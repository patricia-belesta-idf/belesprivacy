'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Play, Lock, CheckCircle, Clock, FileText, Video } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Course, Unit, Enrollment } from '@/types'

const supabase = createClient()

// Mock data for demonstration
const mockCourse: Course = {
  id: '1',
  title: 'Fundamentos de Protección de Datos',
  description: 'Aprende los conceptos básicos de la protección de datos personales, incluyendo principios fundamentales, derechos de los usuarios y obligaciones de las organizaciones. Este curso te proporcionará una base sólida para entender y aplicar las mejores prácticas en el manejo de información personal.',
  image_url: '/api/placeholder/400/250',
  duration: 120,
  total_units: 8,
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
}

const mockUnits: Unit[] = [
  {
    id: '1',
    course_id: '1',
    title: 'Introducción a la Protección de Datos',
    description: 'Conceptos básicos y fundamentos de la privacidad y protección de datos personales.',
    order: 1,
    video_url: 'https://example.com/video1.mp4',
    duration: 15,
    created_at: '2024-01-01'
  },
  {
    id: '2',
    course_id: '1',
    title: 'Principios de la Protección de Datos',
    description: 'Los siete principios fundamentales que rigen el tratamiento de datos personales.',
    order: 2,
    video_url: 'https://example.com/video2.mp4',
    duration: 20,
    created_at: '2024-01-01'
  },
  {
    id: '3',
    course_id: '1',
    title: 'Derechos de los Usuarios',
    description: 'Conoce los derechos que tienen las personas sobre sus datos personales.',
    order: 3,
    video_url: 'https://example.com/video3.mp4',
    duration: 18,
    created_at: '2024-01-01'
  },
  {
    id: '4',
    course_id: '1',
    title: 'Obligaciones de las Organizaciones',
    description: 'Responsabilidades y deberes que tienen las empresas al manejar datos personales.',
    order: 4,
    video_url: 'https://example.com/video4.mp4',
    duration: 22,
    created_at: '2024-01-01'
  },
  {
    id: '5',
    course_id: '1',
    title: 'Medidas de Seguridad',
    description: 'Implementación de controles técnicos y organizativos para proteger datos.',
    order: 5,
    video_url: 'https://example.com/video5.mp4',
    duration: 25,
    created_at: '2024-01-01'
  },
  {
    id: '6',
    course_id: '1',
    title: 'Transferencias Internacionales',
    description: 'Consideraciones especiales para el envío de datos fuera del país.',
    order: 6,
    video_url: 'https://example.com/video6.mp4',
    duration: 20,
    created_at: '2024-01-01'
  },
  {
    id: '7',
    course_id: '1',
    title: 'Incidentes de Seguridad',
    description: 'Cómo manejar y reportar violaciones de datos personales.',
    order: 7,
    video_url: 'https://example.com/video7.mp4',
    duration: 18,
    created_at: '2024-01-01'
  },
  {
    id: '8',
    course_id: '1',
    title: 'Evaluación Final',
    description: 'Test final para evaluar tu comprensión del curso completo.',
    order: 8,
    video_url: 'https://example.com/video8.mp4',
    duration: 30,
    created_at: '2024-01-01'
  }
]

export default function CourseDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (params.courseId) {
      fetchCourseData()
    }
  }, [params.courseId])

  const fetchCourseData = async () => {
    try {
      // In production, this would fetch real data from Supabase
      setCourse(mockCourse)
      setUnits(mockUnits)
      
      if (user) {
        // Fetch enrollment data
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', params.courseId)
          .single()

        if (!error && data) {
          setEnrollment(data)
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoading(false)
    }
  }

  const enrollInCourse = async () => {
    if (!user || !course) return

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          progress: 0,
          current_unit: 1,
          completed_units: []
        })

      if (error) {
        console.error('Error enrolling in course:', error)
      } else {
        // Refresh enrollment data
        fetchCourseData()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const isUnitCompleted = (unitId: string) => {
    return enrollment?.completed_units.includes(unitId) || false
  }

  const isUnitAccessible = (unitOrder: number) => {
    if (!enrollment) return false
    return unitOrder <= enrollment.current_unit
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
          <Link href="/courses">
            <Button>Volver a Cursos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Link href="/courses" className="text-blue-600 hover:text-blue-800">
                  ← Volver a Cursos
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4 max-w-3xl">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} minutos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.total_units} unidades</span>
                </div>
                {enrollment && (
                  <div className="flex items-center space-x-1">
                    <Progress value={enrollment.progress} className="w-20 h-2" />
                    <span>{enrollment.progress}% completado</span>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-8">
              {!enrollment ? (
                <Button onClick={enrollInCourse} size="lg">
                  Inscribirse en el Curso
                </Button>
              ) : (
                <Link href={`/courses/${course.id}/units/${enrollment.current_unit}`}>
                  <Button size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Continuar Aprendiendo
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="curriculum">Contenido del Curso</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>¿Qué aprenderás?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Habilidades que desarrollarás:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Comprensión de principios de protección de datos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Implementación de medidas de seguridad</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Gestión de derechos de usuarios</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Cumplimiento normativo</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Requisitos previos:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>No se requieren conocimientos previos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Interés en privacidad y protección de datos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Dispositivo con conexión a internet</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenido del Curso</CardTitle>
                <CardDescription>
                  {course.total_units} unidades • {course.duration} minutos de contenido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {units.map((unit, index) => (
                    <div
                      key={unit.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${
                        isUnitCompleted(unit.id)
                          ? 'bg-green-50 border-green-200'
                          : isUnitAccessible(unit.order)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isUnitCompleted(unit.id) ? (
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        ) : isUnitAccessible(unit.order) ? (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{unit.order}</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <Lock className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{unit.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Video className="h-3 w-3" />
                            <span>{unit.duration} min</span>
                          </span>
                          {unit.order === 8 && (
                            <span className="flex items-center space-x-1">
                              <FileText className="h-3 w-3" />
                              <span>Test Final</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isUnitCompleted(unit.id) ? (
                          <Badge variant="secondary">Completado</Badge>
                        ) : isUnitAccessible(unit.order) ? (
                          <Link href={`/courses/${course.id}/units/${unit.id}`}>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Comenzar
                            </Button>
                          </Link>
                        ) : (
                          <Badge variant="outline">Bloqueado</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos Adicionales</CardTitle>
                <CardDescription>
                  Materiales complementarios para enriquecer tu aprendizaje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Documentos Descargables</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Guía de Mejores Prácticas</span>
                        </div>
                        <Button variant="outline" size="sm">Descargar</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Plantillas de Políticas</span>
                        </div>
                        <Button variant="outline" size="sm">Descargar</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Enlaces Útiles</h4>
                    <div className="space-y-3">
                      <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Regulaciones Oficiales
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Enlaces a leyes y regulaciones vigentes
                        </p>
                      </a>
                      <a href="#" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Casos de Estudio
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Ejemplos reales de implementación
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
