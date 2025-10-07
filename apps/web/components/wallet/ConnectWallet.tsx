'use client';

import { useWallet } from '@vechain/dapp-kit-react';
import { Button } from '@/components/ui/button';
import { useWalletModal } from '@vechain/dapp-kit-react';

export function ConnectWallet() {
  const { account } = useWallet();
  const { open } = useWalletModal();

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <Button onClick={open} variant="outline" size="sm">
          Wallet
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={open} size="sm">
      Connect Wallet
    </Button>
  );
}
