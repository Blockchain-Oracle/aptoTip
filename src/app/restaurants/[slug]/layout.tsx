import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getRestaurantBySlug } from '@/lib/mock-data'

interface RestaurantLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const restaurant = getRestaurantBySlug(slug)
  
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found | TipLink',
      description: 'The restaurant you are looking for could not be found.'
    }
  }

  return {
    title: `${restaurant.name} | TipLink`,
    description: restaurant.bio,
    keywords: [`${restaurant.name}`, ...restaurant.tags, 'restaurant', 'tipping', 'aptos'].join(', '),
    openGraph: {
      title: `${restaurant.name} | TipLink`,
      description: restaurant.bio,
      images: [
        {
          url: restaurant.bannerUrl,
          width: 1200,
          height: 630,
          alt: `${restaurant.name} banner`
        }
      ],
      type: 'website',
      siteName: 'TipLink'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${restaurant.name} | TipLink`,
      description: restaurant.bio,
      images: [restaurant.bannerUrl]
    }
  }
}

export default function RestaurantLayout({ children, params }: RestaurantLayoutProps) {
  const { slug } = use(params)
  const restaurant = getRestaurantBySlug(slug)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": restaurant.name,
            "description": restaurant.bio,
            "image": restaurant.bannerUrl,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": restaurant.address,
              "addressLocality": restaurant.city,
              "addressRegion": restaurant.state
            },
            "telephone": restaurant.phone || "",
            "url": restaurant.website || "",
            "servesCuisine": restaurant.tags.join(", "),
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": restaurant.averageTip / 100, // Convert cents to dollars for rating
              "reviewCount": restaurant.tipCount
            }
          })
        }}
      />
      
      {children}
    </div>
  )
}
