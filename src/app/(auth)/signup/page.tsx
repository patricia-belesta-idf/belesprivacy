'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SignupPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center p-4">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#005eb8]/20 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-200/50 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-5 h-5 text-[#005eb8] mr-2" />
            <span className="text-[#005eb8] font-medium">{t('auth.newUser')}</span>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#005eb8] to-[#0077e6] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-wide">{t('auth.signupTitle')}</h1>
          <p className="text-gray-600 text-lg">{t('auth.signupSubtitle')}</p>
        </div>
        
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 font-light tracking-wide">{t('auth.signup')}</CardTitle>
            <CardDescription className="text-gray-600">
              {t('auth.signupSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm initialMode="signup" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
