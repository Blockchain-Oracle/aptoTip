'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { Users, Heart, ChevronRight, Home, CheckCircle, Instagram, Youtube, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCreatorsByCategory, type Creator } from '@/lib/mock-data'
import { formatCurrency, formatCompactNumber } from '@/lib/format'

interface CreatorCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

const categoryInfo = {
  'music': {
    title: 'Music',
    description: 'Talented musicians, singers, and composers sharing their musical journey',
    emoji: '🎵',
    color: 'blue'
  },
  'art': {
    title: 'Visual Art',
    description: 'Digital artists, illustrators, and creators showcasing their masterpieces',
    emoji: '🎨',
    color: 'purple'
  },
  'gaming': {
    title: 'Gaming',
    description: 'Streamers, content creators, and gaming enthusiasts building communities',
    emoji: '🎮',
    color: 'green'
  },
  'education': {
    title: 'Education',
    description: 'Educators, tutors, and knowledge sharers making learning accessible',
    emoji: '📚',
    color: 'orange'
  },
  'comedy': {
    title: 'Comedy',
    description: 'Comedians, entertainers, and content creators bringing joy and laughter',
    emoji: '😂',
    color: 'yellow'
  },
  'cooking': {
    title: 'Cooking',
    description: 'Chefs, food enthusiasts, and culinary artists sharing recipes and techniques',
    emoji: '👨‍🍳',
    color: 'red'
  },
  'fitness': {
    title: 'Fitness',
    description: 'Trainers, athletes, and wellness coaches promoting healthy lifestyles',
    emoji: '💪',
    color: 'pink'
  },
  'tech': {
    title: 'Technology',
    description: 'Tech reviewers, developers, and innovators exploring the digital world',
    emoji: '💻',
    color: 'indigo'
  },
  'lifestyle': {
    title: 'Lifestyle',
    description: 'Influencers and content creators sharing life experiences and inspiration',
    emoji: '✨',
    color: 'teal'
  }
}

export default function CreatorCategoryPage({ params }: CreatorCategoryPageProps) {
  const { category } = use(params)
  const creators = getCreatorsByCategory(category)
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
          <Link href="/creators" className="hover:text-gray-900 transition-colors">
            Creators
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
            Category "<span className="capitalize">{category}</span>" Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We couldn't find the creator category you're looking for. Here are some popular categories to explore:
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
                <Link href={`/creators/category/${key}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{catInfo.emoji}</div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
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
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/creators">Browse All Creators</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup/creator">Join as Creator</Link>
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
        <Link href="/creators" className="hover:text-gray-900 transition-colors">
          Creators
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
          <span className={`text-${info.color}-500`}>{info.title}</span> Creators
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {info.description}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {creators.length} creators
          </Badge>
          <Badge variant="outline" className="text-sm">
            Powered by Aptos
          </Badge>
        </div>
      </motion.div>

      {/* Results */}
      {creators.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => (
            <CreatorCard key={creator.id} creator={creator} index={index} />
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
          <h3 className="text-xl font-semibold mb-2">No {info.title.toLowerCase()} creators yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first {info.title.toLowerCase()} creator to join TipLink!
          </p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/signup/creator">Join as Creator</Link>
          </Button>
        </motion.div>
      )}

      {/* Call to Action */}
      {creators.length > 0 && (
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Are you a {info.title.toLowerCase()} creator?</h3>
          <p className="text-gray-600 mb-6">
            Join TipLink and start receiving direct support from your fans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/signup/creator">Join as Creator</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/creators">Browse All Creators</Link>
            </Button>
          </div>
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
