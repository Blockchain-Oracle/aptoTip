'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  ArrowLeft, 
  Upload, 
  Music, 
  Palette, 
  Gamepad2, 
  Camera,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Tag,
  CheckCircle,
  Sparkles,
  Wallet,
  Heart,
  Users
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

const creatorCategories = [
  "Music", "Art", "Gaming", "Digital Art", "NFT", "Streaming",
  "Singer-Songwriter", "Acoustic", "Cyberpunk", "Fantasy", "Tutorials",
  "Photography", "Video", "Podcast", "Writing", "Comedy", "Dance",
  "Fashion", "Beauty", "Fitness", "Cooking", "Education"
]

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Twitter', icon: Twitter, color: 'text-blue-500' },
  { name: 'Website', icon: Globe, color: 'text-gray-500' }
]

export default function CreateCreatorPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    walletAddress: '',
    bio: '',
    category: '',
    tags: [] as string[],
    followers: '',
    imageUrl: '',
    bannerUrl: '',
    portfolioImages: [] as string[],
    socialLinks: {
      instagram: '',
      youtube: '',
      twitter: '',
      website: ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
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
      if (!formData.name.trim()) newErrors.name = 'Creator name is required'
      if (!formData.walletAddress.trim()) newErrors.walletAddress = 'Wallet address is required'
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
      if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters'
    }

    if (currentStep === 2) {
      if (!formData.category) newErrors.category = 'Please select a main category'
      if (formData.tags.length === 0) newErrors.tags = 'Please select at least one tag'
    }

    if (currentStep === 3) {
      // Optional step - no validation required
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
      router.push(`/creators/${slug}`)
    } catch (error) {
      console.error('Error creating profile:', error)
      setIsSubmitting(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/create" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Create</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-lg">Create Creator Profile</span>
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
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
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
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Basic Information</CardTitle>
                  <p className="text-gray-600">Tell us about yourself and your content</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Creator Name */}
                  <div>
                    <Label htmlFor="name">Creator Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Alice Sterling"
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
                      This is where you'll receive tips from your supporters
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Bio *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell your audience about yourself, your content, what you create..."
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

                  {/* Follower Count */}
                  <div>
                    <Label htmlFor="followers">Approximate Follower Count (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="followers"
                        value={formData.followers}
                        onChange={(e) => handleInputChange('followers', e.target.value)}
                        placeholder="e.g., 12500"
                        type="number"
                      />
                      <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      This helps supporters understand your reach
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-pink-600" />
                  </div>
                  <CardTitle className="text-2xl">Categories & Content</CardTitle>
                  <p className="text-gray-600">Help supporters discover your content</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Main Category */}
                  <div>
                    <Label htmlFor="category">Main Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your main category" />
                      </SelectTrigger>
                      <SelectContent>
                        {creatorCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Content Tags *</Label>
                    <p className="text-sm text-gray-600 mb-3">Select all that apply to your content</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {creatorCategories.map((tag) => (
                        <Button
                          key={tag}
                          variant={formData.tags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(tag)}
                          className="justify-start"
                        >
                          {formData.tags.includes(tag) && (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          {tag}
                        </Button>
                      ))}
                    </div>
                    {errors.tags && (
                      <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                    )}
                  </div>

                  <Alert>
                    <Heart className="h-4 w-4" />
                    <AlertDescription>
                      These categories help your supporters find you and understand your content better.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl">Portfolio & Social Links</CardTitle>
                  <p className="text-gray-600">Showcase your work and connect with supporters</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Social Links */}
                  <div>
                    <Label>Social Media Links (Optional)</Label>
                    <p className="text-sm text-gray-600 mb-3">Help supporters find you on other platforms</p>
                    
                    <div className="space-y-3">
                      {socialPlatforms.map((platform) => {
                        const Icon = platform.icon
                        const fieldName = platform.name.toLowerCase()
                        return (
                          <div key={platform.name} className="relative">
                            <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${platform.color}`} />
                            <Input
                              value={formData.socialLinks[fieldName as keyof typeof formData.socialLinks]}
                              onChange={(e) => handleSocialLinkChange(fieldName, e.target.value)}
                              placeholder={`Your ${platform.name} username or URL`}
                              className="pl-10"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Portfolio Images */}
                  <div>
                    <Label>Portfolio Images (Optional)</Label>
                    <p className="text-sm text-gray-600 mb-3">Showcase your best work</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload portfolio images</p>
                      <p className="text-sm text-gray-500">Coming soon - for now, we'll use placeholder images</p>
                    </div>
                  </div>

                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      Perfect! You're ready to create your profile and start receiving tips from supporters worldwide.
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
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
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