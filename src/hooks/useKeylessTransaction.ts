import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Account, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { useKeylessAccount } from './useKeylessAccount';

export interface TransactionOptions {
  function: `${string}::${string}::${string}`;
  functionArguments: any[];
  typeArguments?: string[];
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

export function useKeylessTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Initialize Aptos client
  const config = new AptosConfig({ 
    network: process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET 
  });
  const aptos = new Aptos(config);

  const executeTransaction = useCallback(async (
    googleIdToken: string,
    transactionOptions: TransactionOptions
  ): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Import keyless functions
      const { authenticateWithGoogle, getLocalEphemeralKeyPair } = await import('@/lib/keyless');
      
      // Get the stored ephemeral key pair
      const ephemeralKeyPair = getLocalEphemeralKeyPair();
      if (!ephemeralKeyPair) {
        throw new Error('No ephemeral key pair found. Please authenticate again.');
      }

      // Create keyless account using the proper authentication flow
      const keylessAccount = await authenticateWithGoogle(googleIdToken, ephemeralKeyPair);

      // Build transaction
      const transaction = await aptos.transaction.build.simple({
        sender: keylessAccount.accountAddress,
        data: {
          function: transactionOptions.function,
          functionArguments: transactionOptions.functionArguments,
          typeArguments: transactionOptions.typeArguments || [],
        },
      });

      // Sign and submit transaction
      const pendingTransaction = await aptos.signAndSubmitTransaction({
        signer: keylessAccount,
        transaction: transaction,
      });

      // Wait for confirmation
      const result = await aptos.waitForTransaction({ 
        transactionHash: pendingTransaction.hash 
      });

      setIsLoading(false);
      return {
        hash: pendingTransaction.hash,
        success: true,
      };

    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      return {
        hash: '',
        success: false,
        error: errorMessage,
      };
    }
  }, [aptos]);

  // Mutation for React Query integration
  const mutation = useMutation({
    mutationFn: ({ googleIdToken, transactionOptions }: {
      googleIdToken: string;
      transactionOptions: TransactionOptions;
    }) => executeTransaction(googleIdToken, transactionOptions),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['blockchain-profile'] });
        queryClient.invalidateQueries({ queryKey: ['tips'] });
        queryClient.invalidateQueries({ queryKey: ['platform-config'] });
      }
    },
  });

  return {
    executeTransaction,
    mutation,
    isLoading,
    error,
    clearError: () => setError(null),
  };
} 