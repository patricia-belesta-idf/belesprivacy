import { useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'

interface VideoAnalytics {
  totalWatchTime: number
  pauseCount: number
  seekCount: number
  rewindCount: number
  startTime: Date
  completedAt?: Date
  maxProgressReached: number
  watchSegments: { start: number; end: number }[]
}

interface UseVideoAnalyticsProps {
  userId: string
  unitId: string
  completionThreshold?: number
}

export function useVideoAnalytics({ userId, unitId, completionThreshold = 95 }: UseVideoAnalyticsProps) {
  const supabase = createClient()
  const sessionIdRef = useRef<string>(crypto.randomUUID())
  const analyticsIdRef = useRef<string | null>(null)

  const saveAnalytics = useCallback(async (analytics: VideoAnalytics) => {
    if (!userId || !unitId) return

    try {
      const analyticsData = {
        user_id: userId,
        unit_id: unitId,
        session_id: sessionIdRef.current,
        total_watch_time: analytics.totalWatchTime,
        pause_count: analytics.pauseCount,
        seek_count: analytics.seekCount,
        rewind_count: analytics.rewindCount,
        max_progress_reached: analytics.maxProgressReached,
        completion_threshold: completionThreshold,
        start_time: analytics.startTime.toISOString(),
        end_time: new Date().toISOString(),
        completed_at: analytics.completedAt?.toISOString(),
        is_completed: !!analytics.completedAt,
        watch_segments: analytics.watchSegments
      }

      if (analyticsIdRef.current) {
        // Update existing record
        const { error } = await supabase
          .from('video_analytics')
          .update(analyticsData)
          .eq('id', analyticsIdRef.current)

        if (error) {
          console.error('Error updating video analytics:', error)
        }
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('video_analytics')
          .insert(analyticsData)
          .select('id')
          .single()

        if (error) {
          console.error('Error saving video analytics:', error)
        } else if (data) {
          analyticsIdRef.current = data.id
        }
      }
    } catch (error) {
      console.error('Error in saveAnalytics:', error)
    }
  }, [userId, unitId, completionThreshold, supabase])

  const saveQualityMetrics = useCallback(async (metrics: {
    initialLoadTime?: number
    bufferEvents?: number
    totalBufferTime?: number
    videoResolution?: string
    droppedFrames?: number
  }) => {
    if (!analyticsIdRef.current) return

    try {
      const { error } = await supabase
        .from('video_quality_metrics')
        .insert({
          analytics_id: analyticsIdRef.current,
          ...metrics
        })

      if (error) {
        console.error('Error saving quality metrics:', error)
      }
    } catch (error) {
      console.error('Error in saveQualityMetrics:', error)
    }
  }, [supabase])

  const getEngagementScore = useCallback(async (watchTime: number, totalDuration: number, pauseCount: number, seekCount: number, rewindCount: number) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_engagement_score', {
          watch_time: watchTime,
          total_duration: totalDuration,
          pause_count: pauseCount,
          seek_count: seekCount,
          rewind_count: rewindCount
        })

      if (error) {
        console.error('Error calculating engagement score:', error)
        return 0
      }

      return data || 0
    } catch (error) {
      console.error('Error in getEngagementScore:', error)
      return 0
    }
  }, [supabase])

  return {
    saveAnalytics,
    saveQualityMetrics,
    getEngagementScore,
    sessionId: sessionIdRef.current
  }
}
