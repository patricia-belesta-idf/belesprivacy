'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { X, Award, Home, Trophy, Star, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

interface CourseCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle: string
  completionDate: Date
  finalScore: number
  totalUnits: number
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseTitle,
  completionDate,
  finalScore,
  totalUnits
}: CourseCompletionModalProps) {
  const { t } = useLanguage()
  const hasTriggeredConfetti = useRef(false)

  useEffect(() => {
    if (isOpen && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true
      // Trigger confetti
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto my-8 overflow-hidden border border-white/20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          {/* Celebration Section */}
              <div className="text-center space-y-4 mb-6">
                {/* Trophy Animation */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 rounded-full">
                      <Trophy className="w-12 h-12 text-white animate-bounce" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  {t('completion.congratulations')}
                </h1>

                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <p className="text-lg md:text-xl text-white font-light">
                    {t('completion.subtitle')}
                  </p>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                {/* Course Name */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mt-4">
                  <p className="text-white/70 text-xs mb-1">{t('completion.courseCompleted')}</p>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {courseTitle}
                  </h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-200 text-xs">{t('completion.unitsCompleted')}</p>
                    <p className="text-xl font-bold text-white">{totalUnits}/{totalUnits}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-3">
                    <Award className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-green-200 text-xs">{t('completion.finalScore')}</p>
                    <p className="text-xl font-bold text-white">{finalScore}%</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-3">
                    <Clock className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <p className="text-purple-200 text-xs">{t('completion.completedOn')}</p>
                    <p className="text-sm font-bold text-white">
                      {completionDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-4 mt-4">
                  <p className="text-sm text-white/90 italic">
                    &ldquo;{t('completion.motivationalMessage')}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center mt-6">
                <Link href="/dashboard">
                  <Button
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    {t('completion.backToDashboard')}
                  </Button>
                </Link>
              </div>
        </div>
      </div>
    </div>
  )
}

