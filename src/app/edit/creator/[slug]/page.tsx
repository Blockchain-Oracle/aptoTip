'use client'

import { useKeylessAccount } from '@/hooks/useKeylessAccount'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, AlertCircle, ArrowLeft, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UploadButton } from '@/components/ui/upload-button'
import { toast } from 'sonner'
import Link from 'next/link'
import { AccountSwitcherModal } from '@/components/auth/AccountSwitcherModal'

interface CreatorProfile {
  id: string
  slug: string
  walletAddress: string
  name: string
  bio: string
  imageUrl?: string
  bannerUrl?: string
  portfolioImages?: string[]
  socialLinks?: {
    instagram?: string
    twitter?: string
    youtube?: string
    website?: string
  }
  followers?: number
  tags?: string[]
  category?: string
}

export default function EditCreatorPage() {
  const params = useParams()
  const router = useRouter()
  const { account, isAuthenticated, isLoading, signOut } = useKeylessAccount()
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')
  const [canEdit, setCanEdit] = useState(false)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

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

  const slug = params.slug as string

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/creator/${slug}`)
        if (!response.ok) {
          throw new Error('Profile not found')
        }
        
        const profileData = await response.json()
        setProfile(profileData)
        
        // Pre-populate form data
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          category: profileData.category || '',
          imageUrl: profileData.imageUrl || '',
          bannerUrl: profileData.bannerUrl || '',
          portfolioImages: profileData.portfolioImages || [],
          socialLinks: {
            twitter: profileData.socialLinks?.twitter || '',
            instagram: profileData.socialLinks?.instagram || '',
            youtube: profileData.socialLinks?.youtube || '',
            website: profileData.socialLinks?.website || ''
          }
        })
        
        // Check if user can edit this profile
        if (isAuthenticated && account) {
          const userWalletAddress = account.accountAddress.toString()
          const canEditProfile = profileData.walletAddress === userWalletAddress
          setCanEdit(canEditProfile)
        }
      } catch (err) {
        setError('Failed to load profile')
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug && !isLoading) {
      fetchProfile()
    }
  }, [slug, isAuthenticated, account, isLoading])

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

  const handleSave = async () => {
    if (!validateForm() || !profile || !account) return

    setSaving(true)
    try {
      const response = await fetch(`/api/profiles/creator/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${account.accountAddress.toString()}`
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          category: formData.category,
          imageUrl: formData.imageUrl,
          bannerUrl: formData.bannerUrl,
          portfolioImages: formData.portfolioImages,
          socialLinks: formData.socialLinks,
          tags: formData.portfolioImages.length > 0 ? ['creator'] : []
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully!')
      router.push(`/creators/${slug}`)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile', { 
        description: error instanceof Error ? error.message : 'Please try again' 
      })
    } finally {
      setSaving(false)
    }
  }

  // Show loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Loading profile...</h3>
            <p className="text-gray-600">Please wait while we fetch the profile data</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Edit Profile</h1>
              <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
              
              <div className="space-y-3">
                <Link href={`/creators/${slug}`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show authentication required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
              <p className="text-gray-600 mb-6">
                You need to sign in with Google to edit this profile. 
                Make sure you're signed in with the account that owns this profile.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowAccountSwitcher(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Sign In with Google
                </Button>
                
                <Link href={`/creators/${slug}`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Switcher Modal */}
        <AccountSwitcherModal
          open={showAccountSwitcher}
          onOpenChange={setShowAccountSwitcher}
          requiredWalletAddress={profile?.walletAddress}
        />
      </div>
    )
  }

  // Show wrong account message
  if (isAuthenticated && !canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Wrong Account</h1>
              <p className="text-gray-600 mb-6">
                You're signed in with a different account. You can only edit profiles that belong to your account.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current account:</p>
                  <p className="text-sm font-mono text-gray-800 break-all">
                    {account?.accountAddress.toString()}
                  </p>
                </div>
                
                <Button 
                  onClick={() => setShowAccountSwitcher(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Switch Account
                </Button>
                
                <Link href={`/creators/${slug}`}>
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Switcher Modal */}
        <AccountSwitcherModal
          open={showAccountSwitcher}
          onOpenChange={setShowAccountSwitcher}
          currentWalletAddress={account?.accountAddress.toString()}
          requiredWalletAddress={profile?.walletAddress}
        />
      </div>
    )
  }

  // Show edit form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Creator Profile</h1>
              <p className="text-gray-600">Update your creator profile information</p>
            </div>
            
            <Link href={`/creators/${slug}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
          
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

              <div className="pt-6 flex justify-end space-x-4">
                <Link href={`/creators/${slug}`}>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 