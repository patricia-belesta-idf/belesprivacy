'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Linkedin, Heart, Sparkles, ChevronLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AuthorPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#003d7a] to-[#005eb8] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-[#005eb8]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-[#0077e6]/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-br from-[#0091ff]/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-300 hover:text-white transition-colors duration-200 group">
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>{t('common.backToHome')}</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#005eb8]/20 to-[#0077e6]/20 backdrop-blur-sm border border-white/20 rounded-full shadow-lg mb-8">
              <Sparkles className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-blue-200 font-medium">{t('author.badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-wide">
              <span className="bg-gradient-to-r from-blue-400 via-[#0077e6] to-[#0091ff] bg-clip-text text-transparent animate-pulse">
                {t('author.name')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t('author.subtitle')}
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Image Section */}
                <div className="flex items-center justify-center">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#005eb8] via-[#0077e6] to-[#0091ff] rounded-3xl opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-500"></div>
                    
                    {/* Image container */}
                    <div className="relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                      <Image 
                        src="/patriciabelestaphoto.jpg" 
                        alt="Patricia Belestá" 
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover"
                        priority
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#005eb8]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#0077e6] to-[#0091ff] rounded-full opacity-50 blur-2xl animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-[#005eb8] rounded-full opacity-50 blur-2xl animate-pulse delay-1000"></div>
                  </div>
                </div>

                {/* Text Section */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-white/90 leading-relaxed italic">
                      {t('author.intro')}
                    </p>
                    
                    <p className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('author.paragraph1') }} />

                    <p className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('author.paragraph2') }} />

                    <p className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('author.paragraph3') }} />

                    <p className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('author.paragraph4') }} />

                    <div className="pt-4 border-t border-white/20 mt-6">
                      <p className="text-[#0091ff] font-semibold leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" />
                        <span>{t('author.closing')}</span>
                      </p>
                      <p className="text-white/70 mt-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 fill-current text-blue-300" />
                        <span>— {t('author.name')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Button Section */}
              <div className="border-t border-white/20 bg-gradient-to-r from-[#005eb8]/10 to-[#0077e6]/10 p-8">
                <div className="text-center">
                  <p className="text-white/80 mb-4">{t('author.linkedInText')}</p>
                  <a 
                    href="https://www.linkedin.com/in/patriciabeles/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-gradient-to-r from-[#0077e6] to-[#0091ff] hover:from-[#0091ff] hover:to-[#00a8ff] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg">
                      <Linkedin className="w-6 h-6 mr-3" />
                      {t('author.linkedInButton')}
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-[#005eb8] to-[#0077e6] hover:from-[#0077e6] hover:to-[#0091ff] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-6 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('author.ctaButton')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

