import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Shield, Video, Award, Users, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Aprende{' '}
              <span className="text-blue-600">Protección de Datos</span>
              <br />
              de manera profesional
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Domina los fundamentos de la privacidad y protección de datos personales 
              con nuestro curso completo y certificado. Aprende a tu ritmo con videos 
              interactivos y evaluaciones prácticas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="text-lg px-8 py-6">
                  Explorar Cursos
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir BelesPrivacy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma te ofrece todo lo necesario para convertirte en un 
              experto en protección de datos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Contenido en Video</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Aprende con videos de alta calidad, explicaciones claras y 
                  ejemplos prácticos del mundo real.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Certificación</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Obtén tu certificado al completar el curso y demuestra 
                  tus conocimientos en protección de datos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Comunidad</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Conecta con otros profesionales y comparte experiencias 
                  en nuestro foro de discusión.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Aprendizaje Flexible</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Estudia a tu ritmo, desde cualquier dispositivo y 
                  en cualquier momento del día.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Contenido Actualizado</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Mantente al día con las últimas regulaciones y 
                  mejores prácticas en protección de datos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Recursos Adicionales</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Accede a materiales complementarios, plantillas y 
                  herramientas para aplicar lo aprendido.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya han transformado su carrera 
            con nuestros cursos de protección de datos.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
