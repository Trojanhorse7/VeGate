"use client";

import { useWallet as useDAppKitWallet, useConnex } from "@vechain/dapp-kit-react";

export function useWallet() {
  const { account, disconnect } = useDAppKitWallet();
  const connex = useConnex();

  return {
    address: account || null,
    balance: "0", // Balance can be fetched separately if needed
    energy: "0", // Energy can be fetched separately if needed
    isConnecting: false,
    isConnected: !!account && !!connex,
    connection: { isConnected: !!account && !!connex }, 
    connex, // Connex instance from DAppKit
    connect: async () => {}, // Handled by DAppKit modal
    disconnect: disconnect,
    refreshBalance: async () => {}, // Not needed with DAppKit
  };
}
