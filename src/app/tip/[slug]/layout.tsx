import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getRestaurantBySlug } from '@/lib/mock-data'

interface TipLayoutProps {
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
    title: `Tip ${restaurant.name} | TipLink`,
    description: `Support ${restaurant.name} with a tip using TipLink. Sign in with Google and tip instantly using Aptos blockchain.`,
    keywords: [`tip ${restaurant.name}`, 'restaurant tipping', 'aptos', 'cryptocurrency', 'google auth'].join(', '),
    openGraph: {
      title: `Tip ${restaurant.name} | TipLink`,
      description: `Support ${restaurant.name} with a tip using TipLink`,
      images: [
        {
          url: restaurant.bannerUrl,
          width: 1200,
          height: 630,
          alt: `Tip ${restaurant.name}`
        }
      ],
      type: 'website',
      siteName: 'TipLink'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tip ${restaurant.name} | TipLink`,
      description: `Support ${restaurant.name} with a tip using TipLink`,
      images: [restaurant.bannerUrl]
    }
  }
}

export default function TipLayout({ children, params }: TipLayoutProps) {
  const { slug } = use(params)
  const restaurant = getRestaurantBySlug(slug)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Action",
            "name": `Tip ${restaurant.name}`,
            "description": `Support ${restaurant.name} with a tip using TipLink`,
            "target": {
              "@type": "Restaurant",
              "name": restaurant.name,
              "address": restaurant.address
            },
            "agent": {
              "@type": "Organization",
              "name": "TipLink",
              "url": "https://tiplink.io"
            }
          })
        }}
      />
      
      {children}
    </div>
  )
}
