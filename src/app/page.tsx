import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Shield, Video, Award, Users, Clock, CheckCircle, Star, Play, ArrowRight, Sparkles, Zap, Target, Globe, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%229C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Glowing Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-300 text-sm font-medium">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Data Protection
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Training
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
              Master the GDPR in under 1 hour
            </span>
            <br />
            <span className="text-gray-400">
              Modern, practical, AI-aware training that transforms boring compliance into engaging learning
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/courses">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Start Course
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="group text-lg px-8 py-6 rounded-2xl border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm">
                <Zap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Sign Up Free
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">30-40 min</div>
              <div className="text-gray-400">Total Duration</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">GDPR Compliant</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-pink-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">AI-Ready</div>
              <div className="text-gray-400">Future-Proof</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Main Message Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full backdrop-blur-sm mb-8">
              <Lock className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-300 font-medium">Legal Requirement</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                Protecting personal data
              </span>
              <br />
              <span className="text-white">is not optional — it's the law</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
              Under the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">General Data Protection Regulation (GDPR)</span>, 
              every company is legally required to process personal data safely and lawfully. 
              This course transforms complex legal requirements into practical, actionable knowledge.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <CardTitle className="text-xl text-white">Mandatory</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-300">EU data protection law</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white">Practical</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-300">Real-life cases & examples</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-xl text-white">Duration</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-300">30–40 minutes total</CardDescription>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">AI-aware</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center">
                <CardDescription className="text-gray-300">AI tools best practices</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Modules Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm mb-8">
              <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 font-medium">Comprehensive Training</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Practical skills
              </span>
              <br />
              <span className="text-white">you can apply immediately</span>
            </h2>
            <h3 className="text-2xl text-gray-400 font-medium">Course modules</h3>
          </div>

                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center">
                 <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <BookOpen className="w-8 h-8 text-blue-400" />
                 </div>
                 <CardTitle className="text-xl text-white">Introduction to GDPR</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Personal data, responsibility, and why it matters</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center">
                 <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <Shield className="w-8 h-8 text-green-400" />
                 </div>
                 <CardTitle className="text-xl text-white">Data Protection Principles</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Core GDPR principles for daily work</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center">
                 <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <Users className="w-8 h-8 text-purple-400" />
                 </div>
                 <CardTitle className="text-xl text-white">Individual Rights</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Understanding and respecting data subject rights</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center">
                 <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <Video className="w-8 h-8 text-orange-400" />
                 </div>
                 <CardTitle className="text-xl text-white">AI and Data Protection</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">AI tools while maintaining compliance</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center">
                 <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <Award className="w-8 h-8 text-red-400" />
                 </div>
                 <CardTitle className="text-xl text-white">Incident Response</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Handling data protection incidents</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center">
                 <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <CheckCircle className="w-8 h-8 text-emerald-400" />
                 </div>
                 <CardTitle className="text-xl text-white">Practical Implementation</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Real-world scenarios and compliance steps</CardDescription>
               </CardContent>
             </Card>
           </div>

          <div className="text-center">
            <Link href="/signup">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg px-10 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                Subscribe Now
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
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full backdrop-blur-sm mb-8">
              <Zap className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-300 font-medium">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Learn at your own pace
              </span>
              <br />
              <span className="text-white">— anytime, anywhere</span>
            </h2>
          </div>

                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center pb-4">
                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <span className="text-3xl font-black text-blue-400">1</span>
                 </div>
                 <CardTitle className="text-xl text-white">Sign up</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Corporate email registration</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center pb-4">
                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <span className="text-3xl font-black text-green-400">2</span>
                 </div>
                 <CardTitle className="text-xl text-white">Subscribe</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Data Privacy Training course</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center pb-4">
                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <span className="text-3xl font-black text-purple-400">3</span>
                 </div>
                 <CardTitle className="text-xl text-white">Lessons</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Video-based learning modules</CardDescription>
               </CardContent>
             </Card>

             <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <CardHeader className="relative z-10 text-center pb-4">
                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                   <span className="text-3xl font-black text-orange-400">4</span>
                 </div>
                 <CardTitle className="text-xl text-white">Quizzes</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 text-center">
                 <CardDescription className="text-gray-300">Assessment after each section</CardDescription>
               </CardContent>
             </Card>
           </div>

          <div className="text-center">
            <Link href="/signup">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg px-10 py-6 rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                <Target className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Sign Up Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-8">
              <Globe className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-purple-300 font-medium">Global Standard</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Ready to master
              </span>
              <br />
              <span className="text-white">GDPR compliance?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who have already transformed their data protection 
              practices with our comprehensive GDPR training course.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg px-10 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="group text-lg px-10 py-6 rounded-2xl border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm">
                  <BookOpen className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  View Course Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
