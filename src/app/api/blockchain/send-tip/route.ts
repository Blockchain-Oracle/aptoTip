import { NextRequest, NextResponse } from 'next/server';
import { tippingService } from '@/lib/contracts/tipping-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipperAccount, recipientAddress, amount, message } = body;
    
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
    
    return NextResponse.json({
      success: true,
      transactionHash,
      message: 'Tip sent successfully on blockchain'
    });
    
  } catch (error) {
    console.error('Error sending tip on blockchain:', error);
    return NextResponse.json(
      { error: 'Failed to send tip on blockchain' },
      { status: 500 }
    );
  }
} 