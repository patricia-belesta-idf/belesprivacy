'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, Play, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Course, Enrollment } from '@/types'
import { toast } from 'sonner'

const supabase = createClient()

// Course data that matches the database UUIDs
const mockCourses: Course[] = [
  {
    id: 'b8c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    title: 'Fundamentos de Protección de Datos',
    description: 'Aprende los conceptos básicos de la protección de datos personales, incluyendo principios fundamentales, derechos de los usuarios y obligaciones de las organizaciones.',
    image_url: '/api/placeholder/400/250',
    duration: 120,
    total_units: 8,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 'c9d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    title: 'GDPR y Regulaciones Europeas',
    description: 'Domina el Reglamento General de Protección de Datos (GDPR) y otras regulaciones europeas relacionadas con la privacidad y protección de datos.',
    image_url: '/api/placeholder/400/250',
    duration: 180,
    total_units: 12,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 'd0e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    title: 'Implementación de Políticas de Privacidad',
    description: 'Aprende a crear e implementar políticas de privacidad efectivas, procedimientos de cumplimiento y sistemas de gestión de datos personales.',
    image_url: '/api/placeholder/400/250',
    duration: 150,
    total_units: 10,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
]

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

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
        setCourses(mockCourses)
      } else {
        setCourses(data || mockCourses)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar cursos')
      // Fallback to mock data if database fails
      setCourses(mockCourses)
    }
  }, [])

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
        .select('*')
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
      toast.error('Debes iniciar sesión para inscribirte en un curso')
      return
    }

    setEnrolling(courseId)

    try {
      // Check if already enrolled
      const existingEnrollment = enrollments.find(e => e.course_id === courseId)
      if (existingEnrollment) {
        toast.info('Ya estás inscrito en este curso')
        return
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress: 0,
          current_unit: 1
          // completed_units will use its default value '{}'
        })

      if (error) {
        console.error('Error enrolling in course:', error)
        toast.error('Error al inscribirse en el curso')
      } else {
        toast.success('¡Te has inscrito exitosamente en el curso!')
        // Refresh enrollments
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

  const getEnrollment = (courseId: string) => {
    return enrollments.find(enrollment => enrollment.course_id === courseId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Cursos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora nuestra colección de cursos especializados en protección de datos. 
              Diseñados por expertos para profesionales que quieren destacar en este campo.
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id)
            const enrollment = getEnrollment(course.id)

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-blue-600" />
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.total_units} unidades</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {enrolled ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{enrollment?.progress || 0}%</span>
                        </div>
                        <Progress value={enrollment?.progress || 0} className="h-2" />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/courses/${course.id}`} className="flex-1">
                          <Button className="w-full" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Continuar
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="px-3">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => enrollInCourse(course.id)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Inscribiendo...
                        </>
                      ) : (
                        'Inscribirse'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
