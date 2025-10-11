'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'

const supabase = createClient()

interface AuthFormProps {
  onModeChange?: (isSignUp: boolean) => void
  initialMode?: 'signup' | 'login'
}

export function AuthForm({ onModeChange, initialMode = 'login' }: AuthFormProps) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })
        if (error) {
          toast.error(error.message)
        } else {
          toast.success(t('auth.signupSuccess'))
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          toast.error(error.message)
        } else {
          toast.success(t('auth.loginSuccess'))
          window.location.href = '/dashboard'
        }
      }
    } catch (error) {
      toast.error(t('auth.authError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isSignUp ? t('auth.signingUp') : t('auth.loggingIn')}
            </>
          ) : (
            isSignUp ? t('auth.signup') : t('auth.login')
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              const newMode = !isSignUp
              setIsSignUp(newMode)
              onModeChange?.(newMode)
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
          </button>
        </div>
      </form>
    </div>
  )
}
