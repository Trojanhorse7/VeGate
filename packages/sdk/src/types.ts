export type Network = "main" | "test";

export type BillCategory = "Donation" | "Subscription" | "E-commerce" | "Utility";

export type BillStatus = "unpaid" | "paid" | "expired" | "cancelled";

export type BridgeStatus = "pending" | "confirmed" | "completed" | "failed";

export interface VeGateConfig {
  network: Network;
  contractAddress?: string;
  b3trAddress?: string;
  delegatorUrl?: string;
}

export interface TransactionReceipt {
  txId: string;
  blockNumber: number;
  gasUsed: number;
  success: boolean;
  events: any[];
}
