'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Store, 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Tag,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Wallet,
  Camera
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROUTES } from '@/lib/constants'

const restaurantCategories = [
  "Pizza", "Italian", "Sushi", "Japanese", "Healthy", "Organic", 
  "Vegan", "Coffee", "Fine Dining", "Cafe", "Family-Friendly",
  "Mexican", "Chinese", "Thai", "Indian", "Mediterranean", "BBQ"
]

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

export default function CreateRestaurantPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    walletAddress: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    website: '',
    category: '',
    tags: [] as string[],
    imageUrl: '',
    bannerUrl: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Restaurant name is required'
      if (!formData.walletAddress.trim()) newErrors.walletAddress = 'Wallet address is required'
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
      if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters'
    }

    if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.state) newErrors.state = 'State is required'
    }

    if (currentStep === 3) {
      if (formData.tags.length === 0) newErrors.tags = 'Please select at least one category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate slug from name
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      // Redirect to success or profile page
      router.push(`/restaurants/${slug}`)
    } catch (error) {
      console.error('Error creating profile:', error)
      setIsSubmitting(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/create" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Create</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Store className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-lg">Create Restaurant Profile</span>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Basic Information</CardTitle>
                  <p className="text-gray-600">Tell us about your restaurant</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Restaurant Name */}
                  <div>
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Mario's Authentic Pizza"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <Label htmlFor="walletAddress">Aptos Wallet Address *</Label>
                    <div className="relative">
                      <Input
                        id="walletAddress"
                        value={formData.walletAddress}
                        onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                        placeholder="0x..."
                        className={errors.walletAddress ? 'border-red-500' : ''}
                      />
                      <Wallet className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.walletAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.walletAddress}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      This is where you'll receive tips. Make sure it's correct!
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Restaurant Bio *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell customers about your restaurant, your story, what makes you special..."
                      rows={4}
                      className={errors.bio ? 'border-red-500' : ''}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Website */}
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourrestaurant.com"
                      />
                      <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Location & Contact</CardTitle>
                  <p className="text-gray-600">Help customers find you</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      Your location helps customers find you and verify they're at the right place when tipping.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Categories & Images</CardTitle>
                  <p className="text-gray-600">Help customers discover you</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <Label>Restaurant Categories *</Label>
                    <p className="text-sm text-gray-600 mb-3">Select all that apply to your restaurant</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {restaurantCategories.map((category) => (
                        <Button
                          key={category}
                          variant={formData.tags.includes(category) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(category)}
                          className="justify-start"
                        >
                          {formData.tags.includes(category) && (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          {category}
                        </Button>
                      ))}
                    </div>
                    {errors.tags && (
                      <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                    )}
                  </div>

                  {/* Image Upload Placeholder */}
                  <div>
                    <Label>Restaurant Images (Optional)</Label>
                    <p className="text-sm text-gray-600 mb-3">Add photos to make your profile stand out</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload restaurant photos</p>
                      <p className="text-sm text-gray-500">Coming soon - for now, we'll use placeholder images</p>
                    </div>
                  </div>

                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      Great! You're almost done. Review your information and create your profile.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between mt-8"
          >
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next Step
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Profile
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 