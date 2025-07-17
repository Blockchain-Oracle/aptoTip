// TipLink Application Constants (Simplified Architecture)

// Tip amounts in cents (for USD display)
export const DEFAULT_TIP_AMOUNTS = [
  { value: 500, label: '$5' },
  { value: 1000, label: '$10' },
  { value: 2000, label: '$20' },
  { value: 5000, label: '$50' }
]

// Platform settings
export const PLATFORM_CONFIG = {
  FEE_RATE: 2, // 2% platform fee
  MIN_TIP_AMOUNT: 100, // $1 minimum
  MAX_TIP_AMOUNT: 10000000, // $100,000 maximum
  MAX_MESSAGE_LENGTH: 280, // Tweet-like message length
} as const

// Profile types
export const PROFILE_TYPES = {
  RESTAURANT: 'restaurant',
  CREATOR: 'creator',
} as const

// Profile categories (Simplified)
export const RESTAURANT_CATEGORIES = [
  'Pizza', 'Italian', 'Sushi', 'Japanese', 'Healthy', 'Organic', 
  'Vegan', 'Coffee', 'Fine Dining', 'Cafe', 'Family-Friendly'
] as const

export const CREATOR_CATEGORIES = [
  'Music', 'Art', 'Gaming', 'Digital Art', 'NFT', 'Streaming',
  'Singer-Songwriter', 'Acoustic', 'Cyberpunk', 'Fantasy', 'Tutorials'
] as const

// Social platforms
export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'website', label: 'Website', icon: 'globe' }
] as const

// Animation configurations (Keep Magic UI animations)
export const ANIMATIONS = {
  PAGE_TRANSITION: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  SLIDE_UP: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  SCALE_IN: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  }
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_PROFILE: 5,
} as const

// API endpoints (Simplified)
export const API_ENDPOINTS = {
  PROFILES: {
    CREATE: '/api/profiles/create',
    RESTAURANT: '/api/profiles/restaurant',
    CREATOR: '/api/profiles/creator'
  },
  TIPS: '/api/tips',
  MEDIA: '/api/media'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  TIP_SENT: 'Tip sent successfully! 🎉',
  PROFILE_CREATED: 'Profile created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MEDIA_UPLOADED: 'Media uploaded successfully!'
} as const

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this tip.',
  INVALID_AMOUNT: 'Please enter a valid tip amount.',
  PROFILE_NOT_FOUND: 'Profile not found.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'File type not supported.',
  INVALID_WALLET_ADDRESS: 'Please enter a valid Aptos wallet address.'
} as const

// Route paths (Simplified)
export const ROUTES = {
  HOME: '/',
  CREATE: {
    MAIN: '/create',
    RESTAURANT: '/create/restaurant',
    CREATOR: '/create/creator'
  },
  RESTAURANTS: {
    LIST: '/restaurants',
    PROFILE: (slug: string) => `/restaurants/${slug}`,
    CATEGORY: (category: string) => `/restaurants/category/${category}`
  },
  CREATORS: {
    LIST: '/creators',
    PROFILE: (slug: string) => `/creators/${slug}`,
    CATEGORY: (category: string) => `/creators/category/${category}`
  },
  TIP: {
    RESTAURANT: (slug: string) => `/tip/${slug}`,
    CREATOR: (slug: string) => `/tip/creator/${slug}`,
    SUCCESS: (slug: string) => `/tip/${slug}/success`
  }
} as const 