// Mock data for TipLink simplified architecture
// Enhanced to support both slugs and IDs for maximum flexibility

export interface Profile {
  id: string
  slug: string
  walletAddress: string
  name: string
  bio: string
  category: 'restaurant' | 'creator'
  imageUrl: string
  bannerUrl: string
  verified: boolean
  totalTips: number
  tipCount: number
  averageTip: number
  createdAt: string
  updatedAt: string
}

export interface Restaurant extends Profile {
  category: 'restaurant'
  address: string
  city: string
  state: string
  phone?: string
  website?: string
  hours: {
    [key: string]: string
  }
  tags: string[]
}

export interface Creator extends Profile {
  category: 'creator'
  followers: number
  portfolioImages: string[]
  tags: string[]
  socialLinks: {
    instagram?: string
    twitter?: string
    youtube?: string
    website?: string
  }
  recentTips: {
    amount: number
    message: string
    timestamp: string
    anonymous: boolean
  }[]
}

export interface Tip {
  id: string
  profileId: string
  profileSlug: string
  tipperAddress: string
  amount: number
  message?: string
  transactionHash: string
  createdAt: string
}

// Mock Restaurant Data (Enhanced with both ID and slug)
export const mockRestaurants: Restaurant[] = [
  {
    id: "rest_001",
    slug: "marios-pizza-nyc",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Mario's Authentic Pizza",
    bio: "Family-owned Italian restaurant serving authentic Neapolitan pizza since 1985. Using traditional wood-fired ovens and ingredients imported directly from Italy.",
    category: "restaurant",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop",
    verified: true,
    totalTips: 45280,
    tipCount: 892,
    averageTip: 507,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    address: "123 Little Italy Street",
    city: "New York",
    state: "NY",
    phone: "(555) 123-4567",
    website: "https://mariospizza.com",
    tags: ["Pizza", "Italian", "Family-Friendly", "Wine", "Delivery"],
    hours: {
      "Monday": "11:00 AM - 10:00 PM",
      "Tuesday": "11:00 AM - 10:00 PM", 
      "Wednesday": "11:00 AM - 10:00 PM",
      "Thursday": "11:00 AM - 10:00 PM",
      "Friday": "11:00 AM - 11:00 PM",
      "Saturday": "11:00 AM - 11:00 PM",
      "Sunday": "12:00 PM - 9:00 PM"
    }
  },
  {
    id: "rest_002",
    slug: "sakura-sushi-sf",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    name: "Sakura Sushi Bar",
    bio: "Premium sushi experience with fresh fish flown in daily from Japan. Traditional omakase and modern fusion rolls.",
    category: "restaurant",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=400&fit=crop",
    verified: true,
    totalTips: 67890,
    tipCount: 543,
    averageTip: 1250,
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-18T12:15:00Z",
    address: "456 Fisherman's Wharf",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 555-7890",
    tags: ["Sushi", "Japanese", "Omakase", "Premium", "Sake"],
    hours: {
      "Monday": "Closed",
      "Tuesday": "5:00 PM - 10:00 PM",
      "Wednesday": "5:00 PM - 10:00 PM", 
      "Thursday": "5:00 PM - 10:00 PM",
      "Friday": "5:00 PM - 11:00 PM",
      "Saturday": "5:00 PM - 11:00 PM",
      "Sunday": "5:00 PM - 9:00 PM"
    }
  },
  {
    id: "rest_003",
    slug: "green-leaf-cafe",
    walletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    name: "Green Leaf Café",
    bio: "Organic, locally-sourced café specializing in healthy bowls, fresh smoothies, and artisanal coffee.",
    category: "restaurant",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&h=400&fit=crop",
    verified: false,
    totalTips: 12450,
    tipCount: 298,
    averageTip: 418,
    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    address: "789 Wellness Avenue",
    city: "Austin",
    state: "TX",
    phone: "(512) 555-3456",
    website: "https://greenleafcafe.com",
    tags: ["Healthy", "Organic", "Vegan", "Coffee", "Smoothies"],
    hours: {
      "Monday": "7:00 AM - 3:00 PM",
      "Tuesday": "7:00 AM - 3:00 PM",
      "Wednesday": "7:00 AM - 3:00 PM",
      "Thursday": "7:00 AM - 3:00 PM", 
      "Friday": "7:00 AM - 3:00 PM",
      "Saturday": "8:00 AM - 4:00 PM",
      "Sunday": "8:00 AM - 4:00 PM"
    }
  }
]

