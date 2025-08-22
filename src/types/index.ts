export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  image_url?: string
  duration: number // in minutes
  total_units: number
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  course_id: string
  title: string
  description: string
  order: number
  video_url: string
  duration: number // in minutes
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress: number // percentage completed
  current_unit: number
  completed_units: string[]
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  unit_id: string
  title: string
  questions: QuizQuestion[]
  passing_score: number
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  answers: Record<string, number>
  passed: boolean
  completed_at: string
}
