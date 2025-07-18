import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  idToken: string;
}

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogle = () => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = useCallback((response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        idToken: response.credential,
      };

      setUser(googleUser);
      setIsLoading(false);
    } catch (err: any) {
      setError('Failed to process Google authentication');
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt();
    }
  }, []);

  const signOut = useCallback(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect();
      setUser(null);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    signIn,
    signOut,
    clearError: () => setError(null),
  };
} 