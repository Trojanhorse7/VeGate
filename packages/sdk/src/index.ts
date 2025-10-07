/**
 * VeGate SDK - Gasless payments on VeChainThor
 * @packageDocumentation
 */

// VeChain Integration (DAppKit)
export * from "./vechain/contracts";
export * from "./vechain/dappkit-helpers";

// Payment Module
export * from "./payment";

// QR Code Tools
export * from "./qr";

// Rewards Module
export * from "./rewards";

// WanBridge Cross-Chain Payments (Pay with ETH, BTC, USDT, etc.)
export * from "./wanbridge/wanbridge-api";
export * from "./wanbridge/bridge";

// Analytics
export * from "./analytics";

// Types
export * from "./types";

// Version
export const VERSION = "1.0.0";
export const SDK_NAME = "VeGate SDK";
