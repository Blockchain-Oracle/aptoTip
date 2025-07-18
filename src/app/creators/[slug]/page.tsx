'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import { Users, Heart, Share2, CheckCircle, Instagram, Youtube, Twitter, Globe, Image as ImageIcon, MessageCircle, Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile, isCreator } from '@/hooks/useProfiles'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { formatCurrency, formatCompactNumber } from '@/lib/format'
import { ROUTES } from '@/lib/constants'
import { AccountSwitcherModal } from '@/components/auth/AccountSwitcherModal'

interface CreatorPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const { slug } = use(params)
  const { data: creator, isLoading, error } = useProfile(slug)
  const { account, isAuthenticated } = useKeylessAccount()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

  // Check if current user owns this profile
  const isOwner = isAuthenticated && account && creator && 
    account.accountAddress.toString() === creator.walletAddress

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !creator || !isCreator(creator)) {
    notFound()
  }

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
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Follow</span>
              </Button>
              {isOwner ? (
                <Button 
                  asChild
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm"
                >
                  <Link href={`/edit/creator/${creator.slug}`}>
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
                    {creator.portfolioImages.map((image, index) => (
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
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm sm:text-base">No portfolio images yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

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
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">M</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">Mike R.</p>
                      <p className="text-gray-600 text-xs sm:text-sm">"Love your content!"</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base text-green-600">{formatCurrency(3000)}</p>
                      <p className="text-gray-500 text-xs">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">Alex K.</p>
                      <p className="text-gray-600 text-xs sm:text-sm">"Amazing work!"</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base text-green-600">{formatCurrency(2000)}</p>
                      <p className="text-gray-500 text-xs">3 hours ago</p>
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
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white shadow-lg">
                      <AvatarImage src={creator.imageUrl || undefined} alt={creator.name} />
                      <AvatarFallback className="text-lg sm:text-xl lg:text-2xl">
                        {creator.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <h3 className="font-semibold text-lg sm:text-xl mb-2">{creator.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Tips</span>
                      <span className="font-semibold text-sm sm:text-base">{formatCurrency(creator.totalTips || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Tip Count</span>
                      <span className="font-semibold text-sm sm:text-base">{creator.tipCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Average Tip</span>
                      <span className="font-semibold text-sm sm:text-base">{formatCurrency(creator.averageTip || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Followers</span>
                      <span className="font-semibold text-sm sm:text-base">{formatCompactNumber(creator.followers || 0)}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full" size="lg">
                    <Link href={`/tip/creator/${creator.slug}`}>
                      Send Tip
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links */}
          {(creator.socialLinks?.twitter || creator.socialLinks?.instagram || creator.socialLinks?.youtube || creator.socialLinks?.website) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {creator.socialLinks?.twitter && (
                    <a 
                      href={`https://twitter.com/${creator.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span className="text-sm sm:text-base">@{creator.socialLinks.twitter}</span>
                    </a>
                  )}
                  {creator.socialLinks?.instagram && (
                    <a 
                      href={`https://instagram.com/${creator.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="text-sm sm:text-base">@{creator.socialLinks.instagram}</span>
                    </a>
                  )}
                  {creator.socialLinks?.youtube && (
                    <a 
                      href={creator.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span className="text-sm sm:text-base">YouTube Channel</span>
                    </a>
                  )}
                  {creator.socialLinks?.website && (
                    <a 
                      href={creator.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm sm:text-base">Website</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Contact Creator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Contact Creator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Follow Creator
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
        requiredWalletAddress={creator.walletAddress}
        onSignIn={() => {
          setShowAccountSwitcher(false)
          // Handle sign in logic
        }}
      />
    </div>
  )
}
