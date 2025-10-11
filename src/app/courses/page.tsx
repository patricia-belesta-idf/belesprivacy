'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, Play, CheckCircle, Star, ArrowRight, Sparkles, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClient } from '@/lib/supabase'
import { Course, Enrollment } from '@/types'
import { toast } from 'sonner'

const supabase = createClient()

// Course data that matches the database UUIDs - will be translated dynamically
const mockCoursesData = {
  course1: {
    id: 'b8c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    image_url: '/api/placeholder/400/250',
    duration: 120,
    total_units: 8,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  course2: {
    id: 'c9d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    image_url: '/api/placeholder/400/250',
    duration: 180,
    total_units: 12,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  course3: {
    id: 'd0e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    image_url: '/api/placeholder/400/250',
    duration: 150,
    total_units: 10,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
}

export default function CoursesPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  // Function to get mock courses with translations
  const getMockCourses = useCallback(() => [
    {
      ...mockCoursesData.course1,
      title: t('courses.mock.course1.title'),
      description: t('courses.mock.course1.description'),
    },
    {
      ...mockCoursesData.course2,
      title: t('courses.mock.course2.title'),
      description: t('courses.mock.course2.description'),
    },
    {
      ...mockCoursesData.course3,
      title: t('courses.mock.course3.title'),
      description: t('courses.mock.course3.description'),
    }
  ], [t])

  const fetchCoursesData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching courses:', error)
        toast.error('Error al cargar cursos')
                // Fallback to mock data if database fails
        setCourses(getMockCourses())
      } else {
        setCourses(data || getMockCourses())
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar cursos')
      // Fallback to mock data if database fails
      setCourses(getMockCourses())
    }
  }, [getMockCourses])

  useEffect(() => {
    fetchCoursesData()
    if (user) {
      fetchEnrollments()
    } else {
      setLoading(false)
    }
  }, [user, fetchCoursesData])


  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, completed_units')
        .eq('user_id', user?.id)

      if (error) {
        console.error('Error fetching enrollments:', error)
        toast.error('Error al cargar inscripciones')
      } else {
        setEnrollments(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar inscripciones')
    } finally {
      setLoading(false)
    }
  }


  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para inscribirte')
      return
    }

    setEnrolling(courseId)
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          current_unit: 1,
          completed_units: []
        })

      if (error) {
        console.error('Error enrolling in course:', error)
        toast.error('Error al inscribirse en el curso')
      } else {
        toast.success('¡Inscripción exitosa!')
        fetchEnrollments()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al inscribirse en el curso')
    } finally {
      setEnrolling(null)
    }
  }

  const isEnrolled = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId)
  }

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    if (!enrollment) return 0
    
    // Calcular progreso basado en la unidad actual vs total de unidades
    const course = courses.find(c => c.id === courseId)
    if (!course) return 0
    
    // Debug: mostrar información del enrollment
    console.log(`Course: ${course.title}`, {
      currentUnit: enrollment.current_unit,
      totalUnits: course.total_units,
      completedUnits: enrollment.completed_units,
      enrollment
    })
    
    // Priorizar completed_units si está disponible y tiene datos
    if (enrollment.completed_units && Array.isArray(enrollment.completed_units) && enrollment.completed_units.length > 0) {
      const completedCount = enrollment.completed_units.length
      const progress = Math.round((completedCount / course.total_units) * 100)
      console.log(`Progress from completed_units: ${completedCount}/${course.total_units} = ${progress}%`)
      return Math.min(100, Math.max(0, progress))
    }
    
    // Fallback: usar current_unit si completed_units no está disponible
    // Si current_unit es 1, significa que apenas empezó (0% completado)
    // Si current_unit es mayor que total_units, significa que completó todo (100%)
    if (enrollment.current_unit <= 1) return 0
    if (enrollment.current_unit >= course.total_units) return 100
    
    // Calcular porcentaje basado en unidades completadas
    // Restamos 1 porque current_unit indica la siguiente unidad a hacer
    const completedUnits = enrollment.current_unit - 1
    const progress = Math.round((completedUnits / course.total_units) * 100)
    
    console.log(`Progress from current_unit: ${completedUnits}/${course.total_units} = ${progress}%`)
    return Math.min(100, Math.max(0, progress))
  }

  const getCurrentUnit = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    if (!enrollment) return 1
    
    // current_unit indica la siguiente unidad a hacer
    // Si es 1, significa que apenas empezó
    // Si es mayor que total_units, significa que completó todo
    return enrollment.current_unit
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-200/50 rounded-full backdrop-blur-sm mb-8">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">{t('courses.loading')}</span>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-[#005eb8]/20 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full backdrop-blur-sm mb-8">
            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">{t('courses.catalog')}</span>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="relative pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className={`grid gap-8 ${
              courses.length === 1 
                ? 'grid-cols-1 max-w-2xl' 
                : courses.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl'
            }`}>
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id)
              const progress = getEnrollmentProgress(course.id)
              const currentUnit = getCurrentUnit(course.id)
              
              // Debug: mostrar información del progreso
              if (enrolled) {
                console.log(`Course: ${course.title}`, {
                  currentUnit,
                  totalUnits: course.total_units,
                  progress,
                  enrollment: enrollments.find(e => e.course_id === course.id)
                })
              }

              return (
                <Card key={course.id} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 min-w-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-blue-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                      <Lock className="w-16 h-16 text-blue-600" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <CardTitle className="text-xl text-gray-900 font-light tracking-wide group-hover:text-blue-600 transition-colors duration-200">
                        {course.title}
                      </CardTitle>
                      {enrolled && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">{t('courses.enrolled')}</span>
                        </div>
                      )}
                    </div>
                    
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 space-y-4">
                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <Clock className="w-5 h-5 text-blue-600 mb-1" />
                        <span className="text-sm font-medium text-gray-900">{course.duration} min</span>
                        <span className="text-xs text-gray-500">{t('courseDetail.duration')}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <BookOpen className="w-5 h-5 text-[#005eb8] mb-1" />
                        <span className="text-sm font-medium text-gray-900">{course.total_units}</span>
                        <span className="text-xs text-gray-500">{t('courseDetail.units')}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Enrolled Users */}
                    {enrolled && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('courses.progress')}</span>
                          <span className="text-blue-600 font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#005eb8] to-[#0077e6] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          {t('courseDetail.units')} {currentUnit} {t('common.of')} {course.total_units}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3">
                      {enrolled ? (
                        <Link href={`/courses/${course.id}`}>
                          <Button className="w-full bg-gradient-to-r from-[#005eb8] to-[#0077e6] hover:from-[#0077e6] hover:to-[#0091ff] text-white shadow-md hover:shadow-lg transition-all duration-200">
                            <Play className="w-4 h-4 mr-2" />
                            {t('courses.continueLearning')}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          onClick={() => enrollInCourse(course.id)}
                          disabled={enrolling === course.id}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {enrolling === course.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              {t('courseDetail.enrolling')}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              {t('courses.enrollFree')}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-200/50 rounded-full backdrop-blur-sm mb-8">
              <Star className="w-5 h-5 text-[#005eb8] mr-2" />
              <span className="text-[#005eb8] font-medium">{t('common.help')}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 tracking-wide">
              {t('courses.courseNotFound')}
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('courses.contactDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:patricia.belesta@idefinance.com?subject=Consulta sobre cursos de privacidad">
                <Button className="bg-gradient-to-r from-[#005eb8] to-[#0077e6] hover:from-[#0077e6] hover:to-[#0091ff] text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('courses.contactTeam')}
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                  {t('common.backToHome')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
