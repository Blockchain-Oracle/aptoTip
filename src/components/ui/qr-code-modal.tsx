'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, QrCode, Download, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { QRCodeCard } from './qr-code-card'
import { formatCurrency } from '@/lib/format'

interface QRCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
}

const DEFAULT_AMOUNTS = [500, 1000, 2000, 5000, 10000]

export function QRCodeModal({ open, onOpenChange, restaurant, creator }: QRCodeModalProps) {
  const [tableNumber, setTableNumber] = useState<number | undefined>()
  const [defaultAmount, setDefaultAmount] = useState(1000)
  const [showSettings, setShowSettings] = useState(false)

  // Determine which profile type we're working with
  const profile = restaurant || creator
  const isCreator = !!creator
  const tipUrl = isCreator ? `/tip/creator/${profile?.slug}` : `/tip/${profile?.slug}`

  const handleClose = () => {
    onOpenChange(false)
    setShowSettings(false)
  }

  if (!profile) {
    return null
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">QR Code Generator</h2>
                  <p className="text-sm text-gray-600">Create beautiful QR codes for {profile.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    className="lg:w-80 border-r border-gray-200 bg-gray-50"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '320px', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    <div className="p-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize QR Code</h3>
                        
                        {/* Table Number - Only show for restaurants */}
                        {!isCreator && (
                          <div className="space-y-2 mb-6">
                            <Label htmlFor="tableNumber" className="text-sm font-medium text-gray-700">
                              Table Number (Optional)
                            </Label>
                            <Input
                              id="tableNumber"
                              type="number"
                              placeholder="e.g., 5"
                              value={tableNumber || ''}
                              onChange={(e) => setTableNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500">
                              Leave empty for general tipping
                            </p>
                          </div>
                        )}

                        {/* Default Amount */}
                        <div className="space-y-3 mb-6">
                          <Label className="text-sm font-medium text-gray-700">
                            Suggested Amount
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {DEFAULT_AMOUNTS.map((amount) => (
                              <Button
                                key={amount}
                                variant={defaultAmount === amount ? "default" : "outline"}
                                size="sm"
                                onClick={() => setDefaultAmount(amount)}
                                className="text-xs"
                              >
                                {formatCurrency(amount)}
                              </Button>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="Custom amount"
                              value={defaultAmount}
                              onChange={(e) => setDefaultAmount(parseInt(e.target.value) || 0)}
                              className="flex-1"
                            />
                            <span className="text-xs text-gray-500">cents</span>
                          </div>
                        </div>

                        {/* Preview Info */}
                        <Card className="bg-white">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Preview Info</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">{isCreator ? 'Creator:' : 'Restaurant:'}</span>
                                <span className="font-medium">{profile.name}</span>
                              </div>
                              {!isCreator && tableNumber && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Table:</span>
                                  <span className="font-medium">{tableNumber}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">Suggested:</span>
                                <span className="font-medium">{formatCurrency(defaultAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">URL:</span>
                                <span className="font-mono text-xs text-gray-500 truncate">
                                  {tipUrl}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR Code Display */}
              <div className="flex-1 flex items-center justify-center p-6 lg:p-8 overflow-auto">
                <div className="flex flex-col items-center space-y-6">
                  <QRCodeCard
                    restaurant={restaurant}
                    creator={creator}
                    tableNumber={tableNumber}
                    defaultAmount={defaultAmount}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 