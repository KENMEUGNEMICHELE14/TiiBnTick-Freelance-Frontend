'use client'

import React, { useState } from "react"
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  // const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // TODO: Implémenter l'appel API de connexion ici
    try {
      // const success = await login(email, password)
      // if (success) router.push('/dashboard')
      
      // Simulation d'une requête réseau
      setTimeout(() => {
        setIsLoading(false)
        // Redirection factice après succès (à adapter selon le rôle)
        // router.push('/dashboard')
      }, 1500)
    } catch (err) {
      setError('Email ou mot de passe incorrect')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">
              TiiB<span className="text-orange-600">n</span>Tick
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bienvenue</h1>
            <p className="text-sm text-gray-600">Connectez-vous à votre compte</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 rounded-xl border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all text-base"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 text-sm font-medium">Mot de passe</Label>
                  <Link href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline">
                    Oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-12 rounded-xl border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 rounded-xl text-base font-semibold shadow-md transition-all mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-orange-600 font-bold hover:underline">
            S'inscrire
          </Link>
        </p>

      </div>
    </div>
  )
}
