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
import { useProfile, isRestaurant } from '@/hooks/useProfiles'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { tippingService } from '@/lib/contracts/tipping-service'
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
  const [slug, setSlug] = useState<string>('')
  const [isLoadingParams, setIsLoadingParams] = useState(true)
  
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
  const { account, isAuthenticated, isLoading: authLoading, createAuthSession, getAuthUrl } = useKeylessAccount()

  // Google Maps setup
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })

  // State management
  const [selectedAmount, setSelectedAmount] = useState<number>(1000) // Default $10
  const [customAmount, setCustomAmount] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationVerified, setLocationVerified] = useState<boolean | null>(null)
  const [tipError, setTipError] = useState<string>('')

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
    const numValue = parseInt(value) * 100 // Convert dollars to cents
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setTipError('')
      const ephemeralKeyPair = await createAuthSession()
      const authUrl = getAuthUrl(ephemeralKeyPair)
      window.location.href = authUrl
    } catch (error) {
      console.error('Login error:', error)
      setTipError('Failed to start authentication. Please try again.')
    }
  }

  const processTip = async () => {
    if (!account || !profile) return
    
    setIsProcessing(true)
    setTipError('')
    
    try {
      // Convert amount from cents to APT (assuming 1 APT = $10 for demo)
      const amountInAPT = selectedAmount / 1000 // $10 = 1 APT
      
      // Send tip using our TippingService
      const txHash = await tippingService.sendTip(
        account,
        profile.walletAddress,
        amountInAPT,
        message || 'Thank you for the great service!'
      )
      
      console.log('Tip sent successfully:', txHash)
      
      // Redirect to success page
      router.push(`${ROUTES.TIP.SUCCESS(slug)}?amount=${selectedAmount}&message=${encodeURIComponent(message)}&txHash=${txHash}`)
    } catch (error) {
      console.error('Tip processing failed:', error)
      setTipError('Failed to send tip. Please try again.')
      setIsProcessing(false)
    }
  }

  const formatAmountDisplay = (cents: number) => {
    return formatCurrency(cents)
  }

  // Loading state for params or profile
  if (isLoadingParams || isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Loading restaurant...</h3>
            <p className="text-gray-600">Getting ready for your tip</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold mb-2">Failed to load restaurant</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                  {restaurant.verified && (
                    <Badge className="bg-blue-600 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Location Verification */}
            {locationVerified !== null && (
              <div className="flex items-center space-x-2">
                {locationVerified ? (
                  <Badge className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Location Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Location Mismatch
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Restaurant Info & Map */}
          <div className="space-y-6">
            {/* Restaurant Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-semibold">{((restaurant.averageTip || 0) / 100).toFixed(1)}</span>
                        <span className="text-gray-600">({restaurant.tipCount || 0} tips)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {restaurant.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700">{restaurant.bio}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {restaurant.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      
                      {restaurant.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <a 
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Website
                          </a>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Open today</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{restaurant.tipCount || 0} supporters</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Navigation className="w-5 h-5 mr-2" />
                    Restaurant Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden">
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter}
                        zoom={16}
                        options={{
                          disableDefaultUI: true,
                          zoomControl: true,
                          styles: [
                            {
                              featureType: 'poi',
                              elementType: 'labels',
                              stylers: [{ visibility: 'off' }]
                            }
                          ]
                        }}
                      >
                        {/* Restaurant Marker */}
                        <Marker
                          position={restaurantLocation}
                          title={restaurant.name}
                        />
                        
                        {/* User Location Marker */}
                        {userLocation && (
                          <Marker
                            position={userLocation}
                            title="Your Location"
                            icon={{
                              url: '/api/placeholder/20/20', // User location icon
                              scaledSize: new window.google.maps.Size(20, 20)
                            }}
                          />
                        )}
                      </GoogleMap>
                    ) : (
                      <Skeleton className="w-full h-[200px]" />
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700 font-medium">{restaurant.address}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const url = `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.address)}`
                          window.open(url, '_blank')
                        }}
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Tip Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-900">
                    <Heart className="w-6 h-6 inline mr-2" />
                    Support {restaurant.name}
                  </CardTitle>
                  <p className="text-blue-700">
                    Show your appreciation with a tip
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Quick Tip Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Choose Amount
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {defaultTipAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className={`h-12 text-lg ${
                            selectedAmount === amount 
                              ? "bg-blue-600 hover:bg-blue-700" 
                              : "border-blue-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          {formatAmountDisplay(amount)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="pl-8 h-12 text-lg"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Tip Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Say something nice to the restaurant..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                      rows={3}
                      maxLength={280}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {message.length}/280 characters
                    </div>
                  </div>

                  {/* Location Warning */}
                  {locationVerified === false && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-700">
                        We couldn't verify you're at {restaurant.name}. Tips are still welcome from anywhere!
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Error Display */}
                  {tipError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {tipError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Summary */}
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Tip:</span>
                      <span className="text-green-600">{formatAmountDisplay(selectedAmount)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Platform fee: FREE (sponsored by Aptos)
                    </div>
                  </div>

                  {/* Sign In & Pay Button */}
                  {!isAuthenticated && !isProcessing && (
                    <Button
                      onClick={handleGoogleSignIn}
                      className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
                      size="lg"
                      disabled={selectedAmount < 100} // Minimum $1
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign in with Google & Send Tip
                    </Button>
                  )}

                  {/* Send Tip Button (when authenticated) */}
                  {isAuthenticated && !isProcessing && (
                    <Button
                      onClick={processTip}
                      className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={selectedAmount < 100} // Minimum $1
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Send Tip ({formatAmountDisplay(selectedAmount)})
                    </Button>
                  )}

                  {/* Processing */}
                  {isProcessing && (
                    <div className="text-center p-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="font-medium">Processing your tip...</div>
                      <div className="text-sm text-gray-600">This may take a few seconds</div>
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="text-xs text-gray-600 text-center">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Secured by Aptos blockchain • No fees • Instant delivery
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
