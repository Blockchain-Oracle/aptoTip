import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, creators } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getWalletAddressFromRequest, canEditProfile } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Check if it's a creator profile
    if (profile[0].category !== 'creator') {
      return NextResponse.json(
        { error: 'Profile is not a creator' },
        { status: 400 }
      );
    }

    // Get creator details
    const creatorData = await db
      .select()
      .from(creators)
      .where(eq(creators.id, profile[0].id))
      .limit(1);

    const creatorProfile = {
      ...profile[0],
      ...creatorData[0],
    };

    return NextResponse.json(creatorProfile);
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
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

    // Check if it's a creator profile
    if (profile[0].category !== 'creator') {
      return NextResponse.json(
        { error: 'Profile is not a creator' },
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

    // Update creator details
    await db
      .update(creators)
      .set({
        portfolioImages: body.portfolioImages,
        tags: body.tags,
        socialLinks: body.socialLinks,
      })
      .where(eq(creators.id, profile[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating creator profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 