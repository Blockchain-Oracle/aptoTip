import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { tippingService } from '@/lib/contracts/tipping-service';
import { toast } from 'sonner';

export interface CreateProfileData {
  walletAddress: string;
  profileType: 'restaurant' | 'creator';
  name: string;
  bio: string;
  imageUrl?: string;
  bannerUrl?: string;
  // Restaurant-specific fields
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
  tags?: string[];
  // Creator-specific fields
  followers?: number;
  portfolioImages?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}

export interface CreateProfileResponse {
  id: string;
  slug: string;
  message: string;
}

export function useCreateProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: CreateProfileData): Promise<CreateProfileResponse> => {
      // Step 1: Validate profile data
      if (!profileData.walletAddress) {
        throw new Error('Wallet address is required');
      }
      if (!profileData.name.trim()) {
        throw new Error('Profile name is required');
      }
      if (!profileData.bio.trim()) {
        throw new Error('Profile bio is required');
      }

      // Step 2: Create profile in database first
      const databaseResponse = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!databaseResponse.ok) {
        const errorData = await databaseResponse.json();
        throw new Error(errorData.error || 'Failed to create profile in database');
      }

      return await databaseResponse.json();
    },
    onSuccess: (data, variables) => {
      // Show success toast
      toast.success('Profile created successfully!', {
        description: `Your ${variables.profileType} profile is now live on AptoTip.`,
      });

      // Invalidate and refetch profiles
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profiles', variables.profileType] });

      // Redirect to profile page after a short delay
      setTimeout(() => {
        const route = variables.profileType === 'restaurant' 
          ? `/restaurants/${data.slug}` 
          : `/creators/${data.slug}`;
        router.push(route);
      }, 2000);
    },
    onError: (error: Error) => {
      console.error('Profile creation error:', error);
      
      toast.error('Failed to create profile', {
        description: error.message,
      });
    },
  });
}

// Hook for creating blockchain profile (separate from database creation)
export function useCreateBlockchainProfile() {
  return useMutation({
    mutationFn: async ({ 
      account, 
      profileType 
    }: { 
      account: any; 
      profileType: 'restaurant' | 'creator' 
    }): Promise<string> => {
      if (!account) {
        throw new Error('Keyless account is required');
      }

      // Check if profile already exists on blockchain
      const exists = await tippingService.profileExists(account.accountAddress.toString());
      if (exists) {
        console.log('Profile already exists on blockchain');
        return 'Profile already exists';
      }

      // Create profile on blockchain
      const txHash = await tippingService.createProfileOnChain(account, profileType);
      return txHash;
    },
    onSuccess: (txHash) => {
      toast.success('Blockchain profile created!', {
        description: `Transaction: ${txHash.slice(0, 8)}...${txHash.slice(-8)}`,
      });
    },
    onError: (error: Error) => {
      console.error('Blockchain profile creation error:', error);
      toast.error('Failed to create blockchain profile', {
        description: error.message,
      });
    },
  });
}

// Hook for checking if profile exists
export function useProfileExists(walletAddress: string) {
  return useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!walletAddress) return false;
      return await tippingService.profileExists(walletAddress);
    },
  });
}

// Hook for getting profile from blockchain
export function useGetBlockchainProfile(walletAddress: string) {
  return useMutation({
    mutationFn: async () => {
      if (!walletAddress) return null;
      return await tippingService.getProfile(walletAddress);
    },
  });
} 