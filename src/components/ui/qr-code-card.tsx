'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { Download, Share2, QrCode, Sparkles, Heart, Star, MapPin, Phone, Globe } from 'lucide-react'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'

// Add CSS animations for html2canvas compatibility
const animationStyles = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;

interface QRCodeCardProps {
  restaurant?: {
    name: string
    slug: string
    imageUrl?: string | null
    bannerUrl?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    phone?: string | null
    website?: string | null
    averageTip?: number | null
    tipCount?: number | null
    tags?: string[] | null
  }
  creator?: {
    name: string
    slug: string
    imageUrl?: string | null
    bannerUrl?: string | null
    bio?: string | null
    category?: string | null
    followers?: number | null
    averageTip?: number | null
    tipCount?: number | null
    tags?: string[] | null
  }
  tableNumber?: number
  defaultAmount?: number
  className?: string
}

export function QRCodeCard({ restaurant, creator, tableNumber, defaultAmount = 1000, className = '' }: QRCodeCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Determine which profile type we're working with
  const profile = restaurant || creator
  const isCreator = !!creator

  if (!profile) {
    return null
  }

  // Generate QR code data
  const generateQRCode = async () => {
    try {
      setIsGenerating(true)
      const tipUrl = `${window.location.origin}${isCreator ? `/tip/creator/${profile.slug}` : `/tip/${profile.slug}`}${tableNumber ? `?table=${tableNumber}` : ''}${defaultAmount ? `&amount=${defaultAmount}` : ''}`
      
      const qrCodeDataUrl = await QRCode.toDataURL(tipUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
      
      setQrCodeUrl(qrCodeDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Export functionality - Coming Soon
  const handleDownloadComingSoon = () => {
    toast.info('Download functionality coming soon!', {
      description: 'You\'ll be able to download QR codes as images soon.',
    })
  }

  // Share functionality - Coming Soon
  const handleShareComingSoon = () => {
    toast.info('Share functionality coming soon!', {
      description: 'You\'ll be able to share QR codes directly soon.',
    })
  }

  useEffect(() => {
    generateQRCode()
  }, [profile.slug, tableNumber, defaultAmount])

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className={className}>
        {/* QR Code Card */}
        <motion.div
          ref={cardRef}
          style={{ 
            position: 'relative',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            width: '400px', 
            height: '600px',
            backgroundColor: '#ffffff'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)' 
          }} />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '128px', 
            height: '128px', 
            borderRadius: '50%', 
            transform: 'translate(-64px, -64px)',
            background: 'linear-gradient(to bottom left, rgba(219, 234, 254, 0.5), transparent)' 
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            width: '96px', 
            height: '96px', 
            borderRadius: '50%', 
            transform: 'translate(-48px, 48px)',
            background: 'linear-gradient(to top right, rgba(243, 232, 255, 0.5), transparent)' 
          }} />
          
          {/* Header */}
          <div style={{ position: 'relative', padding: '24px', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)'
                }}>
                  <QrCode style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', margin: 0 }}>AptoTip</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Instant Tipping</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563' }}>Powered by Aptos</span>
              </div>
            </div>
            
            {/* Profile Info */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  border: '4px solid #ffffff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <img
                    src={profile.imageUrl || '/placeholder-avatar.jpg'}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-4px', 
                  right: '-4px', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: '2px solid #ffffff',
                  backgroundColor: '#10b981',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <Heart style={{ width: '12px', height: '12px', color: '#ffffff' }} />
                </div>
              </div>
              
              <h2 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '4px', color: '#111827', margin: 0 }}>{profile.name}</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <Star style={{ width: '16px', height: '16px', fill: '#fbbf24', color: '#fbbf24' }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {((profile.averageTip ?? 0) / 100).toFixed(1)}
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  ({profile.tipCount ?? 0} tips)
                </span>
              </div>
              
              {profile.tags && profile.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                  {profile.tags.slice(0, 2).map((tag) => (
                    <span key={tag} style={{ 
                      fontSize: '12px', 
                      padding: '4px 8px', 
                      borderRadius: '9999px', 
                      backgroundColor: '#f3f4f6', 
                      color: '#374151' 
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ margin: '0 24px', borderTop: '1px solid #e5e7eb' }} />

          {/* QR Code Section */}
          <div style={{ padding: '24px', paddingTop: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '4px', color: '#111827', margin: 0 }}>Scan to Tip</h3>
              <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                {tableNumber ? `Table ${tableNumber}` : 'Quick Tip'}
              </p>
              {defaultAmount > 0 && (
                <p style={{ fontSize: '12px', marginTop: '4px', color: '#6b7280', margin: 0 }}>
                  Suggested: {formatCurrency(defaultAmount)}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                {isGenerating ? (
                  <div style={{ 
                    width: '192px', 
                    height: '192px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6'
                  }}>
                    <div style={{ 
                      animation: 'spin 1s linear infinite',
                      borderRadius: '50%', 
                      height: '32px', 
                      width: '32px', 
                      borderBottom: '2px solid #2563eb' 
                    }} />
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      style={{ 
                        width: '192px', 
                        height: '192px', 
                        borderRadius: '12px', 
                        border: '4px solid #ffffff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#ffffff'
                      }}>
                        <QrCode style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', marginBottom: '8px', color: '#6b7280', margin: 0 }}>
                Open camera app and scan
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', color: '#9ca3af' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  backgroundColor: '#10b981' 
                }} />
                <span>No app download required</span>
              </div>
            </div>
          </div>

          <div style={{ margin: '0 24px', borderTop: '1px solid #e5e7eb' }} />

          {/* Footer */}
          <div style={{ padding: '24px', paddingTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {!isCreator && restaurant?.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563' }}>
                  <MapPin style={{ width: '12px', height: '12px' }} />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {!isCreator && restaurant?.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563' }}>
                  <Phone style={{ width: '12px', height: '12px' }} />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {!isCreator && restaurant?.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563' }}>
                  <Globe style={{ width: '12px', height: '12px' }} />
                  <span>{restaurant.website}</span>
                </div>
              )}
              {isCreator && creator?.category && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4b5563' }}>
                  <span style={{ textTransform: 'capitalize' }}>{creator.category}</span>
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                Powered by Aptos Blockchain
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                Zero fees • Instant payments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            onClick={handleDownloadComingSoon}
            disabled={isGenerating}
            style={{ flex: 1 }}
            variant="outline"
          >
            <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Coming Soon
          </Button>
          
          <Button
            onClick={handleShareComingSoon}
            disabled={isGenerating}
            style={{ flex: 1 }}
            variant="secondary"
          >
            <Share2 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Coming Soon
          </Button>
        </div>
      </div>
    </>
  )
} 