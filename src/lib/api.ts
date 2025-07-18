import { ProfileWithDetails } from '@/hooks/useProfiles';

// Server-side function to fetch profile data
export async function getProfileBySlug(slug: string): Promise<ProfileWithDetails | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/profiles/${slug}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Server-side function to fetch all profiles
export async function getAllProfiles(options?: {
  category?: 'restaurant' | 'creator';
  limit?: number;
}): Promise<ProfileWithDetails[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams();
    if (options?.category) params.append('type', options.category);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const response = await fetch(`${baseUrl}/api/profiles?${params.toString()}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.profiles || [];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
} 