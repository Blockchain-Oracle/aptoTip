import { NextRequest, NextResponse } from 'next/server';
import { tippingService } from '@/lib/contracts/tipping-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    const exists = await tippingService.profileExists(address);
    
    return NextResponse.json(exists);
    
  } catch (error) {
    console.error('Error checking profile existence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 