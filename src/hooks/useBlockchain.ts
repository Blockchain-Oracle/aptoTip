import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Account } from '@aptos-labs/ts-sdk';

// Types for blockchain data
export interface TipBreakdown {
  netAmount: number;
  platformFee: number;
}

export interface PlatformConfig {
  platform_fee_rate: number;
  platform_treasury: string;
  admin: string;
  paused: boolean;
  total_platform_volume: number;
  total_platform_fees: number;
}

export interface BlockchainProfile {
  owner: string;
  profile_type: number;
  total_tips_received: number;
  total_tips_sent: number;
  tip_count_received: number;
  tip_count_sent: number;
  active: boolean;
  created_at: number;
}

// Calculate tip breakdown (platform fee calculation)
export function useTipBreakdown(amount: number) {
  return useQuery({
    queryKey: ['tip-breakdown', amount],
    queryFn: async (): Promise<TipBreakdown> => {
      const response = await fetch(`/api/blockchain/tip-breakdown?amount=${amount}`);
      if (!response.ok) {
        throw new Error('Failed to calculate tip breakdown');
      }
      return response.json();
    },
    enabled: amount > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get platform configuration
export function usePlatformConfig() {
  return useQuery({
    queryKey: ['platform-config'],
    queryFn: async (): Promise<PlatformConfig> => {
      const response = await fetch('/api/blockchain/sync');
      if (!response.ok) {
        throw new Error('Failed to fetch platform config');
      }
      const data = await response.json();
      return data.platformConfig;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get blockchain profile data
export function useBlockchainProfile(walletAddress: string) {
  return useQuery({
    queryKey: ['blockchain-profile', walletAddress],
    queryFn: async (): Promise<BlockchainProfile | null> => {
      const response = await fetch(`/api/blockchain/profile/${walletAddress}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch blockchain profile');
      }
      return response.json();
    },
    enabled: !!walletAddress,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Send tip on blockchain
export function useSendBlockchainTip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      tipperAccount,
      recipientAddress,
      amount,
      message,
    }: {
      tipperAccount: Account;
      recipientAddress: string;
      amount: number;
      message: string;
    }) => {
      const response = await fetch('/api/blockchain/send-tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipperAccount,
          recipientAddress,
          amount,
          message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send tip on blockchain');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['blockchain-profile', variables.recipientAddress] });
    },
  });
}

// Check if profile exists on blockchain
export function useProfileExists(walletAddress: string) {
  return useQuery({
    queryKey: ['profile-exists', walletAddress],
    queryFn: async (): Promise<boolean> => {
      const response = await fetch(`/api/blockchain/profile/${walletAddress}/exists`);
      if (!response.ok) {
        throw new Error('Failed to check profile existence');
      }
      return response.json();
    },
    enabled: !!walletAddress,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
} 