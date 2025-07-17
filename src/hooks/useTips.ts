import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tip } from '@/lib/db/schema';

// Types for API responses
export interface TipWithDetails extends Tip {
  // Additional fields that might come from blockchain
  verified?: boolean;
  blockNumber?: number;
  netAmount?: number;
  platformFee?: number;
  blockchainTxHash?: string;
}

// Fetch tips for a profile
export function useTips(profileId: string) {
  return useQuery({
    queryKey: ['tips', profileId],
    queryFn: async (): Promise<TipWithDetails[]> => {
      const response = await fetch(`/api/profiles/${profileId}/tips`);
      if (!response.ok) {
        throw new Error('Failed to fetch tips');
      }
      return response.json();
    },
    enabled: !!profileId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch all tips across the platform
export function useAllTips(limit?: number) {
  return useQuery({
    queryKey: ['tips', 'all', limit],
    queryFn: async (): Promise<TipWithDetails[]> => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      
      const response = await fetch(`/api/tips?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tips');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Send a tip (mutation)
export function useSendTip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tipData: {
      profileId: string;
      amount: number;
      message?: string;
      tipperAddress: string;
      tipperAccount?: any; // For blockchain integration
    }): Promise<TipWithDetails> => {
      const response = await fetch(`/api/profiles/${tipData.profileId}/tips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send tip');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch tips for this profile
      queryClient.invalidateQueries({ queryKey: ['tips', variables.profileId] });
      
      // Invalidate profile data to update tip counts
      queryClient.invalidateQueries({ queryKey: ['profile', variables.profileId] });
      
      // Invalidate all tips list
      queryClient.invalidateQueries({ queryKey: ['tips', 'all'] });
    },
  });
} 