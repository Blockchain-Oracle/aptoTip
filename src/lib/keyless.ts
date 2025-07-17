import { KeylessAccount, EphemeralKeyPair, ZeroKnowledgeSig } from '@aptos-labs/ts-sdk';
import { KEYLESS_CONFIG } from './aptos';

async function fetchPepper(jwt: string): Promise<string> {
  const res = await fetch(`${KEYLESS_CONFIG.pepperServiceUrl}?jwt=${encodeURIComponent(jwt)}`);
  if (!res.ok) throw new Error('Failed to fetch pepper');
  const { pepper } = await res.json();
  return pepper;
}

async function fetchProof(jwt: string, ephemeralPublicKey: string, pepper: string): Promise<ZeroKnowledgeSig> {
  const res = await fetch(KEYLESS_CONFIG.proverServiceUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt, ephemeralPublicKey, pepper }),
  });
  if (!res.ok) throw new Error('Failed to fetch proof');
  const proofObj = await res.json();
  // Construct ZeroKnowledgeSig with the full proof object
  return new ZeroKnowledgeSig(proofObj);
}

/**
 * Create a KeylessAccount from a Google ID token (JWT) using the full 2025 Aptos pattern
 */
export async function createKeylessAccount(googleIdToken: string): Promise<KeylessAccount> {
  // 1. Generate ephemeral key pair
  const ephemeralKeyPair = await EphemeralKeyPair.generate();
  // 2. Fetch pepper
  const pepper = await fetchPepper(googleIdToken);
  // 3. Fetch proof (use the public key getter as string)
  const proof = await fetchProof(googleIdToken, ephemeralKeyPair.getPublicKey().toString(), pepper);
  // 4. Create KeylessAccount
  return await KeylessAccount.create({
    jwt: googleIdToken,
    ephemeralKeyPair,
    pepper,
    proof,
  });
}

export function getKeylessAddress(account: KeylessAccount): string {
  return account.accountAddress.toString();
} 