import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getCreatorById } from '@/lib/mock-data'

interface TipCreatorLayoutProps {
  children: React.ReactNode
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const creator = getCreatorById(id)
  
  if (!creator) {
    return {
      title: 'Creator Not Found | TipLink',
      description: 'The creator you are looking for could not be found.'
    }
  }

  return {
    title: `Tip ${creator.name} | TipLink`,
    description: `Support ${creator.name} with a tip using TipLink. Sign in with Google and tip instantly using Aptos blockchain.`,
    keywords: [`tip ${creator.name}`, 'creator tipping', 'aptos', 'cryptocurrency', 'google auth', creator.category].join(', '),
    openGraph: {
      title: `Tip ${creator.name} | TipLink`,
      description: `Support ${creator.name} with a tip using TipLink`,
      images: [
        {
          url: creator.bannerUrl,
          width: 1200,
          height: 630,
          alt: `Tip ${creator.name}`
        }
      ],
      type: 'website',
      siteName: 'TipLink'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tip ${creator.name} | TipLink`,
      description: `Support ${creator.name} with a tip using TipLink`,
      images: [creator.bannerUrl]
    }
  }
}

export default function TipCreatorLayout({ children, params }: TipCreatorLayoutProps) {
  const { id } = use(params)
  const creator = getCreatorById(id)

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
            "@type": "Action",
            "name": `Tip ${creator.name}`,
            "description": `Support ${creator.name} with a tip using TipLink`,
            "target": {
              "@type": "Person",
              "name": creator.name,
              "jobTitle": creator.category
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