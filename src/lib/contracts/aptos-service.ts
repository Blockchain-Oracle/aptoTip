import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export interface ContractBalance {
  address: string;
  balance: number;
  coinType: string;
}

export class AptosService {
  private client: Aptos;
  
  constructor() {
    const config = new AptosConfig({ 
      network: process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET 
    });
    this.client = new Aptos(config);
  }
  
  /**
   * Get account balance for a wallet address
   */
  async getAccountBalance(walletAddress: string): Promise<ContractBalance | null> {
    try {
      const resources = await this.client.getAccountResources({ accountAddress: walletAddress });
      const coinResource = resources.find((r: any) => r.type.includes('CoinStore'));
      
      if (!coinResource) return null;
      
      // Safe access to coin data
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
  }
  
  /**
   * Verify a transaction hash exists and is valid
   */
  async verifyTransaction(transactionHash: string): Promise<boolean> {
    try {
      const transaction = await this.client.getTransactionByHash({ transactionHash });
      return !!transaction;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aptosService = new AptosService(); 