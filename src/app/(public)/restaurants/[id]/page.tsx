'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { Star, MapPin, Phone, Globe, Clock, Heart, Share2, QrCode, Camera } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getRestaurantById } from '@/lib/mock-data'
import { formatCurrency, formatCompactNumber } from '@/lib/format'

interface RestaurantPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = use(params)
  const restaurant = getRestaurantById(id)

  if (!restaurant) {
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
          src={restaurant.bannerUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold">{restaurant.name}</h1>
                {restaurant.verified && (
                  <Badge className="bg-blue-600">Verified</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-white/80">({restaurant.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-1 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.city}, {restaurant.state}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {restaurant.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Heart className="w-4 h-4 mr-2" />
                Save
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
                <CardTitle>About {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.galleryImages.slice(0, 6).map((image, index) => (
                    <Link 
                      key={index} 
                      href={`/gallery/${restaurant.id}/${index}`}
                      className="group relative aspect-square rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${restaurant.name} photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hours Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(restaurant.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">{hours}</span>
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
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center">
                <CardTitle className="text-blue-900">Support {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatCurrency(restaurant.totalTips)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total tips received from {restaurant.tipCount} supporters
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button asChild className="w-full h-12" size="lg">
                    <Link href={`/tip/${restaurant.id}`}>
                      <Heart className="w-5 h-5 mr-2" />
                      Send a Tip
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href={`/qr-preview/${restaurant.id}-table-1`}>
                      <QrCode className="w-5 h-5 mr-2" />
                      View QR Code
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{restaurant.address}</div>
                    <div className="text-sm text-gray-600">{restaurant.city}, {restaurant.state}</div>
                  </div>
                </div>
                
                {restaurant.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`tel:${restaurant.phone}`}
                      className="font-medium hover:text-blue-600 transition-colors"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                )}
                
                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-600 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
