/// <reference path="../global.d.ts" />
import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet, SimpleWallet } from "@vechain/connex-driver";

export interface ConnexConfig {
  network: "main" | "test";
  nodeUrl?: string;
}

let connexInstance: Connex | null = null;

/**
 * Initialize Connex instance for VeChain
 */
export async function initializeConnex(
  config: ConnexConfig = { network: "test" }
): Promise<Connex> {
  if (connexInstance) return connexInstance;

  const nodeUrl =
    config.nodeUrl ||
    (config.network === "main"
      ? "https://mainnet.vechain.org"
      : "https://testnet.vechain.org");

  const net = new SimpleNet(nodeUrl);
  const driver = await Driver.connect(net);
  
  connexInstance = new Framework(driver);
  return connexInstance;
}

/**
 * Get existing Connex instance or initialize new one
 */
export function getConnex(): Connex {
  if (!connexInstance) {
    throw new Error("Connex not initialized. Call initializeConnex() first.");
  }
  return connexInstance;
}

/**
 * Check if VeWorld wallet is available (browser extension or VeChain Kit)
 */
export function isVeWorldAvailable(): boolean {
  if (typeof window === "undefined") return false;
  // Check for window.connex (both extension and VeChain Kit inject this)
  // Also check for vechain property which VeChain Kit uses
  return !!(window as any).connex || !!(window as any).vechain;
}

/**
 * Get VeWorld Connex instance (browser only)
 * Now supports both VeChain Kit and browser extension
 */
export function getVeWorldConnex(): Connex {
  if (typeof window === "undefined") {
    throw new Error(
      "Connex only available in browser environment"
    );
  }
  
  // Check for injected connex (VeChain Kit injects this when wallet is connected)
  const connex = (window as any).connex || (window as any).vechain?.connex;
  
  if (!connex) {
    // More helpful error message
    const hasVeChainKit = !!(window as any).vechain;
    if (hasVeChainKit) {
      throw new Error(
        "VeChain wallet not connected. Please click the wallet button in the top right corner to connect your VeWorld wallet."
      );
    } else {
      throw new Error(
        "VeChain not initialized. Please make sure VeChainKitProvider is wrapping your app."
      );
    }
  }
  
  return connex as Connex;
}

/**
 * Get current network
 */
export function getNetwork(connex: Connex): "main" | "test" {
  const genesisId = connex.thor.genesis.id;
  // VeChain mainnet genesis ID
  const mainnetId =
    "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a";
  return genesisId === mainnetId ? "main" : "test";
}

/**
 * Get chain tag
 */
export function getChainTag(connex: Connex): number {
  return connex.thor.genesis.id.startsWith("0x000000008") ? 0x27 : 0x4a;
}

/**
 * Check if address is valid VeChain address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Format VeChain address for display
 */
export function formatAddress(
  address: string,
  short: boolean = true
): string {
  if (!isValidAddress(address)) return address;
  if (short) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
}

/**
 * Get block number
 */
export async function getBlockNumber(connex: Connex): Promise<number> {
  const block = await connex.thor.block().get();
  return block?.number || 0;
}

/**
 * Get account balance (VET)
 */
export async function getBalance(
  connex: Connex,
  address: string
): Promise<string> {
  const account = await connex.thor.account(address).get();
  return account.balance;
}

/**
 * Get account energy (VTHO)
 */
export async function getEnergy(
  connex: Connex,
  address: string
): Promise<string> {
  const account = await connex.thor.account(address).get();
  return account.energy;
}
