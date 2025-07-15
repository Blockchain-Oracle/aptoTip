'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Heart, Grid, List, Instagram, Youtube, Twitter, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockCreators, type Creator } from '@/lib/mock-data'
import { formatCurrency, formatCompactNumber } from '@/lib/format'
import { useState } from 'react'

const categories = [
  { label: 'All Categories', value: '' },
  { label: 'Music', value: 'music' },
  { label: 'Art', value: 'art' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Education', value: 'education' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Cooking', value: 'cooking' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Tech', value: 'tech' },
  { label: 'Lifestyle', value: 'lifestyle' }
]

export default function CreatorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCreators = mockCreators.filter(creator => {
    const matchesCategory = !selectedCategory || creator.category === selectedCategory
    const matchesSearch = !searchQuery || 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
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
          Support <span className="text-purple-600">Creators</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover and support amazing creators directly with zero-friction tipping powered by Aptos blockchain
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
            placeholder="Search creators, content type, or tags..."
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
            Showing {filteredCreators.length} creators
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator, index) => (
          <CreatorCard key={creator.id} creator={creator} index={index} />
        ))}
      </div>

      {/* Call to Action */}
      {filteredCreators.length > 0 && (
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Are you a creator?</h3>
          <p className="text-gray-600 mb-6">
            Join TipLink and start receiving direct support from your fans
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/signup/creator">Join as Creator</Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link href={`/creators/${creator.id}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="relative h-48">
            <Image
              src={creator.bannerUrl}
              alt={creator.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {creator.verified && (
              <Badge className="absolute top-3 left-3 bg-purple-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            
            {/* Avatar overlay */}
            <div className="absolute bottom-4 left-4">
              <Avatar className="w-12 h-12 border-2 border-white">
                <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                <AvatarFallback>
                  {creator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                {creator.name}
              </h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {creator.category}
              </Badge>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {creator.bio}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{formatCompactNumber(creator.followers)} followers</span>
              </div>
              
              <div className="flex space-x-1">
                {creator.socialLinks.instagram && (
                  <Instagram className="w-4 h-4 text-pink-500" />
                )}
                {creator.socialLinks.youtube && (
                  <Youtube className="w-4 h-4 text-red-500" />
                )}
                {creator.socialLinks.twitter && (
                  <Twitter className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {creator.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(creator.totalTips)}
                </div>
                <div className="text-xs text-gray-500">
                  {creator.tipCount} tips
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
