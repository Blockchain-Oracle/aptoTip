// TipLink Application Constants

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

// User types
export const USER_TYPES = {
  RESTAURANT: 1,
  CREATOR: 2,
} as const

// Profile categories
export const RESTAURANT_CATEGORIES = [
  'fast-food',
  'fine-dining',
  'casual-dining',
  'cafe',
  'bar',
  'food-truck',
  'bakery',
  'other'
] as const

export const CREATOR_CATEGORIES = [
  'music',
  'art',
  'gaming',
  'education',
  'comedy',
  'cooking',
  'fitness',
  'tech',
  'lifestyle',
  'other'
] as const

// Social platforms
export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'tiktok', label: 'TikTok', icon: 'music' },
  { key: 'twitch', label: 'Twitch', icon: 'twitch' },
  { key: 'website', label: 'Website', icon: 'globe' }
] as const

// Animation configurations
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

// QR Code settings
export const QR_CODE_CONFIG = {
  SIZE: 256,
  ERROR_CORRECTION_LEVEL: 'M' as const,
  MARGIN: 2,
  COLOR: {
    DARK: '#1f2937',
    LIGHT: '#ffffff'
  }
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/mov'],
  MAX_IMAGES_PER_PROFILE: 10,
  MAX_PORTFOLIO_ITEMS: 20
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: '/api/auth/google',
    KEYLESS: '/api/auth/keyless',
    SESSION: '/api/auth/session'
  },
  PROFILES: {
    RESTAURANT: '/api/profiles/restaurant',
    CREATOR: '/api/profiles/creator'
  },
  TIPS: '/api/tips',
  QR_CODES: '/api/qr-codes',
  MEDIA: '/api/media',
  ANALYTICS: '/api/analytics'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  TIP_SENT: 'Tip sent successfully! 🎉',
  PROFILE_CREATED: 'Profile created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  QR_CODE_CREATED: 'QR code generated successfully!',
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
  INVALID_FILE_TYPE: 'File type not supported.'
} as const 