// Mock Creator Data (Enhanced with both ID and slug)
export const mockCreators: Creator[] = [
  {
    id: "creator_001",
    slug: "alice-music",
    walletAddress: "0x4567890abcdef1234567890abcdef1234567890ab",
    name: "Alice Sterling",
    bio: "Singer-songwriter creating acoustic covers and original music. Performing live every weekend at local venues and sharing music that touches the soul.",
    category: "creator",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b631?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop",
    verified: true,
    totalTips: 23450,
    tipCount: 156,
    averageTip: 1503,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-19T13:20:00Z",
    followers: 12500,
    portfolioImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop"
    ],
    tags: ["Acoustic", "Singer-Songwriter", "Live Music", "Original Songs"],
    socialLinks: {
      instagram: "@alice_music",
      youtube: "@alicesterling",
      website: "https://alicemusic.com"
    },
    recentTips: [
      {
        amount: 2000,
        message: "Your cover of 'Hallelujah' gave me chills! 🎵",
        timestamp: "2 hours ago",
        anonymous: false
      },
      {
        amount: 500,
        message: "Keep making beautiful music!",
        timestamp: "1 day ago", 
        anonymous: true
      },
      {
        amount: 1000,
        message: "Can't wait for your next live show ❤️",
        timestamp: "3 days ago",
        anonymous: false
      }
    ]
  },
  {
    id: "creator_002",
    slug: "digital-art-bob",
    walletAddress: "0xdef1234567890abcdef1234567890abcdef12345",
    name: "Bob Chen",
    bio: "Digital artist and NFT creator specializing in cyberpunk and fantasy artwork. Commissions open and creating tutorials for aspiring digital artists.",
    category: "creator",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=400&fit=crop",
    verified: true,
    totalTips: 18920,
    tipCount: 89,
    averageTip: 2126,
    createdAt: "2024-01-08T16:00:00Z",
    updatedAt: "2024-01-17T10:30:00Z",
    followers: 8700,
    portfolioImages: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551913902-c92207136625?w=800&h=600&fit=crop"
    ],
    tags: ["Digital Art", "NFT", "Cyberpunk", "Fantasy", "Tutorials"],
    socialLinks: {
      instagram: "@bobchen_art",
      twitter: "@digitalartbob",
      website: "https://bobchenart.com"
    },
    recentTips: [
      {
        amount: 5000,
        message: "Your cyberpunk series is incredible! 🔥",
        timestamp: "5 hours ago",
        anonymous: false
      },
      {
        amount: 1500,
        message: "Thanks for the digital art tutorial!",
        timestamp: "2 days ago",
        anonymous: true
      }
    ]
  },
  {
    id: "creator_003",
    slug: "gaming-sarah",
    walletAddress: "0x234567890abcdef1234567890abcdef1234567890",
    name: "Sarah GameMaster",
    bio: "Variety streamer and gaming content creator. Live streaming daily on Twitch, creating YouTube guides, and building an awesome community of gamers.",
    category: "creator",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop",
    verified: true,
    totalTips: 15670,
    tipCount: 234,
    averageTip: 670,
    createdAt: "2024-01-03T20:00:00Z",
    updatedAt: "2024-01-16T14:15:00Z",
    followers: 18900,
    portfolioImages: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop"
    ],
    tags: ["Gaming", "Streaming", "Variety", "Community", "Tutorials"],
    socialLinks: {
      instagram: "@sarahgamemaster",
      twitter: "@gaming_sarah",
      youtube: "@SarahGameMaster",
      website: "https://sarahgamemaster.com"
    },
    recentTips: [
      {
        amount: 1000,
        message: "Amazing stream tonight! 🎮",
        timestamp: "1 hour ago",
        anonymous: false
      },
      {
        amount: 2500,
        message: "Your tutorial helped me beat that boss!",
        timestamp: "1 day ago",
        anonymous: true
      },
      {
        amount: 800,
        message: "Love your energy! Keep it up! 💪",
        timestamp: "2 days ago",
        anonymous: false
      }
    ]
  }
]

// Mock Tips Data (Enhanced with both profile ID and slug)
export const mockTips: Tip[] = [
  {
    id: "tip_001",
    profileId: "rest_001",
    profileSlug: "marios-pizza-nyc",
    tipperAddress: "0x1111111111111111111111111111111111111111",
    amount: 2000,
    message: "Amazing pizza! Best in NYC! 🍕",
    transactionHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc1",
    createdAt: "2024-01-20T18:30:00Z"
  },
  {
    id: "tip_002",
    profileId: "creator_001",
    profileSlug: "alice-music",
    tipperAddress: "0x2222222222222222222222222222222222222222",
    amount: 1500,
    message: "Your voice is incredible! 🎵",
    transactionHash: "0xdef456789abc123def456789abc123def456789abc123def456789abc123def4",
    createdAt: "2024-01-20T16:45:00Z"
  },
  {
    id: "tip_003",
    profileId: "creator_002",
    profileSlug: "digital-art-bob",
    tipperAddress: "0x3333333333333333333333333333333333333333",
    amount: 3000,
    message: "Love your cyberpunk art! 🔥",
    transactionHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
    createdAt: "2024-01-20T14:20:00Z"
  }
]

