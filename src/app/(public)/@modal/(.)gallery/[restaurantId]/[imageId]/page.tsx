'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { use } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getRestaurantById } from '@/lib/mock-data'
import { useEffect } from 'react'

interface GalleryModalProps {
  params: Promise<{
    restaurantId: string
    imageId: string
  }>
}

export default function GalleryModal({ params }: GalleryModalProps) {
  const router = useRouter()
  const { restaurantId, imageId } = use(params)
  const restaurant = getRestaurantById(restaurantId)
  const imageIndex = parseInt(imageId)

  useEffect(() => {
    if (!restaurant) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back()
      } else if (e.key === 'ArrowLeft' && imageIndex > 0) {
        router.push(`/gallery/${restaurantId}/${imageIndex - 1}`)
      } else if (e.key === 'ArrowRight' && imageIndex < restaurant.galleryImages.length - 1) {
        router.push(`/gallery/${restaurantId}/${imageIndex + 1}`)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [router, restaurant, imageIndex, restaurantId])

  if (!restaurant || imageIndex < 0 || imageIndex >= restaurant.galleryImages.length) {
    router.back()
    return null
  }

  const currentImage = restaurant.galleryImages[imageIndex]

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => router.back()}
    >
      <motion.div
        className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-lg overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent z-10 p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="font-semibold">{restaurant.name}</h3>
              <p className="text-sm opacity-80">
                Image {imageIndex + 1} of {restaurant.galleryImages.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // Download functionality would go here
                  const link = document.createElement('a')
                  link.href = currentImage
                  link.download = `${restaurant.name}-${imageIndex + 1}.jpg`
                  link.click()
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => {
                  // Share functionality would go here
                  navigator.share?.({
                    title: `${restaurant.name} - Gallery`,
                    text: `Check out this image from ${restaurant.name}!`,
                    url: window.location.href
                  })
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => router.back()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative aspect-video">
          <Image
            src={currentImage}
            alt={`${restaurant.name} gallery image ${imageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navigation */}
        {imageIndex > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
            onClick={() => router.push(`/gallery/${restaurantId}/${imageIndex - 1}`)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {imageIndex < restaurant.galleryImages.length - 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
            onClick={() => router.push(`/gallery/${restaurantId}/${imageIndex + 1}`)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-center space-x-2">
            {restaurant.galleryImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === imageIndex ? 'bg-white' : 'bg-white/40'
                }`}
                onClick={() => router.push(`/gallery/${restaurantId}/${index}`)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
