import { 
  Aptos, 
  AptosConfig, 
  Network, 
  Account, 
  Ed25519PrivateKey,
  HexInput
} from '@aptos-labs/ts-sdk';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const MODULE_NAME = process.env.NEXT_PUBLIC_CONTRACT_MODULE!;
const PLATFORM_FEE_RATE = parseInt(process.env.NEXT_PUBLIC_PLATFORM_FEE_RATE || '200');

// Types based on contract events
export interface TipEvent {
  tipper: string;
  recipient: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  timestamp: number;
  message: string;
  tip_id: number;
}

export interface ProfileEvent {
  owner: string;
  profile_type: number; // 1 = restaurant, 2 = creator
  action: string; // "created", "updated", "deactivated"
  timestamp: number;
}

export interface UserProfile {
  owner: string;
  profile_type: number;
  total_tips_received: number;
  total_tips_sent: number;
  tip_count_received: number;
  tip_count_sent: number;
  active: boolean;
  created_at: number;
}

export interface PlatformConfig {
  platform_fee_rate: number;
  platform_treasury: string;
  admin: string;
  paused: boolean;
  total_platform_volume: number;
  total_platform_fees: number;
}

export class TippingService {
  private client: Aptos;
  
  constructor() {
    const config = new AptosConfig({ 
      network: process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET 
    });
    this.client = new Aptos(config);
  }
  
