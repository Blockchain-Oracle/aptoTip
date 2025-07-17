import { db } from './index';
import { profiles, restaurants, creators, tips } from './schema';
import { Account, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { eq } from 'drizzle-orm';

// Realistic restaurant data
const RESTAURANT_DATA = [
  {
    name: "Mario's Authentic Pizza",
    bio: "Family-owned Italian restaurant serving authentic Neapolitan pizza since 1985. Using traditional wood-fired ovens and ingredients imported directly from Italy.",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop",
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
    name: "Sakura Sushi Bar",
    bio: "Premium sushi experience with fresh fish flown in daily from Japan. Traditional omakase and modern fusion rolls.",
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=400&fit=crop",
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
    name: "Green Leaf Café",
    bio: "Organic, locally-sourced café specializing in healthy bowls, fresh smoothies, and artisanal coffee.",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&h=400&fit=crop",
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
];

// Realistic creator data
const CREATOR_DATA = [
  {
    name: "Alice Sterling",
    bio: "Singer-songwriter creating acoustic covers and original music. Performing live every weekend at local venues and sharing music that touches the soul.",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b631?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop",
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
    }
  },
  {
    name: "Bob Chen",
    bio: "Digital artist and NFT creator specializing in cyberpunk and fantasy artwork. Commissions open and creating tutorials for aspiring digital artists.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=400&fit=crop",
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
    }
  }
];

// Sample tip data with realistic amounts
const SAMPLE_TIPS = [
  { amount: 500, message: "Great service! 🍕", daysAgo: 1 },
  { amount: 1000, message: "Amazing pizza! Will definitely come back", daysAgo: 2 },
  { amount: 750, message: "Best Italian food in the city", daysAgo: 3 },
  { amount: 1500, message: "Incredible sushi! The omakase was perfect", daysAgo: 1 },
  { amount: 800, message: "Fresh and delicious", daysAgo: 4 },
  { amount: 1200, message: "Your music is incredible! 🎵", daysAgo: 1 },
  { amount: 600, message: "Keep making beautiful music", daysAgo: 2 },
  { amount: 900, message: "Love your acoustic covers", daysAgo: 3 },
  { amount: 2000, message: "Your digital art is mind-blowing! 🔥", daysAgo: 1 },
  { amount: 1100, message: "Thanks for the art tutorial", daysAgo: 2 }
];

// Generate realistic Aptos addresses using the proper SDK method
function generateAptosAddress(): string {
  // Use the proper Aptos SDK method to generate an account
  const account = Account.generate();
  return account.accountAddress.toString();
}

// Generate slug from name
function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Fund account with faucet tokens
async function fundAccount(aptos: Aptos, address: string, amount: number = 100000000) {
  try {
    console.log(`💰 Funding account ${address} with ${amount / 100000000} APT...`);
    await aptos.fundAccount({
      accountAddress: address,
      amount: amount
    });
    console.log(`✅ Funded ${address}`);
  } catch (error) {
    console.warn(`⚠️ Failed to fund ${address}:`, error);
  }
}

