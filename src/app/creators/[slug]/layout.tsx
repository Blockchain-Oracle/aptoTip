import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getProfileBySlug } from '@/lib/api'

interface CreatorLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const creator = await getProfileBySlug(slug)
  
  if (!creator || creator.category !== 'creator') {
    return {
      title: 'Creator Not Found | AptoTip',
      description: 'The creator you are looking for could not be found.'
    }
  }

  return {
    title: `${creator.name} | AptoTip`,
    description: creator.bio || `Support ${creator.name} with tips using AptoTip`,
    keywords: [`${creator.name}`, creator.category, 'creator', 'tipping', 'aptos'].join(', '),
    openGraph: {
      title: `${creator.name} | AptoTip`,
      description: creator.bio || `Support ${creator.name} with tips using AptoTip`,
      images: creator.bannerUrl ? [
        {
          url: creator.bannerUrl,
          width: 1200,
          height: 630,
          alt: `${creator.name} banner`
        }
      ] : [],
      type: 'website',
      siteName: 'AptoTip'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${creator.name} | AptoTip`,
      description: creator.bio || `Support ${creator.name} with tips using AptoTip`,
      images: creator.bannerUrl ? [creator.bannerUrl] : []
    }
  }
}

export default function CreatorLayout({ children, params }: CreatorLayoutProps) {
  const { slug } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Creator Profile",
            "description": "Creator profile on AptoTip",
            "url": `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/creators/${slug}`,
          })
        }}
      />
      
      {children}
    </div>
  )
}
