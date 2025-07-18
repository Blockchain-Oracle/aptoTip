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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Creator Profile</h1>
            <p className="text-gray-600 mb-8">Sign in to create your creator profile and start receiving tips</p>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Get Started with AptoTip</h2>
                <p className="text-gray-600">Connect your Google account to create your creator profile</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
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
              
              <p className="text-sm text-gray-500 mt-4">
                No crypto knowledge required. We'll set up your keyless account automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Create Creator Profile</h1>
          <p className="text-gray-600 mb-8 text-center">Set up your creator profile to start receiving tips</p>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creator Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alice Sterling"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
                  placeholder="Tell us about yourself, your content, and what you create..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formData.bio.length}/500 characters</span>
                  <span>Minimum 50 characters</span>
                </div>
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  <option value="artist">Artist</option>
                  <option value="musician">Musician</option>
                  <option value="writer">Writer</option>
                  <option value="podcaster">Podcaster</option>
                  <option value="streamer">Streamer</option>
                  <option value="educator">Educator</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="photographer">Photographer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Links
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/yourusername"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <input
                  type="url"
                  placeholder="https://instagram.com/yourusername"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <input
                  type="url"
                  placeholder="https://youtube.com/@yourchannel"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image *
                </label>
                {formData.imageUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.imageUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-purple-200"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image *
                </label>
                {formData.bannerUrl ? (
                  <div className="relative">
                    <img
                      src={formData.bannerUrl}
                      alt="Banner"
                      className="w-full h-32 rounded-lg object-cover border-2 border-purple-200"
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

              {/* Portfolio Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Images * (At least 1)
                </label>
                {formData.portfolioImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {formData.portfolioImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePortfolioImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <UploadButton
                  endpoint="portfolioImages"
                  onUploadComplete={handleImageUpload('portfolio')}
                  onUploadError={handleUploadError}
                  maxFiles={10}
                >
                  Add Portfolio Image
                </UploadButton>
                {errors.portfolioImages && <p className="text-red-500 text-sm mt-1">{errors.portfolioImages}</p>}
              </div>

              <div className="pt-6">
                <CreateProfileButton
                  profileType="creator"
                  walletAddress={account?.accountAddress?.toString() || ''}
                  profileData={{
                    name: formData.name,
                    bio: formData.bio,
                    imageUrl: formData.imageUrl,
                    bannerUrl: formData.bannerUrl,
                    portfolioImages: formData.portfolioImages,
                    socialLinks: formData.socialLinks,
                    followers: 0,
                    tags: formData.category ? [formData.category] : []
                  }}
                  onSuccess={(txHash) => {
                    console.log('Profile created successfully:', txHash)
                    toast.success('Creator profile created successfully!')
                  }}
                  onError={(error) => {
                    console.error('Profile creation failed:', error)
                    toast.error('Failed to create profile', { description: error })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 