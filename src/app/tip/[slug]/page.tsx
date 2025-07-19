'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { notFound } from 'next/navigation'
import { 
  MapPin, 
  Star, 
  Shield, 
  Phone, 
  Globe, 
  Heart, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Navigation,
  Clock,
  Users,
  Loader2,
  LogIn
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TransactionModal } from '@/components/blockchain/TransactionModal'
import { TransactionOptions } from '@/hooks/useKeylessTransaction'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { useProfile, isRestaurant } from '@/hooks/useProfiles'
import { formatCurrency } from '@/lib/format'
import { ROUTES } from '@/lib/constants'

interface TipPageProps {
  params: Promise<{
    slug: string
  }>
}

const containerStyle = {
  width: '100%',
  height: '200px'
}

// Default tip amounts in cents (for USD display)
const defaultTipAmounts = [500, 1000, 2000, 5000] // $5, $10, $20, $50

export default function TipPage({ params }: TipPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { account, isAuthenticated, isLoading: authLoading, createAuthSession, getAuthUrl } = useKeylessAccount()
  
  const [slug, setSlug] = useState<string>('')
  const [isLoadingParams, setIsLoadingParams] = useState(true)
  const [selectedAmount, setSelectedAmount] = useState(1000) // Default $10
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [tipError, setTipError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationVerified, setLocationVerified] = useState<boolean | null>(null)

  // Load params asynchronously
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params
        setSlug(resolvedParams.slug)
      } catch (error) {
        console.error('Failed to load params:', error)
      } finally {
        setIsLoadingParams(false)
      }
    }
    
    loadParams()
  }, [params])
  
  const { data: profile, isLoading, error } = useProfile(slug)

  // Google Maps setup
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })

  // Mock restaurant coordinates (in real app, these would come from the database)
  const restaurantLocation = {
    lat: 40.7128, // NYC coordinates for Mario's Pizza
    lng: -74.0060
  }

  const mapCenter = restaurantLocation

  useEffect(() => {
    // Get user's current location for verification
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(userPos)
          
          // Calculate distance and verify location (within 1km = verified)
          const distance = calculateDistance(userPos, restaurantLocation)
          setLocationVerified(distance < 1000) // 1km radius
        },
        () => {
          // Location access denied, that's ok
          setLocationVerified(null)
        }
      )
    }
  }, [])

  const calculateDistance = (pos1: {lat: number, lng: number}, pos2: {lat: number, lng: number}) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = pos1.lat * Math.PI/180
    const φ2 = pos2.lat * Math.PI/180
    const Δφ = (pos2.lat-pos1.lat) * Math.PI/180
    const Δλ = (pos2.lng-pos1.lng) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseFloat(value) * 100 // Convert dollars to cents
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const ephemeralKeyPair = await createAuthSession()
      const authUrl = getAuthUrl(ephemeralKeyPair)
      window.location.href = authUrl
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  const handleSendTip = () => {
    if (!account || !profile) return
    
    // Validate amount
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount
    if (finalAmount <= 0) {
      setTipError('Please enter a valid amount')
      return
    }
    
    setTipError('')
    setIsModalOpen(true)
  }

  const handleTipSuccess = async (hash: string, tipperAddress?: string) => {
    console.log('🎯 Tip transaction successful!', { 
      hash, 
      tipperAddress, 
      restaurantId: profile?.id,
      recipientAddress: profile?.walletAddress,
      amount: customAmount ? parseFloat(customAmount) : selectedAmount,
      message 
    })
    
    // Sync blockchain data to database
    if (profile?.id && profile?.walletAddress) {
      try {
        const syncResponse = await fetch('/api/blockchain/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: profile.id,
            walletAddress: profile.walletAddress,
          }),
        })
        
        if (syncResponse.ok) {
          const syncData = await syncResponse.json()
          console.log('✅ Database synced successfully:', syncData)
        } else {
          console.warn('⚠️ Database sync failed:', await syncResponse.text())
        }
      } catch (error) {
        console.error('❌ Error syncing database:', error)
      }
    }
    
    // Convert amount from cents to APT for display
    const amountInAPT = (customAmount ? parseFloat(customAmount) : selectedAmount) / 1000
    
    // Redirect to success page
    router.push(`${ROUTES.TIP.SUCCESS(slug)}?amount=${customAmount ? parseFloat(customAmount) : selectedAmount}&message=${encodeURIComponent(message)}&txHash=${hash}`)
  }

  const formatAmountDisplay = (cents: number) => {
    return formatCurrency(cents)
  }

  // Loading state for params or profile
  if (isLoadingParams || isLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="h-64 sm:h-80 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6 sm:space-y-8">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !profile || !isRestaurant(profile)) {
    notFound()
  }

  const restaurant = profile

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="relative h-64 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8"
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
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{restaurant.name}</h1>
                  {restaurant.verified && (
                    <Badge className="bg-blue-600 text-xs sm:text-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
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
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Directions</span>
                </Button>
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

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm sm:text-base">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm sm:text-base">{restaurant.city}, {restaurant.state}</span>
                    </div>
                    
                    {isLoaded && (
                      <div className="rounded-lg overflow-hidden border">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={mapCenter}
                          zoom={15}
                        >
                          <Marker position={restaurantLocation} />
                        </GoogleMap>
                      </div>
                    )}
                    
                    {locationVerified !== null && (
                      <Alert className={locationVerified ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                        <AlertCircle className={`h-4 w-4 ${locationVerified ? 'text-green-600' : 'text-yellow-600'}`} />
                        <AlertDescription className={`text-sm ${locationVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                          {locationVerified 
                            ? 'Location verified! You\'re near this restaurant.' 
                            : 'You appear to be outside the restaurant area.'
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  {restaurant.hours && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm sm:text-base">Check hours on website</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Tip Form */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-blue-900 text-lg sm:text-xl">Support {restaurant.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {!isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                          {formatCurrency(restaurant.totalTips || 0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total tips received from {restaurant.tipCount || 0} supporters
                        </div>
                      </div>
                      
                      <Alert>
                        <LogIn className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Sign in to send a tip and support this restaurant
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        size="lg"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign in to Tip
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                          {formatCurrency(restaurant.totalTips || 0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total tips received from {restaurant.tipCount || 0} supporters
                        </div>
                      </div>
                      
                      {/* Tip Amount Selection */}
                      <div className="space-y-3">
                        <label className="text-sm sm:text-base font-medium text-gray-700">Select Tip Amount</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                          {defaultTipAmounts.map((amount) => (
                            <button
                              key={amount}
                              onClick={() => handleAmountSelect(amount)}
                              className={`p-3 sm:p-4 text-sm sm:text-base rounded-lg border transition-colors ${
                                selectedAmount === amount
                                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                              }`}
                            >
                              {formatAmountDisplay(amount)}
                            </button>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm sm:text-base font-medium text-gray-700">Custom Amount</label>
                          <Input
                            type="number"
                            placeholder="Enter amount in USD"
                            value={customAmount}
                            onChange={(e) => handleCustomAmountChange(e.target.value)}
                            className="text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      
                      {/* Message */}
                      <div className="space-y-2">
                        <label className="text-sm sm:text-base font-medium text-gray-700">Message (Optional)</label>
                        <Textarea
                          placeholder="Leave a message for the restaurant..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="text-sm sm:text-base"
                        />
                      </div>
                      
                      {/* Error Display */}
                      {tipError && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-sm text-red-700">
                            {tipError}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {/* Send Tip Button */}
                      <Button 
                        onClick={handleSendTip}
                        disabled={!isAuthenticated || !account || (customAmount ? parseFloat(customAmount) <= 0 : selectedAmount <= 0)}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        size="lg"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Send {formatAmountDisplay(customAmount ? parseFloat(customAmount) * 100 : selectedAmount)} Tip
                      </Button>
                      
                      {/* Security Note */}
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                          <Shield className="w-3 h-3" />
                          <span>Secure blockchain transaction</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Info */}
            {isAuthenticated && account && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Your Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {account.accountAddress.toString().slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Keyless Account</p>
                        <p className="text-xs sm:text-sm text-gray-500 font-mono">
                          {account.accountAddress.toString().slice(0, 6)}...{account.accountAddress.toString().slice(-4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {profile && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transactionOptions={{
            function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::${process.env.NEXT_PUBLIC_CONTRACT_MODULE}::send_tip`,
            functionArguments: [
              profile.walletAddress,
              Math.round((customAmount ? parseFloat(customAmount) : selectedAmount) / 1000 * 100000000), // Convert to octas
              message || 'Thank you for the great service!'
            ],
          }}
          title="Send Tip"
          description={`Send a tip to ${profile.name} using your Google account.`}
          successMessage={`Tip sent successfully to ${profile.name}!`}
          onSuccess={handleTipSuccess}
        />
      )}
    </div>
  )
}
