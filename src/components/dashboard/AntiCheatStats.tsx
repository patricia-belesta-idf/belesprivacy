'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, Clock, AlertTriangle, CheckCircle, TrendingUp, Eye } from 'lucide-react'

interface AntiCheatStats {
  totalVideos: number
  completedVideos: number
  averageCheatScore: number
  totalWatchTime: number
  totalValidTime: number
  largeSkipsDetected: number
  suspiciousSegments: number
  timeRequirementMet: number
  progressUnlocked: number
}

interface UseAntiCheatStatsProps {
  userId: string
}

export function AntiCheatStats({ userId }: UseAntiCheatStatsProps) {
  const [stats, setStats] = useState<AntiCheatStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAntiCheatStats() {
      try {
        // Get video analytics with validation data
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('video_analytics')
          .select(`
            *,
            video_validation (
              time_requirement_met,
              progress_unlocked,
              can_complete,
              cheat_score,
              large_skips_detected,
              suspicious_segments,
              valid_watch_time
            )
          `)
          .eq('user_id', userId)

        if (analyticsError) {
          console.error('Error fetching analytics:', analyticsError)
          return
        }

        if (analyticsData && analyticsData.length > 0) {
          const totalVideos = analyticsData.length
          const completedVideos = analyticsData.filter(a => a.video_validation?.can_complete).length
          
          const totalWatchTime = analyticsData.reduce((sum, a) => sum + (a.total_watch_time || 0), 0)
          const totalValidTime = analyticsData.reduce((sum, a) => sum + (a.video_validation?.valid_watch_time || 0), 0)
          
          const largeSkipsDetected = analyticsData.reduce((sum, a) => sum + (a.video_validation?.large_skips_detected || 0), 0)
          const suspiciousSegments = analyticsData.reduce((sum, a) => sum + (a.video_validation?.suspicious_segments || 0), 0)
          
          const timeRequirementMet = analyticsData.filter(a => a.video_validation?.time_requirement_met).length
          const progressUnlocked = analyticsData.filter(a => a.video_validation?.progress_unlocked).length
          
          const cheatScores = analyticsData
            .map(a => a.video_validation?.cheat_score)
            .filter(score => score !== null && score !== undefined)
          
          const averageCheatScore = cheatScores.length > 0 
            ? cheatScores.reduce((sum, score) => sum + score, 0) / cheatScores.length
            : 100

          setStats({
            totalVideos,
            completedVideos,
            averageCheatScore: Math.round(averageCheatScore * 100) / 100,
            totalWatchTime: Math.round(totalWatchTime * 100) / 100,
            totalValidTime: Math.round(totalValidTime * 100) / 100,
            largeSkipsDetected,
            suspiciousSegments,
            timeRequirementMet,
            progressUnlocked
          })
        }
      } catch (error) {
        console.error('Error in fetchAntiCheatStats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchAntiCheatStats()
    }
  }, [userId, supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-4" />
            Estadísticas Anti-Trampa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const completionRate = stats.totalVideos > 0 ? (stats.completedVideos / stats.totalVideos) * 100 : 0
  const timeEfficiency = stats.totalWatchTime > 0 ? (stats.totalValidTime / stats.totalWatchTime) * 100 : 0
  const cheatRisk = stats.averageCheatScore < 70 ? 'Alto' : stats.averageCheatScore < 85 ? 'Medio' : 'Bajo'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-4" />
          Estadísticas Anti-Trampa
        </CardTitle>
        <CardDescription>
          Monitoreo de integridad en el aprendizaje
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm text-muted-foreground">{stats.completedVideos}/{stats.totalVideos} videos</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completionRate.toFixed(1)}% de videos completados
          </p>
        </div>

        {/* Time Efficiency */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Eficiencia de Tiempo</span>
            <span className="text-sm text-muted-foreground">{timeEfficiency.toFixed(1)}%</span>
          </div>
          <Progress value={timeEfficiency} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stats.totalValidTime}s válidos de {stats.totalWatchTime}s totales
          </p>
        </div>

        {/* Anti-Cheat Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.averageCheatScore}</div>
            <div className="text-xs text-blue-600">Puntuación Anti-Trampa</div>
            <Badge variant={cheatRisk === 'Bajo' ? 'default' : cheatRisk === 'Medio' ? 'secondary' : 'destructive'} className="mt-1">
              {cheatRisk}
            </Badge>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.timeRequirementMet}</div>
            <div className="text-xs text-green-600">Requisito 90% Cumplido</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo total válido
            </span>
            <span className="font-medium">{Math.round(stats.totalValidTime / 60)} min</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Saltos grandes detectados
            </span>
            <span className="font-medium text-yellow-600">{stats.largeSkipsDetected}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              Segmentos sospechosos
            </span>
            <span className="font-medium text-blue-600">{stats.suspiciousSegments}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Progreso desbloqueado
            </span>
            <span className="font-medium text-green-600">{stats.progressUnlocked}</span>
          </div>
        </div>

        {/* Recommendations */}
        {stats.averageCheatScore < 85 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <strong>Recomendación:</strong>
            </div>
            <p className="text-yellow-800 text-xs mt-1">
              Tu puntuación anti-trampa es {stats.averageCheatScore}/100. 
              Evita adelantar videos y ve el contenido completo para mejorar tu aprendizaje.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
