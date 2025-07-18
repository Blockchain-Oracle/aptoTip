'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TransactionModal } from './TransactionModal';
import { TransactionOptions } from '@/hooks/useKeylessTransaction';
import { UserPlus, Send, Wallet } from 'lucide-react';

interface CreateProfileButtonProps {
  profileType: 'restaurant' | 'creator';
  onSuccess?: (hash: string) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function CreateProfileButton({ 
  profileType, 
  onSuccess, 
  variant = 'default',
  size = 'default',
  className 
}: CreateProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transactionOptions: TransactionOptions = {
    function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::${process.env.NEXT_PUBLIC_CONTRACT_MODULE}::create_profile`,
    functionArguments: [profileType === 'restaurant' ? 1 : 2],
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        className={className}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Create {profileType} Profile
      </Button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionOptions={transactionOptions}
        title={`Create ${profileType} Profile`}
        description={`Create your ${profileType} profile on the blockchain using your Google account.`}
        successMessage={`Your ${profileType} profile has been created successfully!`}
        onSuccess={onSuccess}
      />
    </>
  );
}

interface SendTipButtonProps {
  recipientAddress: string;
  amount: number;
  message?: string;
  onSuccess?: (hash: string) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function SendTipButton({ 
  recipientAddress, 
  amount, 
  message = '', 
  onSuccess,
  variant = 'default',
  size = 'default',
  className,
  disabled = false
}: SendTipButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transactionOptions: TransactionOptions = {
    function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::${process.env.NEXT_PUBLIC_CONTRACT_MODULE}::send_tip`,
    functionArguments: [
      recipientAddress,
      Math.round(amount * 100000000), // Convert to octas
      message
    ],
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
      >
        <Send className="mr-2 h-4 w-4" />
        Send ${amount.toFixed(2)} Tip
      </Button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionOptions={transactionOptions}
        title="Send Tip"
        description={`Send a tip of $${amount.toFixed(2)} to this creator using your Google account.`}
        successMessage={`Tip of $${amount.toFixed(2)} sent successfully!`}
        onSuccess={onSuccess}
      />
    </>
  );
}

interface WalletInfoButtonProps {
  onShowWallet?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function WalletInfoButton({ 
  onShowWallet,
  variant = 'outline',
  size = 'default',
  className 
}: WalletInfoButtonProps) {
  return (
    <Button
      onClick={onShowWallet}
      variant={variant}
      size={size}
      className={className}
    >
      <Wallet className="mr-2 h-4 w-4" />
      View Wallet
    </Button>
  );
} 