'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Back</span>
          </Link>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TipLink
            </span>
          </Link>
          
          <div className="w-16" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-2xl rounded-2xl p-8">
            {children}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-sm text-gray-500">
        <p>
          By continuing, you agree to TipLink's{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  )
}
