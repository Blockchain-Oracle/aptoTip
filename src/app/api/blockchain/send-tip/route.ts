import { NextRequest, NextResponse } from 'next/server';
import { tippingService } from '@/lib/contracts/tipping-service';
import { db } from '@/lib/db';
import { tips, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipperAccount, recipientAddress, amount, message, profileSlug } = body;
    
    if (!tipperAccount || !recipientAddress || !amount) {
      return NextResponse.json(
        { error: 'Tipper account, recipient address, and amount are required' },
        { status: 400 }
      );
    }
    
    // Send tip on blockchain
    const transactionHash = await tippingService.sendTip(
      tipperAccount,
      recipientAddress,
      amount,
      message || ''
    );
    
    // Find the profile by wallet address to get profileId
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.walletAddress, recipientAddress))
      .limit(1);
    
    if (profile.length > 0) {
      const profileData = profile[0];
      
      // Save tip to database
      const [tip] = await db
        .insert(tips)
        .values({
          profileId: profileData.id,
          profileSlug: profileData.slug,
          tipperAddress: tipperAccount.accountAddress.toString(),
          amount: Math.round(amount * 100), // Convert APT to cents
          message: message || '',
          transactionHash,
        })
        .returning();
      
      // Update profile statistics
      const profileTips = await db
        .select()
        .from(tips)
        .where(eq(tips.profileId, profileData.id));
      
      const totalTips = profileTips.reduce((sum, tip) => sum + tip.amount, 0);
      const tipCount = profileTips.length;
      const averageTip = tipCount > 0 ? Math.round(totalTips / tipCount) : 0;
      
      await db
        .update(profiles)
        .set({
          totalTips,
          tipCount,
          averageTip,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, profileData.id));
      
      console.log(`✅ Tip saved to database: $${(amount).toFixed(2)} to ${profileData.name}`);
    }
    
    return NextResponse.json({
      success: true,
      transactionHash,
      message: 'Tip sent successfully on blockchain and saved to database'
    });
    
  } catch (error) {
    console.error('Error sending tip on blockchain:', error);
    return NextResponse.json(
      { error: 'Failed to send tip on blockchain' },
      { status: 500 }
    );
  }
} 