'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  onVideoEnd: () => void
  onProgress?: (progress: number) => void
  className?: string
}

export function VideoPlayer({ 
  videoUrl, 
  title, 
  onVideoEnd, 
  onProgress,
  className = "" 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Handle different video types
  const isYouTube = videoUrl.includes('youtube.com')
  const isVimeo = videoUrl.includes('vimeo.com')
  const isDirectVideo = !isYouTube && !isVimeo

  useEffect(() => {
    if (isDirectVideo && videoRef.current) {
      const video = videoRef.current
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration)
      }
      
      const handleTimeUpdate = () => {
        const current = video.currentTime
        const total = video.duration
        const progressPercent = (current / total) * 100
        
        setCurrentTime(current)
        setProgress(progressPercent)
        
        if (onProgress) {
          onProgress(progressPercent)
        }
        
        // Mark as completed when 90% watched
        if (progressPercent >= 90 && !isCompleted) {
          setIsCompleted(true)
          onVideoEnd()
        }
      }
      
      const handleEnded = () => {
        setIsCompleted(true)
        onVideoEnd()
      }
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('ended', handleEnded)
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [isDirectVideo, onVideoEnd, onProgress, isCompleted])

  const togglePlay = () => {
    if (isDirectVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
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

  if (isYouTube) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-full rounded-lg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Nota:</strong> Para videos de YouTube, el seguimiento del progreso se basa en el tiempo de visualización.
            Marca manualmente cuando hayas completado el video.
          </p>
          <Button 
            onClick={onVideoEnd} 
            className="mt-2"
            variant="outline"
            size="sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar como Completado
          </Button>
        </div>
      </div>
    )
  }

  if (isVimeo) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-full rounded-lg"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Nota:</strong> Para videos de Vimeo, el seguimiento del progreso se basa en el tiempo de visualización.
            Marca manualmente cuando hayas completado el video.
          </p>
          <Button 
            onClick={onVideoEnd} 
            className="mt-2"
            variant="outline"
            size="sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar como Completado
          </Button>
        </div>
      </div>
    )
  }

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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Custom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
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
      )}
      
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-green-600 text-white">
            <Check className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        </div>
      )}
    </div>
  )
}
