'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Check, AlertCircle, SkipBack, SkipForward, RotateCcw, Shield, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAntiCheatValidation } from '@/hooks/useAntiCheatValidation'

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

interface VideoPlayerProps {
  videoUrl: string
  title: string
  onVideoEnd: () => void
  onProgress?: (progress: number, analytics: VideoAnalytics) => void
  className?: string
  completionThreshold?: number
  userId?: string
  unitId?: string
  analyticsId?: string
}

export function AntiCheatVideoPlayer({ 
  videoUrl, 
  title, 
  onVideoEnd, 
  onProgress,
  className = "",
  completionThreshold = 95,
  userId,
  unitId,
  analyticsId
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showProgressAlert, setShowProgressAlert] = useState(false)
  const [showCompletionAlert, setShowCompletionAlert] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showAntiCheatAlert, setShowAntiCheatAlert] = useState(false)
  
  // Analytics state
  const [analytics, setAnalytics] = useState<VideoAnalytics>({
    totalWatchTime: 0,
    pauseCount: 0,
    seekCount: 0,
    rewindCount: 0,
    startTime: new Date(),
    maxProgressReached: 0,
    watchSegments: []
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCurrentTimeRef = useRef<number>(0)
  const watchStartTimeRef = useRef<number>(0)
  const currentSegmentRef = useRef<{ start: number; end: number } | null>(null)

  // Anti-cheat validation
  const {
    validation,
    trackProgress,
    finalizeSegment,
    saveValidation,
    getValidationStatus,
    initializeValidation
  } = useAntiCheatValidation({
    userId: userId || '',
    unitId: unitId || '',
    analyticsId: analyticsId || '',
    totalDuration: duration
  })

  // Handle different video types
  const isYouTube = videoUrl.includes('youtube.com')
  const isVimeo = videoUrl.includes('vimeo.com')
  const isDirectVideo = !isYouTube && !isVimeo

  // Initialize validation when component mounts or duration changes
  useEffect(() => {
    if (userId && unitId && analyticsId && duration > 0) {
      try {
        initializeValidation()
      } catch (error) {
        console.log('Validation not available yet, using fallback mode')
      }
    }
  }, [userId, unitId, analyticsId, duration, initializeValidation])

  // Update validation when duration changes
  useEffect(() => {
    console.log('Duration changed:', duration, 'Current validation duration:', validation.totalDuration)
    if (duration > 0 && validation.totalDuration !== duration) {
      // Force re-initialization when duration changes
      console.log('Re-initializing validation with new duration:', duration)
      try {
        initializeValidation()
      } catch (error) {
        console.log('Using fallback validation mode')
      }
    }
  }, [duration, validation.totalDuration, initializeValidation])

  // Analytics functions
  const updateAnalytics = useCallback((updates: Partial<VideoAnalytics>) => {
    setAnalytics(prev => {
      const newAnalytics = { ...prev, ...updates }
      if (onProgress) {
        onProgress(progress, newAnalytics)
      }
      return newAnalytics
    })
  }, [onProgress, progress])

  const trackWatchTime = useCallback((currentTime: number) => {
    const now = currentTime
    const last = lastCurrentTimeRef.current
    
    // Si el tiempo avanzó normalmente (no es un seek)
    if (Math.abs(now - last) < 2) {
      updateAnalytics({
        totalWatchTime: analytics.totalWatchTime + (now - last)
      })
    }
    
    lastCurrentTimeRef.current = now
  }, [analytics.totalWatchTime, updateAnalytics])

  const trackSeek = useCallback((fromTime: number, toTime: number) => {
    const isRewind = toTime < fromTime
    
    // Finalizar segmento actual si existe
    if (currentSegmentRef.current) {
      const segment = { ...currentSegmentRef.current, end: fromTime }
      updateAnalytics({
        watchSegments: [...analytics.watchSegments, segment],
        seekCount: analytics.seekCount + 1,
        rewindCount: isRewind ? analytics.rewindCount + 1 : analytics.rewindCount
      })
    }
    
    // Iniciar nuevo segmento
    currentSegmentRef.current = { start: toTime, end: toTime }
  }, [analytics.watchSegments, analytics.seekCount, analytics.rewindCount, updateAnalytics])

  useEffect(() => {
    if (isDirectVideo && videoRef.current) {
      const video = videoRef.current
      
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded, duration:', video.duration)
        setDuration(video.duration)
        setIsBuffering(false)
      }
      
      const handleWaiting = () => {
        setIsBuffering(true)
      }
      
      const handleCanPlay = () => {
        setIsBuffering(false)
      }
      
      const handleTimeUpdate = () => {
        const current = video.currentTime
        const total = video.duration
        const progressPercent = (current / total) * 100
        
        setCurrentTime(current)
        setProgress(progressPercent)
        
        // Track analytics
        trackWatchTime(current)
        
        // Track anti-cheat validation
        if (userId && unitId && analyticsId) {
          trackProgress(current, isPlaying)
        }
        
        // Update max progress reached
        if (progressPercent > analytics.maxProgressReached) {
          updateAnalytics({ maxProgressReached: progressPercent })
        }
        
        // ANTI-CHEAT VALIDATION: Check if user can complete video
        const minimumWatchTime = duration * 0.9 // 90% of total duration
        const hasWatchedMinimum = current >= minimumWatchTime
        
        // Only allow completion if minimum time requirement is met
        if (hasWatchedMinimum) {
          // Show progress alerts
          if (progressPercent >= completionThreshold - 10 && progressPercent < completionThreshold && !showProgressAlert) {
            setShowProgressAlert(true)
          }
          
          // Mark as completed when threshold is reached (95% by default)
          if (progressPercent >= completionThreshold && !isCompleted) {
            setIsCompleted(true)
            setShowCompletionAlert(true)
            
            // Finalizar segmento actual
            if (currentSegmentRef.current) {
              const segment = { ...currentSegmentRef.current, end: current }
              updateAnalytics({
                watchSegments: [...analytics.watchSegments, segment],
                completedAt: new Date()
              })
            }
            
            // Save final validation data
            if (userId && unitId && analyticsId) {
              saveValidation()
            }
            
            onVideoEnd()
          }
        } else {
          // User hasn't watched enough - show warning
          if (progressPercent >= completionThreshold && !showProgressAlert) {
            setShowProgressAlert(true)
            setShowCompletionAlert(false)
          }
        }
      }
      
      const handleEnded = () => {
        setIsCompleted(true)
        setShowCompletionAlert(true)
        
        // Finalizar segmento y analytics
        if (currentSegmentRef.current) {
          const segment = { ...currentSegmentRef.current, end: duration }
          updateAnalytics({
            watchSegments: [...analytics.watchSegments, segment],
            completedAt: new Date()
          })
        }
        
        // Save final validation data
        if (userId && unitId && analyticsId) {
          saveValidation()
        }
        
        onVideoEnd()
      }
      
      const handlePlay = () => {
        setIsPlaying(true)
        watchStartTimeRef.current = video.currentTime
        
        // Iniciar nuevo segmento si no existe
        if (!currentSegmentRef.current) {
          currentSegmentRef.current = { start: video.currentTime, end: video.currentTime }
        }
      }
      
      const handlePause = () => {
        setIsPlaying(false)
        updateAnalytics({ pauseCount: analytics.pauseCount + 1 })
        
        // Finalizar segmento actual
        if (currentSegmentRef.current) {
          const segment = { ...currentSegmentRef.current, end: video.currentTime }
          updateAnalytics({
            watchSegments: [...analytics.watchSegments, segment]
          })
          currentSegmentRef.current = null
        }
        
        // Finalizar segmento para anti-cheat
        if (userId && unitId && analyticsId) {
          finalizeSegment()
        }
      }
      
      const handleSeeked = () => {
        const currentTime = video.currentTime
        trackSeek(lastCurrentTimeRef.current, currentTime)
      }
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('seeked', handleSeeked)
      video.addEventListener('waiting', handleWaiting)
      video.addEventListener('canplay', handleCanPlay)
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('seeked', handleSeeked)
        video.removeEventListener('waiting', handleWaiting)
        video.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [isDirectVideo, onVideoEnd, isCompleted, completionThreshold, showProgressAlert, duration, analytics, updateAnalytics, trackWatchTime, trackSeek, userId, unitId, analyticsId, trackProgress, finalizeSegment, saveValidation, getValidationStatus, isPlaying])

  const togglePlay = () => {
    if (isDirectVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const changeVolume = (newVolume: number) => {
    if (isDirectVideo && videoRef.current) {
      setVolume(newVolume)
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const changePlaybackRate = (rate: number) => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const skipForward = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
    }
  }

  const toggleFullscreen = () => {
    if (isDirectVideo && videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDirectVideo && videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const width = rect.width
      const seekTime = (clickX / width) * duration
      
      videoRef.current.currentTime = seekTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  // Para YouTube/Vimeo, no podemos hacer seguimiento real
  if (isYouTube || isVimeo) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-full rounded-lg"
          allowFullScreen
          allow={isYouTube ? 
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" :
            "autoplay; fullscreen; picture-in-picture"
          }
        />
        <div className="mt-4 space-y-3">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>⚠️ Limitación Importante:</strong> Para videos de {isYouTube ? 'YouTube' : 'Vimeo'}, no podemos medir el progreso real del usuario.
              <br />
              <strong>📊 Para el seguimiento del 95%:</strong> Necesitas usar videos subidos directamente (MP4, WebM).
            </AlertDescription>
          </Alert>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm mb-3">
              <strong>💡 Solución Temporal:</strong> Marca manualmente cuando hayas completado el video.
            </p>
            <Button 
              onClick={onVideoEnd} 
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar como Completado ({completionThreshold}%)
            </Button>
          </div>
        </div>
      </div>
    )
  }

        // Get validation status for display (with fallback)
      const validationStatus = (() => {
        try {
          return getValidationStatus()
        } catch (error) {
          // Fallback mode when validation tables don't exist
          return {
            status: 'ready',
            message: `✅ Modo básico activo. El seguimiento del ${completionThreshold}% está activo.`,
            progress: 100,
            canTrackProgress: true
          }
        }
      })()

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        title={title}
        className="w-full h-full"
        preload="metadata"
      />
      
      {/* Loading/Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Anti-Cheat Status Alert */}
      {showAntiCheatAlert && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <Alert className={`${
            validationStatus.status === 'ready' 
              ? 'bg-green-50 border-green-200' 
              : validationStatus.status === 'cheating-detected'
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            {validationStatus.status === 'ready' ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : validationStatus.status === 'cheating-detected' ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-600" />
            )}
            <AlertDescription className={
              validationStatus.status === 'ready' 
                ? 'text-green-800' 
                : validationStatus.status === 'cheating-detected'
                ? 'text-red-800'
                : 'text-yellow-800'
            }>
              <strong>🛡️ Sistema Anti-Trampa:</strong> {validationStatus.message}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Progress Alerts */}
      {showProgressAlert && !isCompleted && (
        <div className="absolute top-20 left-4 right-4 z-20">
          {currentTime >= duration * 0.9 ? (
            // User can complete - show progress alert
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                🎯 ¡Casi lo logras! Continúa viendo para alcanzar el {completionThreshold}% requerido. 
                <strong> Progreso actual: {Math.round(progress)}%</strong>
              </AlertDescription>
            </Alert>
          ) : (
            // User cannot complete - show anti-cheat warning
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                🚫 <strong>Anti-Trampa Activado:</strong> Has adelantado el video sin ver el tiempo mínimo requerido.
                <br />
                <strong>Debes ver al menos {Math.round(duration * 0.9)}s para poder completar.</strong>
                <br />
                <strong>Tiempo visto: {Math.round(currentTime)}s / {Math.round(duration * 0.9)}s</strong>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {validationStatus.canTrackProgress && showCompletionAlert && isCompleted && (
        <div className="absolute top-20 left-4 right-4 z-20">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 ¡Excelente! Has completado el {completionThreshold}% del video. Unidad marcada como completada.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-10">
          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
              {/* Completion threshold indicator - Only show if validation passes */}
              {validationStatus.canTrackProgress && (
                <div 
                  className="absolute top-0 h-full w-1 bg-green-400 rounded"
                  style={{ 
                    left: `${completionThreshold}%`,
                    transform: 'translateX(-50%)'
                  }}
                  title={`Meta: ${completionThreshold}%`}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <span>{Math.round(progress)}% / {validationStatus.canTrackProgress ? completionThreshold : 'Bloqueado'}%</span>
            </div>
          </div>
          
          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipBackward}
                className="text-white hover:bg-white/20"
                title="Retroceder 10s"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipForward}
                className="text-white hover:bg-white/20"
                title="Avanzar 10s"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              {/* Speed Control */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                className="bg-white/20 text-white text-xs rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Anti-Cheat Info */}
              <div className="text-xs text-white/70 hidden sm:block">
                <Shield className="h-3 w-3 inline mr-1" />
                {validationStatus.status === 'ready' ? '✅ Validado' : '⏳ Validando...'}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Completion Badge - Only show if requirements met */}
      {isCompleted && currentTime >= duration * 0.9 && (
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="secondary" className="bg-green-600 text-white shadow-lg">
            <Check className="h-3 w-3 mr-1" />
            Completado ({Math.round(progress)}%)
          </Badge>
        </div>
      )}
      
      {/* Progress Info with Anti-Cheat Status */}
      <div className="absolute top-4 left-4 z-20">
        <Badge variant="outline" className={`${
          validationStatus.canTrackProgress 
            ? 'bg-black/60 text-white border-white/20' 
            : 'bg-red-600 text-white border-red-400'
        }`}>
          {validationStatus.canTrackProgress ? (
            `${Math.round(progress)}% / ${completionThreshold}%`
          ) : (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Anti-Trampa Activo
            </>
          )}
        </Badge>
      </div>
      
      {/* Time Requirement Progress */}
      {!validationStatus.canTrackProgress && duration > 0 && (
        <div className="absolute top-16 left-4 right-4 z-20">
          <div className="bg-black/80 rounded-lg p-3">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span>⏱️ Tiempo requerido: {Math.round(duration * 0.9)}s (90%)</span>
              <span>{Math.round(currentTime)}s / {Math.round(duration * 0.9)}s</span>
            </div>
            <Progress 
              value={Math.min((currentTime / (duration * 0.9)) * 100, 100)} 
              className="h-2"
            />
            <p className="text-white/70 text-xs mt-1">
              Debes ver al menos {Math.round(duration * 0.9)}s (90%) del video para desbloquear el seguimiento del progreso
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
