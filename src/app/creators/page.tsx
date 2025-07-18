'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Heart, Grid, List, Instagram, Youtube, Twitter, CheckCircle, Loader2, QrCode } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layouts/header'
import { QRCodeModal } from '@/components/ui/qr-code-modal'
import { useCreators, isCreator } from '@/hooks/useProfiles'
import { formatCurrency, formatCompactNumber } from '@/lib/format'
import { ROUTES } from '@/lib/constants'
import { useState } from 'react'

// Creator categories for filtering
const creatorCategories = [
  'Music', 'Art', 'Gaming', 'Education', 'Comedy', 'Fitness', 
  'Cooking', 'Travel', 'Technology', 'Fashion', 'Lifestyle', 'Business'
]

const categories = [
  { label: 'All Categories', value: '' },
  ...creatorCategories.map(cat => ({ label: cat, value: cat }))
]

export default function CreatorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Use real database hook instead of mock data
  const { data: creators, isLoading, error } = useCreators()

  // Filter creators based on search and category
  const filteredCreators = (creators || []).filter(creator => {
    if (!isCreator(creator)) return false
    
    const matchesCategory = !selectedCategory || creator.tags?.includes(selectedCategory)
    const matchesSearch = !searchQuery || 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="public" showSearch={true} />
        <div className="container mx-auto px-4 lg:px-6 py-4 sm:py-8">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="public" showSearch={true} />
        <div className="container mx-auto px-4 lg:px-6 py-4 sm:py-8">
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">😞</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Failed to load creators</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">{error.message}</p>
            <Button onClick={() => window.location.reload()} size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header variant="public" showSearch={true} />

      <div className="container mx-auto px-4 lg:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4">
            Support <span className="text-purple-600">Creators</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover and support amazing creators directly with zero-friction tipping powered by Aptos blockchain
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-6 sm:mb-8 space-y-3 sm:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search creators, content type, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="h-7 sm:h-8 text-xs sm:text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing {filteredCreators.length} creators
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <List className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCreators.map((creator, index) => (
              <CreatorCard key={creator.slug} creator={creator} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredCreators.map((creator, index) => (
              <CreatorListItem key={creator.slug} creator={creator} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCreators.length === 0 && (
          <motion.div
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎨</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No creators found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
              Try adjusting your search or category filters
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('') }} size="sm">
              Clear all filters
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        {filteredCreators.length > 0 && (
          <motion.div
            className="text-center py-8 sm:py-12 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                Are You a Creator?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                Create your creator profile and start receiving tips from your audience
              </p>
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href={ROUTES.CREATE.CREATOR}>
                  Create Creator Profile
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function CreatorCard({ creator, index }: { creator: any; index: number }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
          {/* Clickable card area for navigation */}
          <Link href={ROUTES.CREATORS.PROFILE(creator.slug)} className="block">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <Image
            src={creator.bannerUrl || '/images/default-banner.jpg'}
            alt={creator.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Creator Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg sm:text-xl truncate">{creator.name}</h3>
              {creator.verified && (
                <Badge className="bg-purple-600 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{formatCompactNumber(creator.followers || 0)} followers</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 capitalize text-xs">
                {creator.category}
              </Badge>
            </div>
          </div>
        </div>
          </Link>
        
        <CardContent className="p-4">
            <Link href={ROUTES.CREATORS.PROFILE(creator.slug)} className="block">
          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3">
            {creator.bio || 'No bio available.'}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {creator.tags?.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {creator.tags && creator.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{creator.tags.length - 3}
              </Badge>
            )}
          </div>
            </Link>
          
          <div className="flex items-center justify-between">
            <div className="text-sm sm:text-base">
              <span className="font-semibold text-green-600">
                {formatCurrency(creator.totalTips || 0)}
              </span>
              <span className="text-gray-500 ml-1">total tips</span>
            </div>
            
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsQRModalOpen(true)
                  }}
                  className="h-8 px-2"
                >
                  <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
            <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Link href={ROUTES.TIP.CREATOR(creator.slug)}>
                Send Tip
              </Link>
            </Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

      {/* QR Code Modal */}
      <QRCodeModal
        open={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
        creator={creator}
      />
    </>
  )
}

function CreatorListItem({ creator, index }: { creator: any; index: number }) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Creator Image */}
              <Link href={ROUTES.CREATORS.PROFILE(creator.slug)} className="block">
            <div className="relative w-full sm:w-24 sm:h-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={creator.bannerUrl || '/images/default-banner.jpg'}
                alt={creator.name}
                fill
                className="object-cover"
              />
            </div>
              </Link>
            
            {/* Creator Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                    <Link href={ROUTES.CREATORS.PROFILE(creator.slug)} className="block">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg sm:text-xl truncate">{creator.name}</h3>
                    {creator.verified && (
                      <Badge className="bg-purple-600 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatCompactNumber(creator.followers || 0)} followers</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3">
                    {creator.bio || 'No bio available.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {creator.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {creator.tags && creator.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{creator.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                    </Link>
                </div>
                
                {/* Stats and Action */}
                <div className="flex flex-col sm:items-end space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {creator.category}
                    </Badge>
                  </div>
                  
                  <div className="text-sm sm:text-base">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(creator.totalTips || 0)}
                    </span>
                    <span className="text-gray-500 ml-1">total tips</span>
                  </div>
                  
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsQRModalOpen(true)
                        }}
                        className="h-8 px-2"
                      >
                        <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href={ROUTES.TIP.CREATOR(creator.slug)}>
                      Send Tip
                    </Link>
                  </Button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

      {/* QR Code Modal */}
      <QRCodeModal
        open={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
        creator={creator}
      />
    </>
  )
}
