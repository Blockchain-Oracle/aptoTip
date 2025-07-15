// Mock data for TipLink public pages

export interface Restaurant {
  id: string
  name: string
  description: string
  category: string
  rating: number
  reviewCount: number
  address: string
  city: string
  state: string
  phone?: string
  website?: string
  imageUrl: string
  bannerUrl: string
  galleryImages: string[]
  totalTips: number
  tipCount: number
  averageTip: number
  verified: boolean
  tags: string[]
  hours: {
    [key: string]: string
  }
}

export interface Creator {
  id: string
  name: string
  bio: string
  category: string
  followers: number
  totalTips: number
  tipCount: number
  averageTip: number
  avatarUrl: string
  bannerUrl: string
  portfolioImages: string[]
  verified: boolean
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

// Mock Restaurant Data
export const mockRestaurants: Restaurant[] = [
  {
    id: "mario-pizza-nyc",
    name: "Mario's Authentic Pizza",
    description: "Family-owned Italian restaurant serving authentic Neapolitan pizza since 1985. Using traditional wood-fired ovens and ingredients imported directly from Italy.",
    category: "fine-dining",
    rating: 4.8,
    reviewCount: 1247,
    address: "123 Little Italy Street",
    city: "New York",
    state: "NY",
    phone: "(555) 123-4567",
    website: "https://mariospizza.com",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=600&fit=crop"
    ],
    totalTips: 45280,
    tipCount: 892,
    averageTip: 507,
    verified: true,
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
    id: "sakura-sushi-sf",
    name: "Sakura Sushi Bar",
    description: "Premium sushi experience with fresh fish flown in daily from Japan. Traditional omakase and modern fusion rolls.",
    category: "fine-dining",
    rating: 4.9,
    reviewCount: 856,
    address: "456 Fisherman's Wharf",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 555-7890",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=400&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563612192-facbe58e6ac2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"
    ],
    totalTips: 67890,
    tipCount: 543,
    averageTip: 1250,
    verified: true,
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
    id: "green-leaf-cafe",
    name: "Green Leaf Café",
    description: "Organic, locally-sourced café specializing in healthy bowls, fresh smoothies, and artisanal coffee.",
    category: "cafe",
    rating: 4.6,
    reviewCount: 423,
    address: "789 Wellness Avenue",
    city: "Austin",
    state: "TX",
    phone: "(512) 555-3456",
    website: "https://greenleafcafe.com",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&h=400&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
    ],
    totalTips: 12450,
    tipCount: 298,
    averageTip: 418,
    verified: false,
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

// Mock Creator Data
export const mockCreators: Creator[] = [
  {
    id: "alice-music",
    name: "Alice Sterling",
    bio: "Singer-songwriter creating acoustic covers and original music. Performing live every weekend at local venues and sharing music that touches the soul.",
    category: "music",
    followers: 12500,
    totalTips: 23450,
    tipCount: 156,
    averageTip: 1503,
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b631?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop",
    portfolioImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop"
    ],
    verified: true,
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
    id: "digital-art-bob",
    name: "Bob Chen",
    bio: "Digital artist and NFT creator specializing in cyberpunk and fantasy artwork. Commissions open and creating tutorials for aspiring digital artists.",
    category: "art",
    followers: 8700,
    totalTips: 18920,
    tipCount: 89,
    averageTip: 2126,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=400&fit=crop",
    portfolioImages: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551913902-c92207136625?w=800&h=600&fit=crop"
    ],
    verified: true,
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
    id: "gaming-sarah",
    name: "Sarah GameMaster",
    bio: "Variety streamer and gaming content creator. Live streaming daily on Twitch, creating YouTube guides, and building an awesome community of gamers.",
    category: "gaming",
    followers: 45600,
    totalTips: 67890,
    tipCount: 423,
    averageTip: 1605,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=400&fit=crop",
    portfolioImages: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566577134815-3926dfe04bc9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop"
    ],
    verified: true,
    tags: ["Gaming", "Streaming", "Community", "Guides", "Variety"],
    socialLinks: {
      instagram: "@sarahgamemaster",
      twitter: "@sarahgm",
      youtube: "@sarahgamemaster"
    },
    recentTips: [
      {
        amount: 2500,
        message: "Great stream tonight! That clutch play was amazing 🎮",
        timestamp: "1 hour ago",
        anonymous: false
      },
      {
        amount: 1000,
        message: "Thanks for the game recommendations!",
        timestamp: "4 hours ago",
        anonymous: true
      },
      {
        amount: 500,
        message: "Love the community vibes ❤️",
        timestamp: "1 day ago",
        anonymous: false
      }
    ]
  }
]

// Helper functions
export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find(restaurant => restaurant.id === id)
}

export function getCreatorById(id: string): Creator | undefined {
  return mockCreators.find(creator => creator.id === id)
}

export function getRestaurantsByCategory(category: string): Restaurant[] {
  return mockRestaurants.filter(restaurant => restaurant.category === category)
}

export function getCreatorsByCategory(category: string): Creator[] {
  return mockCreators.filter(creator => creator.category === category)
}

export function searchRestaurants(query: string): Restaurant[] {
  const lowerQuery = query.toLowerCase()
  return mockRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(lowerQuery) ||
    restaurant.description.toLowerCase().includes(lowerQuery) ||
    restaurant.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function searchCreators(query: string): Creator[] {
  const lowerQuery = query.toLowerCase()
  return mockCreators.filter(creator => 
    creator.name.toLowerCase().includes(lowerQuery) ||
    creator.bio.toLowerCase().includes(lowerQuery) ||
    creator.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
} 