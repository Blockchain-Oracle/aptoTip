import { Network } from '@aptos-labs/ts-sdk';

// Type for supported networks
type SupportedNetwork = Network.MAINNET | Network.TESTNET | Network.DEVNET;

// Network configuration for AptoTip (only supported networks)
export const NETWORKS: Record<SupportedNetwork, {
  name: string;
  displayName: string;
  fullnodeUrl: string;
  faucetUrl: string;
  explorerUrl: string;
  isProduction: boolean;
  isTestnet: boolean;
}> = {
  [Network.MAINNET]: {
    name: 'Mainnet',
    displayName: 'Aptos Mainnet',
    fullnodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.mainnet.aptoslabs.com',
    explorerUrl: 'https://explorer.aptoslabs.com',
    isProduction: true,
    isTestnet: false,
  },
  [Network.TESTNET]: {
    name: 'Testnet',
    displayName: 'Aptos Testnet',
    fullnodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.testnet.aptoslabs.com',
    explorerUrl: 'https://explorer.aptoslabs.com/account',
    isProduction: false,
    isTestnet: true,
  },
  [Network.DEVNET]: {
    name: 'Devnet',
    displayName: 'Aptos Devnet',
    fullnodeUrl: 'https://fullnode.devnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.devnet.aptoslabs.com',
    explorerUrl: 'https://explorer.aptoslabs.com/account',
    isProduction: false,
    isTestnet: false,
  },
} as const;

// Get current network from environment
export function getCurrentNetwork(): SupportedNetwork {
  const networkEnv = process.env.NEXT_PUBLIC_APTOS_NETWORK;
  
  if (networkEnv === 'mainnet') return Network.MAINNET;
  if (networkEnv === 'testnet') return Network.TESTNET;
  if (networkEnv === 'devnet') return Network.DEVNET;
  
  // Default to devnet for development
  return Network.DEVNET;
}

// Get network configuration with proper type safety
export function getNetworkConfig(network: Network = getCurrentNetwork()) {
  // Only return config for supported networks, fallback to devnet
  if (network === Network.MAINNET || network === Network.TESTNET || network === Network.DEVNET) {
    return NETWORKS[network as SupportedNetwork];
  }
  return NETWORKS[Network.DEVNET];
}

// Check if current network is production
export function isProductionNetwork(): boolean {
  return getNetworkConfig().isProduction;
}

// Check if current network is testnet
export function isTestnetNetwork(): boolean {
  return getNetworkConfig().isTestnet;
}

// Get explorer URL for a transaction or account
export function getExplorerUrl(type: 'transaction' | 'account', hashOrAddress: string): string {
  const config = getNetworkConfig();
  return `${config.explorerUrl}/${type}/${hashOrAddress}`;
}

// Network switching utilities (for future use)
export function getNetworkOptions() {
  return Object.entries(NETWORKS).map(([network, config]) => ({
    value: network,
    label: config.displayName,
    isProduction: config.isProduction,
    isTestnet: config.isTestnet,
  }));
} 