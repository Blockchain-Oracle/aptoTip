import { useQuery } from '@tanstack/react-query';
import { Profile, Restaurant, Creator } from '@/lib/db/schema';

// Types for API responses
export interface ProfileWithDetails extends Profile {
  balance?: number;
  // Restaurant fields
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
  tags?: string[];
  // Creator fields
  followers?: number;
  portfolioImages?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  // Blockchain fields
  blockchainTxHash?: string;
}

export interface ProfilesResponse {
  profiles: ProfileWithDetails[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

// Fetch all profiles
export function useProfiles(options?: {
  category?: 'restaurant' | 'creator';
  limit?: number;
}) {
  return useQuery({
    queryKey: ['profiles', options],
    queryFn: async (): Promise<ProfileWithDetails[]> => {
      const params = new URLSearchParams();
      if (options?.category) params.append('type', options.category);
      if (options?.limit) params.append('limit', options.limit.toString());
      
      const response = await fetch(`/api/profiles?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      const data: ProfilesResponse = await response.json();
      return data.profiles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch single profile by ID or slug
export function useProfile(identifier: string) {
  return useQuery({
    queryKey: ['profile', identifier],
    queryFn: async (): Promise<ProfileWithDetails> => {
      const response = await fetch(`/api/profiles/${identifier}`);
      if (!response.ok) {
        throw new Error('Profile not found');
      }
      return response.json();
    },
    enabled: !!identifier,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch restaurants only
export function useRestaurants(limit?: number) {
  return useProfiles({ category: 'restaurant', limit });
}

// Fetch creators only
export function useCreators(limit?: number) {
  return useProfiles({ category: 'creator', limit });
}

// Fetch restaurants with location filtering
export function useRestaurantsByLocation(city?: string, state?: string, limit?: number) {
  return useQuery({
    queryKey: ['restaurants', 'location', city, state, limit],
    queryFn: async (): Promise<ProfileWithDetails[]> => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/profiles/restaurant?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data: ProfilesResponse = await response.json();
      return data.profiles;
    },
    enabled: !!(city || state),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch creators by tag
export function useCreatorsByTag(tag?: string, limit?: number) {
  return useQuery({
    queryKey: ['creators', 'tag', tag, limit],
    queryFn: async (): Promise<ProfileWithDetails[]> => {
      const params = new URLSearchParams();
      if (tag) params.append('tag', tag);
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/profiles/creator?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch creators');
      }
      const data: ProfilesResponse = await response.json();
      return data.profiles;
    },
    enabled: !!tag,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Type guards
export function isRestaurant(profile: ProfileWithDetails): profile is ProfileWithDetails & Restaurant {
  return profile.category === 'restaurant';
}

export function isCreator(profile: ProfileWithDetails): profile is ProfileWithDetails & Creator {
  return profile.category === 'creator';
} 