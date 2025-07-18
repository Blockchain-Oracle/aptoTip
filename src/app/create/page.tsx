'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Store, 
  User, 
  Sparkles, 
  Heart, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Star,
  Users,
  Camera,
  Music,
  Palette,
  Gamepad2,
  Coffee,
  Pizza,
  Utensils
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <img 
                  src="/image.png" 
                  alt="AptoTip Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain"
                />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Create Your Tipping Profile
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Set up your profile in seconds and start receiving tips from supporters worldwide. 
                No complex setup, just your wallet address and basic info.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main Options */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Choose Your Profile Type
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Select the type of profile that best represents you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Restaurant Option */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="h-full border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                <Link href={ROUTES.CREATE.RESTAURANT}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl text-blue-900">Restaurant</CardTitle>
                    <p className="text-sm sm:text-base text-blue-700">For restaurants, cafes, and food businesses</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Coffee className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Cafes & Coffee Shops</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Pizza className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Pizza & Italian</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Sushi & Fine Dining</span>
                    </div>
                    
                    <div className="pt-3 sm:pt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors text-sm sm:text-base">
                        Create Restaurant Profile
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            {/* Creator Option */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="h-full border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                <Link href={ROUTES.CREATE.CREATOR}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl text-purple-900">Creator</CardTitle>
                    <p className="text-sm sm:text-base text-purple-700">For artists, musicians, streamers, and content creators</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Musicians & Artists</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Digital Artists & Designers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Streamers & Gamers</span>
                    </div>
                    
                    <div className="pt-3 sm:pt-4">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700 transition-colors text-sm sm:text-base">
                        Create Creator Profile
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12 sm:mb-16"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Why Choose AptoTip?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                The easiest way to receive tips from your supporters
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Lightning Fast</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Set up your profile in under 30 seconds with just your wallet address</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Secure & Reliable</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Built on Aptos blockchain with Google authentication for maximum security</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Global Reach</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Receive tips from anywhere in the world, instantly and fee-free</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Success Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12 sm:mb-16"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Success Stories
              </h2>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                See how others are using AptoTip to grow their business
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Mario's Pizza</h3>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                        <span>4.8 • 892 tips</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3">
                    "AptoTip helped us increase our tips by 300% in just 2 months. 
                    Our customers love the convenience!"
                  </p>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    $45,280 total tips
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Alice Sterling</h3>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>12.5K followers</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3">
                    "As a musician, AptoTip made it so easy for my fans to support me. 
                    The Google sign-in is genius!"
                  </p>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    $23,450 total tips
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  Ready to Start Receiving Tips?
                </h2>
                <p className="text-base sm:text-xl mb-4 sm:mb-6 opacity-90 px-4">
                  Join thousands of restaurants and creators already using AptoTip
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base">
                    <Link href={ROUTES.CREATE.RESTAURANT}>
                      <Store className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Create Restaurant Profile
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-sm sm:text-base">
                    <Link href={ROUTES.CREATE.CREATOR}>
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Create Creator Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 