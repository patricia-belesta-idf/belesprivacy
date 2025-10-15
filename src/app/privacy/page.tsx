'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Database, Users, Globe, FileText, CheckCircle, ArrowLeft, Target, AlertTriangle, Info, Mail, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const sections = [
    {
      id: 'responsible',
      title: t('privacy.sections.responsible'),
      icon: <Database className="w-6 h-6" />,
      content: t('privacy.content.responsible')
    },
    {
      id: 'purposes',
      title: t('privacy.sections.purposes'),
      icon: <Target className="w-6 h-6" />,
      content: t('privacy.content.purposes')
    },
    {
      id: 'data',
      title: t('privacy.sections.data'),
      icon: <FileText className="w-6 h-6" />,
      content: t('privacy.content.data')
    },
    {
      id: 'legal-basis',
      title: t('privacy.sections.legalBasis'),
      icon: <CheckCircle className="w-6 h-6" />,
      content: t('privacy.content.legalBasis')
    },
    {
      id: 'retention',
      title: t('privacy.sections.retention'),
      icon: <Clock className="w-6 h-6" />,
      content: t('privacy.content.retention')
    },
    {
      id: 'recipients',
      title: t('privacy.sections.recipients'),
      icon: <Users className="w-6 h-6" />,
      content: t('privacy.content.recipients')
    },
    {
      id: 'cookies',
      title: t('privacy.sections.cookies'),
      icon: <Globe className="w-6 h-6" />,
      content: t('privacy.content.cookies')
    },
    {
      id: 'rights',
      title: t('privacy.sections.rights'),
      icon: <Shield className="w-6 h-6" />,
      content: t('privacy.content.rights')
    },
    {
      id: 'security',
      title: t('privacy.sections.security'),
      icon: <Lock className="w-6 h-6" />,
      content: t('privacy.content.security')
    },
    {
      id: 'modifications',
      title: t('privacy.sections.modifications'),
      icon: <AlertTriangle className="w-6 h-6" />,
      content: t('privacy.content.modifications')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-[#003d7a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-[#005eb8]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-[#0077e6]/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-[#0091ff]/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('privacy.backToHome')}
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-[#005eb8]/20 backdrop-blur-sm border border-white/20 rounded-full shadow-lg mb-8">
              <Shield className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-blue-200 font-medium">{t('privacy.title')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-wide">
              <span className="bg-gradient-to-r from-blue-400 via-[#0077e6] to-[#0091ff] bg-clip-text text-transparent animate-pulse">
                {t('privacy.title').split(' ')[0]}
              </span>
              <br />
              <span className="text-white/90">
                {t('privacy.subtitle')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              {t('privacy.description')}
            </p>

            <div className="flex items-center justify-center mt-8 space-x-8 text-sm text-white/60">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                RGPD Compliant
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-blue-400" />
                Cifrado End-to-End
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                Auditorías Regulares
              </div>
            </div>
          </div>

          {/* Interactive Navigation */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                    activeSection === index
                      ? 'bg-gradient-to-r from-blue-500/30 to-[#005eb8]/30 border-white/30 shadow-lg scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-2 transition-colors duration-300 ${
                      activeSection === index ? 'text-blue-300' : 'text-white/60'
                    }`}>
                      {section.icon}
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-300 leading-tight ${
                      activeSection === index ? 'text-white' : 'text-white/70'
                    }`}>
                      {section.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-[#005eb8]/20 rounded-xl">
                    {sections[activeSection].icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
                      {sections[activeSection].title}
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-[#0077e6] rounded-full"></div>
                  </div>
                </div>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  {sections[activeSection].content}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500/20 to-[#005eb8]/20 backdrop-blur-sm border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-light text-white mb-4">
                    {t('privacy.needMoreInfo')}
                  </h3>
                  <p className="text-white/70">
                    {t('privacy.teamDescription')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white/60 text-sm">Email Principal</p>
                        <p className="text-white font-medium">dpd@idfinance.com</p>
                      </div>
                    </div>

                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white/60 text-sm">Dirección</p>
                        <p className="text-white font-medium">Calle Tuset, 5, 3ª planta<br />08006 Barcelona, España</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white/60 text-sm">CIF</p>
                        <p className="text-white font-medium">B66862442</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <Info className="w-4 h-4 text-white/60 mr-2" />
              <span className="text-white/60 text-sm">
                {t('privacy.lastUpdated')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}