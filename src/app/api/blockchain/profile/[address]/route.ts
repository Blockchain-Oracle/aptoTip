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
    
    const profile = await tippingService.getProfile(address);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found on blockchain' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
    
  } catch (error) {
    console.error('Error fetching blockchain profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 