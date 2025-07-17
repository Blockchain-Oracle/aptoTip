import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Get network from environment, default to devnet for development
const network = (process.env.NEXT_PUBLIC_APTOS_NETWORK as Network) || Network.DEVNET;

// Aptos network configuration with correct 2025 RPC URLs
const aptosConfig = new AptosConfig({
  network,
  fullnode: process.env.NEXT_PUBLIC_APTOS_NODE_URL || getDefaultFullnodeUrl(network),
  faucet: process.env.NEXT_PUBLIC_APTOS_FAUCET_URL || getDefaultFaucetUrl(network),
});

// Helper functions to get correct URLs based on network
function getDefaultFullnodeUrl(network: Network): string {
  switch (network) {
    case Network.MAINNET:
      return 'https://fullnode.mainnet.aptoslabs.com/v1';
    case Network.TESTNET:
      return 'https://fullnode.testnet.aptoslabs.com/v1';
    case Network.DEVNET:
      return 'https://fullnode.devnet.aptoslabs.com/v1';
    default:
      return 'https://fullnode.devnet.aptoslabs.com/v1';
  }
}

function getDefaultFaucetUrl(network: Network): string {
  switch (network) {
    case Network.MAINNET:
      return 'https://faucet.mainnet.aptoslabs.com';
    case Network.TESTNET:
      return 'https://faucet.testnet.aptoslabs.com';
    case Network.DEVNET:
      return 'https://faucet.devnet.aptoslabs.com';
    default:
      return 'https://faucet.devnet.aptoslabs.com';
  }
}

// Create Aptos client instance
export const aptos = new Aptos(aptosConfig);

// Contract configuration
export const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xb9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a',
  module: process.env.NEXT_PUBLIC_CONTRACT_MODULE || 'tipping_system',
  moduleAddress: process.env.NEXT_PUBLIC_MODULE_ADDRESS || '0xb9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a::tipping_system',
} as const;

// Platform configuration
export const PLATFORM_CONFIG = {
  feeRate: parseInt(process.env.NEXT_PUBLIC_PLATFORM_FEE_RATE || '200'), // 2%
  treasury: process.env.NEXT_PUBLIC_PLATFORM_TREASURY || '0xb9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a',
} as const;

// Keyless configuration
export const KEYLESS_CONFIG = {
  pepperServiceUrl: process.env.NEXT_PUBLIC_KEYLESS_PEPPER_SERVICE_URL || 'https://api.keyless.aptoslabs.com/pepper',
  proverServiceUrl: process.env.NEXT_PUBLIC_KEYLESS_PROVER_SERVICE_URL || 'https://api.keyless.aptoslabs.com/prove',
} as const;

// Contract function names
export const CONTRACT_FUNCTIONS = {
  CREATE_PROFILE: `${CONTRACT_CONFIG.moduleAddress}::create_profile`,
  SEND_TIP: `${CONTRACT_CONFIG.moduleAddress}::send_tip`,
  GET_PROFILE: `${CONTRACT_CONFIG.moduleAddress}::get_profile`,
  PROFILE_EXISTS: `${CONTRACT_CONFIG.moduleAddress}::profile_exists`,
  GET_PLATFORM_CONFIG: `${CONTRACT_CONFIG.moduleAddress}::get_platform_config`,
  CALCULATE_TIP_BREAKDOWN: `${CONTRACT_CONFIG.moduleAddress}::calculate_tip_breakdown`,
} as const;

// Profile types
export const PROFILE_TYPES = {
  RESTAURANT: 1,
  CREATOR: 2,
} as const;

// Error codes from contract
export const ERROR_CODES = {
  E_NOT_INITIALIZED: 1,
  E_PROFILE_ALREADY_EXISTS: 2,
  E_PROFILE_NOT_FOUND: 3,
  E_INSUFFICIENT_BALANCE: 4,
  E_INVALID_PROFILE_TYPE: 5,
  E_SYSTEM_PAUSED: 6,
  E_UNAUTHORIZED: 7,
  E_INVALID_AMOUNT: 8,
} as const; 