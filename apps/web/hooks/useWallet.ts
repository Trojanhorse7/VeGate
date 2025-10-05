"use client";

import { useWallet as useVeChainKitWallet } from "@vechain/vechain-kit";

export function useWallet() {
  const { account, connection } = useVeChainKitWallet();

  // VeChain Kit injects connex into window when wallet is connected
  const getConnex = () => {
    if (typeof window !== 'undefined' && connection.isConnected) {
      return (window as any).connex;
    }
    return null;
  };

  return {
    address: account?.address || null,
    balance: "0", // VeChain Kit manages balance internally
    energy: "0", // VeChain Kit manages energy internally
    isConnecting: false,
    isConnected: connection.isConnected,
    connex: getConnex(), // Expose connex for SDK usage
    connect: async () => {}, // Handled by WalletButton
    disconnect: () => {}, // Handled by WalletButton
    refreshBalance: async () => {}, // Not needed with VeChain Kit
  };
}
