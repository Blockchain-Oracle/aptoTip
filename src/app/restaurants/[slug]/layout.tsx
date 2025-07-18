import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { db } from '@/lib/db'
import { profiles, restaurants } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'

interface RestaurantLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

async function getRestaurantData(slug: string) {
  try {
    // Query profile by ID or slug
    const profile = await db
      .select()
      .from(profiles)
      .where(or(eq(profiles.id, slug), eq(profiles.slug, slug)))
      .limit(1);
    
    if (!profile[0] || profile[0].category !== 'restaurant') {
      return null;
    }
    
    const profileData = profile[0];
    
    // Get restaurant details
    const restaurantData = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, profileData.id))
      .limit(1);
    
    if (!restaurantData[0]) {
      return null;
    }
    
    return {
      ...profileData,
      ...restaurantData[0],
    };
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const restaurant = await getRestaurantData(slug)
  
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found | TipLink',
      description: 'The restaurant you are looking for could not be found.'
    }
  }

  return {
    title: `${restaurant.name} | TipLink`,
    description: restaurant.bio || '',
    keywords: [`${restaurant.name}`, ...(restaurant.tags || []), 'restaurant', 'tipping', 'aptos'].join(', '),
    openGraph: {
      title: `${restaurant.name} | TipLink`,
      description: restaurant.bio || '',
      images: [
        {
          url: restaurant.bannerUrl || '',
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
      description: restaurant.bio || '',
      images: [restaurant.bannerUrl || '']
    }
  }
}

export default function RestaurantLayout({ children, params }: RestaurantLayoutProps) {
  const { slug } = use(params)
  
  // For server components, we'll let the page component handle the data fetching
  // This layout will just provide the structure

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
