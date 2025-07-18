'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { AccountSwitcher } from '@/components/auth/AccountSwitcher'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'

export default function AccountSwitchPage() {
  const { account } = useKeylessAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Account Switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <AccountSwitcher
            currentWalletAddress={account?.accountAddress.toString()}
          />
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Need to switch accounts? Sign out and sign in with a different Google account.
            </p>
            <p>
              Each Google account creates a unique Aptos keyless account for you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 