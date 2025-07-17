import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, tips } from '@/lib/db/schema';
import { tippingService } from '@/lib/contracts/tipping-service';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, walletAddress } = body;
    
    if (!profileId || !walletAddress) {
      return NextResponse.json(
        { error: 'Profile ID and wallet address are required' },
        { status: 400 }
      );
    }
    
    // Sync blockchain data
    const blockchainData = await tippingService.syncBlockchainData(profileId, walletAddress);
    
    if (!blockchainData) {
      return NextResponse.json(
        { error: 'No blockchain data found for this profile' },
        { status: 404 }
      );
    }
    
    const { profile: blockchainProfile, recentTips } = blockchainData;
    
    // Update database with blockchain data
    const updatedProfile = await db
      .update(profiles)
      .set({
        totalTips: Math.round(blockchainProfile.total_tips_received / 100000000 * 100), // Convert from octas to cents
        tipCount: blockchainProfile.tip_count_received,
        averageTip: blockchainProfile.tip_count_received > 0 
          ? Math.round((blockchainProfile.total_tips_received / 100000000 * 100) / blockchainProfile.tip_count_received)
          : 0,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profileId))
      .returning();
    
    return NextResponse.json({
      message: 'Blockchain data synchronized successfully',
      blockchainProfile,
      recentTips,
      updatedProfile: updatedProfile[0]
    });
    
  } catch (error) {
    console.error('Error syncing blockchain data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get platform configuration
export async function GET() {
  try {
    const platformConfig = await tippingService.getPlatformConfig();
    
    if (!platformConfig) {
      return NextResponse.json(
        { error: 'Platform not initialized' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      platformConfig,
      adminAddress: tippingService.getAdminAddress()
    });
    
  } catch (error) {
    console.error('Error fetching platform config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 