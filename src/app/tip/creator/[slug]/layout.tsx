import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { getProfileBySlug } from '@/lib/api'

interface TipCreatorLayoutProps {
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
    title: `Tip ${creator.name} | AptoTip`,
    description: `Support ${creator.name} with a tip using AptoTip. Sign in with Google and tip instantly using Aptos blockchain.`,
    keywords: [`tip ${creator.name}`, 'creator tipping', 'aptos', 'cryptocurrency', 'google auth', creator.category].join(', '),
    openGraph: {
      title: `Tip ${creator.name} | AptoTip`,
      description: `Support ${creator.name} with a tip using AptoTip`,
      images: creator.bannerUrl ? [
        {
          url: creator.bannerUrl,
          width: 1200,
          height: 630,
          alt: `Tip ${creator.name}`
        }
      ] : [],
      type: 'website',
      siteName: 'AptoTip'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tip ${creator.name} | AptoTip`,
      description: `Support ${creator.name} with a tip using AptoTip`,
      images: creator.bannerUrl ? [creator.bannerUrl] : []
    }
  }
}

export default function TipCreatorLayout({ children, params }: TipCreatorLayoutProps) {
  const { slug } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {children}
    </div>
  )
} 