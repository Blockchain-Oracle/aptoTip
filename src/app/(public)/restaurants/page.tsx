'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, MapPin, Heart, TrendingUp, Filter, Grid, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockRestaurants, type Restaurant } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'
import { useState } from 'react'

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Fine Dining', value: 'fine-dining' },
  { label: 'Casual Dining', value: 'casual-dining' },
  { label: 'Fast Food', value: 'fast-food' },
  { label: 'Café', value: 'cafe' },
  { label: 'Bar', value: 'bar' },
  { label: 'Food Truck', value: 'food-truck' },
  { label: 'Bakery', value: 'bakery' }
]

export default function RestaurantsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesCategory = !selectedCategory || restaurant.category === selectedCategory
    const matchesSearch = !searchQuery || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover <span className="text-blue-600">Restaurants</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Support your favorite local restaurants with zero-friction tipping powered by Aptos blockchain
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="mb-8 space-y-4"
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
            className="h-12"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="h-8"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* View Toggle and Stats */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredRestaurants.length} restaurants
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantListItem key={restaurant.id} restaurant={restaurant} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredRestaurants.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or category filters
          </p>
          <Button onClick={() => { setSearchQuery(''); setSelectedCategory('') }}>
            Clear all filters
          </Button>
        </motion.div>
      )}

      {/* Call to Action */}
      {filteredRestaurants.length > 0 && (
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Own a restaurant?</h3>
          <p className="text-gray-600 mb-6">
            Join TipLink and start receiving tips with zero setup fees
          </p>
          <Button asChild size="lg">
            <Link href="/signup/restaurant">Join as Restaurant</Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function RestaurantCard({ restaurant, index }: { restaurant: Restaurant; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link href={`/restaurants/${restaurant.id}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="relative h-48">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {restaurant.verified && (
              <Badge className="absolute top-3 left-3 bg-blue-600">
                Verified
              </Badge>
            )}
            <div className="absolute top-3 right-3">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                {restaurant.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {restaurant.city}, {restaurant.state}
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {restaurant.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {restaurant.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(restaurant.totalTips)}
                </div>
                <div className="text-xs text-gray-500">
                  {restaurant.tipCount} tips
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function RestaurantListItem({ restaurant, index }: { restaurant: Restaurant; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
    >
      <Link href={`/restaurants/${restaurant.id}`}>
        <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  fill
                  className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors truncate">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm ml-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-gray-500">({restaurant.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {restaurant.address}, {restaurant.city}, {restaurant.state}
                </div>
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                  {restaurant.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-green-600 font-medium">
                      {formatCurrency(restaurant.totalTips)} earned
                    </div>
                    <div className="text-gray-500">
                      {restaurant.tipCount} tips
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
