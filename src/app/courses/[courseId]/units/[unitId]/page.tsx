'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, ArrowLeft, ArrowRight, Check, Video, RefreshCw, CheckCircle } from 'lucide-react'
import { AntiCheatVideoPlayer } from "@/components/video/AntiCheatVideoPlayer"
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Course, Unit, Quiz } from '@/types'
import { toast } from 'sonner'

const supabase = createClient()

export default function UnitPage() {
  const params = useParams()
  const { user } = useAuth()
  const [unit, setUnit] = useState<Unit | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('video')
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [videoWatched, setVideoWatched] = useState(false)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const [canRetakeQuiz, setCanRetakeQuiz] = useState(false)

  useEffect(() => {
    if (params.courseId && params.unitId) {
      fetchUnitData()
    }
  }, [params.courseId, params.unitId])

  const fetchUnitData = async () => {
    try {
      // Fetch unit data
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', params.unitId)
        .single()

      if (unitError) {
        console.error('Error fetching unit:', unitError)
        toast.error('Error al cargar la unidad')
        return
      }

      setUnit(unitData)

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

      // Fetch quiz data
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (
            *,
            order
          )
        `)
        .eq('unit_id', params.unitId)
        .single()

      if (quizError) {
        console.error('Error fetching quiz:', quizError)
        // Quiz might not exist yet, that's okay
      } else {
        // Sort questions by order
        const sortedQuiz = {
          ...quizData,
          questions: quizData.quiz_questions?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || []
        }
        setQuiz(sortedQuiz)
      }

      // Check if user has watched this video
      if (user) {
        console.log('🔍 Checking video progress for user:', user.id, 'unit:', params.unitId)
        
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('video_watched, video_watched_at')
          .eq('user_id', user.id)
          .eq('unit_id', params.unitId)
          .single()

        if (progressError) {
          console.log('ℹ️ No progress record found for this unit (normal for new units)')
        } else if (progressData?.video_watched) {
          console.log('✅ Video already watched at:', progressData.video_watched_at)
          setVideoWatched(true)
        } else {
          console.log('⏳ Video not watched yet')
        }
      }
    } catch (error) {
      console.error('Error fetching unit data:', error)
      toast.error('Error al cargar datos de la unidad')
    } finally {
      setLoading(false)
      
      // Debug enrollment status when page loads
      setTimeout(() => {
        debugEnrollmentStatus()
      }, 2000)
    }
  }

  const handleVideoEnd = async () => {
    setVideoWatched(true)
    
    if (user && unit && course) {
      try {
        // Update user progress in Supabase - ONLY mark video as watched
        const { error: progressError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            unit_id: unit.id,
            video_watched: true,
            video_watched_at: new Date().toISOString()
          })

        if (progressError) {
          console.error('Error updating progress:', progressError)
        } else {
          toast.success('¡Video completado! Ahora puedes tomar el test.')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Error al actualizar el progreso del video')
      }
    }
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const submitQuiz = async () => {
    if (!quiz || !user || !unit) return

    setSubmittingQuiz(true)

    try {
      let correctAnswers = 0
      quiz.questions.forEach(question => {
        if (quizAnswers[question.id] === question.correct_answer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / quiz.questions.length) * 100)
      setQuizScore(score)
      setQuizSubmitted(true)

      // Enable retake if failed
      if (score < quiz.passing_score) {
        setCanRetakeQuiz(true)
      }

      // Save quiz attempt to Supabase
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          score: score,
          answers: quizAnswers,
          passed: score >= quiz.passing_score,
          completed_at: new Date().toISOString()
        })

      if (attemptError) {
        console.error('Error saving quiz attempt:', attemptError)
        toast.error('Error al guardar el intento del test')
      } else {
        console.log(`Quiz attempt saved: Score ${score}%, Passed: ${score >= quiz.passing_score}`)
      }

      // If passed, mark unit as completed
      if (score >= quiz.passing_score) {
        console.log('Quiz passed, calling markUnitAsCompleted...')
        await markUnitAsCompleted()
        
        // Debug enrollment status after marking unit as completed
        setTimeout(() => {
          debugEnrollmentStatus()
        }, 1000)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Error al enviar el test')
    } finally {
      setSubmittingQuiz(false)
    }
  }

  const retakeQuiz = () => {
    // Reset quiz state
    setQuizAnswers({})
    setQuizScore(null)
    setQuizSubmitted(false)
    setCanRetakeQuiz(false)
    setSubmittingQuiz(false)
  }

  const markUnitAsCompleted = async () => {
    if (!user || !unit || !course) return

    try {
      console.log(`Marking unit ${unit.id} (order: ${unit.order}) as completed for course ${course.id}`)

      // Update user progress - mark quiz as passed
      console.log('Attempting to update user_progress for unit:', unit.id)
      
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          unit_id: unit.id,
          quiz_passed: true,
          quiz_passed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,unit_id'
        })

      if (progressError) {
        console.error('Error updating user_progress:', progressError)
        console.error('Progress error details:', {
          code: progressError.code,
          message: progressError.message,
          details: progressError.details
        })
        
        // Try to get existing record to understand the conflict
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('unit_id', unit.id)
          .single()
        
        console.log('Existing progress record:', existingProgress)
        
        // Continue anyway - don't return here
        console.log('Continuing with enrollment update despite user_progress error...')
      } else {
        console.log('✅ user_progress updated successfully:', progressData)
      }

      // Get current enrollment data
      const { data: enrollmentData, error: enrollmentSelectError } = await supabase
        .from('enrollments')
        .select('completed_units, current_unit')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()

      if (enrollmentSelectError) {
        console.error('Error fetching enrollment data:', enrollmentSelectError)
        return
      }

      if (enrollmentData) {
        // Ensure we don't add duplicate units
        const existingCompletedUnits = enrollmentData.completed_units || []
        const isUnitAlreadyCompleted = existingCompletedUnits.includes(unit.id)
        
        if (isUnitAlreadyCompleted) {
          console.log(`Unit ${unit.id} already marked as completed`)
          return
        }

        // Add current unit to completed units
        const updatedCompletedUnits = [...existingCompletedUnits, unit.id]
        const currentUnit = Math.max(enrollmentData.current_unit || 1, unit.order + 1)
        
        console.log(`Updated completed units: ${updatedCompletedUnits.length}/${course.total_units}`)
        console.log(`Current unit: ${currentUnit}`)
        
        // Check if this completes the course
        const isLastUnit = unit.order === course.total_units
        const isCourseCompleted = isLastUnit && updatedCompletedUnits.length >= course.total_units
        
        console.log(`Is last unit: ${isLastUnit}, Is course completed: ${isCourseCompleted}`)

        const updateData: {
          completed_units: string[]
          current_unit: number
          completed_at?: string
        } = {
          completed_units: updatedCompletedUnits,
          current_unit: currentUnit
        }

        // Mark course as completed if this is the last unit
        if (isCourseCompleted) {
          updateData.completed_at = new Date().toISOString()
          console.log('Marking course as completed with timestamp:', updateData.completed_at)
        }

        // Update enrollment
        console.log('Attempting to update enrollment with data:', updateData)
        console.log('Current enrollment state before update:', enrollmentData)
        
        const { data: enrollmentUpdateData, error: enrollmentUpdateError } = await supabase
          .from('enrollments')
          .update(updateData)
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .select()

        if (enrollmentUpdateError) {
          console.error('❌ Error updating enrollment:', enrollmentUpdateError)
          console.error('Enrollment error details:', {
            code: enrollmentUpdateError.code,
            message: enrollmentUpdateError.message,
            details: enrollmentUpdateError.details
          })
          toast.error('Error al actualizar el progreso del curso')
        } else {
          console.log('✅ Enrollment updated successfully:', enrollmentUpdateData)
          
          if (isCourseCompleted) {
            toast.success('¡Felicitaciones! Has completado todo el curso.')
            console.log('🎉 Course marked as completed successfully')
          } else {
            toast.success('¡Unidad completada! Progreso actualizado.')
            console.log('✅ Unit marked as completed successfully')
          }
        }
      }
    } catch (error) {
      console.error('Error marking unit as completed:', error)
      toast.error('Error al marcar la unidad como completada')
    }
  }

  const getNextUnit = async (): Promise<{ id: string; title: string } | null> => {
    if (!unit || !course) {
      console.log('❌ getNextUnit: Missing unit or course data')
      return null
    }

    console.log(`🔍 getNextUnit: Looking for next unit after order ${unit.order}`)
    console.log(`🔍 getNextUnit: Course ID: ${course.id}, Current unit order: ${unit.order}`)

    try {
      // Primero, vamos a probar una consulta simple para diagnosticar
      console.log('🔍 Testing basic units query...')
      const { data: testData, error: testError } = await supabase
        .from('units')
        .select('id, title, order')
        .eq('course_id', course.id)
        .limit(5)

      if (testError) {
        console.error('❌ Test query failed:', testError)
        console.error('Test error details:', {
          code: testError.code,
          message: testError.message,
          details: testError.details
        })
        return null
      }

      console.log('✅ Test query successful, found units:', testData)
      console.log('🔍 Looking for unit with order:', unit.order + 1)

      // Ahora buscamos la siguiente unidad
      const { data: nextUnitData, error: nextUnitError } = await supabase
        .from('units')
        .select('id, title, order')
        .eq('course_id', course.id)
        .eq('order', unit.order + 1)
        .single()

      if (nextUnitError) {
        console.error('❌ getNextUnit: Error fetching next unit:', nextUnitError)
        console.error('Error details:', {
          code: nextUnitError.code,
          message: nextUnitError.message,
          details: nextUnitError.details
        })
        return null
      }

      if (nextUnitData) {
        console.log(`✅ getNextUnit: Found next unit: ${nextUnitData.title} (order: ${nextUnitData.order})`)
        return nextUnitData
      } else {
        console.log('⚠️ getNextUnit: No next unit found')
        return null
      }
    } catch (error) {
      console.error('❌ getNextUnit: Unexpected error:', error)
      return null
    }
  }

  const isLastUnit = (): boolean => {
    if (!unit || !course) return false
    return unit.order === course.total_units
  }

  const isCourseCompleted = (): boolean => {
    if (!unit || !course) return false
    return unit.order === course.total_units && quizScore !== null && quizScore >= (quiz?.passing_score || 70)
  }

  const getCourseCompletionMessage = (): string => {
    if (!unit || !course) return ''
    
    if (isLastUnit()) {
      if (quizScore !== null && quizScore >= (quiz?.passing_score || 70)) {
        return `¡Felicitaciones! Has completado "${course.title}" exitosamente.`
      } else {
        return `Esta es la última unidad de "${course.title}". Completa el test para finalizar el curso.`
      }
    }
    
    return ''
  }

  // Debug function to check enrollment status
  const debugEnrollmentStatus = async () => {
    if (!user || !course) return
    
    try {
      const { data: enrollmentData, error } = await supabase
        .from('enrollments')
        .select('completed_units, current_unit, completed_at')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()
      
      if (error) {
        console.error('Error fetching enrollment for debug:', error)
        return
      }
      
      // Calculate progress manually since column doesn't exist
      const completedCount = enrollmentData?.completed_units?.length || 0
      const calculatedProgress = course.total_units > 0 ? Math.round((completedCount / course.total_units) * 100) : 0
      
      console.log('=== ENROLLMENT DEBUG INFO ===')
      console.log('Course ID:', course.id)
      console.log('Course total units:', course.total_units)
      console.log('Current unit:', enrollmentData?.current_unit)
      console.log('Calculated progress:', calculatedProgress + '%')
      console.log('Completed units count:', completedCount)
      console.log('Completed units IDs:', enrollmentData?.completed_units)
      console.log('Completed at:', enrollmentData?.completed_at)
      console.log('Current unit order:', unit?.order)
      console.log('Is last unit:', isLastUnit())
      console.log('================================')
    } catch (error) {
      console.error('Error in debug function:', error)
    }
  }

  // Function to get previous unit (unused for now)
  // const getPreviousUnit = async (): Promise<{ id: string; title: string } | null> => {
  //   if (!unit || !course) return null

  //   try {
  //     const { data: prevUnitData } = await supabase
  //       .from('units')
  //       .select('id, title')
  //       .eq('course_id', course.id)
  //       .eq('order', unit.order - 1)
  //       .single()

  //     return prevUnitData || null
  //   } catch (error) {
  //     return null
  //   }
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando unidad...</p>
        </div>
      </div>
    )
  }

  if (!unit || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unidad no encontrada</h1>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{unit.title}</h1>
                <p className="text-gray-600">Unidad {unit.order} • {unit.duration} minutos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {videoWatched && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Check className="h-3 w-3" />
                  <span>Video visto</span>
                </Badge>
              )}
              <Link href={`/courses/${course.id}`}>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Curso
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="quiz">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video de la Unidad</CardTitle>
                <CardDescription>
                  {unit.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AntiCheatVideoPlayer
                  videoUrl={unit.video_url}
                  title={unit.title}
                  onVideoEnd={handleVideoEnd}
                  completionThreshold={95}
                  userId={user?.id}
                  unitId={unit.id}
                  analyticsId={crypto.randomUUID()}
                  onProgress={(progress, analytics) => {
                    // Optional: You can use this to show progress
                    console.log('Video progress:', progress)
                  }}
                  className="aspect-video"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Duración: {unit.duration} minutos
                  </div>
                  {videoWatched && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Completado</span>
                    </Badge>
                  )}
                </div>

                {videoWatched && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        ¡Excelente! Has completado el video de esta unidad.
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Ahora puedes proceder al test para evaluar tu comprensión.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{quiz?.title || 'Test de la Unidad'}</CardTitle>
                <CardDescription>
                  {quiz ? 
                    `Responde las siguientes preguntas para evaluar tu comprensión de la unidad. Necesitas obtener al menos ${quiz.passing_score}% para aprobar.` :
                    'Esta unidad no tiene test disponible aún.'
                  }
                </CardDescription>
                
                {/* Mensaje especial para la última unidad */}
                {isLastUnit() && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      🎯 {getCourseCompletionMessage()}
                    </p>
                    
                    {/* Botón de debug temporal */}
                    <button
                      onClick={debugEnrollmentStatus}
                      className="mt-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                    >
                      🔍 Debug Enrollment
                    </button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {!videoWatched && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">
                        Primero debes ver el video de la unidad
                      </span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      Ve a la pestaña &quot;Video&quot; y completa la reproducción antes de tomar el test.
                    </p>
                  </div>
                )}

                {/* Mensaje especial para la última unidad cuando no has visto el video */}
                {/* Removido el aviso de "última unidad" para una experiencia más limpia */}

                {!quiz && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-blue-800">
                        Esta unidad no tiene test disponible aún. Pronto se agregará contenido de evaluación.
                      </p>
                    </div>
                  </div>
                )}

                {videoWatched && quiz && !quizSubmitted && (
                  <div className="space-y-6">
                    {/* Mensaje especial para la última unidad cuando has visto el video */}
                    {/* Removido el aviso de "último paso" para una experiencia más limpia */}
                    
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={optionIndex}
                                checked={quizAnswers[question.id] === optionIndex}
                                onChange={() => handleQuizAnswer(question.id, optionIndex)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={submitQuiz}
                      className="w-full"
                      disabled={Object.keys(quizAnswers).length < quiz.questions.length || submittingQuiz}
                    >
                      {submittingQuiz ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Test'
                      )}
                    </Button>
                  </div>
                )}

                {quizSubmitted && quiz && (
                  <div className="space-y-6">
                    {/* Mensaje especial cuando completas el curso */}
                    {isLastUnit() && quizScore && quizScore >= quiz.passing_score && (
                      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <span className="text-2xl font-bold text-green-800">
                            ¡Curso Completado!
                          </span>
                        </div>
                        <p className="text-green-700 text-lg font-medium">
                          Has completado exitosamente &quot;{course.title}&quot;
                        </p>
                        <p className="text-green-600 text-sm mt-2">
                          ¡Felicitaciones por tu dedicación y esfuerzo!
                        </p>
                      </div>
                    )}
                    
                    <div className={`p-4 rounded-lg border ${
                      quizScore && quizScore >= quiz.passing_score
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="text-center">
                        <h3 className={`text-lg font-semibold ${
                          quizScore && quizScore >= quiz.passing_score
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {quizScore && quizScore >= quiz.passing_score
                            ? isLastUnit() 
                              ? '¡Felicitaciones! Has completado todo el curso'
                              : '¡Felicitaciones! Has aprobado el test'
                            : 'No has alcanzado la puntuación mínima'
                          }
                        </h3>
                        <p className={`text-sm mt-1 ${
                          quizScore && quizScore >= quiz.passing_score
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          Tu puntuación: {quizScore}% (Puntuación mínima: {quiz.passing_score}%)
                          {isLastUnit() && quizScore && quizScore >= quiz.passing_score && (
                            <span className="block mt-2 text-green-600 font-medium">
                              🎉 ¡Has completado exitosamente &quot;{course.title}&quot;!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`flex items-center space-x-3 p-3 border rounded-lg ${
                                optionIndex === question.correct_answer
                                  ? 'bg-green-50 border-green-200'
                                  : quizAnswers[question.id] === optionIndex && optionIndex !== question.correct_answer
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                optionIndex === question.correct_answer
                                  ? 'bg-green-600'
                                  : quizAnswers[question.id] === optionIndex && optionIndex !== question.correct_answer
                                  ? 'bg-red-600'
                                  : 'bg-gray-400'
                              }`}>
                                {optionIndex === question.correct_answer ? (
                                  <Check className="h-3 w-3 text-white" />
                                ) : quizAnswers[question.id] === optionIndex && optionIndex !== question.correct_answer ? (
                                  <span className="text-white text-xs">✗</span>
                                ) : (
                                  <span className="text-white text-xs">○</span>
                                )}
                              </div>
                              <span className={`text-sm ${
                                optionIndex === question.correct_answer
                                  ? 'text-green-800 font-medium'
                                  : quizAnswers[question.id] === optionIndex && optionIndex !== question.correct_answer
                                  ? 'text-red-800 font-medium'
                                  : 'text-gray-700'
                              }`}>
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Explicación:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mensaje especial cuando no apruebas el test en la última unidad */}
                    {/* Removido el aviso de "última unidad" para una experiencia más limpia */}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="outline">
                            Ver Curso
                          </Button>
                        </Link>
                        
                        {/* Botón Repetir Test - solo aparece si no aprobaste */}
                        {canRetakeQuiz && (
                          <Button 
                            onClick={retakeQuiz}
                            variant="outline"
                            className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Repetir Test
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {quizScore && quizScore >= quiz.passing_score && (
                          <>
                            {isLastUnit() ? (
                              // Si es la última unidad, mostrar botón de curso completado
                              <Button 
                                onClick={async () => {
                                  // Forzar refresh de datos antes de navegar
                                  console.log('🔄 Refreshing course data before navigation...')
                                  
                                  // Pequeño delay para asegurar que la BD se actualice
                                  await new Promise(resolve => setTimeout(resolve, 500))
                                  
                                  // Navegar con refresh forzado
                                  window.location.href = `/courses/${course.id}?refresh=${Date.now()}`
                                }}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Curso Completado
                              </Button>
                            ) : (
                              // Si no es la última, mostrar botón de siguiente unidad
                              <Button onClick={async () => {
                                console.log('🔄 Button clicked: Siguiente Unidad')
                                console.log('🔍 Current unit:', unit?.title, 'order:', unit?.order)
                                
                                const nextUnit = await getNextUnit()
                                console.log('🔍 getNextUnit result:', nextUnit)
                                
                                if (nextUnit) {
                                  console.log(`✅ Navigating to next unit: ${nextUnit.title} (${nextUnit.id})`)
                                  window.location.href = `/courses/${course.id}/units/${nextUnit.id}`
                                } else {
                                  console.error('❌ No next unit found, cannot navigate')
                                  toast.error('Error: No se encontró la siguiente unidad')
                                }
                              }}>
                                Siguiente Unidad
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
