import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, restaurants } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    
    // Get restaurant profiles
    let query = db
      .select()
      .from(profiles)
      .where(eq(profiles.category, 'restaurant'))
      .orderBy(desc(profiles.createdAt))
      .limit(limit);
    
    // Add location filtering if provided
    if (city || state) {
      // This would need to be implemented with proper joins
      // For now, return all restaurants
    }
    
    const restaurantProfiles = await query;
    
    // Get additional restaurant data
    const restaurantsWithDetails = await Promise.all(
      restaurantProfiles.map(async (profile) => {
        const restaurantData = await db
          .select()
          .from(restaurants)
          .where(eq(restaurants.id, profile.id))
          .limit(1);
        
        return {
          ...profile,
          ...restaurantData[0],
        };
      })
    );
    
    return NextResponse.json(restaurantsWithDetails);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
