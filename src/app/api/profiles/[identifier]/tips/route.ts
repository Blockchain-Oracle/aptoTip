import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, tips } from '@/lib/db/schema';
import { tippingService } from '@/lib/contracts/tipping-service';
import { eq, or, desc } from 'drizzle-orm';

// GET - Fetch tips for a profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    
    // First, get the profile to get the ID
    const profile = await db
      .select()
      .from(profiles)
      .where(or(eq(profiles.id, identifier), eq(profiles.slug, identifier)))
      .limit(1);
    
    if (!profile[0]) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const profileId = profile[0].id;
    
    // Get tips for this profile
    const tipsData = await db
      .select()
      .from(tips)
      .where(eq(tips.profileId, profileId))
      .orderBy(desc(tips.createdAt))
      .limit(50); // Limit to last 50 tips
    
    return NextResponse.json(tipsData);
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new tip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    const body = await request.json();
    
    const { amount, message, tipperAddress, tipperAccount } = body;
    
    // Validate required fields
    if (!amount || !tipperAddress) {
      return NextResponse.json(
        { error: 'Amount and tipper address are required' },
        { status: 400 }
      );
    }
    
    // Get the profile
    const profile = await db
      .select()
      .from(profiles)
      .where(or(eq(profiles.id, identifier), eq(profiles.slug, identifier)))
      .limit(1);
    
    if (!profile[0]) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    const profileData = profile[0];
    const profileId = profileData.id;
    const profileSlug = profileData.slug;
    const recipientAddress = profileData.walletAddress;
    
    // Calculate tip breakdown using blockchain view function
    const { netAmount, platformFee } = await tippingService.calculateTipBreakdown(amount);
    
    // Create the tip in database first
    const [newTip] = await db
      .insert(tips)
      .values({
        profileId,
        profileSlug,
        tipperAddress,
        amount: Math.round(amount * 100), // Convert to cents
        message,
        transactionHash: null, // Will be updated when blockchain transaction is confirmed
      })
      .returning();
    
    // Send tip on blockchain if tipper account is provided
    let blockchainTxHash: string | null = null;
    if (tipperAccount) {
      try {
        blockchainTxHash = await tippingService.sendTip(
          tipperAccount,
          recipientAddress,
          amount,
          message
        );
        
        // Update tip with transaction hash
        await db
          .update(tips)
          .set({ transactionHash: blockchainTxHash })
          .where(eq(tips.id, newTip.id));
        
      } catch (error) {
        console.error('Failed to send tip on blockchain:', error);
        // Don't fail the request, just log the error
        // The tip is still recorded in the database
      }
    }
    
    // Update profile tip statistics with safe null handling
    const currentTotalTips = profileData.totalTips || 0;
    const currentTipCount = profileData.tipCount || 0;
    const tipAmount = Math.round(amount * 100);
    
    await db
      .update(profiles)
      .set({
        totalTips: currentTotalTips + tipAmount,
        tipCount: currentTipCount + 1,
        averageTip: Math.round((currentTotalTips + tipAmount) / (currentTipCount + 1)),
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profileId));
    
    // Return the created tip with blockchain info
    return NextResponse.json({
      ...newTip,
      blockchainTxHash,
      netAmount,
      platformFee,
      message: blockchainTxHash 
        ? 'Tip sent successfully on both database and blockchain'
        : 'Tip recorded in database (blockchain transaction pending)'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 