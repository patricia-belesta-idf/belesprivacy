'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Play, Lock, CheckCircle, Clock, FileText, Video, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Course, Unit, Enrollment } from '@/types'
import { toast } from 'sonner'

const supabase = createClient()

export default function CourseDetailPage() {
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [units, setUnits] = useState<Unit[]>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('curriculum')
  const [enrolling, setEnrolling] = useState(false)
  const [repeatingCourse, setRepeatingCourse] = useState(false)

  useEffect(() => {
    if (params.courseId && !authLoading) {
      console.log('🔐 Auth loaded, user:', user?.id, 'fetching course data...')
      fetchCourseData()
    }
  }, [params.courseId, authLoading, user])

  // Detectar si venimos de completar el curso y forzar refresh
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const refreshParam = urlParams.get('refresh')
    
    if (refreshParam) {
      console.log('🔄 Refresh parameter detected, forcing data reload...')
      // Limpiar el parámetro de la URL
      window.history.replaceState({}, document.title, window.location.pathname)
      // Forzar recarga de datos
      fetchCourseData()
    }
  }, [])

  const fetchCourseData = async () => {
    console.log('🔄 Fetching course data...')
    console.log('🔐 Auth state - loading:', authLoading, 'user:', user?.id)
    try {
      // Fetch course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.courseId)
        .single()

      if (courseError) {
        console.error('Error fetching course:', courseError)
        toast.error('Error al cargar el curso')
        return
      }

      setCourse(courseData)

      // Fetch units for this course
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .eq('course_id', params.courseId)
        .order('order')

      if (unitsError) {
        console.error('Error fetching units:', unitsError)
        toast.error('Error al cargar las unidades')
      } else {
        setUnits(unitsData || [])
      }
      
      if (user) {
        // Fetch enrollment data - especificar columnas exactas
        console.log('🔍 Fetching enrollment for user:', user.id, 'course:', params.courseId)
        console.log('🔍 User object:', user)
        
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id, user_id, course_id, current_unit, completed_units, completed_at, created_at, updated_at')
          .eq('user_id', user.id)
          .eq('course_id', params.courseId)
          .single()

        console.log('🔍 Raw enrollment query result:', { enrollmentData, enrollmentError })

        if (enrollmentError) {
          console.error('❌ Error fetching enrollment:', enrollmentError)
          console.error('Enrollment error details:', {
            code: enrollmentError.code,
            message: enrollmentError.message,
            details: enrollmentError.details
          })
          
          // Intentar con select más simple si falla
          console.log('🔄 Trying simple enrollment query...')
          const { data: simpleEnrollmentData, error: simpleError } = await supabase
            .from('enrollments')
            .select('id, current_unit, completed_units')
            .eq('user_id', user.id)
            .eq('course_id', params.courseId)
            .single()
            
          console.log('🔍 Simple enrollment query result:', { simpleEnrollmentData, simpleError })
            
          if (simpleError) {
            console.error('❌ Even simple enrollment query failed:', simpleError)
            console.error('Simple error details:', {
              code: simpleError.code,
              message: simpleError.message,
              details: simpleError.details
            })
          } else {
            console.log('✅ Simple enrollment query succeeded:', simpleEnrollmentData)
            setEnrollment(simpleEnrollmentData)
          }
        } else if (enrollmentData) {
          console.log('✅ Enrollment data loaded successfully:', enrollmentData)
          setEnrollment(enrollmentData)
        } else {
          console.log('⚠️ No enrollment data found')
        }
      } else {
        console.log('⚠️ No user found, skipping enrollment fetch')
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Error al cargar datos del curso')
    } finally {
      setLoading(false)
      console.log('✅ Course data loaded successfully')
    }
  }

  const enrollInCourse = async () => {
    if (!user || !course) {
      console.log('❌ enrollInCourse: Missing user or course data')
      return
    }

    console.log('🔍 enrollInCourse: Starting enrollment process...')
    console.log('🔍 User ID:', user.id)
    console.log('🔍 Course ID:', course.id)

    setEnrolling(true)

    try {
      // Check if already enrolled
      if (enrollment) {
        console.log('ℹ️ User already enrolled in this course')
        toast.info('Ya estás inscrito en este curso')
        return
      }

      console.log('📝 Inserting new enrollment...')
      
      // Limpiar caché del cliente antes de insertar
      console.log('🧹 Clearing Supabase client cache...')
      
      const { data: enrollmentData, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          current_unit: 1,
          completed_units: []
        })
        .select()

      if (error) {
        console.error('❌ Error enrolling in course:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details
        })
        
        // Si es error de caché, intentar refrescar
        if (error.code === 'PGRST204') {
          console.log('🔄 PGRST204 error detected, trying to refresh schema...')
          // Forzar refresh del esquema
          window.location.reload()
          return
        }
        
        toast.error('Error al inscribirse en el curso')
      } else {
        console.log('✅ Enrollment successful:', enrollmentData)
        toast.success('¡Te has inscrito exitosamente en el curso!')
        // Refresh enrollment data
        fetchCourseData()
      }
    } catch (error) {
      console.error('❌ Unexpected error enrolling in course:', error)
      toast.error('Error al inscribirse en el curso')
    } finally {
      setEnrolling(false)
    }
  }

  const handleRepeatCourse = async () => {
    if (!user || !course || !enrollment) return

    setRepeatingCourse(true)

    try {
      console.log('🔄 Starting course reset for user:', user.id, 'course:', course.id)

      // 1. Reset enrollment data
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({
          current_unit: 1,
          completed_units: [],
          completed_at: null
        })
        .eq('user_id', user.id)
        .eq('course_id', course.id)

      if (enrollmentError) {
        console.error('❌ Error resetting enrollment:', enrollmentError)
        toast.error('Error al reiniciar el curso')
        return
      }

      // 2. Clear user progress for all units
      if (units) {
        console.log('🗑️ Clearing user progress for', units.length, 'units...')
        
        // Primero, verificar qué registros existen
        const { data: existingProgress, error: checkError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('unit_id', units.map(u => u.id))

        if (checkError) {
          console.error('❌ Error checking existing progress:', checkError)
        } else {
          console.log('🔍 Existing progress records to delete:', existingProgress)
        }
        
        for (const unit of units) {
          console.log(`🗑️ Clearing progress for unit: ${unit.id} (${unit.title})`)
          
          // Intentar DELETE con más detalle
          const { data: deletedData, error: progressError } = await supabase
            .from('user_progress')
            .delete()
            .eq('user_id', user.id)
            .eq('unit_id', unit.id)
            .select()

          if (progressError) {
            console.error(`❌ Error clearing progress for unit ${unit.id}:`, progressError)
            console.error('Error details:', {
              code: progressError.code,
              message: progressError.message,
              details: progressError.details
            })
          } else {
            console.log(`✅ Progress cleared for unit ${unit.id}:`, deletedData)
          }
        }
        console.log('✅ User progress cleared for all units')
      }

      // 3. Verify that user_progress was cleared
      console.log('🔍 Verifying user_progress cleanup...')
      const { data: remainingProgress, error: verifyError } = await supabase
        .from('user_progress')
        .select('unit_id, video_watched, quiz_passed')
        .eq('user_id', user.id)
        .in('unit_id', units?.map(u => u.id) || [])

      if (verifyError) {
        console.error('❌ Error verifying cleanup:', verifyError)
      } else {
        console.log('🔍 Remaining user_progress records:', remainingProgress)
        if (remainingProgress && remainingProgress.length > 0) {
          console.warn('⚠️ Some progress records still exist:', remainingProgress)
        } else {
          console.log('✅ All user_progress records cleared successfully')
        }
      }

      // 4. Refresh course data to show updated state
      await fetchCourseData()

      toast.success('¡Curso reiniciado exitosamente! Puedes comenzar de nuevo.')
      console.log('🎉 Course reset completed successfully')

    } catch (error) {
      console.error('❌ Error in handleRepeatCourse:', error)
      toast.error('Error al reiniciar el curso')
    } finally {
      setRepeatingCourse(false)
    }
  }

  const isUnitCompleted = (unitId: string) => {
    const isCompleted = enrollment?.completed_units?.includes(unitId) || false
    console.log(`🔍 Unit ${unitId} completed status:`, isCompleted, 'Enrollment:', enrollment?.completed_units)
    return isCompleted
  }

  const calculateProgress = () => {
    if (!enrollment || !units.length) return 0
    
    // Debug: mostrar información del enrollment
    console.log('Enrollment data:', {
      enrollment,
      completedUnits: enrollment.completed_units,
      unitsCount: units.length,
      currentUnit: enrollment.current_unit
    })
    
    // Si no hay unidades completadas, el progreso es 0
    if (!enrollment.completed_units || enrollment.completed_units.length === 0) {
      console.log('No completed units found, progress: 0%')
      return 0
    }
    
    // Calcular progreso basado en unidades completadas vs total de unidades
    const completedCount = enrollment.completed_units.length
    const totalUnits = units.length
    const progress = Math.round((completedCount / totalUnits) * 100)
    
    console.log(`Progress calculation: ${completedCount}/${totalUnits} = ${progress}%`)
    return Math.min(100, Math.max(0, progress))
  }

  const isUnitAccessible = (unitOrder: number) => {
    if (!enrollment) return false
    return unitOrder <= enrollment.current_unit
  }

  const getCurrentUnitId = () => {
    if (!enrollment || !units.length) return ''
    const currentUnit = units.find(unit => unit.order === enrollment.current_unit)
    return currentUnit?.id || units[0]?.id || ''
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Cargando autenticación...' : 'Cargando curso...'}
          </p>
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
                    <Progress value={calculateProgress()} className="w-20 h-2" />
                    <span>{calculateProgress()}% completado</span>
                  </div>
                )}
              </div>
            </div>

            <div className="ml-8">
              {!enrollment ? (
                <Button 
                  onClick={enrollInCourse} 
                  size="lg"
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Inscribiendo...
                    </>
                  ) : (
                    'Inscribirse en el Curso'
                  )}
                </Button>
              ) : enrollment?.completed_at ? (
                // Si el curso está completado, mostrar botón para ir a cursos
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ver Otros Cursos
                  </Button>
                </Link>
              ) : (
                // Si no está completado, mostrar botón para continuar
                <Link href={`/courses/${course.id}/units/${getCurrentUnitId()}`}>
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
                  {console.log('🎯 Rendering units with enrollment:', enrollment)}
                  {units.map((unit) => (
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
                          {unit.order === course.total_units && (
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
                
                {/* Botón Repetir Curso - solo aparece cuando está completado */}
                {enrollment?.completed_at && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        ¿Quieres repetir este curso?
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Reiniciarás todo el progreso y podrás volver a tomar el curso desde el principio.
                      </p>
                      <Button 
                        onClick={handleRepeatCourse}
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                        disabled={repeatingCourse}
                      >
                        {repeatingCourse ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                            Reiniciando...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Repetir Curso
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
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
