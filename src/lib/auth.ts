import { NextRequest } from 'next/server';

/**
 * Extract wallet address from request headers
 * The frontend should send this in the Authorization header
 */
export function getWalletAddressFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract wallet address from "Bearer <wallet_address>" format
  const walletAddress = authHeader.substring(7); // Remove "Bearer " prefix
  
  // Basic validation - should be a valid Aptos address
  if (!walletAddress || walletAddress.length < 10) {
    return null;
  }
  
  return walletAddress;
}

/**
 * Validate if a user can edit a profile by checking wallet address
 */
export function canEditProfile(
  profileWalletAddress: string,
  userWalletAddress: string | null
): boolean {
  if (!userWalletAddress) {
    return false;
  }
  
  return profileWalletAddress.toLowerCase() === userWalletAddress.toLowerCase();
} 