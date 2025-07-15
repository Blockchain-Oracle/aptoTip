'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { use } from 'react'
import { 
  X, 
  QrCode, 
  Download, 
  Share2, 
  Copy,
  Printer,
  Eye,
  TrendingUp
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRestaurantById } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

interface QRPreviewModalProps {
  params: Promise<{
    qrId: string
  }>
}

// Mock QR code data - same as standalone page
const getQRCodeData = (qrId: string) => {
  const qrData = {
    'mario-pizza-table-1': {
      id: 'mario-pizza-table-1',
      restaurantId: 'mario-pizza-nyc',
      tableName: 'Table 1',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/mario-pizza-nyc?table=1`),
      tipUrl: '/tip/mario-pizza-nyc?table=1',
      createdAt: '2024-01-15',
      scans: 156,
      tips: 23,
      totalTipped: 4680,
      lastScanned: '2 hours ago'
    },
    'mario-pizza-table-2': {
      id: 'mario-pizza-table-2',
      restaurantId: 'mario-pizza-nyc',
      tableName: 'Table 2',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/mario-pizza-nyc?table=2`),
      tipUrl: '/tip/mario-pizza-nyc?table=2',
      createdAt: '2024-01-15',
      scans: 142,
      tips: 19,
      totalTipped: 3850,
      lastScanned: '1 hour ago'
    },
    'green-leaf-cafe-table-1': {
      id: 'green-leaf-cafe-table-1',
      restaurantId: 'green-leaf-cafe',
      tableName: 'Table 1',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/green-leaf-cafe?table=1`),
      tipUrl: '/tip/green-leaf-cafe?table=1',
      createdAt: '2024-01-10',
      scans: 89,
      tips: 12,
      totalTipped: 2340,
      lastScanned: '30 minutes ago'
    },
    'green-leaf-cafe-table-2': {
      id: 'green-leaf-cafe-table-2',
      restaurantId: 'green-leaf-cafe',
      tableName: 'Table 2',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/green-leaf-cafe?table=2`),
      tipUrl: '/tip/green-leaf-cafe?table=2',
      createdAt: '2024-01-10',
      scans: 76,
      tips: 8,
      totalTipped: 1920,
      lastScanned: '1 hour ago'
    },
    'sakura-sushi-sf-table-1': {
      id: 'sakura-sushi-sf-table-1',
      restaurantId: 'sakura-sushi-sf',
      tableName: 'Table 1',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/sakura-sushi-sf?table=1`),
      tipUrl: '/tip/sakura-sushi-sf?table=1',
      createdAt: '2024-01-12',
      scans: 203,
      tips: 31,
      totalTipped: 6420,
      lastScanned: '15 minutes ago'
    },
    'taco-libre-austin-table-1': {
      id: 'taco-libre-austin-table-1',
      restaurantId: 'taco-libre-austin',
      tableName: 'Table 1',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/taco-libre-austin?table=1`),
      tipUrl: '/tip/taco-libre-austin?table=1',
      createdAt: '2024-01-08',
      scans: 134,
      tips: 17,
      totalTipped: 3570,
      lastScanned: '45 minutes ago'
    },
    'bistro-belle-chicago-table-1': {
      id: 'bistro-belle-chicago-table-1',
      restaurantId: 'bistro-belle-chicago',
      tableName: 'Table 1',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(`https://tiplink.io/tip/bistro-belle-chicago?table=1`),
      tipUrl: '/tip/bistro-belle-chicago?table=1',
      createdAt: '2024-01-05',
      scans: 167,
      tips: 25,
      totalTipped: 5890,
      lastScanned: '20 minutes ago'
    }
  }
  
  return qrData[qrId as keyof typeof qrData]
}

export default function QRPreviewModal({ params }: QRPreviewModalProps) {
  const router = useRouter()
  const { qrId } = use(params)
  const qrCode = getQRCodeData(qrId)
  const restaurant = qrCode ? getRestaurantById(qrCode.restaurantId) : null

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [router])

  if (!qrCode || !restaurant) {
    router.back()
    return null
  }

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}${qrCode.tipUrl}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCode.qrCodeUrl
    link.download = `${restaurant.name}-${qrCode.tableName}-QR.png`
    link.click()
  }

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${restaurant.name} ${qrCode.tableName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .qr-container {
                max-width: 400px;
                margin: 0 auto;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
              }
              h1 { 
                color: #1f2937; 
                margin-bottom: 10px; 
              }
              p { 
                color: #6b7280; 
                margin-bottom: 20px; 
              }
              img { 
                max-width: 100%; 
                height: auto; 
              }
              .instructions {
                margin-top: 20px;
                font-size: 14px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>${restaurant.name}</h1>
              <p>${qrCode.tableName}</p>
              <img src="${qrCode.qrCodeUrl}" alt="QR Code" />
              <div class="instructions">
                <p><strong>Scan to tip with TipLink</strong></p>
                <p>1. Point your camera at the QR code</p>
                <p>2. Tap the notification</p>
                <p>3. Sign in with Google & tip!</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${restaurant.name} - ${qrCode.tableName} QR Code`,
      text: `Tip ${restaurant.name} easily with this QR code!`,
      url: `${window.location.origin}${qrCode.tipUrl}`
    }

    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      handleCopyUrl()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => router.back()}
    >
      <motion.div
        className="relative max-w-2xl w-full bg-white rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
            <p className="text-gray-600">{qrCode.tableName} QR Code</p>
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

        <div className="p-6 space-y-6">
          {/* QR Code Display */}
          <div className="text-center">
            <div className="inline-block p-6 bg-gray-50 rounded-lg">
              <Image
                src={qrCode.qrCodeUrl}
                alt={`${restaurant.name} ${qrCode.tableName} QR Code`}
                width={250}
                height={250}
                className="rounded-lg"
              />
            </div>
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                Created {qrCode.createdAt}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{qrCode.scans}</div>
              <div className="text-xs text-gray-600">Scans</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{qrCode.tips}</div>
              <div className="text-xs text-gray-600">Tips</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round((qrCode.tips / qrCode.scans) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Rate</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {formatCurrency(qrCode.totalTipped)}
              </div>
              <div className="text-xs text-gray-600">Earned</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadQR}
              className="h-11 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button
              onClick={handlePrintQR}
              variant="outline"
              className="h-11"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              className="h-11"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-11"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* View Full Details */}
          <Button
            onClick={() => {
              router.push(`/qr-preview/${qrId}`)
            }}
            variant="ghost"
            className="w-full"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Full Analytics
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
