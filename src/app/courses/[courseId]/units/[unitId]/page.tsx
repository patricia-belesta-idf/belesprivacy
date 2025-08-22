'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, ArrowLeft, ArrowRight, Check, Video } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase'
import { Course, Unit, Quiz } from '@/types'

const supabase = createClient()

// Mock data for demonstration
const mockUnit: Unit = {
  id: '1',
  course_id: '1',
  title: 'Introducción a la Protección de Datos',
  description: 'En esta unidad aprenderás los conceptos básicos y fundamentos de la privacidad y protección de datos personales. Comprenderás por qué es importante proteger la información personal y cómo las organizaciones deben manejar estos datos de manera responsable.',
  order: 1,
  video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example video URL
  duration: 15,
  created_at: '2024-01-01'
}

const mockQuiz: Quiz = {
  id: '1',
  unit_id: '1',
  title: 'Test: Introducción a la Protección de Datos',
  questions: [
    {
      id: '1',
      question: '¿Qué es la protección de datos personales?',
      options: [
        'Un proceso para almacenar información de manera segura',
        'Un conjunto de medidas para proteger la privacidad y los derechos de las personas sobre su información personal',
        'Una técnica de encriptación de datos',
        'Un protocolo de seguridad informática'
      ],
      correct_answer: 1,
      explanation: 'La protección de datos personales se refiere al conjunto de medidas, garantías y derechos que protegen la privacidad y los derechos de las personas sobre su información personal.'
    },
    {
      id: '2',
      question: '¿Cuál de los siguientes NO es un principio de la protección de datos?',
      options: [
        'Licitud, lealtad y transparencia',
        'Limitación de la finalidad',
        'Minimización de datos',
        'Maximización del almacenamiento'
      ],
      correct_answer: 3,
      explanation: 'La maximización del almacenamiento NO es un principio de la protección de datos. Los principios incluyen la minimización de datos, no su maximización.'
    },
    {
      id: '3',
      question: '¿Qué derecho tiene una persona sobre sus datos personales?',
      options: [
        'Solo el derecho de acceso',
        'Solo el derecho de rectificación',
        'Múltiples derechos incluyendo acceso, rectificación, cancelación y oposición',
        'Ningún derecho específico'
      ],
      correct_answer: 2,
      explanation: 'Las personas tienen múltiples derechos sobre sus datos personales, incluyendo el acceso, rectificación, cancelación y oposición (derechos ARCO).'
    }
  ],
  passing_score: 70,
  created_at: '2024-01-01'
}

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

  useEffect(() => {
    if (params.courseId && params.unitId) {
      fetchUnitData()
    }
  }, [params.courseId, params.unitId])

  const fetchUnitData = async () => {
    try {
      // In production, this would fetch real data from Supabase
      setUnit(mockUnit)
      setQuiz(mockQuiz)
      
      // Mock course data
      setCourse({
        id: '1',
        title: 'Fundamentos de Protección de Datos',
        description: 'Curso de protección de datos',
        image_url: '',
        duration: 120,
        total_units: 8,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      })
    } catch (error) {
      console.error('Error fetching unit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoEnd = () => {
    setVideoWatched(true)
    // In production, this would update the user's progress in Supabase
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const submitQuiz = () => {
    if (!quiz) return

    let correctAnswers = 0
    quiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct_answer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    // In production, this would save the quiz attempt to Supabase
    if (score >= quiz.passing_score) {
      // Mark unit as completed
      markUnitAsCompleted()
    }
  }

  const markUnitAsCompleted = async () => {
    if (!user || !unit) return

    try {
      // In production, this would update the enrollment in Supabase
      console.log('Unit completed:', unit.id)
    } catch (error) {
      console.error('Error marking unit as completed:', error)
    }
  }

  const getNextUnit = (): { id: string; title: string } | null => {
    if (!unit || !course) return null
    // In production, this would fetch the next unit from Supabase
    return { id: '2', title: 'Principios de la Protección de Datos' }
  }

  const getPreviousUnit = (): { id: string; title: string } | null => {
    if (!unit || !course) return null
    // In production, this would fetch the previous unit from Supabase
    return null // First unit has no previous
  }

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

  const nextUnit = getNextUnit()
  const previousUnit = getPreviousUnit()

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
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={unit.video_url}
                    title={unit.title}
                    className="w-full h-full"
                    allowFullScreen
                    onEnded={handleVideoEnd}
                  />
                </div>
                
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
                <CardTitle>{quiz?.title}</CardTitle>
                <CardDescription>
                  Responde las siguientes preguntas para evaluar tu comprensión de la unidad.
                  Necesitas obtener al menos {quiz?.passing_score}% para aprobar.
                </CardDescription>
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

                {videoWatched && !quizSubmitted && (
                  <div className="space-y-6">
                    {quiz?.questions.map((question, index) => (
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
                      disabled={Object.keys(quizAnswers).length < (quiz?.questions.length || 0)}
                    >
                      Enviar Test
                    </Button>
                  </div>
                )}

                {quizSubmitted && (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg border ${
                      quizScore && quizScore >= (quiz?.passing_score || 0)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="text-center">
                        <h3 className={`text-lg font-semibold ${
                          quizScore && quizScore >= (quiz?.passing_score || 0)
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {quizScore && quizScore >= (quiz?.passing_score || 0)
                            ? '¡Felicitaciones! Has aprobado el test'
                            : 'No has alcanzado la puntuación mínima'
                          }
                        </h3>
                        <p className={`text-sm mt-1 ${
                          quizScore && quizScore >= (quiz?.passing_score || 0)
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          Tu puntuación: {quizScore}% (Puntuación mínima: {quiz?.passing_score}%)
                        </p>
                      </div>
                    </div>

                    {quiz?.questions.map((question, index) => (
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

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        {previousUnit && (
                          <Link href={`/courses/${course.id}/units/${previousUnit.id}`}>
                            <Button variant="outline">
                              <ArrowLeft className="h-4 w-4 mr-2" />
                              Unidad Anterior
                            </Button>
                          </Link>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="outline">
                            Ver Curso
                          </Button>
                        </Link>
                        
                        {nextUnit && quizScore && quizScore >= (quiz?.passing_score || 0) && (
                          <Link href={`/courses/${course.id}/units/${nextUnit.id}`}>
                            <Button>
                              Siguiente Unidad
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
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
