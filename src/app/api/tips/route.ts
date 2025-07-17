import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Get recent tips across all profiles
    const tipsData = await db
      .select()
      .from(tips)
      .orderBy(desc(tips.createdAt))
      .limit(limit);
    
    return NextResponse.json(tipsData);
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
