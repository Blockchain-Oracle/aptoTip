import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getCreatorBySlug } from '@/lib/mock-data'

interface CreatorLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const creator = getCreatorBySlug(slug)
  
  if (!creator) {
    return {
      title: 'Creator Not Found | TipLink',
      description: 'The creator you are looking for could not be found.'
    }
  }

  return {
    title: `${creator.name} | TipLink`,
    description: creator.bio,
    keywords: [`${creator.name}`, ...creator.tags, 'creator', 'tipping', 'aptos'].join(', '),
    openGraph: {
      title: `${creator.name} | TipLink`,
      description: creator.bio,
      images: [
        {
          url: creator.bannerUrl,
          width: 1200,
          height: 630,
          alt: `${creator.name} banner`
        }
      ],
      type: 'website',
      siteName: 'TipLink'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${creator.name} | TipLink`,
      description: creator.bio,
      images: [creator.bannerUrl]
    }
  }
}

export default function CreatorLayout({ children, params }: CreatorLayoutProps) {
  const { slug } = use(params)
  const creator = getCreatorBySlug(slug)

  if (!creator) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": creator.name,
            "description": creator.bio,
            "image": creator.bannerUrl,
            "url": creator.socialLinks?.website || "",
            "sameAs": [
              creator.socialLinks?.instagram && `https://instagram.com/${creator.socialLinks.instagram}`,
              creator.socialLinks?.youtube && `https://youtube.com/${creator.socialLinks.youtube}`,
              creator.socialLinks?.twitter && `https://twitter.com/${creator.socialLinks.twitter}`,
            ].filter(Boolean)
          })
        }}
      />
      
      {children}
    </div>
  )
}
