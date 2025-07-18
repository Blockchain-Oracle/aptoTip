import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { profiles, restaurants } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'

interface TipLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  // Get profile from database
  const profile = await db
    .select()
    .from(profiles)
    .where(or(eq(profiles.id, slug), eq(profiles.slug, slug)))
    .limit(1);
  
  if (!profile[0] || profile[0].category !== 'restaurant') {
    return {
      title: 'Restaurant Not Found | AptoTip',
      description: 'The restaurant you are looking for could not be found.'
    }
  }

  const restaurant = profile[0];
  
  // Get additional restaurant data
  const restaurantData = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurant.id))
    .limit(1);

  const additionalData = restaurantData[0] || {};

  return {
    title: `Tip ${restaurant.name} | AptoTip`,
    description: `Support ${restaurant.name} with a tip using AptoTip. Sign in with Google and tip instantly using Aptos blockchain.`,
    keywords: [`tip ${restaurant.name}`, 'restaurant tipping', 'aptos', 'cryptocurrency', 'google auth'].join(', '),
    openGraph: {
      title: `Tip ${restaurant.name} | AptoTip`,
      description: `Support ${restaurant.name} with a tip using AptoTip`,
      images: [
        {
          url: restaurant.bannerUrl || '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Tip ${restaurant.name}`
        }
      ],
      type: 'website',
      siteName: 'AptoTip'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tip ${restaurant.name} | AptoTip`,
      description: `Support ${restaurant.name} with a tip using AptoTip`,
      images: [restaurant.bannerUrl || '/og-image.png']
    }
  }
}

export default async function TipLayout({ children, params }: TipLayoutProps) {
  const { slug } = await params
  
  // Get profile from database
  const profile = await db
    .select()
    .from(profiles)
    .where(or(eq(profiles.id, slug), eq(profiles.slug, slug)))
    .limit(1);
  
  if (!profile[0] || profile[0].category !== 'restaurant') {
    notFound()
  }

  const restaurant = profile[0];
  
  // Get additional restaurant data
  const restaurantData = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurant.id))
    .limit(1);

  const additionalData = restaurantData[0] || {};

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
            "description": `Support ${restaurant.name} with a tip using AptoTip`,
            "target": {
              "@type": "Restaurant",
              "name": restaurant.name,
              "address": additionalData.address || restaurant.name
            },
            "agent": {
              "@type": "Organization",
              "name": "AptoTip",
              "url": "https://aptotip.io"
            }
          })
        }}
      />
      
      {children}
    </div>
  )
}
