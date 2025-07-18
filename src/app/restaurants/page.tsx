'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, MapPin, Heart, TrendingUp, Filter, Grid, List, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layouts/header'
import { useRestaurants, isRestaurant } from '@/hooks/useProfiles'
import { formatCurrency } from '@/lib/format'
import { ROUTES } from '@/lib/constants'
import { useState } from 'react'

// Restaurant categories for filtering
const restaurantCategories = [
  'Pizza', 'Italian', 'Sushi', 'Japanese', 'Healthy', 'Organic', 
  'Vegan', 'Coffee', 'Mexican', 'Thai', 'Indian', 'American'
]

const categories = [
  { label: 'All Categories', value: '' },
  ...restaurantCategories.map(cat => ({ label: cat, value: cat }))
]

export default function RestaurantsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Use real database hook instead of mock data
  const { data: restaurants, isLoading, error } = useRestaurants()

  // Filter restaurants based on search and category
  const filteredRestaurants = (restaurants || []).filter(restaurant => {
    if (!isRestaurant(restaurant)) return false
    
    const matchesCategory = !selectedCategory || restaurant.tags?.includes(selectedCategory)
    const matchesSearch = !searchQuery || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
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
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Failed to load restaurants</h3>
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
            Discover <span className="text-blue-600">Restaurants</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Support your favorite local restaurants with zero-friction tipping powered by Aptos blockchain
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
              placeholder="Search restaurants, cuisine, or tags..."
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
              Showing {filteredRestaurants.length} restaurants
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
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard key={restaurant.slug} restaurant={restaurant} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantListItem key={restaurant.slug} restaurant={restaurant} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <motion.div
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🍽️</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
              Try adjusting your search or category filters
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('') }} size="sm">
              Clear all filters
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        {filteredRestaurants.length > 0 && (
          <motion.div
            className="text-center py-8 sm:py-12 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                Own a Restaurant?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                Create your restaurant profile and start receiving tips from customers
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href={ROUTES.CREATE.RESTAURANT}>
                  Create Restaurant Profile
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant, index }: { restaurant: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <Image
            src={restaurant.bannerUrl || '/placeholder-banner.jpg'}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg sm:text-xl truncate">{restaurant.name}</h3>
              {restaurant.verified && (
                <Badge className="bg-blue-600 text-xs">Verified</Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm mb-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{restaurant.city}, {restaurant.state}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              <span>{((restaurant.averageTip || 0) / 100).toFixed(1)}</span>
              <span className="text-white/80">({restaurant.tipCount || 0} tips)</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3">
            {restaurant.bio}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {restaurant.tags?.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {restaurant.tags && restaurant.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{restaurant.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm sm:text-base">
              <span className="font-semibold text-green-600">
                {formatCurrency(restaurant.totalTips || 0)}
              </span>
              <span className="text-gray-500 ml-1">total tips</span>
            </div>
            
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href={ROUTES.TIP.RESTAURANT(restaurant.slug)}>
                Send Tip
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RestaurantListItem({ restaurant, index }: { restaurant: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Restaurant Image */}
            <div className="relative w-full sm:w-24 sm:h-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={restaurant.bannerUrl || '/placeholder-banner.jpg'}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Restaurant Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg sm:text-xl truncate">{restaurant.name}</h3>
                    {restaurant.verified && (
                      <Badge className="bg-blue-600 text-xs">Verified</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{restaurant.city}, {restaurant.state}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3">
                    {restaurant.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {restaurant.tags && restaurant.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{restaurant.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Stats and Action */}
                <div className="flex flex-col sm:items-end space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span>{((restaurant.averageTip || 0) / 100).toFixed(1)}</span>
                    <span className="text-gray-500">({restaurant.tipCount || 0} tips)</span>
                  </div>
                  
                  <div className="text-sm sm:text-base">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(restaurant.totalTips || 0)}
                    </span>
                    <span className="text-gray-500 ml-1">total tips</span>
                  </div>
                  
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link href={ROUTES.TIP.RESTAURANT(restaurant.slug)}>
                      Send Tip
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
