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

interface RestaurantProfile {
  id: string
  slug: string
  walletAddress: string
  name: string
  bio: string
  imageUrl?: string
  bannerUrl?: string
  address?: string
  city?: string
  state?: string
  phone?: string
  website?: string
  hours?: Record<string, string>
  tags?: string[]
  category?: string
}

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

export default function EditRestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const { account, isAuthenticated, isLoading, signOut } = useKeylessAccount()
  const [profile, setProfile] = useState<RestaurantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')
  const [canEdit, setCanEdit] = useState(false)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

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

  const slug = params.slug as string

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/restaurant/${slug}`)
        if (!response.ok) {
          throw new Error('Profile not found')
        }
        
        const profileData = await response.json()
        setProfile(profileData)
        
        // Pre-populate form data
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          phone: profileData.phone || '',
          website: profileData.website || '',
          category: profileData.category || '',
          tags: profileData.tags || [],
          imageUrl: profileData.imageUrl || '',
          bannerUrl: profileData.bannerUrl || '',
          hours: profileData.hours || {}
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required'
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required'
    } else if (formData.bio.length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state) {
      newErrors.state = 'State is required'
    }

    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Profile image is required'
    }

    if (!formData.bannerUrl) {
      newErrors.bannerUrl = 'Banner image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !profile || !account) return

    setSaving(true)
    try {
      const response = await fetch(`/api/profiles/restaurant/${slug}`, {
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
          address: formData.address,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          website: formData.website,
          hours: formData.hours,
          tags: formData.tags
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully!')
      router.push(`/restaurants/${slug}`)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Edit Profile</h1>
              <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
              
              <div className="space-y-3">
                <Link href={`/restaurants/${slug}`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Sign In with Google
                </Button>
                
                <Link href={`/restaurants/${slug}`}>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Switch Account
                </Button>
                
                <Link href={`/restaurants/${slug}`}>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Restaurant Profile</h1>
              <p className="text-gray-600">Update your restaurant profile information</p>
            </div>
            
            <Link href={`/restaurants/${slug}`}>
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
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mario's Authentic Pizza"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Bio *
                </label>
                <textarea
                  placeholder="Describe your restaurant, cuisine, atmosphere, and what makes you special..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  Primary Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {restaurantCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 123 Main Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., New York"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select 
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="e.g., https://mariospizza.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image *
                </label>
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

              {/* Business Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Hours
                </label>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24 font-medium">{day}</div>
                      <input
                        type="text"
                        placeholder="e.g., 11:00 AM - 10:00 PM or Closed"
                        value={formData.hours[day] || ''}
                        onChange={(e) => handleHoursChange(day, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories & Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories & Tags
                </label>
                <p className="text-sm text-gray-600 mb-4">Choose categories that describe your restaurant</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {restaurantCategories.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-4">
                <Link href={`/restaurants/${slug}`}>
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
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