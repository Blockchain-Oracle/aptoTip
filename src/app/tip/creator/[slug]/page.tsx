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
import { TransactionModal } from '@/components/blockchain/TransactionModal'
import { TransactionOptions } from '@/hooks/useKeylessTransaction'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { useProfile, isCreator } from '@/hooks/useProfiles'
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
  const { user, signIn } = useGoogleAuth()
  const { account } = useKeylessAccount()
  
  const [slug, setSlug] = useState<string>('')
  const [isLoadingParams, setIsLoadingParams] = useState(true)
  const [selectedAmount, setSelectedAmount] = useState(500) // $5.00 default
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [tipError, setTipError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  const { isAuthenticated, isLoading: authLoading } = useKeylessAccount()

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
  if (error || !profile || !isCreator(profile)) {
    notFound()
  }

  const creator = profile

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
      await signIn()
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  const handleSendTip = () => {
    if (!account || !creator) return
    
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
      creatorId: creator?.id,
      recipientAddress: creator?.walletAddress,
      amount: customAmount ? parseFloat(customAmount) : selectedAmount,
      message 
    })
    
    // Sync blockchain data to database
    if (creator?.id && creator?.walletAddress) {
      try {
        const syncResponse = await fetch('/api/blockchain/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: creator.id,
            walletAddress: creator.walletAddress,
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
    router.push(`${ROUTES.TIP.CREATOR(creator.slug)}/success?amount=${customAmount ? parseFloat(customAmount) : selectedAmount}&message=${encodeURIComponent(message)}&txHash=${hash}`)
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
            src={creator.bannerUrl || '/images/default-banner.jpg'}
            alt={creator.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Creator Avatar and Info */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white self-center sm:self-end">
                  <AvatarImage src={creator.imageUrl || undefined} alt={creator.name} />
                  <AvatarFallback className="text-lg sm:text-xl lg:text-2xl">
                    {creator.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{creator.name}</h1>
                    {creator.verified && (
                      <Badge className="bg-purple-600 text-xs sm:text-sm self-center sm:self-start">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="flex items-center justify-center sm:justify-start space-x-1">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-sm sm:text-base">{formatCompactNumber(creator.followers || 0)}</span>
                      <span className="text-white/80 text-sm">followers</span>
                    </div>
                    
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize text-xs sm:text-sm self-center sm:self-start">
                      {creator.category}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2">
                    {(creator.tags || []).slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(creator.tags || []).length > 3 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                        +{(creator.tags || []).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Follow</span>
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Message</span>
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
                  <CardTitle className="text-lg sm:text-xl">About {creator.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{creator.bio || 'No bio available.'}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Portfolio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  {creator.portfolioImages && creator.portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {creator.portfolioImages.map((image: string, index: number) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Play className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm sm:text-base">No portfolio images yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            {(creator.socialLinks?.twitter || creator.socialLinks?.instagram || creator.socialLinks?.youtube || creator.socialLinks?.website) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Follow {creator.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {creator.socialLinks?.twitter && (
                        <a 
                          href={`https://twitter.com/${creator.socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Twitter className="w-6 h-6 text-blue-400" />
                          <span className="text-xs sm:text-sm text-center">Twitter</span>
                        </a>
                      )}
                      {creator.socialLinks?.instagram && (
                        <a 
                          href={`https://instagram.com/${creator.socialLinks.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Instagram className="w-6 h-6 text-pink-500" />
                          <span className="text-xs sm:text-sm text-center">Instagram</span>
                        </a>
                      )}
                      {creator.socialLinks?.youtube && (
                        <a 
                          href={creator.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Youtube className="w-6 h-6 text-red-500" />
                          <span className="text-xs sm:text-sm text-center">YouTube</span>
                        </a>
                      )}
                      {creator.socialLinks?.website && (
                        <a 
                          href={creator.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="w-6 h-6 text-gray-500" />
                          <span className="text-xs sm:text-sm text-center">Website</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Tip Form */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-purple-900 text-lg sm:text-xl">Support {creator.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {!isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                          {formatCurrency(creator.totalTips || 0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total tips received from {creator.tipCount || 0} supporters
                        </div>
                      </div>
                      
                      <Alert>
                        <LogIn className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Sign in to send a tip and support this creator
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
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
                          {formatCurrency(creator.totalTips || 0)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total tips received from {creator.tipCount || 0} supporters
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
                                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300'
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
                          placeholder="Leave a message for the creator..."
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
                        disabled={isProcessing || (customAmount ? parseFloat(customAmount) <= 0 : selectedAmount <= 0)}
                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 mr-2" />
                            Send {formatAmountDisplay(customAmount ? parseFloat(customAmount) : selectedAmount)} Tip
                          </>
                        )}
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
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
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
      {creator && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transactionOptions={{
            function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::${process.env.NEXT_PUBLIC_CONTRACT_MODULE}::send_tip`,
            functionArguments: [
              creator.walletAddress,
              Math.round((customAmount ? parseFloat(customAmount) : selectedAmount) / 1000 * 100000000), // Convert to octas
              message || 'Thank you for your amazing content!'
            ],
          }}
          title="Send Tip"
          description={`Send a tip to ${creator.name} using your Google account.`}
          successMessage={`Tip sent successfully to ${creator.name}!`}
          onSuccess={handleTipSuccess}
        />
      )}
    </div>
  )
}
