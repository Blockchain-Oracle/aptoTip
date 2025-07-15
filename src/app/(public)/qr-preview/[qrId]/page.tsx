'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { 
  QrCode, 
  Download, 
  Share2, 
  ArrowLeft, 
  Copy,
  Eye,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Printer,
  Smartphone
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRestaurantById } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

interface QRPreviewPageProps {
  params: Promise<{
    qrId: string
  }>
}

// Mock QR code data - in real app this would come from database
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

export default function QRPreviewPage({ params }: QRPreviewPageProps) {
  const router = useRouter()
  const { qrId } = use(params)
  const qrCode = getQRCodeData(qrId)
  const restaurant = qrCode ? getRestaurantById(qrCode.restaurantId) : null

  const [copied, setCopied] = useState(false)

  if (!qrCode || !restaurant) {
    notFound()
  }

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}${qrCode.tipUrl}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    // Create download link for QR code
    const link = document.createElement('a')
    link.href = qrCode.qrCodeUrl
    link.download = `${restaurant.name}-${qrCode.tableName}-QR.png`
    link.click()
  }

  const handlePrintQR = () => {
    // Open QR code in new window for printing
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-600">{qrCode.tableName} QR Code</p>
          </div>
          
          <div className="w-16" /> {/* Spacer for alignment */}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - QR Code */}
          <div className="space-y-6">
            {/* QR Code Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-blue-900">
                    <QrCode className="w-6 h-6 inline mr-2" />
                    QR Code Preview
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center p-8 bg-white rounded-lg">
                    <div className="relative">
                      <Image
                        src={qrCode.qrCodeUrl}
                        alt={`${restaurant.name} ${qrCode.tableName} QR Code`}
                        width={300}
                        height={300}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  {/* QR Code Info */}
                  <div className="text-center p-4 bg-white rounded-lg">
                    <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                    <p className="text-gray-600 mb-2">{qrCode.tableName}</p>
                    <Badge variant="outline" className="text-xs">
                      Created {qrCode.createdAt}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleDownloadQR}
                      className="h-12 bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      onClick={handlePrintQR}
                      variant="outline"
                      className="h-12 border-blue-200 hover:border-blue-300"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    
                    <Button
                      onClick={handleCopyUrl}
                      variant="outline"
                      className="h-12 border-blue-200 hover:border-blue-300"
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
                      className="h-12 border-blue-200 hover:border-blue-300"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Smartphone className="w-5 h-5 mr-2" />
                    How to Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Place QR code on table</p>
                        <p className="text-gray-600">Print and display where customers can easily see it</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Customers scan with phone</p>
                        <p className="text-gray-600">Works with any camera app - no special app needed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Instant tipping with Google</p>
                        <p className="text-gray-600">Sign in with Google account and tip instantly</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    QR Code Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{qrCode.scans}</div>
                      <div className="text-sm text-gray-600">Total Scans</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{qrCode.tips}</div>
                      <div className="text-sm text-gray-600">Tips Received</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((qrCode.tips / qrCode.scans) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(qrCode.totalTipped)}
                      </div>
                      <div className="text-sm text-gray-600">Total Earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Restaurant Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2" />
                    Restaurant Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <p className="text-gray-600">{restaurant.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {restaurant.category}
                        </Badge>
                        {restaurant.verified && (
                          <Badge className="bg-blue-600 text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Tips Received:</span>
                      <span className="font-medium">{formatCurrency(restaurant.totalTips)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Supporters:</span>
                      <span className="font-medium">{restaurant.tipCount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Tip:</span>
                      <span className="font-medium">{formatCurrency(restaurant.averageTip)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Activity:</span>
                      <span className="font-medium">{qrCode.lastScanned}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Usage Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">💡 Pro Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Place QR codes at eye level for easy scanning</li>
                    <li>• Use table tents or laminated cards for durability</li>
                    <li>• Include a brief instruction: "Scan to tip!"</li>
                    <li>• Check QR codes regularly to ensure they're readable</li>
                    <li>• Consider multiple QR codes for busy establishments</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
