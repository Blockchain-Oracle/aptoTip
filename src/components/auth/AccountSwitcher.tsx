'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, LogIn, User, AlertCircle, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'

interface AccountSwitcherProps {
  currentWalletAddress?: string
  requiredWalletAddress?: string
  onSignIn?: () => void
  onCancel?: () => void
}

export function AccountSwitcher({ 
  currentWalletAddress, 
  requiredWalletAddress, 
  onSignIn, 
  onCancel 
}: AccountSwitcherProps) {
  const { account, isAuthenticated, signOut, createAuthSession, getAuthUrl } = useKeylessAccount()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      signOut()
      // Small delay to show the sign out state
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const ephemeralKeyPair = await createAuthSession()
      const authUrl = getAuthUrl(ephemeralKeyPair)
      window.location.href = authUrl
    } catch (error) {
      console.error('Error starting sign in:', error)
      setIsSigningIn(false)
    }
  }

  const isWrongAccount = currentWalletAddress && requiredWalletAddress && 
    currentWalletAddress !== requiredWalletAddress

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <User className="w-5 h-5" />
          <span>Account Management</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Account Status */}
        {isAuthenticated && account && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Current Account:</span>
              {isWrongAccount ? (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Wrong Account
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Correct Account
                </Badge>
              )}
            </div>
            <div className="font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded">
              {account.accountAddress.toString().slice(0, 8)}...{account.accountAddress.toString().slice(-6)}
            </div>
          </div>
        )}

        {/* Required Account */}
        {requiredWalletAddress && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-700 mb-2">Required Account:</div>
            <div className="font-mono text-xs text-blue-600 bg-white px-2 py-1 rounded">
              {requiredWalletAddress.slice(0, 8)}...{requiredWalletAddress.slice(-6)}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isAuthenticated ? (
            <>
              <Button
                onClick={handleSignOut}
                disabled={isSigningOut}
                variant="outline"
                className="w-full"
              >
                {isSigningOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
              
              {isWrongAccount && (
                <Button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full"
                >
                  {isSigningIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In with Different Account
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full"
            >
              {isSigningIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Redirecting...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In with Google
                </>
              )}
            </Button>
          )}

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 text-center">
          {isWrongAccount 
            ? "You need to sign in with the account that owns this profile to edit it."
            : "Sign in with your Google account to access your profile."
          }
        </div>
      </CardContent>
    </Card>
  )
} 