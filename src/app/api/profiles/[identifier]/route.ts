import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, restaurants, creators } from '@/lib/db/schema';
import { aptosService } from '@/lib/contracts/aptos-service';
import { eq, or } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    
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
    
    // Get blockchain balance (with error handling for network issues)
    let balance = 0;
    try {
      const balanceData = await aptosService.getAccountBalance(profileData.walletAddress);
      balance = balanceData?.balance || 0;
    } catch (error) {
      console.warn('Failed to fetch blockchain balance:', error);
      // Continue without blockchain balance
    }
    
    // Combine all data
    const result = {
      ...profileData,
      ...additionalData,
      balance,
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