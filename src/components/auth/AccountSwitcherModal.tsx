'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AccountSwitcher } from './AccountSwitcher'

interface AccountSwitcherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentWalletAddress?: string
  requiredWalletAddress?: string
  onSignIn?: () => void
}

export function AccountSwitcherModal({
  open,
  onOpenChange,
  currentWalletAddress,
  requiredWalletAddress,
  onSignIn
}: AccountSwitcherModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Switch Account
          </DialogTitle>
        </DialogHeader>
        
        <AccountSwitcher
          currentWalletAddress={currentWalletAddress}
          requiredWalletAddress={requiredWalletAddress}
          onSignIn={onSignIn}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 