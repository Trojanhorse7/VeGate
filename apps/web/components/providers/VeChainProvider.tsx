'use client';

import { VeChainKitProvider } from '@vechain/vechain-kit';


export function VeChainProvider({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      network={{ type: 'test' }}
      feeDelegation={{
        delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/441',
        delegateAllTransactions: false,
      }}
      loginMethods={[
        { method: 'dappkit', gridColumn: 4 },
      ]}
      dappKit={{ allowedWallets: ['veworld'] }}
    >
      {children}
    </VeChainKitProvider>
  );
}
