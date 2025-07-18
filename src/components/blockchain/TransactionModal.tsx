'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useKeylessAccount } from '@/hooks/useKeylessAccount';
import { useKeylessTransaction, TransactionOptions } from '@/hooks/useKeylessTransaction';
import { useAccountBalance } from '@/hooks/useBalance';
import { useProfileExists } from '@/hooks/useBlockchain';
import { ExternalLink, Wallet, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionOptions: TransactionOptions;
  title: string;
  description: string;
  successMessage?: string;
  onSuccess?: (hash: string) => void;
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
  const { user, signIn, signOut } = useGoogleAuth();
  const { account: keylessAccount, accountAddress: address, isLoading: keylessLoading, error: keylessError } = useKeylessAccount();
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
    if (user && keylessAccount && !keylessLoading && step === 'auth') {
      setStep('confirm');
    }
  }, [user, keylessAccount, keylessLoading, step]);

  const handleSignIn = () => {
    signIn();
  };

  const handleConfirmTransaction = async () => {
    if (!user?.idToken) return;

    setStep('processing');
    
    const result = await mutation.mutateAsync({
      googleIdToken: user.idToken,
      transactionOptions,
    });

    if (result.success) {
      setStep('success');
      onSuccess?.(result.hash);
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step Indicator */}
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center gap-2 ${step === 'auth' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {step === 'auth' ? '1' : <CheckCircle className="h-4 w-4" />}
              </div>
              Authenticate
            </div>
            <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {step === 'confirm' ? '2' : step === 'processing' || step === 'success' ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              Confirm
            </div>
            <div className={`flex items-center gap-2 ${step === 'processing' ? 'text-primary' : step === 'success' ? 'text-green-600' : 'text-muted-foreground'}`}>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                {step === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 'success' ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              Complete
            </div>
          </div>

          {/* Authentication Step */}
          {step === 'auth' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sign in with Google</CardTitle>
                <CardDescription>
                  Connect your Google account to create a keyless wallet for blockchain transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSignIn} className="w-full" disabled={keylessLoading}>
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
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {keylessError}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirmation Step */}
          {step === 'confirm' && keylessAccount && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confirm Transaction</CardTitle>
                <CardDescription>
                  Review your wallet details and confirm the transaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Wallet Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Wallet Address:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatAddress(address || '')}</Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Balance:</span>
                    <span className="text-sm font-mono">{formatBalance(balance?.balance || 0)}</span>
                  </div>
                  {profileExists && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Profile Status:</span>
                      <Badge variant="secondary">Profile Exists</Badge>
                    </div>
                  )}
                </div>

                {/* Transaction Details */}
                <div className="border rounded-lg p-3 bg-muted/50">
                  <div className="text-sm font-medium mb-2">Transaction Details:</div>
                  <div className="text-xs font-mono break-all">
                    Function: {transactionOptions.function}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Arguments: {JSON.stringify(transactionOptions.functionArguments)}
                  </div>
                </div>

                <Button 
                  onClick={handleConfirmTransaction} 
                  className="w-full"
                  disabled={transactionLoading}
                >
                  {transactionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Transaction'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <div>
                    <h3 className="font-medium">Processing Transaction</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we process your transaction on the blockchain...
                    </p>
                  </div>
                  <Progress value={undefined} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-medium text-green-600">Transaction Successful!</h3>
                    <p className="text-sm text-muted-foreground">{successMessage}</p>
                  </div>
                  <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                    Hash: {mutation.data?.hash}
                  </div>
                  <Button onClick={onClose} className="w-full">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
                  <div>
                    <h3 className="font-medium text-red-600">Transaction Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      {transactionError || 'An error occurred while processing your transaction.'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('confirm')} className="flex-1">
                      Try Again
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Close
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 