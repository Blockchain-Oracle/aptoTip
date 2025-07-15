'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
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
  Star
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCreatorById } from '@/lib/mock-data'
import { formatCurrency, formatCompactNumber } from '@/lib/format'

interface CreatorTipPageProps {
  params: Promise<{
    id: string
  }>
}

// Default tip amounts in octas (1 APT = 100,000,000 octas)
const defaultTipAmounts = [500, 1000, 2000, 5000] // $5, $10, $20, $50

export default function CreatorTipPage({ params }: CreatorTipPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const creator = getCreatorById(id)

  // State management
  const [selectedAmount, setSelectedAmount] = useState<number>(1000) // Default $10
  const [customAmount, setCustomAmount] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showGoogleAuth, setShowGoogleAuth] = useState(false)

  if (!creator) {
    notFound()
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseInt(value) * 100 // Convert dollars to octas
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue)
    }
  }

  const handleGoogleSignIn = async () => {
    setShowGoogleAuth(true)
    // Simulate Google OAuth flow
    setTimeout(() => {
      processTip()
    }, 2000)
  }

  const processTip = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate tip processing (in real app, this would call Aptos smart contracts)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Redirect to success page
      router.push(`/tip/creator/${id}/success?amount=${selectedAmount}&message=${encodeURIComponent(message)}`)
    } catch (error) {
      console.error('Tip processing failed:', error)
      setIsProcessing(false)
      setShowGoogleAuth(false)
    }
  }

  const formatAmountDisplay = (octas: number) => {
    return formatCurrency(octas)
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
                <AvatarImage src={creator.avatarUrl} alt={creator.name} />
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
                      {creator.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCompactNumber(creator.followers)}
                        </div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(creator.totalTips)}
                        </div>
                        <div className="text-sm text-gray-600">Total Tips</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{creator.tipCount}</div>
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
                    {Object.entries(creator.socialLinks).map(([platform, username]) => {
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
                    {creator.portfolioImages.slice(0, 4).map((image, index) => (
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

            {/* Recent Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Recent Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creator.recentTips.slice(0, 3).map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {tip.anonymous ? '?' : tip.message[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-green-600 text-sm">
                              {formatCurrency(tip.amount)}
                            </span>
                            <span className="text-xs text-gray-500">{tip.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{tip.message}</p>
                        </div>
                      </div>
                    ))}
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
                  {!showGoogleAuth && !isProcessing && (
                    <Button
                      onClick={handleGoogleSignIn}
                      className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700"
                      size="lg"
                      disabled={selectedAmount < 100} // Minimum $1
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Sign in with Google & Send Tip
                    </Button>
                  )}

                  {/* Google Auth Simulation */}
                  {showGoogleAuth && !isProcessing && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">G</span>
                        </div>
                        <div>
                          <div className="font-medium">Google Sign-In</div>
                          <div className="text-sm text-gray-600">Creating keyless account...</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-1/2 animate-pulse"></div>
                      </div>
                    </div>
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
