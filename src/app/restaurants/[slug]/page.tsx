'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import { Star, MapPin, Phone, Globe, Clock, Heart, Share2, QrCode, Camera, Loader2, Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useProfile, isRestaurant } from '@/hooks/useProfiles'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { formatCurrency, formatCompactNumber } from '@/lib/format'
import { ROUTES } from '@/lib/constants'
import { AccountSwitcherModal } from '@/components/auth/AccountSwitcherModal'

interface RestaurantPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = use(params)
  const { data: profile, isLoading, error } = useProfile(slug)
  const { account, isAuthenticated } = useKeylessAccount()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

  // Check if current user owns this profile
  const isOwner = isAuthenticated && account && profile && 
    account.accountAddress.toString() === profile.walletAddress

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Loading restaurant...</h3>
          <p className="text-gray-600">Getting the details ready</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Failed to load restaurant</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Not found or not a restaurant
  if (!profile || !isRestaurant(profile)) {
    notFound()
  }

  const restaurant = profile

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 sm:py-8">
      {/* Hero Section */}
      <motion.div
        className="relative h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={restaurant.bannerUrl || '/placeholder-banner.jpg'}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{restaurant.name}</h1>
                {restaurant.verified && (
                  <Badge className="bg-blue-600 text-xs sm:text-sm">Verified</Badge>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm sm:text-base">{((restaurant.averageTip || 0) / 100).toFixed(1)}</span>
                  <span className="text-white/80 text-sm">({restaurant.tipCount || 0} tips)</span>
                </div>
                
                <div className="flex items-center space-x-1 text-white/80 text-sm">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{restaurant.city}, {restaurant.state}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {restaurant.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {tag}
                  </Badge>
                ))}
                {restaurant.tags && restaurant.tags.length > 3 && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    +{restaurant.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              {isOwner ? (
                <Button 
                  asChild
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm"
                >
                  <Link href={`/edit/restaurant/${restaurant.slug}`}>
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Link>
                </Button>
              ) : isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-white/80 text-center px-2 hidden sm:block">
                    <div>Not your profile</div>
                    <div className="font-mono text-[10px] mt-1 opacity-60">
                      {account?.accountAddress.toString().slice(0, 8)}...{account?.accountAddress.toString().slice(-6)}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/10 hover:bg-white/20 text-white/60 border-white/20 cursor-not-allowed text-xs sm:text-sm"
                    disabled
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm"
                  onClick={() => setShowAccountSwitcher(true)}
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign In to Edit</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">About {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{restaurant.bio}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hours Section */}
          {restaurant.hours && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {Object.entries(restaurant.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-sm sm:text-base capitalize">{day}</span>
                        <span className="text-gray-600 text-sm sm:text-base">{hours || 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recent Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Placeholder tips - replace with real data */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">J</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">John D.</p>
                      <p className="text-gray-600 text-xs sm:text-sm">"Amazing food and service!"</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base text-green-600">{formatCurrency(2500)}</p>
                      <p className="text-gray-500 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">S</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">Sarah M.</p>
                      <p className="text-gray-600 text-xs sm:text-sm">"Best pizza in town!"</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base text-green-600">{formatCurrency(1500)}</p>
                      <p className="text-gray-500 text-xs">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Image
                      src={restaurant.imageUrl || '/placeholder-avatar.jpg'}
                      alt={restaurant.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-lg sm:text-xl mb-2">{restaurant.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Tips</span>
                      <span className="font-semibold text-sm sm:text-base">{formatCurrency(restaurant.totalTips || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Tip Count</span>
                      <span className="font-semibold text-sm sm:text-base">{restaurant.tipCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Average Tip</span>
                      <span className="font-semibold text-sm sm:text-base">{formatCurrency(restaurant.averageTip || 0)}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/tip/${restaurant.slug}`}>
                      Send Tip
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm sm:text-base">{restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm sm:text-base">{restaurant.city}, {restaurant.state}</span>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm sm:text-base">{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick Tip</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <QrCode className="w-24 h-24 mx-auto text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Scan to tip on mobile</p>
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        open={showAccountSwitcher}
        onOpenChange={setShowAccountSwitcher}
        requiredWalletAddress={restaurant.walletAddress}
        onSignIn={() => {
          setShowAccountSwitcher(false)
          // Handle sign in logic
        }}
      />
    </div>
  )
}
