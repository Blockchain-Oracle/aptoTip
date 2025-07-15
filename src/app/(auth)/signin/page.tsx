'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Chrome, Mail, ArrowRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignInPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    // TODO: Implement Google OAuth with keyless accounts
    console.log('Google sign-in clicked')
    setTimeout(() => setIsGoogleLoading(false), 2000) // Mock loading
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    // TODO: Implement email sign-in
    console.log('Email sign-in submitted')
    setTimeout(() => setIsEmailLoading(false), 2000) // Mock loading
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Sign in to your TipLink account
        </p>
      </div>

      {/* Google Sign-in */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          variant="outline"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-3" />
          ) : (
            <Chrome className="w-5 h-5 mr-3 text-blue-600" />
          )}
          <span className="font-medium">
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">or continue with email</span>
        </div>
      </motion.div>

      {/* Email Sign-in Form */}
      <motion.form
        onSubmit={handleEmailSignIn}
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          disabled={isEmailLoading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          {isEmailLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Mail className="w-5 h-5 mr-2" />
          )}
          {isEmailLoading ? 'Signing in...' : 'Sign in with Email'}
          {!isEmailLoading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </motion.form>

      {/* Sign-up Link */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/signup" 
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </motion.div>

      {/* Features Preview */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">0%</div>
            <div className="text-xs text-gray-600">Gas Fees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">2%</div>
            <div className="text-xs text-gray-600">Platform Fee</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
