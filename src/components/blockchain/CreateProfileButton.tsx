'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Store, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Wallet
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useKeylessAccount } from '@/hooks/useKeylessAccount';
import { tippingService } from '@/lib/contracts/tipping-service';
import { useCreateBlockchainProfile } from '@/hooks/useCreateProfile';
import { toast } from 'sonner';

interface CreateProfileButtonProps {
  profileType: 'restaurant' | 'creator';
  walletAddress: string;
  profileData: {
    name: string;
    bio: string;
    imageUrl?: string;
    bannerUrl?: string;
    // Restaurant-specific fields
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    website?: string;
    hours?: Record<string, string>;
    tags?: string[];
    // Creator-specific fields
    followers?: number;
    portfolioImages?: string[];
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
      website?: string;
    };
  };
  onSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function CreateProfileButton({
  profileType,
  walletAddress,
  profileData,
  onSuccess,
  onError,
  className = ''
}: CreateProfileButtonProps) {
  const router = useRouter();
  const { account, isAuthenticated } = useKeylessAccount();
  const createBlockchainProfile = useCreateBlockchainProfile();
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState<'idle' | 'validating' | 'creating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [blockchainProfileExists, setBlockchainProfileExists] = useState<boolean | null>(null);

  // Check if blockchain profile already exists when account is available
  useEffect(() => {
    const checkBlockchainProfile = async () => {
      if (account && walletAddress) {
        try {
          const exists = await tippingService.profileExists(walletAddress);
          setBlockchainProfileExists(exists);
        } catch (error) {
          console.error('Error checking blockchain profile:', error);
          setBlockchainProfileExists(false);
        }
      }
    };

    checkBlockchainProfile();
  }, [account, walletAddress]);

  const handleCreateProfile = async () => {
    if (!walletAddress) {
      setError('Wallet address is required');
      onError?.('Wallet address is required');
      return;
    }

    if (!isAuthenticated || !account) {
      setError('Authentication required. Please sign in with Google.');
      onError?.('Authentication required');
      return;
    }

    setIsCreating(true);
    setStep('validating');
    setError('');

    try {
      // Step 1: Validate profile data
      if (!profileData.name.trim()) {
        throw new Error('Profile name is required');
      }
      if (!profileData.bio.trim()) {
        throw new Error('Profile bio is required');
      }

      setStep('creating');

      // Step 2: Create profile in database first
      const databaseResponse = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          profileType,
          ...profileData,
        }),
      });

      if (!databaseResponse.ok) {
        const errorData = await databaseResponse.json();
        throw new Error(errorData.error || 'Failed to create profile in database');
      }

      const { slug } = await databaseResponse.json();

      // Step 3: Create blockchain profile if it doesn't already exist
      let txHash: string | null = null;
      if (blockchainProfileExists === false) {
        console.log('Creating blockchain profile...');
        txHash = await createBlockchainProfile.mutateAsync({
          account,
          profileType
        });
      } else if (blockchainProfileExists === true) {
        console.log('Blockchain profile already exists');
        txHash = 'Profile already exists on blockchain';
      }

      setStep('success');
      toast.success('Profile created successfully!', {
        description: `Your ${profileType} profile is now live on AptoTip.`,
      });

      onSuccess?.(txHash || 'Database profile created');

      // Redirect to profile page after a short delay
      setTimeout(() => {
        const route = profileType === 'restaurant' ? `/restaurants/${slug}` : `/creators/${slug}`;
        router.push(route);
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      console.error('Profile creation error:', err);
      
      setError(errorMessage);
      setStep('error');
      
      toast.error('Failed to create profile', {
        description: errorMessage,
      });
      
      onError?.(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'validating':
        return (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Validating profile data...</span>
          </div>
        );
      
      case 'creating':
        return (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              {blockchainProfileExists === false 
                ? 'Creating profile on blockchain...' 
                : 'Creating profile...'
              }
            </span>
          </div>
        );
      
      case 'success':
        return (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Profile created successfully!</span>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Failed to create profile</span>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center space-x-2">
            {profileType === 'restaurant' ? (
              <Store className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span>Create {profileType} Profile</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        );
    }
  };

  const isDisabled = isCreating || !walletAddress || !profileData.name.trim() || !profileData.bio.trim() || !isAuthenticated;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Wallet Address Display */}
      {walletAddress && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Wallet Address:</span>
              <span className="text-sm text-green-700 font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blockchain Profile Status */}
      {blockchainProfileExists !== null && (
        <Card className={blockchainProfileExists ? "border-blue-200 bg-blue-50" : "border-yellow-200 bg-yellow-50"}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {blockchainProfileExists ? (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {blockchainProfileExists 
                  ? 'Blockchain profile already exists' 
                  : 'Blockchain profile will be created'
                }
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {blockchainProfileExists 
                ? 'Your profile is already registered on the Aptos blockchain.'
                : 'Your profile will be registered on the Aptos blockchain for secure tipping.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Authentication Status */}
      {!isAuthenticated && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in with Google to create your profile on the blockchain.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Display */}
      {step === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Profile Created Successfully!</h4>
                  <p className="text-sm text-green-700">
                    Your {profileType} profile is now live on AptoTip.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Button */}
      <Button
        onClick={handleCreateProfile}
        disabled={isDisabled}
        className={`w-full h-12 text-lg font-medium transition-all duration-300 ${
          step === 'success' 
            ? 'bg-green-600 hover:bg-green-700' 
            : profileType === 'restaurant'
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-purple-600 hover:bg-purple-700'
        } ${isCreating ? 'cursor-not-allowed' : ''}`}
      >
        {isCreating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            {getStepContent()}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            {getStepContent()}
          </motion.div>
        )}
      </Button>

      {/* Loading Progress */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm text-gray-600">
            <span>Creating your profile...</span>
            <span>{step === 'validating' ? '25%' : step === 'creating' ? '75%' : '100%'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                step === 'validating' ? 'bg-blue-500' : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ 
                width: step === 'validating' ? '25%' : step === 'creating' ? '75%' : '100%' 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-800">What happens next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your profile will be created in our database</li>
                {blockchainProfileExists === false && (
                  <li>• Your profile will be registered on the Aptos blockchain</li>
                )}
                <li>• You'll be redirected to your new profile page</li>
                <li>• Start receiving tips from supporters worldwide</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 