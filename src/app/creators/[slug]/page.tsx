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
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Hero Section */}
      <motion.div
        className="relative h-96 rounded-2xl overflow-hidden mb-8"
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
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-end justify-between">
            <div className="flex items-end space-x-6">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={creator.imageUrl || undefined} alt={creator.name} />
                <AvatarFallback className="text-2xl">
                  {creator.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold">{creator.name}</h1>
                  {creator.verified && (
                    <Badge className="bg-purple-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{formatCompactNumber(creator.followers || 0)}</span>
                    <span className="text-white/80">followers</span>
                  </div>
                  
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize">
                    {creator.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {(creator.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
              {isOwner ? (
                <Button 
                  asChild
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Link href={`/edit/creator/${creator.slug}`}>
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
                <CardTitle>About {creator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{creator.bio || 'No bio available.'}</p>
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
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(creator.portfolioImages || []).map((image: string, index: number) => (
                    <div 
                      key={index} 
                      className="group relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${creator.name} portfolio ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
                {(!creator.portfolioImages || creator.portfolioImages.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No portfolio images available.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tip Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center">
                <CardTitle className="text-purple-900">Support {creator.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatCurrency(creator.totalTips || 0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total tips received from {creator.tipCount || 0} supporters
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button asChild className="w-full h-12 bg-purple-600 hover:bg-purple-700" size="lg">
                    <Link href={ROUTES.TIP.CREATOR(creator.slug)}>
                      <Heart className="w-5 h-5 mr-2" />
                      Send a Tip
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {creator.socialLinks?.instagram && (
                  <a 
                    href={`https://instagram.com/${creator.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <span className="font-medium">{creator.socialLinks.instagram}</span>
                  </a>
                )}
                
                {creator.socialLinks?.youtube && (
                  <a 
                    href={`https://youtube.com/${creator.socialLinks.youtube.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="font-medium">{creator.socialLinks.youtube}</span>
                  </a>
                )}
                
                {creator.socialLinks?.twitter && (
                  <a 
                    href={`https://twitter.com/${creator.socialLinks.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{creator.socialLinks.twitter}</span>
                  </a>
                )}
                
                {creator.socialLinks?.website && (
                  <a 
                    href={creator.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Website</span>
                  </a>
                )}
                
                {(!creator.socialLinks?.instagram && !creator.socialLinks?.youtube && !creator.socialLinks?.twitter && !creator.socialLinks?.website) && (
                  <p className="text-gray-500 text-center py-4">No social links available.</p>
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
        requiredWalletAddress={creator?.walletAddress}
      />
    </div>
  )
}
