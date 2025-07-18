'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { 
  CheckCircle, 
  Heart, 
  Star, 
  Share2, 
  ArrowLeft, 
  ExternalLink,
  Copy,
  Twitter,
  Users,
  MessageCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile, isCreator } from '@/hooks/useProfiles'
import { formatCurrency, formatCompactNumber } from '@/lib/format'
import { ROUTES } from '@/lib/constants'

interface SuccessPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function SuccessPage({ params }: SuccessPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { slug } = use(params)
  const { data: creator, isLoading, error } = useProfile(slug)

  const [showCelebration, setShowCelebration] = useState(true)
  const [copied, setCopied] = useState(false)

  const tipAmount = parseInt(searchParams.get('amount') || '1000')
  const tipMessage = searchParams.get('message') || ''

  // Get real transaction hash from URL parameters
  const transactionHash = searchParams.get('txHash') || ''

  // Get the correct explorer URL based on network
  const getExplorerUrl = (hash: string) => {
    const network = process.env.NEXT_PUBLIC_APTOS_NETWORK || 'devnet'
    const baseUrl = 'https://explorer.aptoslabs.com'
    
    // For mainnet, we don't need the network parameter
    if (network === 'mainnet') {
      return `${baseUrl}/txn/${hash}`
    }
    
    // For testnet and devnet, we include the network parameter
    return `${baseUrl}/txn/${hash}?network=${network}`
  }

  useEffect(() => {
    // Hide celebration animation after 3 seconds
    const timer = setTimeout(() => {
      setShowCelebration(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !creator || !isCreator(creator)) {
    notFound()
  }

  const handleCopyTransaction = async () => {
    if (!transactionHash) return
    await navigator.clipboard.writeText(transactionHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: `I just supported ${creator.name}!`,
      text: `Just sent ${formatCurrency(tipAmount)} to ${creator.name} using AptoTip! Supporting amazing creators 💜`,
      url: window.location.href
    }

    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Celebration Overlay */}
      {showCelebration && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="text-8xl mb-4">💜</div>
            <motion.div
              className="text-4xl font-bold text-purple-600 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Support Sent!
            </motion.div>
            <motion.div
              className="text-xl text-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {formatCurrency(tipAmount)} sent to {creator.name}
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Amazing! 🌟
          </h1>
          <p className="text-xl text-gray-600">
            Your support has been successfully sent
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-purple-900">
                  <Heart className="w-6 h-6 inline mr-2" />
                  Support Complete
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Creator Info */}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={creator.imageUrl || undefined} alt={creator.name} />
                    <AvatarFallback className="text-lg">
                      {creator.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      {creator.verified && (
                        <Badge className="bg-purple-600 text-xs">
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

                {/* Transaction Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium">Support Amount:</span>
                    <span className="font-bold text-purple-600">{formatCurrency(tipAmount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Platform Fee:</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Network:</span>
                    <span className="font-medium capitalize">{process.env.NEXT_PUBLIC_APTOS_NETWORK || 'devnet'}</span>
                  </div>
                  
                  <hr className="border-purple-200" />
                  
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Sent:</span>
                    <span className="text-purple-600">{formatCurrency(tipAmount)}</span>
                  </div>
                </div>

                {/* Message */}
                {tipMessage && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-purple-900 mb-1">Your Message:</div>
                    <div className="text-purple-800">"{tipMessage}"</div>
                  </div>
                )}

                {/* Transaction Hash */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">Transaction Hash:</div>
                  {transactionHash ? (
                    <div className="flex items-center space-x-2">
                      <code className="text-xs text-gray-600 bg-white px-2 py-1 rounded flex-1 overflow-hidden">
                        {transactionHash.slice(0, 16)}...{transactionHash.slice(-8)}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyTransaction}
                        disabled={copied}
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getExplorerUrl(transactionHash), '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Transaction hash not available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Share & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Spread the Love</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="h-12"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const tweetText = `Just supported ${creator.name} with ${formatCurrency(tipAmount)} using @AptoTip! Supporting amazing creators has never been easier 💜 #AptosHackathon`
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank')
                    }}
                    className="h-12"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Tweet
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button asChild variant="default" className="w-full h-12 bg-purple-600 hover:bg-purple-700" size="lg">
                    <Link href={`/creators/${creator.slug}`}>
                      <Star className="w-4 h-4 mr-2" />
                      View Creator Profile
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full h-12" size="lg">
                    <Link href="/creators">
                      <Heart className="w-4 h-4 mr-2" />
                      Support Another Creator
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Impact Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  You're Making a Difference!
                </h3>
                <p className="text-purple-700">
                  Your support helps {creator.name} continue creating amazing {creator.category} content. 
                  Every tip matters and directly supports their creative journey.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
