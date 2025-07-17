import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, restaurants, creators } from '@/lib/db/schema';
import { aptosService } from '@/lib/contracts/aptos-service';
import { eq, or } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { identifier: string } }
) {
  try {
    const { identifier } = params;
    
    // Query profile by ID or slug
    const profile = await db
      .select()
      .from(profiles)
      .where(or(eq(profiles.id, identifier), eq(profiles.slug, identifier)))
      .limit(1);
    
    if (!profile[0]) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const profileData = profile[0];
    
    // Get additional data based on category
    let additionalData = {};
    
    if (profileData.category === 'restaurant') {
      const restaurantData = await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.id, profileData.id))
        .limit(1);
      
      if (restaurantData[0]) {
        additionalData = restaurantData[0];
      }
    } else if (profileData.category === 'creator') {
      const creatorData = await db
        .select()
        .from(creators)
        .where(eq(creators.id, profileData.id))
        .limit(1);
      
      if (creatorData[0]) {
        additionalData = creatorData[0];
      }
    }
    
    // Get blockchain balance
    const balance = await aptosService.getAccountBalance(profileData.walletAddress);
    
    // Combine all data
    const result = {
      ...profileData,
      ...additionalData,
      balance: balance?.balance || 0,
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 