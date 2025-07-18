import { 
  Account, 
  Aptos, 
  AptosConfig, 
  Network,
  KeylessAccount,
  EphemeralKeyPair
} from '@aptos-labs/ts-sdk';

// Initialize Aptos client
const config = new AptosConfig({ 
  network: process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET 
});
const aptos = new Aptos(config);

/**
 * Create a KeylessAccount from a Google ID token (JWT) using the SIMPLE approach
 * This follows the official Aptos documentation pattern
 */
export async function createKeylessAccount(googleIdToken: string, ephemeralKeyPair: EphemeralKeyPair): Promise<KeylessAccount> {
  try {
    console.log('Creating keyless account with JWT and ephemeral key pair...');
    
    // Use the simple deriveKeylessAccount method from the official docs
    const keylessAccount = await aptos.deriveKeylessAccount({
      jwt: googleIdToken,
      ephemeralKeyPair: ephemeralKeyPair,
    });
    
    console.log('Keyless account created successfully:', keylessAccount.accountAddress.toString());
    return keylessAccount;
  } catch (error) {
    console.error('Error creating keyless account:', error);
    throw new Error(`Failed to create keyless account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Store keyless account in localStorage
 * Following Aptos documentation patterns
 */
export function storeKeylessAccount(account: KeylessAccount): void {
  try {
    const encodedAccount = encodeKeylessAccount(account);
    localStorage.setItem('@aptos/keyless-account', encodedAccount);
  } catch (error) {
    console.error('Error storing keyless account:', error);
  }
}

/**
 * Encode keyless account for storage
 */
export function encodeKeylessAccount(account: KeylessAccount): string {
  return JSON.stringify(account, (_, value) => {
    if (typeof value === 'bigint') {
      return { __type: 'bigint', value: value.toString() };
    }
    if (value instanceof Uint8Array) {
      return { __type: 'Uint8Array', value: Array.from(value) };
    }
    if (value instanceof KeylessAccount) {
      return { __type: 'KeylessAccount', data: value.bcsToBytes() };
    }
    return value;
  });
}

/**
 * Retrieve keyless account from localStorage
 */
export function getLocalKeylessAccount(): KeylessAccount | undefined {
  try {
    const encodedAccount = localStorage.getItem('@aptos/keyless-account');
    if (!encodedAccount) return undefined;
    
    return decodeKeylessAccount(encodedAccount);
  } catch (error) {
    console.warn('Failed to decode account from localStorage:', error);
    return undefined;
  }
}

/**
 * Decode keyless account from storage
 */
export function decodeKeylessAccount(encodedAccount: string): KeylessAccount {
  return JSON.parse(encodedAccount, (_, value) => {
    if (value && value.__type === 'bigint') {
      return BigInt(value.value);
    }
    if (value && value.__type === 'Uint8Array') {
      return new Uint8Array(value.value);
    }
    if (value && value.__type === 'KeylessAccount') {
      return KeylessAccount.fromBytes(value.data);
    }
    return value;
  });
}

/**
 * Clear stored keyless account
 */
export function clearKeylessAccount(): void {
  try {
    localStorage.removeItem('@aptos/keyless-account');
  } catch (error) {
    console.error('Error clearing keyless account:', error);
  }
}

/**
 * Check if user has a stored keyless account
 */
export function hasStoredKeylessAccount(): boolean {
  try {
    return !!localStorage.getItem('@aptos/keyless-account');
  } catch (error) {
    return false;
  }
}

/**
 * Get account address from keyless account
 */
export function getKeylessAddress(account: KeylessAccount): string {
  return account.accountAddress.toString();
}

/**
 * Validate if a keyless account is still valid
 */
export function isKeylessAccountValid(account: KeylessAccount): boolean {
  try {
    // Basic validation - check if account has required properties
    return !!(
      account.accountAddress &&
      account.publicKey
    );
  } catch (error) {
    return false;
  }
}

/**
 * Create a new ephemeral key pair for authentication
 */
export async function createEphemeralKeyPair(): Promise<EphemeralKeyPair> {
  return await EphemeralKeyPair.generate();
}

/**
 * Store ephemeral key pair in localStorage
 */
export function storeEphemeralKeyPair(ekp: EphemeralKeyPair): void {
  try {
    localStorage.setItem('@aptos/ekp', encodeEphemeralKeyPair(ekp));
  } catch (error) {
    console.error('Error storing ephemeral key pair:', error);
  }
}

/**
 * Retrieve ephemeral key pair from localStorage
 */
export function getLocalEphemeralKeyPair(): EphemeralKeyPair | undefined {
  try {
    const encodedEkp = localStorage.getItem('@aptos/ekp');
    return encodedEkp ? decodeEphemeralKeyPair(encodedEkp) : undefined;
  } catch (error) {
    console.warn('Failed to decode ephemeral key pair from localStorage:', error);
    return undefined;
  }
}

/**
 * Encode ephemeral key pair for storage
 */
export function encodeEphemeralKeyPair(ekp: EphemeralKeyPair): string {
  return JSON.stringify(ekp, (_, value) => {
    if (typeof value === 'bigint') {
      return { __type: 'bigint', value: value.toString() };
    }
    if (value instanceof Uint8Array) {
      return { __type: 'Uint8Array', value: Array.from(value) };
    }
    if (value instanceof EphemeralKeyPair) {
      return { __type: 'EphemeralKeyPair', data: ekp.bcsToBytes() };
    }
    return value;
  });
}

/**
 * Decode ephemeral key pair from storage
 */
export function decodeEphemeralKeyPair(encodedEkp: string): EphemeralKeyPair {
  return JSON.parse(encodedEkp, (_, value) => {
    if (value && value.__type === 'bigint') {
      return BigInt(value.value);
    }
    if (value && value.__type === 'Uint8Array') {
      return new Uint8Array(value.value);
    }
    if (value && value.__type === 'EphemeralKeyPair') {
      return EphemeralKeyPair.fromBytes(value.data);
    }
    return value;
  });
}

/**
 * Get the authentication URL for Google OAuth
 */
export function getGoogleAuthUrl(ephemeralKeyPair: EphemeralKeyPair, clientId: string, redirectUri: string): string {
  const nonce = ephemeralKeyPair.nonce;
  
  const params = new URLSearchParams({
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: nonce,
    redirect_uri: redirectUri,
    client_id: clientId,
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Parse JWT token from URL fragment
 */
export function parseJWTFromURL(url: string): string | null {
  try {
    const urlObject = new URL(url);
    const fragment = urlObject.hash.substring(1);
    const params = new URLSearchParams(fragment);
    return params.get('id_token');
  } catch (error) {
    console.error('Error parsing JWT from URL:', error);
    return null;
  }
}

/**
 * Validate JWT token and extract nonce
 */
export function validateJWTAndGetNonce(jwt: string): string | null {
  try {
    // Decode JWT payload (this is a simplified version)
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return payload.nonce || null;
  } catch (error) {
    console.error('Error validating JWT:', error);
    return null;
  }
}

/**
 * Complete keyless authentication flow using the simple approach
 */
export async function authenticateWithGoogle(
  googleIdToken: string, 
  ephemeralKeyPair: EphemeralKeyPair
): Promise<KeylessAccount> {
  try {
    console.log('Starting keyless authentication...');
    
    // Validate the JWT nonce matches the ephemeral key pair
    const jwtNonce = validateJWTAndGetNonce(googleIdToken);
    if (!jwtNonce || jwtNonce !== ephemeralKeyPair.nonce) {
      throw new Error('Invalid nonce in JWT token');
    }
    
    // Check if ephemeral key pair is expired
    if (ephemeralKeyPair.isExpired()) {
      throw new Error('Ephemeral key pair has expired');
    }
    
    // Create keyless account using the simple approach
    const keylessAccount = await createKeylessAccount(googleIdToken, ephemeralKeyPair);
    
    // Store the account
    storeKeylessAccount(keylessAccount);
    
    console.log('Keyless authentication completed successfully');
    return keylessAccount;
  } catch (error) {
    console.error('Error in keyless authentication:', error);
    throw error;
  }
}

/**
 * Sign and submit a transaction using keyless account
 */
export async function signAndSubmitTransaction(
  keylessAccount: KeylessAccount,
  transaction: any
): Promise<string> {
  try {
    const pendingTransaction = await aptos.signAndSubmitTransaction({
      signer: keylessAccount,
      transaction: transaction,
    });
    
    // Wait for transaction confirmation
    const result = await aptos.waitForTransaction({ 
      transactionHash: pendingTransaction.hash 
    });
    
    return pendingTransaction.hash;
  } catch (error) {
    console.error('Error signing and submitting transaction:', error);
    throw error;
  }
}

/**
 * Get account balance for a keyless account
 */
export async function getAccountBalance(accountAddress: string): Promise<number> {
  try {
    const resources = await aptos.getAccountResources({ accountAddress });
    const coinResource = resources.find((r: any) => r.type.includes('CoinStore'));
    
    if (!coinResource) return 0;
    
    const coinData = coinResource.data as any;
    return coinData?.coin?.value ? parseInt(coinData.coin.value) : 0;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    return 0;
  }
}

/**
 * Check if an account exists on the blockchain
 */
export async function accountExists(accountAddress: string): Promise<boolean> {
  try {
    await aptos.getAccountInfo({ accountAddress });
    return true;
  } catch (error) {
    return false;
  }
}

// Export the Aptos client for use in other modules
export { aptos }; 