export async function seedDatabase() {
  console.log('🌱 Starting comprehensive database seeding...');
  
  try {
    // Initialize Aptos client
    const config = new AptosConfig({ 
      network: process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET 
    });
    const aptos = new Aptos(config);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(tips);
    await db.delete(restaurants);
    await db.delete(creators);
    await db.delete(profiles);
    console.log('✅ Cleared existing data');
    
    // Generate and fund restaurant accounts
    console.log('🏪 Creating restaurant profiles...');
    const restaurantProfiles = [];
    
    for (const restaurantData of RESTAURANT_DATA) {
      // Generate realistic wallet address using proper SDK method
      const walletAddress = generateAptosAddress();
      
      // Fund the account
      await fundAccount(aptos, walletAddress);
      
      // Create profile in database
      const [profile] = await db
        .insert(profiles)
        .values({
          slug: generateSlug(restaurantData.name),
          walletAddress,
          name: restaurantData.name,
          bio: restaurantData.bio,
          category: 'restaurant',
          imageUrl: restaurantData.imageUrl,
          bannerUrl: restaurantData.bannerUrl,
          verified: true,
          totalTips: 0, // Will be updated after tips
          tipCount: 0,
          averageTip: 0,
        })
        .returning();
      
      // Create restaurant details
      await db.insert(restaurants).values({
        id: profile.id,
        address: restaurantData.address,
        city: restaurantData.city,
        state: restaurantData.state,
        phone: restaurantData.phone,
        website: restaurantData.website,
        hours: restaurantData.hours,
        tags: restaurantData.tags,
      });
      
      restaurantProfiles.push(profile);
      console.log(`✅ Created restaurant: ${restaurantData.name}`);
    }
    
    // Generate and fund creator accounts
    console.log('🎨 Creating creator profiles...');
    const creatorProfiles = [];
    
    for (const creatorData of CREATOR_DATA) {
      // Generate realistic wallet address using proper SDK method
      const walletAddress = generateAptosAddress();
      
      // Fund the account
      await fundAccount(aptos, walletAddress);
      
      // Create profile in database
      const [profile] = await db
        .insert(profiles)
        .values({
          slug: generateSlug(creatorData.name),
          walletAddress,
          name: creatorData.name,
          bio: creatorData.bio,
          category: 'creator',
          imageUrl: creatorData.imageUrl,
          bannerUrl: creatorData.bannerUrl,
          verified: true,
          totalTips: 0, // Will be updated after tips
          tipCount: 0,
          averageTip: 0,
        })
        .returning();
      
      // Create creator details
      await db.insert(creators).values({
        id: profile.id,
        followers: creatorData.followers,
        portfolioImages: creatorData.portfolioImages,
        tags: creatorData.tags,
        socialLinks: creatorData.socialLinks,
      });
      
      creatorProfiles.push(profile);
      console.log(`✅ Created creator: ${creatorData.name}`);
    }
    
    // Create blockchain profiles (this will sync with contract)
    console.log('⛓️ Creating blockchain profiles...');
    // Import tipping service conditionally to avoid initialization errors
    let tippingService: any = null;
    try {
      // Debug: Check environment variables
      console.log('🔍 Checking environment variables for tipping service...');
      console.log('  NEXT_PUBLIC_CONTRACT_ADDRESS:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ? '✅ Set' : '❌ Missing');
      console.log('  NEXT_PUBLIC_CONTRACT_MODULE:', process.env.NEXT_PUBLIC_CONTRACT_MODULE ? '✅ Set' : '❌ Missing');
      console.log('  ADMIN_PRIVATE_KEY:', process.env.ADMIN_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
      console.log('  NEXT_PUBLIC_APTOS_NETWORK:', process.env.NEXT_PUBLIC_APTOS_NETWORK ? '✅ Set' : '❌ Missing');
      
      const { tippingService: service } = await import('@/lib/contracts/tipping-service');
      tippingService = service;
      console.log('✅ Tipping service imported successfully');
    } catch (error) {
      console.warn('⚠️ Tipping service not available (missing environment variables)');
      console.warn('   Error details:', error);
      console.warn('   Blockchain profile creation will be skipped');
    }

    if (tippingService) {
      for (const profile of [...restaurantProfiles, ...creatorProfiles]) {
        try {
          const profileType = profile.category === 'restaurant' ? 'restaurant' : 'creator';
          const txHash = await tippingService.createProfileOnChain(profile.walletAddress, profileType);
          console.log(`✅ Created blockchain profile for ${profile.name}: ${txHash}`);
        } catch (error) {
          console.warn(`⚠️ Failed to create blockchain profile for ${profile.name}:`, error);
        }
      }
    } else {
      console.log('⏭️ Skipping blockchain profile creation (tipping service not available)');
    }
    
    // Create sample tips with realistic data
    console.log('💸 Creating sample tips...');
    const allProfiles = [...restaurantProfiles, ...creatorProfiles];
    let totalTipsAmount = 0;
    let totalTipCount = 0;
    
    for (const tipData of SAMPLE_TIPS) {
      // Randomly select a profile
      const profile = allProfiles[Math.floor(Math.random() * allProfiles.length)];
      
      // Generate tipper address using proper SDK method
      const tipperAddress = generateAptosAddress();
      
      // Create tip in database
      const [tip] = await db
        .insert(tips)
        .values({
          profileId: profile.id,
          profileSlug: profile.slug,
          tipperAddress,
          amount: tipData.amount, // Already in cents
          message: tipData.message,
          createdAt: new Date(Date.now() - (tipData.daysAgo * 24 * 60 * 60 * 1000)),
        })
        .returning();
      
      // Update profile statistics
      totalTipsAmount += tipData.amount;
      totalTipCount += 1;
      
      console.log(`✅ Created tip: $${(tipData.amount / 100).toFixed(2)} to ${profile.name}`);
    }
    
    // Update profile statistics
    console.log('📊 Updating profile statistics...');
    for (const profile of allProfiles) {
      const profileTips = await db
        .select()
        .from(tips)
        .where(eq(tips.profileId, profile.id));
      
      const totalTips = profileTips.reduce((sum, tip) => sum + tip.amount, 0);
      const tipCount = profileTips.length;
      const averageTip = tipCount > 0 ? Math.round(totalTips / tipCount) : 0;
      
      await db
        .update(profiles)
        .set({
          totalTips,
          tipCount,
          averageTip,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profile.id));
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📈 Created ${restaurantProfiles.length} restaurants and ${creatorProfiles.length} creators`);
    console.log(`💸 Created ${SAMPLE_TIPS.length} sample tips`);
    console.log(`💰 Total tips amount: $${(totalTipsAmount / 100).toFixed(2)}`);
    
    // Display created profiles
    console.log('\n📋 Created Profiles:');
    for (const profile of allProfiles) {
      console.log(`  - ${profile.name} (${profile.category}): ${profile.walletAddress}`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to seed database:', error);
      process.exit(1);
    });
} 