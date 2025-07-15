'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { QrCode, Heart, ArrowRight, Users, Zap, DollarSign, Sparkles, Award } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SignupPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Award className="w-6 h-6 text-yellow-600" />
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Aptos Hackathon Project
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Join TipLink
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Revolutionary tipping powered by Aptos blockchain. 
            Choose how you'd like to get started.
          </p>
        </motion.div>
      </div>

      {/* Aptos Info Banner */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Built on Aptos Blockchain</h3>
            <p className="text-sm text-gray-600">
              Featuring keyless accounts, sponsored transactions, and sub-second finality
            </p>
          </div>
        </div>
      </motion.div>

      {/* Signup Options */}
      <div className="grid gap-6">
        {/* Restaurant Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="group cursor-pointer border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Restaurant</h3>
                    <p className="text-gray-600">QR code tipping for tables</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Popular
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">0%</div>
                    <div className="text-xs text-gray-600">Setup Fee</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">2%</div>
                    <div className="text-xs text-gray-600">Per Tip</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">∞</div>
                    <div className="text-xs text-gray-600">QR Codes</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Zap className="w-4 h-4 mr-2 text-blue-600" />
                    Instant QR code generation
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Table-specific tipping
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Real-time analytics
                  </div>
                </div>

                <Button asChild className="w-full h-12 bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-all duration-200">
                  <Link href="/signup/restaurant" className="flex items-center justify-center">
                    Start as Restaurant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Creator Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="group cursor-pointer border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Creator</h3>
                    <p className="text-gray-600">Direct fan support platform</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Growing
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">0%</div>
                    <div className="text-xs text-gray-600">Setup Fee</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">2%</div>
                    <div className="text-xs text-gray-600">Per Tip</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <div className="text-xs text-gray-600">You Keep</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Heart className="w-4 h-4 mr-2 text-purple-600" />
                    Beautiful profile pages
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    Fan engagement tools
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                    Portfolio showcase
                  </div>
                </div>

                <Button asChild className="w-full h-12 bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-all duration-200">
                  <Link href="/signup/creator" className="flex items-center justify-center">
                    Start as Creator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Already have account */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/signin" 
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>

      {/* Why TipLink - Aptos Features */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="text-center font-semibold text-gray-900 mb-4">Powered by Aptos Blockchain</h4>
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div>
            <div className="text-green-600 font-bold">Keyless Accounts</div>
            <div className="text-gray-600">Google OAuth only</div>
          </div>
          <div>
            <div className="text-blue-600 font-bold">Zero Gas Fees</div>
            <div className="text-gray-600">Sponsored transactions</div>
          </div>
          <div>
            <div className="text-purple-600 font-bold">Sub-second Finality</div>
            <div className="text-gray-600">Instant confirmations</div>
          </div>
          <div>
            <div className="text-orange-600 font-bold">Move Smart Contracts</div>
            <div className="text-gray-600">Secure & efficient</div>
          </div>
        </div>
      </motion.div>

      {/* Hackathon Badge */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full">
          <Award className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
            Built for Aptos Hackathon 2024
          </span>
        </div>
      </motion.div>
    </div>
  )
}
