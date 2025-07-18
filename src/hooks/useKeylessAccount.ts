import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  KeylessAccount, 
  EphemeralKeyPair 
} from '@aptos-labs/ts-sdk';
import { 
  createKeylessAccount,
  storeKeylessAccount,
  getLocalKeylessAccount,
  clearKeylessAccount,
  hasStoredKeylessAccount,
  isKeylessAccountValid,
  storeEphemeralKeyPair,
  getLocalEphemeralKeyPair,
  getGoogleAuthUrl,
  parseJWTFromURL,
  authenticateWithGoogle,
  getAccountBalance,
  accountExists
} from '@/lib/keyless';

export interface KeylessAccountState {
  account: KeylessAccount | null;
  ephemeralKeyPair: EphemeralKeyPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  balance: number;
  accountExists: boolean;
}

export function useKeylessAccount() {
  const [state, setState] = useState<KeylessAccountState>({
    account: null,
    ephemeralKeyPair: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    balance: 0,
    accountExists: false,
  });

  const queryClient = useQueryClient();

  // Initialize from localStorage on mount
  useEffect(() => {
    const initializeFromStorage = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Check for stored keyless account
        const storedAccount = getLocalKeylessAccount();
        const storedEphemeralKeyPair = getLocalEphemeralKeyPair();

        if (storedAccount && isKeylessAccountValid(storedAccount)) {
          try {
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Initialization timeout')), 5000)
            );

            // Verify account still exists on blockchain with timeout
            const validationPromise = Promise.all([
              accountExists(storedAccount.accountAddress.toString()),
              getAccountBalance(storedAccount.accountAddress.toString())
            ]);

            const [exists, balance] = await Promise.race([
              validationPromise,
              timeoutPromise
            ]) as [boolean, number];

            setState({
              account: storedAccount,
              ephemeralKeyPair: storedEphemeralKeyPair || null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              balance,
              accountExists: exists,
            });

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['keyless-account'] });
            queryClient.invalidateQueries({ queryKey: ['account-balance'] });
          } catch (networkError) {
            console.warn('Network error during account validation, clearing stored account:', networkError);
            // Clear invalid stored data if network calls fail
            clearKeylessAccount();
            setState({
              account: null,
              ephemeralKeyPair: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              balance: 0,
              accountExists: false,
            });
          }
        } else {
          // Clear invalid stored data
          if (storedAccount) {
            clearKeylessAccount();
          }
          
          setState({
            account: null,
            ephemeralKeyPair: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            balance: 0,
            accountExists: false,
          });
        }
      } catch (error) {
        console.error('Error initializing keyless account:', error);
        setState({
          account: null,
          ephemeralKeyPair: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize account',
          balance: 0,
          accountExists: false,
        });
      }
    };

    initializeFromStorage();
  }, [queryClient]);

  // Query for account balance updates
  const { data: balanceData } = useQuery({
    queryKey: ['account-balance', state.account?.accountAddress.toString()],
    queryFn: async () => {
      if (!state.account) return 0;
      return await getAccountBalance(state.account.accountAddress.toString());
    },
    enabled: !!state.account,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider stale after 10 seconds
  });

  // Update balance when query data changes
  useEffect(() => {
    if (balanceData !== undefined) {
      setState(prev => ({ ...prev, balance: balanceData }));
    }
  }, [balanceData]);

  // Create ephemeral key pair for authentication
  const createAuthSession = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const ephemeralKeyPair = await EphemeralKeyPair.generate();
      storeEphemeralKeyPair(ephemeralKeyPair);

      setState(prev => ({ 
        ...prev, 
        ephemeralKeyPair,
        isLoading: false 
      }));

      return ephemeralKeyPair;
    } catch (error) {
      console.error('Error creating auth session:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to create authentication session' 
      }));
      throw error;
    }
  }, []);

  // Get Google OAuth URL
  const getAuthUrl = useCallback((ephemeralKeyPair: EphemeralKeyPair) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    return getGoogleAuthUrl(ephemeralKeyPair, clientId, redirectUri);
  }, []);

  // Handle OAuth callback
  const handleAuthCallback = useCallback(async (url: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Parse JWT from URL
      const jwt = parseJWTFromURL(url);
      if (!jwt) {
        throw new Error('No JWT token found in URL');
      }

      // Get stored ephemeral key pair
      const ephemeralKeyPair = getLocalEphemeralKeyPair();
      if (!ephemeralKeyPair) {
        throw new Error('No ephemeral key pair found');
      }

      // Authenticate and create keyless account
      const keylessAccount = await authenticateWithGoogle(jwt, ephemeralKeyPair);

      // Get account info
      const balance = await getAccountBalance(keylessAccount.accountAddress.toString());
      const exists = await accountExists(keylessAccount.accountAddress.toString());

      setState({
        account: keylessAccount,
        ephemeralKeyPair,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        balance,
        accountExists: exists,
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['keyless-account'] });
      queryClient.invalidateQueries({ queryKey: ['account-balance'] });

      return keylessAccount;
    } catch (error: any) {
      console.error('Error handling auth callback:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Authentication failed' 
      }));
      throw error;
    }
  }, [queryClient]);

  // Sign out and clear stored data
  const signOut = useCallback(() => {
    clearKeylessAccount();
    setState({
      account: null,
      ephemeralKeyPair: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      balance: 0,
      accountExists: false,
    });

    // Invalidate all related queries
    queryClient.invalidateQueries({ queryKey: ['keyless-account'] });
    queryClient.invalidateQueries({ queryKey: ['account-balance'] });
    queryClient.invalidateQueries({ queryKey: ['tips'] });
    queryClient.invalidateQueries({ queryKey: ['profiles'] });
  }, [queryClient]);

  // Refresh account data
  const refreshAccount = useCallback(async () => {
    if (!state.account) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const balance = await getAccountBalance(state.account.accountAddress.toString());
      const exists = await accountExists(state.account.accountAddress.toString());

      setState(prev => ({ 
        ...prev, 
        balance,
        accountExists: exists,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error refreshing account:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to refresh account data' 
      }));
    }
  }, [state.account]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    createAuthSession,
    getAuthUrl,
    handleAuthCallback,
    signOut,
    refreshAccount,
    clearError,
    
    // Computed values
    accountAddress: state.account?.accountAddress.toString(),
    hasStoredAccount: hasStoredKeylessAccount(),
  };
} 