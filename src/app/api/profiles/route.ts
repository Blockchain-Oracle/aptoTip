import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, restaurants, creators } from '@/lib/db/schema';
import { tippingService } from '@/lib/contracts/tipping-service';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Simple query - we'll add filtering later
    let profilesData = await db
      .select()
      .from(profiles)
      .orderBy(desc(profiles.createdAt))
      .limit(limit);
    
    // Filter by category if specified
    if (category && (category === 'restaurant' || category === 'creator')) {
      profilesData = profilesData.filter(profile => profile.category === category);
    }
    
    // Get additional data for each profile
    const profilesWithDetails = await Promise.all(
      profilesData.map(async (profile) => {
        let additionalData = {};
        
        if (profile.category === 'restaurant') {
          const restaurantData = await db
            .select()
            .from(restaurants)
            .where(eq(restaurants.id, profile.id))
            .limit(1);
          
          if (restaurantData[0]) {
            additionalData = restaurantData[0];
          }
        } else if (profile.category === 'creator') {
          const creatorData = await db
            .select()
            .from(creators)
            .where(eq(creators.id, profile.id))
            .limit(1);
          
          if (creatorData[0]) {
            additionalData = creatorData[0];
          }
        }
        
        return {
          ...profile,
          ...additionalData,
        };
      })
    );
    
    return NextResponse.json(profilesWithDetails);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress, 
      profileType, 
      name, 
      bio, 
      imageUrl, 
      bannerUrl,
      // Restaurant-specific fields
      address,
      city,
      state,
      phone,
      website,
      hours,
      tags,
      // Creator-specific fields
      followers,
      portfolioImages,
      socialLinks
    } = body;
    
    // Validate required fields
    if (!walletAddress || !profileType || !name) {
      return NextResponse.json(
        { error: 'Wallet address, profile type, and name are required' },
        { status: 400 }
      );
    }
    
    // Check if profile already exists in database
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.walletAddress, walletAddress))
      .limit(1);
    
    if (existingProfile[0]) {
      return NextResponse.json(
        { error: 'Profile already exists for this wallet address' },
        { status: 409 }
      );
    }
    
    // Check if profile exists on blockchain
    const blockchainProfileExists = await tippingService.profileExists(walletAddress);
    if (blockchainProfileExists) {
      return NextResponse.json(
        { error: 'Profile already exists on blockchain for this wallet address' },
        { status: 409 }
      );
    }
    
    // Create profile in database first
    const [newProfile] = await db
      .insert(profiles)
      .values({
        walletAddress,
        name,
        bio,
        category: profileType,
        imageUrl,
        bannerUrl,
        slug: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      })
      .returning();
    
    // Create blockchain profile using admin account
    let blockchainTxHash: string | null = null;
    try {
      blockchainTxHash = await tippingService.createProfileOnChain(walletAddress, profileType);
    } catch (error) {
      console.error('Failed to create blockchain profile:', error);
      // Rollback database creation
      await db.delete(profiles).where(eq(profiles.id, newProfile.id));
      return NextResponse.json(
        { error: 'Failed to create profile on blockchain' },
        { status: 500 }
      );
    }
    
    // Create additional data based on profile type
    if (profileType === 'restaurant') {
      await db.insert(restaurants).values({
        id: newProfile.id,
        address: address || '',
        city: city || '',
        state: state || '',
        phone,
        website,
        hours,
        tags,
      });
    } else if (profileType === 'creator') {
      await db.insert(creators).values({
        id: newProfile.id,
        followers: followers || 0,
        portfolioImages,
        tags,
        socialLinks,
      });
    }
    
    // Return the created profile with blockchain transaction hash
    return NextResponse.json({
      ...newProfile,
      blockchainTxHash,
      message: 'Profile created successfully on both database and blockchain'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 