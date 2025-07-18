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
  X,
  LogIn
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
  const { account, isAuthenticated, isLoading, createAuthSession, getAuthUrl, error } = useKeylessAccount()
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

  const handleLogin = async () => {
    try {
      console.log('Starting login process...')
      const ephemeralKeyPair = await createAuthSession()
      console.log('Created ephemeral key pair:', ephemeralKeyPair)
      const authUrl = getAuthUrl(ephemeralKeyPair)
      console.log('Redirecting to:', authUrl)
      window.location.href = authUrl
    } catch (error) {
      console.error('Login error:', error)
    }
  }

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

  // Show loading state while checking authentication
  if (isLoading) {
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

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">Create Restaurant Profile</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-12">Sign in to create your restaurant profile and start receiving tips</p>
            
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-12">
              <div className="mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 lg:mb-3">Get Started with AptoTip</h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600">Connect your Google account to create your restaurant profile</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm lg:text-base">{error}</p>
                </div>
              )}
              
              <Button 
                onClick={handleLogin}
                className="w-full h-12 lg:h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base lg:text-lg"
                size="lg"
              >
                <LogIn className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                Sign in with Google
              </Button>
              
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-4 lg:mt-6">
                No crypto knowledge required. We'll set up your keyless account automatically.
              </p>
            </div>
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
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back to Create</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span className="font-semibold text-base sm:text-lg">Create Restaurant Profile</span>
            </div>
            
            <div className="w-16 sm:w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-medium">Step {step} of 4</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6 sm:space-y-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Basic Information</CardTitle>
                    <p className="text-sm sm:text-base text-gray-600">Tell us about your restaurant</p>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Restaurant Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm sm:text-base">Restaurant Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your restaurant name"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm sm:text-base">Bio *</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Describe your restaurant, cuisine, and what makes it special..."
                        rows={4}
                        className={errors.bio ? 'border-red-500' : ''}
                      />
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formData.bio.length}/500 characters (minimum 50)
                      </p>
                      {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Profile Image */}
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Profile Image *</Label>
                        <UploadButton
                          endpoint="profileImage"
                          onUploadComplete={handleImageUpload('profile')}
                          onUploadError={handleUploadError}
                          className="w-full"
                        >
                          <div className="flex items-center space-x-2">
                            <Camera className="w-4 h-4" />
                            <span>Upload Profile Image</span>
                          </div>
                        </UploadButton>
                        {formData.imageUrl && (
                          <div className="mt-4 relative inline-block">
                            <Image
                              src={formData.imageUrl}
                              alt="Profile"
                              width={120}
                              height={120}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {errors.imageUrl && <p className="text-sm text-red-600">{errors.imageUrl}</p>}
                      </div>

                      {/* Banner Image */}
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Banner Image *</Label>
                        <UploadButton
                          endpoint="bannerImage"
                          onUploadComplete={handleImageUpload('banner')}
                          onUploadError={handleUploadError}
                          className="w-full"
                        >
                          <div className="flex items-center space-x-2">
                            <Camera className="w-4 h-4" />
                            <span>Upload Banner Image</span>
                          </div>
                        </UploadButton>
                        {formData.bannerUrl && (
                          <div className="mt-4 relative inline-block">
                            <Image
                              src={formData.bannerUrl}
                              alt="Banner"
                              width={240}
                              height={120}
                              className="w-full h-20 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => setFormData(prev => ({ ...prev, bannerUrl: '' }))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {errors.bannerUrl && <p className="text-sm text-red-600">{errors.bannerUrl}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Location & Contact</CardTitle>
                    <p className="text-sm sm:text-base text-gray-600">Help customers find and contact you</p>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm sm:text-base">Street Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Main Street"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm sm:text-base">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm sm:text-base">State *</Label>
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
                        {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                      </div>
                    </div>

                    {/* Phone and Website */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm sm:text-base">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://yourrestaurant.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Categories & Tags</CardTitle>
                    <p className="text-sm sm:text-base text-gray-600">Help customers discover your restaurant</p>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm sm:text-base">Select Categories *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {restaurantCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleTagToggle(category)}
                            className={`p-2 sm:p-3 text-xs sm:text-sm rounded-lg border transition-colors ${
                              formData.tags.includes(category)
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                      {errors.tags && <p className="text-sm text-red-600">{errors.tags}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Review & Create</CardTitle>
                    <p className="text-sm sm:text-base text-gray-600">Review your information before creating your profile</p>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-3">Profile Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {formData.name}</p>
                          <p><strong>Bio:</strong> {formData.bio}</p>
                          <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}</p>
                          {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
                          {formData.website && <p><strong>Website:</strong> {formData.website}</p>}
                          <p><strong>Categories:</strong> {formData.tags.join(', ')}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-3">Images</h4>
                        <div className="space-y-3">
                          {formData.imageUrl && (
                            <div>
                              <p className="text-sm font-medium mb-1">Profile Image:</p>
                              <Image
                                src={formData.imageUrl}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          {formData.bannerUrl && (
                            <div>
                              <p className="text-sm font-medium mb-1">Banner Image:</p>
                              <Image
                                src={formData.bannerUrl}
                                alt="Banner"
                                width={160}
                                height={80}
                                className="w-full h-16 rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 sm:px-6"
            >
              Back
            </Button>
            
            <div className="flex space-x-2 sm:space-x-4">
              {step < 4 ? (
                <Button onClick={handleNext} className="px-4 sm:px-6">
                  Next
                </Button>
              ) : (
                <div className="w-full max-w-md">
                  <CreateProfileButton
                    profileType="restaurant"
                    walletAddress={account?.accountAddress.toString() || ''}
                    profileData={formData}
                    onSuccess={(txHash) => {
                      toast.success('Profile created successfully!', {
                        description: `Transaction: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`
                      })
                      router.push(`/restaurants/${formData.name.toLowerCase().replace(/\s+/g, '-')}`)
                    }}
                    onError={(error) => {
                      toast.error('Failed to create profile', { description: error })
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 