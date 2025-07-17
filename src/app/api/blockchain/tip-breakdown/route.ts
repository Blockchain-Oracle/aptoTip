import { NextRequest, NextResponse } from 'next/server';
import { tippingService } from '@/lib/contracts/tipping-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') || '0');
    
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }
    
    const breakdown = await tippingService.calculateTipBreakdown(amount);
    
    return NextResponse.json(breakdown);
    
  } catch (error) {
    console.error('Error calculating tip breakdown:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 