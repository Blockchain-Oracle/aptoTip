'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Sparkles, Heart, Star, MapPin, Phone, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QRCodeModal } from '@/components/ui/qr-code-modal'

// Sample restaurant data for demo
const sampleRestaurant = {
  name: "Mario's Pizza",
  slug: "marios-pizza",
  imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center",
  bannerUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop&crop=center",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  phone: "(555) 123-4567",
  website: "https://mariospizza.com",
  averageTip: 1500, // $15.00
  tipCount: 127,
  tags: ["Italian", "Pizza", "Family-owned"]
}

export default function QRDemoPage() {
  const [showQRModal, setShowQRModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QR Code Generator Demo</h1>
                <p className="text-sm text-gray-600">Beautiful QR codes for restaurant tipping</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Powered by Aptos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Beautiful QR Codes for 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Restaurant Tipping</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate stunning QR codes that customers can scan to tip instantly. 
              No app downloads required - just scan with any camera app!
            </p>
            
            <Button 
              size="lg" 
              onClick={() => setShowQRModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Try QR Code Generator
            </Button>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
                  <p className="text-gray-600 text-sm">
                    Create beautiful QR codes instantly with restaurant branding and customization options.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Beautiful Design</h3>
                  <p className="text-gray-600 text-sm">
                    Professional card design with restaurant info, ratings, and contact details.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Easy Export</h3>
                  <p className="text-gray-600 text-sm">
                    Download as high-quality images or share directly via native sharing.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sample Restaurant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl">Sample Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={sampleRestaurant.imageUrl}
                      alt={sampleRestaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{sampleRestaurant.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{((sampleRestaurant.averageTip ?? 0) / 100).toFixed(1)}</span>
                      <span>({sampleRestaurant.tipCount} tips)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{sampleRestaurant.city}, {sampleRestaurant.state}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sampleRestaurant.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setShowQRModal(true)}
                    className="flex-1"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it Works */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Generate</h4>
                    <p className="text-sm text-gray-600">Create QR codes with restaurant branding</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-green-600">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Print</h4>
                    <p className="text-sm text-gray-600">Download and print for tables</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-purple-600">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Scan</h4>
                    <p className="text-sm text-gray-600">Customers scan with any camera app</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold text-yellow-600">4</span>
                    </div>
                    <h4 className="font-semibold mb-2">Tip</h4>
                    <p className="text-sm text-gray-600">Instant tipping with Google sign-in</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        open={showQRModal}
        onOpenChange={setShowQRModal}
        restaurant={sampleRestaurant}
      />
    </div>
  )
} 