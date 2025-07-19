'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useKeylessAccount } from '@/hooks/useKeylessAccount';
import { useKeylessTransaction, TransactionOptions } from '@/hooks/useKeylessTransaction';
import { useAccountBalance } from '@/hooks/useBalance';
import { useProfileExists } from '@/hooks/useBlockchain';
import { 
  ExternalLink, 
  Wallet, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ArrowRight,
  Shield,
  Sparkles,
  Copy,
  X
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionOptions: TransactionOptions;
  title: string;
  description: string;
  successMessage?: string;
  onSuccess?: (hash: string, tipperAddress?: string) => void;
}

export function TransactionModal({
  isOpen,
  onClose,
  transactionOptions,
  title,
  description,
  successMessage = 'Transaction completed successfully!',
  onSuccess,
}: TransactionModalProps) {
  const { account, accountAddress: address, isLoading: keylessLoading, error: keylessError, isAuthenticated, createAuthSession, getAuthUrl } = useKeylessAccount();
  const { mutation, isLoading: transactionLoading, error: transactionError } = useKeylessTransaction();
  const { data: balance } = useAccountBalance(address || null);
  const { data: profileExists } = useProfileExists(address || '');
  
  const [step, setStep] = useState<'auth' | 'confirm' | 'processing' | 'success' | 'error'>('auth');

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('auth');
    }
  }, [isOpen]);

  // Auto-advance to confirm step when user is authenticated
  useEffect(() => {
    if (isAuthenticated && account && !keylessLoading && step === 'auth') {
      setStep('confirm');
    }
  }, [isAuthenticated, account, keylessLoading, step]);

  const handleSignIn = async () => {
    try {
      const ephemeralKeyPair = await createAuthSession();
      const authUrl = getAuthUrl(ephemeralKeyPair);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start authentication:', error);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!account) return;

    setStep('processing');
    
    const result = await mutation.mutateAsync({
      keylessAccount: account,
      transactionOptions,
    });

    if (result.success) {
      setStep('success');
      console.log('🎯 TransactionModal: Transaction successful, calling onSuccess with:', {
        hash: result.hash,
        tipperAddress: address,
        hasAddress: !!address
      });
      onSuccess?.(result.hash, address || undefined);
    } else {
      setStep('error');
    }
  };

  const handleClose = () => {
    if (step === 'processing') return; // Prevent closing during transaction
    onClose();
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatBalance = (bal: number) => `${(bal / 100000000).toFixed(4)} APT`;

  // Dynamic header content based on step
  const getHeaderContent = () => {
    switch (step) {
      case 'auth':
        return {
          title: 'Sign in with Google',
          description: 'Connect your Google account to create a keyless wallet for blockchain transactions.',
          icon: <User className="h-5 w-5" />
        };
      case 'confirm':
        return {
          title: 'Confirm Transaction',
          description: 'Review your wallet details and confirm the transaction.',
          icon: <Wallet className="h-5 w-5" />
        };
      case 'processing':
        return {
          title: 'Processing Transaction',
          description: 'Please wait while we process your transaction on the blockchain...',
          icon: <Loader2 className="h-5 w-5 animate-spin" />
        };
      case 'success':
        return {
          title: 'Transaction Successful!',
          description: successMessage,
          icon: <CheckCircle className="h-5 w-5" />
        };
      case 'error':
        return {
          title: 'Transaction Failed',
          description: transactionError || 'An error occurred while processing your transaction.',
          icon: <AlertCircle className="h-5 w-5" />
        };
      default:
        return {
          title,
          description,
          icon: <Wallet className="h-5 w-5" />
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                {headerContent.icon}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{headerContent.title}</h2>
                <p className="text-sm text-blue-100 mt-1">{headerContent.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              disabled={step === 'processing'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'auth' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step === 'auth' ? '1' : <CheckCircle className="h-4 w-4" />}
              </div>
              <span className={`text-sm font-medium ${step === 'auth' ? 'text-blue-600' : 'text-gray-600'}`}>
                Authenticate
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'confirm' ? 'bg-blue-600 text-white' : step === 'processing' || step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step === 'confirm' ? '2' : step === 'processing' || step === 'success' ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <span className={`text-sm font-medium ${step === 'confirm' ? 'text-blue-600' : step === 'processing' || step === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
                Confirm
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'processing' ? 'bg-blue-600 text-white' : step === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 'success' ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <span className={`text-sm font-medium ${step === 'processing' ? 'text-blue-600' : step === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
                Complete
              </span>
            </div>
          </div>

          {/* Authentication Step */}
          {step === 'auth' && (
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Connect Your Wallet</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sign in with Google to create your keyless wallet
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleSignIn} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={keylessLoading}
              >
                {keylessLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </>
                )}
              </Button>
              
              {keylessError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{keylessError}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Secure blockchain authentication</span>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {step === 'confirm' && account && (
            <div className="space-y-6">
              {/* Wallet Info Card */}
              <Card className="border-2 border-blue-100 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Your Wallet</h4>
                      <p className="text-sm text-gray-600">Keyless Account</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Address:</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatAddress(address || '')}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Balance:</span>
                      <span className="text-sm font-semibold">{formatBalance(balance?.balance || 0)}</span>
                    </div>
                    {profileExists && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profile:</span>
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details Card */}
              <Card className="border-2 border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Transaction Details</h4>
                      <p className="text-sm text-gray-600">Smart contract interaction</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Function:</span>
                      <span className="font-mono text-xs break-all text-right">
                        {transactionOptions.function.split('::').pop()}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-gray-600">Arguments:</span>
                      <span className="font-mono text-xs break-all text-right max-w-[60%]">
                        {JSON.stringify(transactionOptions.functionArguments).slice(0, 50)}...
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleConfirmTransaction} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={transactionLoading}
              >
                {transactionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Transaction
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Transaction</h3>
                <p className="text-gray-600">
                  Please wait while we process your transaction on the blockchain...
                </p>
              </div>
              
              <Progress value={undefined} className="w-full" />
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure blockchain transaction</span>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Transaction Successful!</h3>
                <p className="text-gray-600">{successMessage}</p>
              </div>
              
              <Card className="bg-gray-50 border-2 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transaction Hash:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs break-all">
                        {mutation.data?.hash?.slice(0, 8)}...{mutation.data?.hash?.slice(-6)}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button onClick={onClose} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold">
                Close
              </Button>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Transaction Failed</h3>
                <p className="text-gray-600">
                  {transactionError || 'An error occurred while processing your transaction.'}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('confirm')} 
                  className="flex-1 h-12"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={onClose} 
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 