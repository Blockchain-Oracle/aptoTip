import { useQuery } from '@tanstack/react-query';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export interface AccountBalance {
  address: string;
  balance: number;
  coinType: string;
}

export function useAccountBalance(walletAddress: string | null) {
  return useQuery({
    queryKey: ['account-balance', walletAddress],
    queryFn: async (): Promise<AccountBalance | null> => {
      if (!walletAddress) return null;

      const config = new AptosConfig({ 
        network: process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET 
      });
      const aptos = new Aptos(config);

      try {
        const resources = await aptos.getAccountResources({ accountAddress: walletAddress });
        const coinResource = resources.find((r: any) => r.type.includes('CoinStore'));
        
        if (!coinResource) return null;
        
        const coinData = coinResource.data as any;
        const balance = coinData?.coin?.value ? parseInt(coinData.coin.value) : 0;
        
        return {
          address: walletAddress,
          balance,
          coinType: coinResource.type,
        };
      } catch (error) {
        console.error('Error fetching account balance:', error);
        return null;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
} 