// ===== RESTAURANT HELPER FUNCTIONS =====

// Get restaurant by ID (for database compatibility)
export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find(restaurant => restaurant.id === id)
}

// Get restaurant by slug (for URL-friendly routing)
export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return mockRestaurants.find(restaurant => restaurant.slug === slug)
}

// Get restaurant by either ID or slug (flexible lookup)
export function getRestaurantByIdOrSlug(identifier: string): Restaurant | undefined {
  return getRestaurantById(identifier) || getRestaurantBySlug(identifier)
}

// ===== CREATOR HELPER FUNCTIONS =====

// Get creator by ID (for database compatibility)
export function getCreatorById(id: string): Creator | undefined {
  return mockCreators.find(creator => creator.id === id)
}

// Get creator by slug (for URL-friendly routing)
export function getCreatorBySlug(slug: string): Creator | undefined {
  return mockCreators.find(creator => creator.slug === slug)
}

// Get creator by either ID or slug (flexible lookup)
export function getCreatorByIdOrSlug(identifier: string): Creator | undefined {
  return getCreatorById(identifier) || getCreatorBySlug(identifier)
}

// ===== PROFILE HELPER FUNCTIONS =====

// Get any profile by ID (for database compatibility)
export function getProfileById(id: string): Restaurant | Creator | undefined {
  return getRestaurantById(id) || getCreatorById(id)
}

// Get any profile by slug (for URL-friendly routing)
export function getProfileBySlug(slug: string): Restaurant | Creator | undefined {
  return getRestaurantBySlug(slug) || getCreatorBySlug(slug)
}

// Get any profile by either ID or slug (flexible lookup)
export function getProfileByIdOrSlug(identifier: string): Restaurant | Creator | undefined {
  return getProfileById(identifier) || getProfileBySlug(identifier)
}

// ===== FILTERING AND SEARCH FUNCTIONS =====

export function getRestaurantsByCategory(category: string): Restaurant[] {
  return mockRestaurants.filter(restaurant => 
    restaurant.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
  )
}

export function getCreatorsByCategory(category: string): Creator[] {
  return mockCreators.filter(creator => 
    creator.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
  )
}

export function searchRestaurants(query: string): Restaurant[] {
  const lowercaseQuery = query.toLowerCase()
  return mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(lowercaseQuery) ||
    restaurant.bio.toLowerCase().includes(lowercaseQuery) ||
    restaurant.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function searchCreators(query: string): Creator[] {
  const lowercaseQuery = query.toLowerCase()
  return mockCreators.filter(creator =>
    creator.name.toLowerCase().includes(lowercaseQuery) ||
    creator.bio.toLowerCase().includes(lowercaseQuery) ||
    creator.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// ===== TIP HELPER FUNCTIONS =====

export function getTipsByProfileId(profileId: string): Tip[] {
  return mockTips.filter(tip => tip.profileId === profileId)
}

export function getTipsByProfileSlug(profileSlug: string): Tip[] {
  return mockTips.filter(tip => tip.profileSlug === profileSlug)
}

export function getTipsByProfile(identifier: string): Tip[] {
  return getTipsByProfileId(identifier) || getTipsByProfileSlug(identifier)
}

// ===== CATEGORIES =====

export const restaurantCategories = [
  "Pizza", "Italian", "Sushi", "Japanese", "Healthy", "Organic", 
  "Vegan", "Coffee", "Fine Dining", "Cafe", "Family-Friendly"
] as const

export const creatorCategories = [
  "Music", "Art", "Gaming", "Digital Art", "NFT", "Streaming",
  "Singer-Songwriter", "Acoustic", "Cyberpunk", "Fantasy", "Tutorials"
] as const

// ===== TYPE GUARDS =====

export function isRestaurant(profile: Restaurant | Creator): profile is Restaurant {
  return profile.category === 'restaurant'
}

export function isCreator(profile: Restaurant | Creator): profile is Creator {
  return profile.category === 'creator'
}

// ===== UTILITY FUNCTIONS =====

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateId(prefix: 'rest' | 'creator' | 'tip'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`
} 