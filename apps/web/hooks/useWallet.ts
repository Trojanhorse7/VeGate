"use client";

import { useWallet as useVeChainKitWallet } from "@vechain/vechain-kit";

export function useWallet() {
  const { account, connection } = useVeChainKitWallet();

  return {
    address: account?.address || null,
    balance: "0", // VeChain Kit manages balance internally
    energy: "0", // VeChain Kit manages energy internally
    isConnecting: false,
    isConnected: connection.isConnected,
    connect: async () => {}, // Handled by WalletButton
    disconnect: () => {}, // Handled by WalletButton
    refreshBalance: async () => {}, // Not needed with VeChain Kit
  };
}
