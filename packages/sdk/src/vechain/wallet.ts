/// <reference path="../global.d.ts" />
import { getVeWorldConnex, formatAddress } from "./connex";

export interface WalletAccount {
  address: string;
  balance: string;
  energy: string;
}

/**
 * @deprecated Use VeChain Kit's <WalletButton /> component instead
 * 
 * VeChain Kit now handles wallet connection. Import and use:
 * ```tsx
 * import { WalletButton, useWallet } from '@vechain/vechain-kit';
 * 
 * function MyComponent() {
 *   const { account, connection } = useWallet();
 *   return <WalletButton />;
 * }
 * ```
 */
export async function connectVeWorld(): Promise<WalletAccount> {
  throw new Error(
    "connectVeWorld() is deprecated. Use VeChain Kit's <WalletButton /> component instead.\n" +
    "Import: import { WalletButton, useWallet } from '@vechain/vechain-kit';"
  );
}

/**
 * @deprecated VeChain Kit handles wallet disconnection automatically
 * 
 * The wallet disconnect is managed by VeChain Kit. No manual storage management needed.
 */
export function disconnectWallet(): void {
  throw new Error(
    "disconnectWallet() is deprecated. VeChain Kit handles wallet disconnection automatically."
  );
}

/**
 * @deprecated VeChain Kit persists wallet connection automatically
 */
export function getStoredWallet(): string | null {
  throw new Error(
    "getStoredWallet() is deprecated. Use VeChain Kit's useWallet() hook:\n" +
    "const { account } = useWallet(); // account.address"
  );
}

/**
 * @deprecated VeChain Kit handles wallet storage automatically
 */
export function storeWallet(address: string): void {
  throw new Error(
    "storeWallet() is deprecated. VeChain Kit handles wallet persistence automatically."
  );
}

/**
 * @deprecated VeChain Kit provides connection status
 */
export function isWalletConnected(): boolean {
  throw new Error(
    "isWalletConnected() is deprecated. Use VeChain Kit's useWallet() hook:\n" +
    "const { connection } = useWallet(); // connection.isConnected"
  );
}

/**
 * Get wallet info
 */
export async function getWalletInfo(
  address: string
): Promise<WalletAccount> {
  const connex = getVeWorldConnex();
  const account = await connex.thor.account(address).get();

  return {
    address,
    balance: account.balance,
    energy: account.energy,
  };
}

/**
 * Format balance for display (VET)
 */
export function formatBalance(balance: string): string {
  const vet = BigInt(balance) / BigInt(10 ** 18);
  return vet.toString();
}

/**
 * Format energy for display (VTHO)
 */
export function formatEnergy(energy: string): string {
  const vtho = BigInt(energy) / BigInt(10 ** 18);
  return vtho.toString();
}

/**
 * Switch network (testnet/mainnet) - requires VeWorld support
 */
export async function switchNetwork(network: "main" | "test"): Promise<void> {
  const connex = getVeWorldConnex();
  
  if (!connex) {
    throw new Error("VeWorld wallet not found");
  }
  
  // Note: Network switching depends on VeWorld implementation
  // This is a placeholder for future functionality
  console.warn(`Network switching to ${network} requested. User must manually switch in VeWorld.`);
}
