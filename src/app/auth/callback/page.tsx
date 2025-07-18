'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleAuthCallback, error, clearError } = useKeylessAccount()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const completeAuth = async () => {
      try {
        setStatus('loading')
        
        // Get the current URL with all parameters
        const currentUrl = window.location.href
        
        // Handle the auth callback
        await handleAuthCallback(currentUrl)
        
        setStatus('success')
        
        // Redirect to create creator page after a short delay
        setTimeout(() => {
          router.push('/create/creator')
        }, 2000)
        
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setErrorMessage(error.message || 'Authentication failed')
      }
    };

    completeAuth()
  }, [handleAuthCallback, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
          <h2 className="text-2xl font-semibold mb-2">Completing Authentication...</h2>
          <p className="text-gray-600">Setting up your keyless account</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-semibold mb-2">Authentication Successful!</h2>
          <p className="text-gray-600">Redirecting you to create your creator profile...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-semibold mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/create/creator')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return null
} 