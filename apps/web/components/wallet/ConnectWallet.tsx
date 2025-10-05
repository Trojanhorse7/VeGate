'use client';

import { WalletButton } from '@vechain/vechain-kit';

export function ConnectWallet() {
  return (
    <WalletButton
      mobileVariant="iconDomainAndAssets"
      desktopVariant="iconDomainAndAssets"
    />
  );
}
