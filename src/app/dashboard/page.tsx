'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Play, Clock, CheckCircle, TrendingUp, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClient } from '@/lib/supabase'
import { Course, Enrollment } from '@/types'
import { toast } from 'sonner'

const supabase = createClient()

interface EnrolledCourse {
  id: string
  course: Course
  enrollment: Enrollment
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
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
      // Fetch enrollments with course details
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user?.id)

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError)
        toast.error(t('common.error'))
        return
      }

      if (enrollmentsData && enrollmentsData.length > 0) {
        // Fetch course details for each enrollment
        const courseIds = enrollmentsData.map(e => e.course_id)
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds)

        if (coursesError) {
          console.error('Error fetching courses:', coursesError)
          toast.error(t('common.error'))
          return
        }

        // Combine enrollments with course data
        const enrolledCoursesData: EnrolledCourse[] = enrollmentsData.map(enrollment => {
          const course = coursesData?.find(c => c.id === enrollment.course_id)
          return {
            id: enrollment.id,
            course: course || {
              id: enrollment.course_id,
              title: t('courseDetail.courseNotFound'),
              description: '',
              image_url: '',
              duration: 0,
              total_units: 0,
              created_at: '',
              updated_at: ''
            },
            enrollment
          }
        })

        setEnrolledCourses(enrolledCoursesData)

        // Calculate stats
        const totalUnits = enrolledCoursesData.reduce((acc, item) => acc + item.course.total_units, 0)
        const completedUnits = enrolledCoursesData.reduce((acc, item) => {
          // Usar completed_units si está disponible, sino calcular basado en current_unit
          if (item.enrollment.completed_units && Array.isArray(item.enrollment.completed_units)) {
            return acc + item.enrollment.completed_units.length
          } else {
            // Fallback: calcular basado en current_unit
            const currentUnit = item.enrollment.current_unit || 1
            const completed = Math.max(0, currentUnit - 1)
            return acc + completed
          }
        }, 0)
        
        // Calcular progreso general basado en unidades completadas vs total
        const generalProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0

        setStats({
          totalCourses: enrolledCoursesData.length,
          totalProgress: generalProgress,
          completedUnits,
          totalUnits
        })
      } else {
        setEnrolledCourses([])
        setStats({
          totalCourses: 0,
          totalProgress: 0,
          completedUnits: 0,
          totalUnits: 0
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full backdrop-blur-sm mb-8">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">{t('dashboard.loading')}</span>
          </div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('dashboard.loading')}</p>
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
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 rounded-full backdrop-blur-sm mb-4">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-700 font-medium">{t('dashboard.yourProgress')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-2 tracking-wide">
                {t('dashboard.myDashboard')}
              </h1>
              <p className="text-xl text-gray-600">{t('dashboard.welcomeBack')}, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200">
                <BookOpen className="h-4 w-4 mr-2" />
                {t('dashboard.exploreCourses')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-light text-gray-900 tracking-wide">{t('dashboard.enrolledCourses')}</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                <p className="text-xs text-gray-500">
                  {t('dashboard.activeCourses')}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-emerald-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-light text-gray-900 tracking-wide">{t('dashboard.overallProgress')}</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-gray-900">{stats.totalProgress}%</div>
                <p className="text-xs text-gray-500">
                  {t('dashboard.averageOfAllCourses')}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-light text-gray-900 tracking-wide">{t('dashboard.completedUnits')}</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-gray-900">{stats.completedUnits}</div>
                <p className="text-xs text-gray-500">
                  {t('dashboard.of')} {stats.totalUnits} {t('dashboard.total')}
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Enrolled Courses */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-gray-900 tracking-wide">{t('dashboard.myCourses')}</h2>
            </div>

            <div className="grid gap-6">
              {enrolledCourses.map((item) => (
                <Card key={item.id} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-purple-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Lock className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-light text-gray-900 mb-1 tracking-wide group-hover:text-blue-600 transition-colors duration-200">
                              {item.course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {item.course.description}
                            </p>
                          </div>
                          <Badge className="ml-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50">
                            {(() => {
                              // Calcular progreso real basado en completed_units o current_unit
                              if (item.enrollment.completed_units && Array.isArray(item.enrollment.completed_units)) {
                                const progress = Math.round((item.enrollment.completed_units.length / item.course.total_units) * 100)
                                return Math.min(100, Math.max(0, progress))
                              } else {
                                // Fallback: usar current_unit
                                const currentUnit = item.enrollment.current_unit || 1
                                if (currentUnit <= 1) return 0
                                if (currentUnit >= item.course.total_units) return 100
                                const completedUnits = currentUnit - 1
                                const progress = Math.round((completedUnits / item.course.total_units) * 100)
                                return Math.min(100, Math.max(0, progress))
                              }
                            })()}% {t('common.completed')}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{t('courses.progress')}</span>
                              <span className="font-medium">{(() => {
                                // Calcular progreso real basado en completed_units o current_unit
                                if (item.enrollment.completed_units && Array.isArray(item.enrollment.completed_units)) {
                                  const progress = Math.round((item.enrollment.completed_units.length / item.course.total_units) * 100)
                                  return Math.min(100, Math.max(0, progress))
                                } else {
                                  // Fallback: usar current_unit
                                  const currentUnit = item.enrollment.current_unit || 1
                                  if (currentUnit <= 1) return 0
                                  if (currentUnit >= item.course.total_units) return 100
                                  const completedUnits = currentUnit - 1
                                  const progress = Math.round((completedUnits / item.course.total_units) * 100)
                                  return Math.min(100, Math.max(0, progress))
                                }
                              })()}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(() => {
                                  // Calcular progreso real basado en completed_units o current_unit
                                  if (item.enrollment.completed_units && Array.isArray(item.enrollment.completed_units)) {
                                    const progress = Math.round((item.enrollment.completed_units.length / item.course.total_units) * 100)
                                    return Math.min(100, Math.max(0, progress))
                                  } else {
                                    // Fallback: usar current_unit
                                    const currentUnit = item.enrollment.current_unit || 1
                                    if (currentUnit <= 1) return 0
                                    if (currentUnit >= item.course.total_units) return 100
                                    const completedUnits = currentUnit - 1
                                    const progress = Math.round((completedUnits / item.course.total_units) * 100)
                                    return Math.min(100, Math.max(0, progress))
                                  }
                                })()}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{t('dashboard.currentUnit')}: {item.enrollment.current_unit} {t('dashboard.of')} {item.course.total_units}</span>
                          </div>

                          <div className="flex space-x-3">
                            <Link href={`/courses/${item.course.id}`}>
                              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {t('dashboard.viewCourse')}
                              </Button>
                            </Link>
                            <Link href={`/courses/${item.course.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200">
                                <Play className="h-4 w-4 mr-2" />
                                {t('dashboard.continue')}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {enrolledCourses.length === 0 && (
              <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide">
                    {t('dashboard.noEnrolledCourses')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('dashboard.startExploring')}
                  </p>
                  <Link href="/courses">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200">
                      {t('dashboard.exploreCourses')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
