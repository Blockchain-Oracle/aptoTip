'use client'

import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { Loader2, LogIn, Camera, Image as ImageIcon, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { CreateProfileButton } from '@/components/blockchain/CreateProfileButton'
import { UploadButton } from '@/components/ui/upload-button'
import { toast } from 'sonner'

export default function CreateCreatorPage() {
  const { account, isAuthenticated, isLoading, createAuthSession, getAuthUrl, error } = useKeylessAccount()
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    category: '',
    imageUrl: '',
    bannerUrl: '',
    portfolioImages: [] as string[],
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      website: ''
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Debug logging
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, isLoading, error })
  }, [isAuthenticated, isLoading, error])

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
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (type: 'profile' | 'banner' | 'portfolio') => (url: string) => {
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } else if (type === 'banner') {
      setFormData(prev => ({ ...prev, bannerUrl: url }))
    } else if (type === 'portfolio') {
      setFormData(prev => ({ 
        ...prev, 
        portfolioImages: [...prev.portfolioImages, url] 
      }))
    }
  }

  const handleUploadError = (error: string) => {
    toast.error('Upload failed', { description: error })
  }

  const removePortfolioImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Creator name is required'
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required'
    } else if (formData.bio.length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters'
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Profile image is required'
    }

    if (!formData.bannerUrl) {
      newErrors.bannerUrl = 'Banner image is required'
    }

    if (formData.portfolioImages.length === 0) {
      newErrors.portfolioImages = 'At least one portfolio image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connecting to your account...</h3>
          <p className="text-gray-600">Please wait while we set up your keyless account</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Creator Profile</h1>
            <p className="text-gray-600">Sign in to create your creator profile and start receiving tips</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Get Started with AptoTip</h2>
              <p className="text-gray-600">Connect your Google account to create your creator profile</p>
            </div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              No crypto knowledge required. We'll set up your keyless account automatically.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Creator Profile</h1>
            <p className="text-gray-600">Set up your creator profile to start receiving tips</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Alice Sterling"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                  </label>
                  <textarea
                    placeholder="Tell us about yourself, your content, and what makes you unique..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length}/500 characters (minimum 50)
                  </p>
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image *
                    </label>
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
                        <img
                          src={formData.imageUrl}
                          alt="Profile"
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
                    {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                  </div>

                  {/* Banner Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image *
                    </label>
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
                        <img
                          src={formData.bannerUrl}
                          alt="Banner"
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
                    {errors.bannerUrl && <p className="text-red-500 text-sm mt-1">{errors.bannerUrl}</p>}
                  </div>
                </div>

                {/* Portfolio Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Images *
                  </label>
                  <UploadButton
                    endpoint="portfolioImages"
                    onUploadComplete={handleImageUpload('portfolio')}
                    onUploadError={handleUploadError}
                    maxFiles={5}
                    className="w-full"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Upload Portfolio Images (up to 5)</span>
                    </div>
                  </UploadButton>
                  
                  {formData.portfolioImages.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {formData.portfolioImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-24 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => removePortfolioImage(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.portfolioImages && <p className="text-red-500 text-sm mt-1">{errors.portfolioImages}</p>}
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.socialLinks.instagram}
                      onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube
                    </label>
                    <input
                      type="text"
                      placeholder="Channel URL"
                      value={formData.socialLinks.youtube}
                      onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      placeholder="https://yourwebsite.com"
                      value={formData.socialLinks.website}
                      onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Create Profile Button */}
              <div className="pt-6 border-t">
                <div className="max-w-md mx-auto">
                  <CreateProfileButton
                    profileType="creator"
                    walletAddress={account?.accountAddress.toString() || ''}
                    profileData={formData}
                    onSuccess={(txHash) => {
                      toast.success('Profile created successfully!', {
                        description: `Transaction: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`
                      })
                    }}
                    onError={(error) => {
                      toast.error('Failed to create profile', { description: error })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 