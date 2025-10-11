'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookOpen, User, LogOut, Menu, X, ChevronDown, Lock } from 'lucide-react'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { useLanguage } from '@/contexts/LanguageContext'

export function Navbar() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-6 h-6 bg-gradient-to-br from-[#005eb8] to-[#0077e6] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-xl bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
              <span className="font-bold">ID</span><span className="font-normal">Finance</span>
            </span>
          </Link>



          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 mr-8">
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
              >
                {t('navigation.courses')}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#005eb8] to-[#0077e6] group-hover:w-full transition-all duration-300"></div>
              </Link>
              {user && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium relative group"
                >
                  {t('navigation.dashboard')}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#005eb8] to-[#0077e6] group-hover:w-full transition-all duration-300"></div>
                </Link>
              )}
            </div>
            {/* Language Selector */}
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Avatar className="h-8 w-8 ring-2 ring-gray-200/50">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-[#005eb8] font-medium">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none text-gray-900">
                        {user.user_metadata?.full_name || 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-gray-500">{user.email}</p>
                      <div className="pt-2">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-[#005eb8] to-[#0077e6] h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">65% completado</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      {t('navigation.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {t('navigation.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('navigation.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200">
                    {t('navigation.signIn')}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-[#005eb8] to-[#0077e6] hover:from-[#0077e6] hover:to-[#0091ff] text-white shadow-md hover:shadow-lg transition-all duration-200">
                    {t('navigation.signUp')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cursos
              </Link>
              {user && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Dashboard
                </Link>
              )}
              {!user && (
                <div className="pt-2 border-t border-gray-200/50">
                  <Link 
                    href="/login" 
                    className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/signup" 
                    className="block bg-gradient-to-r from-[#005eb8] to-[#0077e6] hover:from-[#0077e6] hover:to-[#0091ff] text-white transition-all duration-200 font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg mx-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
