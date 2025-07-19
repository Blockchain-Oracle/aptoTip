import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, restaurants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getWalletAddressFromRequest, canEditProfile } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get profile by slug
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.slug, slug))
      .limit(1);

    if (!profile[0]) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if it's a restaurant profile
    if (profile[0].category !== 'restaurant') {
      return NextResponse.json(
        { error: 'Profile is not a restaurant' },
        { status: 400 }
      );
    }

    // Get restaurant details
    const restaurantData = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, profile[0].id))
      .limit(1);

    const restaurantProfile = {
      ...profile[0],
      ...restaurantData[0],
    };

    return NextResponse.json(restaurantProfile);
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Get profile by slug
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.slug, slug))
      .limit(1);

    if (!profile[0]) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if it's a restaurant profile
    if (profile[0].category !== 'restaurant') {
      return NextResponse.json(
        { error: 'Profile is not a restaurant' },
        { status: 400 }
      );
    }

    // Check authentication
    const userWalletAddress = getWalletAddressFromRequest(request);
    if (!canEditProfile(profile[0].walletAddress, userWalletAddress)) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own profile' },
        { status: 403 }
      );
    }

    // Update profile
    await db
      .update(profiles)
      .set({
        name: body.name,
        bio: body.bio,
        category: body.category,
        imageUrl: body.imageUrl,
        bannerUrl: body.bannerUrl,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile[0].id));

    // Update restaurant details
    await db
      .update(restaurants)
      .set({
        address: body.address,
        city: body.city,
        state: body.state,
        phone: body.phone,
        website: body.website,
        hours: body.hours,
        tags: body.tags,
      })
      .where(eq(restaurants.id, profile[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 