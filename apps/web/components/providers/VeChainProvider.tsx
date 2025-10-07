'use client';

import { DAppKitProvider } from '@vechain/dapp-kit-react';

export function VeChainProvider({ children }: { children: React.ReactNode }) {
  return (
    <DAppKitProvider
      nodeUrl="https://testnet.vechain.org/"
      genesis="test"
      usePersistence
      requireCertificate={false}
      logLevel="DEBUG"
    >
      {children}
    </DAppKitProvider>
  );
}
