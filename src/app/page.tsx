'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Shield, Video, Award, Users, Clock, CheckCircle, Star, Play, ArrowRight, Sparkles, Zap, Target, Globe, Lock, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import SplashCursor from '@/components/ui/SplashCursor'

export default function HomePage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 overflow-hidden">
      <SplashCursor />
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E2E8F0%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 pt-20">
        {/* Subtle Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 text-center max-w-7xl mx-auto">
          {/* Elegant Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-gray-700 text-sm font-medium">{t('homepage.hero.badge')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight tracking-wide relative">
            <span className="animated-gradient-primary relative">
              {t('homepage.hero.title').split(' ').slice(0, 3).join(' ')}
            </span>
            <br />
            <span className="animated-gradient-secondary relative">
              {t('homepage.hero.title').split(' ').slice(3).join(' ')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold">
              {t('homepage.hero.subtitle')}
            </span>
            <br />
            <span className="text-gray-500">
              {t('homepage.hero.description')}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/courses">
              <Button size="lg" className="group relative overflow-hidden animated-button-gradient text-white text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                {t('homepage.hero.startLearning')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </div>


      </section>

      {/* Main Message Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-100 to-orange-100 border border-red-200/50 rounded-full backdrop-blur-sm mb-8">
              <Lock className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">{t('homepage.legal.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {t('homepage.legal.title').split(' — ')[0]}
              </span>
              <br />
              <span className="text-gray-900 font-normal">— {t('homepage.legal.title').split(' — ')[1]}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
              {t('homepage.legal.description')}
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 border border-red-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.legal.mandatory.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.legal.mandatory.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.legal.practical.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.legal.practical.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.legal.duration.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.legal.duration.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-violet-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 border border-purple-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.legal.aiAware.title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">{t('homepage.legal.aiAware.description')}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Modules Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full backdrop-blur-sm mb-8">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">{t('homepage.courseModules.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {t('homepage.courseModules.title').split(' ')[0]} {t('homepage.courseModules.title').split(' ')[1]}
              </span>
              <br />
              <span className="text-gray-900 font-normal">{t('homepage.courseModules.title').split(' ').slice(2).join(' ')}</span>
            </h2>
            <h3 className="text-xl text-gray-600 font-light tracking-wide">{t('homepage.courseModules.subtitle')}</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16 justify-items-center">
            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                                  <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.courseModules.introduction.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.courseModules.introduction.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 border border-green-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                                  <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.courseModules.principles.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.courseModules.principles.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                                  <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.courseModules.rights.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.courseModules.rights.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-8 h-8 text-orange-600" />
                </div>
                                  <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.courseModules.ai.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.courseModules.ai.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 border border-red-200/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                                  <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.courseModules.incidents.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.courseModules.incidents.description')}</CardDescription>
              </CardContent>
            </Card>

          </div>

          <div className="text-center">
            <Link href="/signup">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                {t('homepage.courseModules.subscribeNow')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 rounded-full backdrop-blur-sm mb-8">
              <Zap className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">{t('homepage.process.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {t('homepage.process.title').split(' — ')[0]}
              </span>
              <br />
              <span className="text-gray-900 font-normal">— {t('homepage.process.title').split(' — ')[1]}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-blue-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-light text-blue-600 tracking-wider">1</span>
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.process.step1.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.process.step1.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-green-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 border border-green-200/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-light text-green-600 tracking-wider">2</span>
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.process.step2.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.process.step2.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-light text-purple-600 tracking-wider">3</span>
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.process.step3.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.process.step3.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-orange-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-light text-orange-600 tracking-wider">4</span>
                </div>
                <CardTitle className="text-xl text-gray-900 font-light tracking-wide">{t('homepage.process.step4.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-600">{t('homepage.process.step4.description')}</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/signup">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Target className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                {t('homepage.process.signUpNow')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto text-center">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full backdrop-blur-sm mb-8">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">{t('homepage.cta.badge')}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {t('homepage.cta.title').split(' ')[0]} {t('homepage.cta.title').split(' ')[1]}
              </span>
              <br />
              <span className="text-gray-900 font-normal">{t('homepage.cta.title').split(' ').slice(2).join(' ')}</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('homepage.cta.description')}
            </p>

            <div className="flex justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="group relative overflow-hidden animated-button-gradient text-white text-lg px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                  {t('homepage.cta.startLearning')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-sm mb-6">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">{t('privacySection.badge')}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
            {t('privacySection.title')}
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('privacySection.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/privacy">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-3">
                <Shield className="w-5 h-5 mr-2" />
                {t('privacySection.button')}
              </Button>
            </Link>
            
            <Link href="/legal">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md hover:shadow-lg transition-all duration-200 px-8 py-3">
                <FileText className="w-5 h-5 mr-2" />
                {t('legalSection.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