  /**
   * Create a profile on-chain using user's keyless account
   * This requires the user to have a keyless account set up
   * The contract requires the user's signature since profile is created in their account
   */
  async createProfileOnChain(userAccount: Account, profileType: 'restaurant' | 'creator'): Promise<string> {
    try {
      const profileTypeNumber = profileType === 'restaurant' ? 1 : 2;
      
      console.log(`Creating profile for ${userAccount.accountAddress.toString()} with type ${profileType}...`);
      
      // Build transaction using user's account as sender (required by contract)
      const transaction = await this.client.transaction.build.simple({
        sender: userAccount.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::create_profile`,
          functionArguments: [
            profileTypeNumber  // Only pass the profile type
          ]
        }
      });
      
      // Submit transaction using user's account (required by contract)
      const pendingTransaction = await this.client.signAndSubmitTransaction({
        signer: userAccount,
        transaction: transaction,
      });
      
      // Wait for transaction to be confirmed
      const result = await this.client.waitForTransaction({ 
        transactionHash: pendingTransaction.hash 
      });
      
      console.log(`✅ Profile created successfully for ${userAccount.accountAddress.toString()} with type ${profileType}`);
      console.log(`Transaction hash: ${pendingTransaction.hash}`);
      
      return pendingTransaction.hash;
      
    } catch (error) {
      console.error('❌ Error creating profile on-chain:', error);
      throw new Error(`Failed to create profile: ${error}`);
    }
  }
  
  /**
   * Send tip from one account to another
   */
  async sendTip(
    tipperAccount: Account, 
    recipientAddress: string, 
    amount: number, 
    message: string
  ): Promise<string> {
    try {
      console.log(`🎯 Starting tip process...`);
      console.log(`From: ${tipperAccount.accountAddress}`);
      console.log(`To: ${recipientAddress}`);
      console.log(`Amount: ${amount} APT`);
      
      // Ensure both accounts are funded for transaction fees
      await this.ensureAccountFunded(tipperAccount.accountAddress.toString());
      await this.ensureAccountFunded(recipientAddress);
      
      const amountInOctas = Math.round(amount * 100000000);
      
      console.log(`Sending tip: ${amount} APT to ${recipientAddress}...`);
      
      const transaction = await this.client.transaction.build.simple({
        sender: tipperAccount.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_tip`,
          functionArguments: [
            recipientAddress,
            amountInOctas,
            message
          ]
        }
      });
      
      const pendingTransaction = await this.client.signAndSubmitTransaction({
        signer: tipperAccount,
        transaction: transaction,
      });
      
      // Wait for transaction to be confirmed
      const result = await this.client.waitForTransaction({ 
        transactionHash: pendingTransaction.hash 
      });
      
      console.log(`✅ Tip sent successfully: ${amount} APT to ${recipientAddress}`);
      console.log(`Transaction hash: ${pendingTransaction.hash}`);
      
      return pendingTransaction.hash;
      
    } catch (error) {
      console.error('❌ Error sending tip:', error);
      throw new Error(`Failed to send tip: ${error}`);
    }
  }

  /**
   * Ensure an account has sufficient APT for transaction fees
   */
  private async ensureAccountFunded(address: string): Promise<void> {
    try {
      // Check current balance using the correct method
      const resources = await this.client.getAccountResources({ accountAddress: address });
      const coinResource = resources.find((r: any) => r.type.includes('CoinStore'));
      
      let currentBalance = 0;
      if (coinResource) {
        const coinData = coinResource.data as any;
        currentBalance = coinData?.coin?.value ? parseInt(coinData.coin.value) : 0;
      }
      
      const minBalance = 1000000; // 0.01 APT minimum for fees
      
      console.log(`💰 Account ${address} balance: ${currentBalance / 100000000} APT`);
      
      if (currentBalance < minBalance) {
        console.log(`⚠️ Account ${address} needs funding. Current: ${currentBalance / 100000000} APT, Need: ${minBalance / 100000000} APT`);
        
        // Fund the account using faucet
        await this.client.fundAccount({
          accountAddress: address,
          amount: 100000000 // 1 APT
        });
        
        console.log(`✅ Funded account ${address} with 1 APT`);
        
        // Wait a moment for the funding transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(`✅ Account ${address} has sufficient balance`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to check/fund account ${address}:`, error);
      // Continue anyway - the transaction might still work
    }
  }
  
  /**
   * Get user profile from blockchain using view function
   */
  async getProfile(userAddress: string): Promise<UserProfile | null> {
    try {
      const result = await this.client.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_profile`,
          functionArguments: [userAddress],
          typeArguments: []
        }
      });
      
      if (!result || result.length < 8) {
        return null;
      }
      
      return {
        owner: result[0] as string,
        profile_type: parseInt(result[1] as string),
        total_tips_received: parseInt(result[2] as string),
        total_tips_sent: parseInt(result[3] as string),
        tip_count_received: parseInt(result[4] as string),
        tip_count_sent: parseInt(result[5] as string),
        active: result[6] as boolean,
        created_at: parseInt(result[7] as string)
      };
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
  
  /**
   * Check if profile exists using view function
   */
  async profileExists(userAddress: string): Promise<boolean> {
    try {
      const result = await this.client.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::profile_exists`,
          functionArguments: [userAddress],
          typeArguments: []
        }
      });
      
      return result[0] as boolean;
      
    } catch (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
  }
  
  /**
   * Get platform configuration using view function
   */
  async getPlatformConfig(): Promise<PlatformConfig | null> {
    try {
      const result = await this.client.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_platform_config`,
          functionArguments: [],
          typeArguments: []
        }
      });
      
      if (!result || result.length < 5) {
        return null;
      }
      
      return {
        platform_fee_rate: parseInt(result[0] as string),
        platform_treasury: result[1] as string,
        admin: result[2] as string,
        paused: result[3] as boolean,
        total_platform_volume: parseInt(result[4] as string),
        total_platform_fees: parseInt(result[5] as string)
      };
      
    } catch (error) {
      console.error('Error fetching platform config:', error);
      return null;
    }
  }
  
  /**
   * Calculate tip breakdown using view function
   */
  async calculateTipBreakdown(amount: number): Promise<{ netAmount: number; platformFee: number }> {
    try {
      const amountInOctas = Math.round(amount * 100000000);
      
      const result = await this.client.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::calculate_tip_breakdown`,
          functionArguments: [amountInOctas],
          typeArguments: []
        }
      });
      
      if (!result || result.length < 2) {
        // Fallback calculation
        const platformFee = Math.round(amount * PLATFORM_FEE_RATE / 10000);
        const netAmount = amount - platformFee;
        return { netAmount, platformFee };
      }
      
      const netAmount = parseInt(result[0] as string) / 100000000;
      const platformFee = parseInt(result[1] as string) / 100000000;
      
      return { netAmount, platformFee };
      
    } catch (error) {
      console.error('Error calculating tip breakdown:', error);
      // Fallback calculation
      const platformFee = Math.round(amount * PLATFORM_FEE_RATE / 10000);
      const netAmount = amount - platformFee;
      return { netAmount, platformFee };
    }
  }
  
  /**
   * Get tip events from blockchain
   * This fetches recent tip events for a profile
   */
  async getTipEvents(recipientAddress?: string, limit: number = 50): Promise<TipEvent[]> {
    try {
      // For now, return empty array as event fetching needs to be implemented
      // based on the specific Aptos SDK version and API
      console.log('Tip events fetching not yet implemented');
      return [];
      
    } catch (error) {
      console.error('Error fetching tip events:', error);
      return [];
    }
  }
  
  /**
   * Get profile events from blockchain
   */
  async getProfileEvents(ownerAddress?: string, limit: number = 50): Promise<ProfileEvent[]> {
    try {
      // For now, return empty array as event fetching needs to be implemented
      // based on the specific Aptos SDK version and API
      console.log('Profile events fetching not yet implemented');
      return [];
      
    } catch (error) {
      console.error('Error fetching profile events:', error);
      return [];
    }
  }
  
  /**
   * Sync blockchain data with database
   * This ensures our database stays in sync with blockchain state
   */
  async syncBlockchainData(profileId: string, walletAddress: string) {
    try {
      // Get profile from blockchain
      const blockchainProfile = await this.getProfile(walletAddress);
      
      if (!blockchainProfile) {
        console.log(`No blockchain profile found for ${walletAddress}`);
        return null;
      }
      
      // Get recent tips from blockchain
      const tipEvents = await this.getTipEvents(walletAddress, 10);
      
      return {
        profile: blockchainProfile,
        recentTips: tipEvents
      };
      
    } catch (error) {
      console.error('Error syncing blockchain data:', error);
      return null;
    }
  }
}

// Export singleton instance
export const tippingService = new TippingService(); 