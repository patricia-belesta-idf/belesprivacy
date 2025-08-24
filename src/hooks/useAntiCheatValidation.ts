import { useCallback, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

interface WatchSegment {
  start: number
  end: number
  duration: number
  isValid: boolean
}

interface AntiCheatValidation {
  totalDuration: number
  minimumWatchTime: number // 90% of total duration
  actualWatchTime: number
  validWatchTime: number
  largeSkipsDetected: number
  suspiciousSegments: number
  cheatScore: number
  timeRequirementMet: boolean
  progressUnlocked: boolean
  canComplete: boolean
  watchSegments: WatchSegment[]
  lastValidPosition: number
}

interface UseAntiCheatValidationProps {
  userId: string
  unitId: string
  analyticsId: string
  totalDuration: number
}

export function useAntiCheatValidation({ 
  userId, 
  unitId, 
  analyticsId, 
  totalDuration 
}: UseAntiCheatValidationProps) {
  const { t } = useLanguage()
  const supabase = createClient()
  const [validation, setValidation] = useState<AntiCheatValidation>({
    totalDuration,
    minimumWatchTime: totalDuration * 0.9, // 90% requirement
    actualWatchTime: 0,
    validWatchTime: 0,
    largeSkipsDetected: 0,
    suspiciousSegments: 0,
    cheatScore: 100,
    timeRequirementMet: false,
    progressUnlocked: false,
    canComplete: false,
    watchSegments: [],
    lastValidPosition: 0
  })

  const currentSegmentRef = useRef<{ start: number; end: number } | null>(null)
  const lastPositionRef = useRef<number>(0)
  const watchStartTimeRef = useRef<number>(0)
  const segmentStartTimeRef = useRef<number>(0)

  // Initialize validation record in database
  const initializeValidation = useCallback(async () => {
    console.log('🔧 Initializing validation with:', { analyticsId, totalDuration })
    
    if (!analyticsId || !totalDuration) {
      console.log('❌ Missing required data for validation')
      return
    }
    
    try {
      // Check if analytics record already exists
      const { data: existingAnalytics } = await supabase
        .from('video_analytics')
        .select('id')
        .eq('id', analyticsId)
        .single()

      if (existingAnalytics) {
        console.log('✅ Analytics record already exists, skipping creation')
      } else {
        // Create analytics record only if it doesn't exist
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('video_analytics')
          .insert({
            id: analyticsId,
            user_id: userId,
            unit_id: unitId,
            total_watch_time: 0,
            max_progress_reached: 0,
            completion_threshold: 95
          })
          .select()
          .single()

        if (analyticsError) {
          console.error('❌ Error creating analytics record:', analyticsError)
          return
        }

        console.log('✅ Analytics record created:', analyticsData)
      }

      // Check if validation record already exists
      const { data: existingValidation } = await supabase
        .from('video_validation')
        .select('id')
        .eq('analytics_id', analyticsId)
        .single()

      if (existingValidation) {
        console.log('✅ Validation record already exists, skipping creation')
      } else {
        // Create validation record only if it doesn't exist
        const { data: validationData, error: validationError } = await supabase
          .from('video_validation')
          .insert({
            analytics_id: analyticsId,
            total_video_duration: totalDuration,
            minimum_watch_time: totalDuration * 0.9,
            actual_watch_time: 0,
            valid_watch_time: 0,
            cheat_score: 100,
            time_requirement_met: false,
            progress_unlocked: false,
            can_complete: false
          })
          .select()
          .single()

        if (validationError) {
          console.error('❌ Error creating validation record:', validationError)
        } else {
          console.log('✅ Validation record created:', validationData)
        }
      }
    } catch (error) {
      console.error('❌ Error in initializeValidation:', error)
    }
  }, [analyticsId, totalDuration, userId, unitId, supabase])

  // Track video progress with anti-cheat validation
  const trackProgress = useCallback((currentTime: number, isPlaying: boolean) => {
    if (!isPlaying) return

    const now = currentTime
    const last = lastPositionRef.current
    const timeDiff = now - last

    // Detect large skips (cheating)
    if (timeDiff > 10) {
      setValidation(prev => ({
        ...prev,
        largeSkipsDetected: prev.largeSkipsDetected + 1,
        suspiciousSegments: prev.suspiciousSegments + 1
      }))
      
      // Reset current segment
      if (currentSegmentRef.current) {
        currentSegmentRef.current = null
      }
    }

    // Start new segment if needed
    if (!currentSegmentRef.current) {
      currentSegmentRef.current = { start: now, end: now }
      segmentStartTimeRef.current = Date.now()
    } else {
      // Update segment end
      currentSegmentRef.current.end = now
    }

    // Track valid watch time (only if no large skips)
    if (timeDiff <= 10 && timeDiff > 0) {
      setValidation(prev => ({
        ...prev,
        actualWatchTime: prev.actualWatchTime + timeDiff,
        validWatchTime: prev.validWatchTime + timeDiff
      }))
    }

    // Check if time requirement is met (90%)
    const timeRequirementMet = validation.validWatchTime >= validation.minimumWatchTime
    
    // Unlock progress tracking only after time requirement
    const progressUnlocked = timeRequirementMet
    
    // Calculate cheat score
    const cheatScore = Math.max(0, 100 - (validation.largeSkipsDetected * 15) - (validation.suspiciousSegments * 10))
    
    // Can complete only if all requirements met
    const canComplete = timeRequirementMet && cheatScore >= 70 && progressUnlocked

    setValidation(prev => ({
      ...prev,
      timeRequirementMet,
      progressUnlocked,
      cheatScore,
      canComplete,
      lastValidPosition: now
    }))

    lastPositionRef.current = now
  }, [validation.validWatchTime, validation.minimumWatchTime, validation.largeSkipsDetected, validation.suspiciousSegments])

  // Finalize segment when video is paused/stopped
  const finalizeSegment = useCallback(() => {
    if (currentSegmentRef.current) {
      const segment: WatchSegment = {
        start: currentSegmentRef.current.start,
        end: currentSegmentRef.current.end,
        duration: currentSegmentRef.current.end - currentSegmentRef.current.start,
        isValid: currentSegmentRef.current.end - currentSegmentRef.current.start <= 10
      }

      setValidation(prev => ({
        ...prev,
        watchSegments: [...prev.watchSegments, segment]
      }))

      currentSegmentRef.current = null
    }
  }, [])

  // Save validation data to database
  const saveValidation = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('video_validation')
        .upsert({
          analytics_id: analyticsId,
          total_video_duration: validation.totalDuration,
          minimum_watch_time: validation.minimumWatchTime,
          actual_watch_time: validation.actualWatchTime,
          valid_watch_time: validation.validWatchTime,
          large_skips_detected: validation.largeSkipsDetected,
          suspicious_segments: validation.suspiciousSegments,
          cheat_score: validation.cheatScore,
          time_requirement_met: validation.timeRequirementMet,
          progress_unlocked: validation.progressUnlocked,
          can_complete: validation.canComplete,
          watch_segments: validation.watchSegments,
          last_valid_position: validation.lastValidPosition
        })

      if (error) {
        console.error('Error saving validation:', error)
      }
    } catch (error) {
      console.error('Error in saveValidation:', error)
    }
  }, [analyticsId, validation, supabase])

  // Get validation status for display
  const getValidationStatus = useCallback(() => {
    if (!validation.timeRequirementMet) {
      return {
        status: 'time-required',
        message: t('video.watchTimeRequired', { seconds: Math.round(validation.minimumWatchTime) }),
        progress: (validation.validWatchTime / validation.minimumWatchTime) * 100,
        canTrackProgress: false
      }
    }

    if (validation.cheatScore < 70) {
      return {
        status: 'cheating-detected',
        message: t('video.cheatingDetected', { score: validation.cheatScore }),
        progress: 0,
        canTrackProgress: false
      }
    }

    if (!validation.progressUnlocked) {
      return {
        status: 'progress-locked',
        message: t('video.progressLocked'),
        progress: 0,
        canTrackProgress: false
      }
    }

    return {
      status: 'ready',
              message: t('video.requirementsMet'),
      progress: 100,
      canTrackProgress: true
    }
  }, [validation])

  return {
    validation,
    trackProgress,
    finalizeSegment,
    saveValidation,
    getValidationStatus,
    initializeValidation
  }
}
