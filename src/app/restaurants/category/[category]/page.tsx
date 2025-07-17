'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { MapPin, Star, Users, Heart, ChevronRight, Home, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRestaurantsByCategory, type Restaurant } from '@/lib/mock-data'
import { formatCurrency, formatCompactNumber } from '@/lib/format'

interface RestaurantCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// Category information - updated to match actual restaurant categories
const categoryInfo = {
  'fine-dining': {
    title: 'Fine Dining',
    description: 'Upscale restaurants offering exceptional cuisine and service',
    emoji: '🍽️',
    color: 'purple'
  },
  'casual-dining': {
    title: 'Casual Dining',
    description: 'Family-friendly restaurants with comfortable atmosphere',
    emoji: '🍴',
    color: 'blue'
  },
  'fast-food': {
    title: 'Fast Food',
    description: 'Quick service restaurants for convenient meals',
    emoji: '🍔',
    color: 'red'
  },
  'cafe': {
    title: 'Cafés',
    description: 'Coffee shops and light meal establishments',
    emoji: '☕',
    color: 'orange'
  },
  'bar': {
    title: 'Bars',
    description: 'Establishments serving drinks and bar food',
    emoji: '🍺',
    color: 'amber'
  },
  'food-truck': {
    title: 'Food Trucks',
    description: 'Mobile food vendors offering diverse street food',
    emoji: '🚚',
    color: 'green'
  },
  'bakery': {
    title: 'Bakeries',
    description: 'Fresh baked goods, pastries, and artisanal breads',
    emoji: '🥖',
    color: 'yellow'
  }
}

export default function RestaurantCategoryPage({ params }: RestaurantCategoryPageProps) {
  const { category } = use(params)
  const restaurants = getRestaurantsByCategory(category)
  const info = categoryInfo[category as keyof typeof categoryInfo]

  // If category doesn't exist, show helpful alternatives
  if (!info) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumbs */}
        <motion.nav
          className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="hover:text-gray-900 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/restaurants" className="hover:text-gray-900 transition-colors">
            Restaurants
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900 capitalize">{category}</span>
        </motion.nav>

        {/* Category Not Found */}
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Restaurant Category "<span className="capitalize">{category}</span>" Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We couldn't find the restaurant category you're looking for. Here are our available categories:
          </p>

          {/* Available Categories */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {Object.entries(categoryInfo).slice(0, 6).map(([key, catInfo]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Object.keys(categoryInfo).indexOf(key) }}
              >
                <Link href={`/restaurants/category/${key}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{catInfo.emoji}</div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {catInfo.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {catInfo.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/restaurants">Browse All Restaurants</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup/restaurant">Join as Restaurant</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Breadcrumbs */}
      <motion.nav
        className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="hover:text-gray-900 transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/restaurants" className="hover:text-gray-900 transition-colors">
          Restaurants
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900">{info.title}</span>
      </motion.nav>

      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-6xl mb-4">{info.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className={`text-${info.color}-600`}>{info.title}</span> Restaurants
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {info.description}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {restaurants.length} restaurants
          </Badge>
          <Badge variant="outline" className="text-sm">
            Powered by Aptos
          </Badge>
        </div>
      </motion.div>

      {/* Results */}
      {restaurants.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No {info.title.toLowerCase()} restaurants yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to add a {info.title.toLowerCase()} restaurant to TipLink!
          </p>
          <Button asChild size="lg">
            <Link href="/signup/restaurant">Join as Restaurant</Link>
          </Button>
        </motion.div>
      )}

      {/* Call to Action */}
      {restaurants.length > 0 && (
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Own a {info.title.toLowerCase()} restaurant?</h3>
          <p className="text-gray-600 mb-6">
            Join TipLink and start receiving tips with zero setup fees
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup/restaurant">Join as Restaurant</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/restaurants">Browse All Restaurants</Link>
            </Button>
          </div>
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
