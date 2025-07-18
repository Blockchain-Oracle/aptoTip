import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, restaurants, creators } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

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
      socialLinks,
    } = body;

    // Validate required fields
    if (!walletAddress || !profileType || !name || !bio) {
      return NextResponse.json(
        { error: 'Missing required fields: walletAddress, profileType, name, bio' },
        { status: 400 }
      );
    }

    // Validate profile type
    if (!['restaurant', 'creator'].includes(profileType)) {
      return NextResponse.json(
        { error: 'Invalid profile type. Must be "restaurant" or "creator"' },
        { status: 400 }
      );
    }

    // Check if profile already exists for this wallet
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.walletAddress, walletAddress))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json(
        { error: 'Profile already exists for this wallet address' },
        { status: 409 }
      );
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingSlug = await db
      .select()
      .from(profiles)
      .where(eq(profiles.slug, slug))
      .limit(1);

    if (existingSlug.length > 0) {
      // Add random suffix to make slug unique
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      slug = `${slug}-${randomSuffix}`;
    }

    // Prepare profile data for database
    const profileData = {
      walletAddress,
      category: profileType as 'restaurant' | 'creator', // Use 'category' field from schema
      name,
      bio,
      slug,
      imageUrl: imageUrl || null,
      bannerUrl: bannerUrl || null,
    };

    // Insert profile into database
    const [newProfile] = await db
      .insert(profiles)
      .values(profileData)
      .returning();

    console.log(`✅ Profile created in database with ID: ${newProfile.id}`);

    // Create additional data based on profile type
    if (profileType === 'restaurant') {
      await db.insert(restaurants).values({
        id: newProfile.id,
        address: address || '',
        city: city || '',
        state: state || '',
        phone: phone || null,
        website: website || null,
        hours: hours || null,
        tags: tags || null,
      });
    } else if (profileType === 'creator') {
      await db.insert(creators).values({
        id: newProfile.id,
        followers: followers || 0,
        portfolioImages: portfolioImages || null,
        tags: tags || null,
        socialLinks: socialLinks || null,
      });
    }

    return NextResponse.json({
      id: newProfile.id,
      slug: newProfile.slug,
      message: 'Profile created successfully in database. Blockchain profile creation will be handled on the client side.',
    });

  } catch (error) {
    console.error('❌ Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query based on filters
    let allProfiles;
    
    if (profileType && ['restaurant', 'creator'].includes(profileType)) {
      // Get profiles with category filter
      const baseProfiles = await db
        .select()
        .from(profiles)
        .where(eq(profiles.category, profileType as 'restaurant' | 'creator'))
        .limit(limit)
        .offset(offset);

      // Enrich profiles with additional data
      allProfiles = await Promise.all(
        baseProfiles.map(async (profile) => {
          if (profile.category === 'restaurant') {
            const restaurantData = await db
              .select()
              .from(restaurants)
              .where(eq(restaurants.id, profile.id))
              .limit(1);
            
            return {
              ...profile,
              ...(restaurantData[0] || {}),
            };
          } else if (profile.category === 'creator') {
            const creatorData = await db
              .select()
              .from(creators)
              .where(eq(creators.id, profile.id))
              .limit(1);
            
            return {
              ...profile,
              ...(creatorData[0] || {}),
            };
          }
          return profile;
        })
      );
    } else {
      // Get all profiles
      const baseProfiles = await db
        .select()
        .from(profiles)
        .limit(limit)
        .offset(offset);

      // Enrich profiles with additional data
      allProfiles = await Promise.all(
        baseProfiles.map(async (profile) => {
          if (profile.category === 'restaurant') {
            const restaurantData = await db
              .select()
              .from(restaurants)
              .where(eq(restaurants.id, profile.id))
              .limit(1);
            
            return {
              ...profile,
              ...(restaurantData[0] || {}),
            };
          } else if (profile.category === 'creator') {
            const creatorData = await db
              .select()
              .from(creators)
              .where(eq(creators.id, profile.id))
              .limit(1);
            
            return {
              ...profile,
              ...(creatorData[0] || {}),
            };
          }
          return profile;
        })
      );
    }

    return NextResponse.json({
      profiles: allProfiles,
      pagination: {
        limit,
        offset,
        total: allProfiles.length,
      },
    });

  } catch (error) {
    console.error('❌ Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
} 