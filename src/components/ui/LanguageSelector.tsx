'use client'

import React from 'react'
import { useLanguage, Language } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const languageOptions: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languageOptions.find(l => l.code === language)?.flag}</span>
        <span className="hidden md:inline">{languageOptions.find(l => l.code === language)?.name}</span>
      </Button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languageOptions.map((option) => (
          <button
            key={option.code}
            onClick={() => setLanguage(option.code)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3 ${
              language === option.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
          >
            <span className="text-lg">{option.flag}</span>
            <span className="font-medium">{option.name}</span>
            {language === option.code && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
