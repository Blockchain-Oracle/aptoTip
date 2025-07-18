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
  Camera,
  Loader2,
  X
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateProfileButton } from '@/components/blockchain/CreateProfileButton'
import { UploadButton } from '@/components/ui/upload-button'
import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { useCreateProfile } from '@/hooks/useCreateProfile'
import { ROUTES } from '@/lib/constants'
import { toast } from 'sonner'

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
  const { account, isAuthenticated } = useKeylessAccount()
  const createProfile = useCreateProfile()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    website: '',
    category: '',
    tags: [] as string[],
    imageUrl: '',
    bannerUrl: '',
    hours: {} as Record<string, string>
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

  const handleImageUpload = (type: 'profile' | 'banner') => (url: string) => {
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } else if (type === 'banner') {
      setFormData(prev => ({ ...prev, bannerUrl: url }))
    }
  }

  const handleUploadError = (error: string) => {
    toast.error('Upload failed', { description: error })
  }

  const handleHoursChange = (day: string, hours: string) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: hours
      }
    }))
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Restaurant name is required'
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
      if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters'
      if (!formData.imageUrl) newErrors.imageUrl = 'Profile image is required'
      if (!formData.bannerUrl) newErrors.bannerUrl = 'Banner image is required'
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

  const handleCreateProfile = async () => {
    if (!validateStep(step) || !isAuthenticated || !account) return

    const profileData = {
      walletAddress: account.accountAddress.toString(),
      profileType: 'restaurant' as const,
      ...formData,
    }

    createProfile.mutate(profileData)
  }

  const progress = (step / 4) * 100

  // Show loading state if not connected
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connecting to your account...</h3>
            <p className="text-gray-600">Please wait while we set up your keyless account</p>
          </div>
        </div>
      </div>
    )
  }

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
              <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
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
                  <div>
                    <Label htmlFor="name">Restaurant Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Mario's Authentic Pizza"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="bio">Restaurant Bio *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your restaurant, cuisine, atmosphere, and what makes you special..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className={errors.bio ? 'border-red-500' : ''}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{formData.bio.length}/500 characters</span>
                      <span>Minimum 50 characters</span>
                    </div>
                    {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                  </div>

                  <div>
                    <Label htmlFor="category">Primary Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurantCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Profile Image */}
                  <div>
                    <Label>Profile Image *</Label>
                    {formData.imageUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.imageUrl}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-2 border-blue-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <UploadButton
                        endpoint="profileImage"
                        onUploadComplete={handleImageUpload('profile')}
                        onUploadError={handleUploadError}
                      >
                        Upload Profile Image
                      </UploadButton>
                    )}
                    {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                  </div>

                  {/* Banner Image */}
                  <div>
                    <Label>Banner Image *</Label>
                    {formData.bannerUrl ? (
                      <div className="relative">
                        <img
                          src={formData.bannerUrl}
                          alt="Banner"
                          className="w-full h-32 rounded-lg object-cover border-2 border-blue-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, bannerUrl: '' }))}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <UploadButton
                        endpoint="bannerImage"
                        onUploadComplete={handleImageUpload('banner')}
                        onUploadError={handleUploadError}
                      >
                        Upload Banner Image
                      </UploadButton>
                    )}
                    {errors.bannerUrl && <p className="text-red-500 text-sm mt-1">{errors.bannerUrl}</p>}
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
                  <p className="text-gray-600">Help customers find your restaurant</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Main Street"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="e.g., New York"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

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
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="e.g., (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="e.g., https://mariospizza.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Business Hours</CardTitle>
                  <p className="text-gray-600">Set your restaurant's operating hours</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-24 font-medium">{day}</div>
                        <Input
                          placeholder="e.g., 11:00 AM - 10:00 PM or Closed"
                          value={formData.hours[day] || ''}
                          onChange={(e) => handleHoursChange(day, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Categories & Tags</CardTitle>
                  <p className="text-gray-600">Help customers discover your restaurant</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <Label>Select Categories *</Label>
                    <p className="text-sm text-gray-600 mb-4">Choose categories that describe your restaurant</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {restaurantCategories.map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant={formData.tags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(tag)}
                          className="justify-start"
                        >
                          {formData.tags.includes(tag) && <CheckCircle className="w-4 h-4 mr-2" />}
                          {tag}
                        </Button>
                      ))}
                    </div>
                    {errors.tags && <p className="text-red-500 text-sm mt-2">{errors.tags}</p>}
                  </div>

                  {/* Profile Creation Section */}
                  <div className="pt-6 border-t">
                    <CreateProfileButton
                      profileType="restaurant"
                      walletAddress={account?.accountAddress.toString() || ''}
                      profileData={formData}
                      onSuccess={(txHash) => {
                        console.log('Profile created with transaction:', txHash);
                      }}
                      onError={(error) => {
                        console.error('Profile creation failed:', error);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Step
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 