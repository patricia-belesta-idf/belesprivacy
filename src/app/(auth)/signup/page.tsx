import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Únete a BelesPrivacy</h1>
          <p className="text-gray-600">Crea tu cuenta y comienza tu aprendizaje</p>
        </div>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Regístrate para acceder a todos nuestros cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
