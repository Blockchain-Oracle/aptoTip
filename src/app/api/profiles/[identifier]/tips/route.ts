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
    
    const { amount, message, tipperAddress, tipperAccount, blockchainTxHash, skipBlockchain } = body;
    
    console.log('📝 API: Processing tip request:', { 
      identifier, 
      amount, 
      message, 
      tipperAddress, 
      hasTipperAccount: !!tipperAccount, 
      blockchainTxHash, 
      skipBlockchain 
    });
    
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
    
    console.log('📊 API: Found profile:', { 
      profileId, 
      profileSlug, 
      recipientAddress, 
      currentTotalTips: profileData.totalTips,
      currentTipCount: profileData.tipCount 
    });
    
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
        transactionHash: blockchainTxHash || null, // Use provided hash or null
      })
      .returning();
    
    console.log('💾 API: Created tip in database:', { tipId: newTip.id, transactionHash: newTip.transactionHash });
    
    // Send tip on blockchain if tipper account is provided and not skipping
    let finalBlockchainTxHash: string | null = blockchainTxHash;
    if (tipperAccount && !skipBlockchain) {
      try {
        console.log('🔗 API: Sending tip on blockchain...');
        finalBlockchainTxHash = await tippingService.sendTip(
          tipperAccount,
          recipientAddress,
          amount,
          message
        );
        
        // Update tip with transaction hash
        await db
          .update(tips)
          .set({ transactionHash: finalBlockchainTxHash })
          .where(eq(tips.id, newTip.id));
        
        console.log('✅ API: Blockchain transaction successful:', finalBlockchainTxHash);
        
      } catch (error) {
        console.error('❌ API: Failed to send tip on blockchain:', error);
        // Don't fail the request, just log the error
        // The tip is still recorded in the database
      }
    } else if (skipBlockchain) {
      console.log('⏭️ API: Skipping blockchain transaction (already completed)');
    }
    
    // Update profile tip statistics with safe null handling
    const currentTotalTips = profileData.totalTips || 0;
    const currentTipCount = profileData.tipCount || 0;
    const tipAmount = Math.round(amount * 100);
    
    const newTotalTips = currentTotalTips + tipAmount;
    const newTipCount = currentTipCount + 1;
    const newAverageTip = Math.round(newTotalTips / newTipCount);
    
    console.log('📈 API: Updating profile stats:', { 
      currentTotalTips, 
      currentTipCount, 
      tipAmount, 
      newTotalTips, 
      newTipCount, 
      newAverageTip 
    });
    
    await db
      .update(profiles)
      .set({
        totalTips: newTotalTips,
        tipCount: newTipCount,
        averageTip: newAverageTip,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profileId));
    
    console.log('✅ API: Profile stats updated successfully');
    
    // Return the created tip with blockchain info
    const response = {
      ...newTip,
      blockchainTxHash: finalBlockchainTxHash,
      netAmount,
      platformFee,
      message: skipBlockchain 
        ? 'Tip synced from blockchain to database'
        : finalBlockchainTxHash 
          ? 'Tip sent successfully on both database and blockchain'
          : 'Tip recorded in database (blockchain transaction pending)'
    };
    
    console.log('🎉 API: Tip processing complete:', response);
    
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    console.error('❌ API: Error creating tip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 