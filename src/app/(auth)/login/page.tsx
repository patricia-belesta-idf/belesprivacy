import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta para continuar</p>
        </div>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Accede a tus cursos y continúa aprendiendo
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
