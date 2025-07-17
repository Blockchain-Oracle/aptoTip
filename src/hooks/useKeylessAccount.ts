import { useState, useEffect } from 'react';
import { KeylessAccount } from '@aptos-labs/ts-sdk';
import { createKeylessAccount, getKeylessAddress } from '@/lib/keyless';

export function useKeylessAccount(googleIdToken: string | null) {
  const [keylessAccount, setKeylessAccount] = useState<KeylessAccount | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!googleIdToken) {
      setKeylessAccount(null);
      setAddress(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    createKeylessAccount(googleIdToken)
      .then((account) => {
        setKeylessAccount(account);
        setAddress(getKeylessAddress(account));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to create keyless account');
        setKeylessAccount(null);
        setAddress(null);
        setLoading(false);
      });
  }, [googleIdToken]);

  return { keylessAccount, address, loading, error };
} 