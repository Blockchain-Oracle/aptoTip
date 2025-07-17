import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, creators } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const tag = searchParams.get('tag');
    
    // Get creator profiles
    let query = db
      .select()
      .from(profiles)
      .where(eq(profiles.category, 'creator'))
      .orderBy(desc(profiles.createdAt))
      .limit(limit);
    
    const creatorProfiles = await query;
    
    // Get additional creator data
    const creatorsWithDetails = await Promise.all(
      creatorProfiles.map(async (profile) => {
        const creatorData = await db
          .select()
          .from(creators)
          .where(eq(creators.id, profile.id))
          .limit(1);
        
        return {
          ...profile,
          ...creatorData[0],
        };
      })
    );
    
    // Filter by tag if provided
    if (tag) {
      return NextResponse.json(
        creatorsWithDetails.filter(creator => 
          creator.tags?.includes(tag)
        )
      );
    }
    
    return NextResponse.json(creatorsWithDetails);
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
