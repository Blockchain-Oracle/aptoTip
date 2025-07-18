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
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Hero Section */}
      <motion.div
        className="relative h-96 rounded-2xl overflow-hidden mb-8"
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
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold">{restaurant.name}</h1>
                {restaurant.verified && (
                  <Badge className="bg-blue-600">Verified</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{((restaurant.averageTip || 0) / 100).toFixed(1)}</span>
                  <span className="text-white/80">({restaurant.tipCount || 0} tips)</span>
                </div>
                
                <div className="flex items-center space-x-1 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.city}, {restaurant.state}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {restaurant.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              {isOwner ? (
                <Button 
                  asChild
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Link href={`/edit/restaurant/${restaurant.slug}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              ) : isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-white/80 text-center px-2">
                    <div>Not your profile</div>
                    <div className="font-mono text-[10px] mt-1 opacity-60">
                      {account?.accountAddress.toString().slice(0, 8)}...{account?.accountAddress.toString().slice(-6)}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/10 hover:bg-white/20 text-white/60 border-white/20 cursor-not-allowed"
                    disabled
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => setShowAccountSwitcher(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Sign In to Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>About {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{restaurant.bio}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hours Section */}
          {restaurant.hours && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(restaurant.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tip Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center">
                <CardTitle className="text-blue-900">Support {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatCurrency(restaurant.totalTips || 0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total tips received from {restaurant.tipCount || 0} supporters
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button asChild className="w-full h-12" size="lg">
                    <Link href={ROUTES.TIP.RESTAURANT(restaurant.slug)}>
                      <Heart className="w-5 h-5 mr-2" />
                      Send a Tip
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
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{restaurant.address}</div>
                    <div className="text-sm text-gray-600">{restaurant.city}, {restaurant.state}</div>
                  </div>
                </div>
                
                {restaurant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`tel:${restaurant.phone}`}
                      className="font-medium hover:text-blue-600 transition-colors"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                )}
                
                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-600 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        open={showAccountSwitcher}
        onOpenChange={setShowAccountSwitcher}
        currentWalletAddress={account?.accountAddress.toString()}
        requiredWalletAddress={restaurant?.walletAddress}
      />
    </div>
  )
}
