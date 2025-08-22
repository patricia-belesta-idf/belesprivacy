'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Play, Award, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Course, Enrollment, Unit } from '@/types'

const supabase = createClient()

// Mock data for demonstration
const mockEnrolledCourses = [
  {
    id: '1',
    course: {
      id: '1',
      title: 'Fundamentos de Protección de Datos',
      description: 'Aprende los conceptos básicos de la protección de datos personales.',
      image_url: '/api/placeholder/400/250',
      duration: 120,
      total_units: 8,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    enrollment: {
      id: '1',
      user_id: 'user1',
      course_id: '1',
      progress: 45,
      current_unit: 4,
      completed_units: ['1', '2', '3'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }
  },
  {
    id: '2',
    course: {
      id: '2',
      title: 'GDPR y Regulaciones Europeas',
      description: 'Domina el Reglamento General de Protección de Datos (GDPR).',
      image_url: '/api/placeholder/400/250',
      duration: 180,
      total_units: 12,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    enrollment: {
      id: '2',
      user_id: 'user1',
      course_id: '2',
      progress: 25,
      current_unit: 3,
      completed_units: ['1', '2'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }
  }
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState(mockEnrolledCourses)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalProgress: 0,
    completedUnits: 0,
    totalUnits: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // In production, this would fetch real data from Supabase
      // For now, we'll use mock data
      setStats({
        totalCourses: enrolledCourses.length,
        totalProgress: Math.round(enrolledCourses.reduce((acc, item) => acc + item.enrollment.progress, 0) / enrolledCourses.length),
        completedUnits: enrolledCourses.reduce((acc, item) => acc + item.enrollment.completed_units.length, 0),
        totalUnits: enrolledCourses.reduce((acc, item) => acc + item.course.total_units, 0)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
              <p className="text-gray-600 mt-1">Bienvenido de vuelta, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <Link href="/courses">
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar Cursos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Cursos activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProgress}%</div>
              <p className="text-xs text-muted-foreground">
                Promedio de todos los cursos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedUnits}</div>
              <p className="text-xs text-muted-foreground">
                De {stats.totalUnits} totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Mis Cursos</h2>
          </div>

          <div className="grid gap-6">
            {enrolledCourses.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.course.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {item.enrollment.progress}% Completado
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-medium">{item.enrollment.progress}%</span>
                          </div>
                          <Progress value={item.enrollment.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Unidad actual: {item.enrollment.current_unit} de {item.course.total_units}</span>
                          <span>{item.enrollment.completed_units.length} unidades completadas</span>
                        </div>

                        <div className="flex space-x-3">
                          <Link href={`/courses/${item.course.id}`} className="flex-1">
                            <Button className="w-full">
                              <Play className="h-4 w-4 mr-2" />
                              Continuar Aprendiendo
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Ver Progreso
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {enrolledCourses.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes cursos inscritos
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza explorando nuestros cursos y inscríbete en el que más te interese.
                </p>
                <Link href="/courses">
                  <Button>
                    Explorar Cursos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
