'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { Users, Heart, Share2, CheckCircle, Instagram, Youtube, Twitter, Globe, Image as ImageIcon, MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCreatorById } from '@/lib/mock-data'
import { formatCurrency, formatCompactNumber } from '@/lib/format'

interface CreatorPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const { id } = use(params)
  const creator = getCreatorById(id)

  if (!creator) {
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
          src={creator.bannerUrl}
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
                <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                <AvatarFallback className="text-2xl">
                  {creator.name.split(' ').map(n => n[0]).join('')}
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
                    <span className="font-semibold">{formatCompactNumber(creator.followers)}</span>
                    <span className="text-white/80">followers</span>
                  </div>
                  
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize">
                    {creator.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {creator.tags.map((tag) => (
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
                <p className="text-gray-700 leading-relaxed">{creator.bio}</p>
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
                  {creator.portfolioImages.map((image, index) => (
                    <Link 
                      key={index} 
                      href={`/portfolio/${creator.id}/${index}`}
                      className="group relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${creator.name} portfolio ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Recent Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creator.recentTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {tip.anonymous ? '?' : tip.message[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(tip.amount)}
                          </span>
                          <span className="text-sm text-gray-500">{tip.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{tip.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                    {formatCurrency(creator.totalTips)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total tips received from {creator.tipCount} supporters
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button asChild className="w-full h-12 bg-purple-600 hover:bg-purple-700" size="lg">
                    <Link href={`/tip/creator/${creator.id}`}>
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
                {creator.socialLinks.instagram && (
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
                
                {creator.socialLinks.youtube && (
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
                
                {creator.socialLinks.twitter && (
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
                
                {creator.socialLinks.website && (
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCompactNumber(creator.followers)}
                    </div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(creator.averageTip)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Tip</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{creator.tipCount}</div>
                  <div className="text-sm text-gray-600">Total tips received</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
