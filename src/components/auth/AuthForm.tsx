'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export function AuthForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/dashboard`}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Iniciar Sesión',
              loading_button_label: 'Iniciando sesión...',
              social_provider_text: 'Iniciar sesión con {{provider}}',
              link_text: '¿Ya tienes una cuenta? Inicia sesión',
            },
            sign_up: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Registrarse',
              loading_button_label: 'Registrando...',
              social_provider_text: 'Registrarse con {{provider}}',
              link_text: '¿No tienes una cuenta? Regístrate',
            },
            forgotten_password: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Enviar instrucciones de restablecimiento',
              loading_button_label: 'Enviando instrucciones...',
              link_text: '¿Olvidaste tu contraseña?',
            },
            update_password: {
              password_label: 'Nueva contraseña',
              button_label: 'Actualizar contraseña',
              loading_button_label: 'Actualizando contraseña...',
            },
          },
        }}
      />
    </div>
  )
}
