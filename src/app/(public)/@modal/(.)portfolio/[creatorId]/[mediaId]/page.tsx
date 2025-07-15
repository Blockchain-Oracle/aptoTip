'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { use } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getCreatorById } from '@/lib/mock-data'

interface PortfolioModalProps {
  params: Promise<{
    creatorId: string
    mediaId: string
  }>
}

export default function PortfolioModal({ params }: PortfolioModalProps) {
  const router = useRouter()
  const { creatorId, mediaId } = use(params)
  const creator = getCreatorById(creatorId)
  const mediaIndex = parseInt(mediaId)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!creator) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back()
      } else if (e.key === 'ArrowLeft' && mediaIndex > 0) {
        router.push(`/portfolio/${creatorId}/${mediaIndex - 1}`)
      } else if (e.key === 'ArrowRight' && mediaIndex < creator.portfolioImages.length - 1) {
        router.push(`/portfolio/${creatorId}/${mediaIndex + 1}`)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [router, creator, mediaIndex, creatorId])

  if (!creator || mediaIndex < 0 || mediaIndex >= creator.portfolioImages.length) {
    router.back()
    return null
  }

  const currentImage = creator.portfolioImages[mediaIndex]
  const hasPrevious = mediaIndex > 0
  const hasNext = mediaIndex < creator.portfolioImages.length - 1

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => router.back()}
    >
      <motion.div
        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div>
            <h2 className="text-lg font-semibold">{creator.name}</h2>
            <p className="text-sm text-gray-600">
              {mediaIndex + 1} of {creator.portfolioImages.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Container */}
        <div className="relative bg-black">
          <div className="relative aspect-video max-h-[70vh]">
            <Image
              src={currentImage}
              alt={`${creator.name} portfolio ${mediaIndex + 1}`}
              fill
              className="object-contain"
              onLoad={() => setIsLoading(false)}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>

          {/* Navigation */}
          {hasPrevious && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => router.push(`/portfolio/${creatorId}/${mediaIndex - 1}`)}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          
          {hasNext && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => router.push(`/portfolio/${creatorId}/${mediaIndex + 1}`)}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button
              onClick={() => router.push(`/portfolio/${creatorId}`)}
              variant="ghost"
              size="sm"
            >
              View Full Portfolio
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex space-x-2 overflow-x-auto">
            {creator.portfolioImages.map((image, index) => (
              <button
                key={index}
                className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                  index === mediaIndex ? 'border-purple-500' : 'border-transparent'
                }`}
                onClick={() => router.push(`/portfolio/${creatorId}/${index}`)}
              >
                <Image
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
