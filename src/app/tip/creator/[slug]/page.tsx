'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { 
  Users, 
  Heart, 
  CreditCard,
  CheckCircle,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Shield,
  Play,
  MessageCircle,
  Loader2,
  LogIn,
  AlertCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useProfile, isCreator } from '@/hooks/useProfiles'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { tippingService } from '@/lib/contracts/tipping-service'
import { formatCurrency, formatCompactNumber } from '@/lib/format'
import { ROUTES } from '@/lib/constants'

interface CreatorTipPageProps {
  params: Promise<{
    slug: string
  }>
}

// Default tip amounts in cents (for USD display)
const defaultTipAmounts = [500, 1000, 2000, 5000] // $5, $10, $20, $50

export default function CreatorTipPage({ params }: CreatorTipPageProps) {
  const router = useRouter()
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

  // State management
  const [selectedAmount, setSelectedAmount] = useState<number>(1000) // Default $10
  const [customAmount, setCustomAmount] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [tipError, setTipError] = useState<string>('')

  // Loading state for params or profile
  if (isLoadingParams || isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Loading creator...</h3>
            <p className="text-gray-600">Getting ready for your tip</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold mb-2">Failed to load creator</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Not found or not a creator
  if (!profile || !isCreator(profile)) {
    notFound()
  }

  const creator = profile

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
        message || 'Thank you for your amazing content!'
      )
      
      console.log('Tip sent successfully:', txHash)
      
      // Redirect to success page
      router.push(`${ROUTES.TIP.CREATOR(slug)}/success?amount=${selectedAmount}&message=${encodeURIComponent(message)}&txHash=${txHash}`)
    } catch (error) {
      console.error('Tip processing failed:', error)
      setTipError('Failed to send tip. Please try again.')
      setIsProcessing(false)
    }
  }

  const formatAmountDisplay = (cents: number) => {
    return formatCurrency(cents)
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram
      case 'youtube': return Youtube
      case 'twitter': return Twitter
      case 'website': return Globe
      default: return Globe
    }
  }

  const getSocialUrl = (platform: string, username: string) => {
    switch (platform) {
      case 'instagram': return `https://instagram.com/${username.replace('@', '')}`
      case 'youtube': return `https://youtube.com/${username.replace('@', '')}`
      case 'twitter': return `https://twitter.com/${username.replace('@', '')}`
      case 'website': return username
      default: return username
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={creator.imageUrl || undefined} alt={creator.name} />
                <AvatarFallback className="text-lg">
                  {creator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{creator.name}</h1>
                  {creator.verified && (
                    <Badge className="bg-purple-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formatCompactNumber(creator.followers)} followers</span>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {creator.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Creator Info & Portfolio */}
          <div className="space-y-6">
            {/* Creator Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">About</h3>
                      <p className="text-gray-700 leading-relaxed">{creator.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(creator.tags || []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCompactNumber(creator.followers || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(creator.totalTips || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Tips</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{creator.tipCount || 0}</div>
                        <div className="text-sm text-gray-600">Supporters</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Follow {creator.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(creator.socialLinks || {}).map(([platform, username]) => {
                      if (!username) return null
                      const Icon = getSocialIcon(platform)
                      return (
                        <a
                          key={platform}
                          href={getSocialUrl(platform, username)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-sm">{username}</span>
                        </a>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Portfolio Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {(creator.portfolioImages || []).slice(0, 4).map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                          src={image}
                          alt={`${creator.name} portfolio ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Tips - Removed as it's not in the database schema */}
          </div>

          {/* Right Column - Tip Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 sticky top-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-purple-900">
                    <Heart className="w-6 h-6 inline mr-2" />
                    Support {creator.name}
                  </CardTitle>
                  <p className="text-purple-700">
                    Show your appreciation for their content
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
                              ? "bg-purple-600 hover:bg-purple-700" 
                              : "border-purple-200 hover:border-purple-300"
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
                      Message for {creator.name} (Optional)
                    </label>
                    <Textarea
                      placeholder="Keep up the amazing work! Love your content 💜"
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

                  {/* Creator Impact */}
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="text-sm text-gray-600 mb-2">💡 Your support helps {creator.name}:</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Create better content</li>
                      <li>• Invest in new equipment</li>
                      <li>• Dedicate more time to their craft</li>
                    </ul>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
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
                      className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700"
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

                  {/* Tip Error */}
                  {tipError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{tipError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Processing */}
                  {isProcessing && (
                    <div className="text-center p-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
