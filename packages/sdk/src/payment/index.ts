import { getVeWorldConnex } from "../vechain/connex";
import { sendTransaction } from "../vechain/transactions";
import { VEGATE_ABI, CONTRACT_ADDRESSES } from "../vechain/contracts";

export interface CreateBillParams {
  token: string;
  amount: string;
  socialImpact?: boolean;
  category?: "Donation" | "Subscription" | "E-commerce" | "Utility";
  expiresIn?: number; // seconds
}

export interface Bill {
  billId: string;
  receiver: string;
  token: string;
  amount: string;
  paid: boolean;
  socialImpact: boolean;
  category: string;
  createdAt: number;
  paidAt: number;
  payer: string;
  b3trReward: string;
  bridgeId: string;
}

export interface PaymentResult {
  txId: string;
  billId: string;
  success: boolean;
  b3trReward: string;
}

/**
 * Generate unique bill ID (short format for URLs, padded to bytes32 for contract)
 */
export function generateBillId(userAddress: string): string {
  const timestamp = Date.now();
  const nonce = Math.floor(Math.random() * 1000000);
  const data = `${userAddress}-${timestamp}-${nonce}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  
  // Use timestamp + hash for shorter, more readable ID (16 chars)
  const shortHash = Math.abs(hash).toString(16);
  const timeHex = timestamp.toString(16);
  const shortId = `${timeHex}${shortHash}`.slice(0, 16);
  
  // Return as bytes32 (padded to 64 chars for contract)
  return `0x${shortId.padStart(64, "0")}`;
}

/**
 * Generate a short hash from the full bill ID using SHA-256
 * Creates an 8-character unique identifier
 */
export async function getShortBillId(fullBillId: string): Promise<string> {
  // Remove 0x prefix
  const cleaned = fullBillId.replace('0x', '');
  
  // Use Web Crypto API for SHA-256 hash (works in both browser and Node.js)
  const encoder = new TextEncoder();
  const data = encoder.encode(cleaned);
  
  let hashHex: string;
  
  // Check if we're in Node.js or browser
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256').update(cleaned).digest('hex');
    hashHex = hash;
  }
  
  return hashHex.slice(0, 8); // 8-character unique hash
}

/**
 * Note: Converting short bill ID back to full requires database lookup
 * The short ID is a one-way hash - store mapping in database
 */
export function getFullBillId(shortBillId: string): string {
  // This function now just formats the shortId for database lookup
  // The actual full bill ID must be retrieved from the database
  return shortBillId;
}

/**
 * Create a new bill
 * 
 * @param params - Bill parameters
 * @param options - Optional connex instance and network (if not provided, will try to get from window.connex)
 * 
 * @example
 * ```tsx
 * import { useWallet, useConnex } from '@vechain/vechain-kit';
 * import { createBill } from '@vegate/sdk';
 * 
 * function CreateBillComponent() {
 *   const { account } = useWallet();
 *   const connex = useConnex();
 *   
 *   const handleCreate = async () => {
 *     if (!account?.address) {
 *       throw new Error("Please connect your wallet first");
 *     }
 *     
 *     const result = await createBill({
 *       token: "0x0000000000000000000000000000456E65726779", // VTHO
 *       amount: "1000000000000000000", // 1 VTHO
 *       socialImpact: true,
 *       category: "Donation"
 *     }, { connex });
 *   };
 * }
 * ```
 */
export async function createBill(
  params: CreateBillParams,
  options?: { connex?: Connex; network?: "main" | "test"; userAddress?: string }
): Promise<{ billId: string; txId: string }> {
  // Get connex from options or fallback to window.connex
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  
  // Get user address from connex if not provided
  const userAddress = options?.userAddress;
  if (!userAddress) {
    throw new Error(
      "User address required. Pass it in options:\n" +
      "createBill(params, { userAddress: account.address, connex })"
    );
  }
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  // Generate bill ID
  const billId = generateBillId(userAddress);

  // Prepare contract call
  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [
        { name: "billId", type: "bytes32" },
        { name: "token", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "socialImpact", type: "bool" },
        { name: "category", type: "string" },
      ],
      name: "createBill",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    });

  const clause = method.asClause(
    billId,
    params.token,
    params.amount,
    params.socialImpact || false,
    params.category || "E-commerce"
  );

  // Send transaction (user will sign in wallet)
  const result = await sendTransaction([clause], {
    comment: "VeGate: Create Bill",
    connex,
  });

  return {
    billId,
    txId: result.txid,
  };
}

/**
 * Pay a bill
 */
export async function payBill(
  billId: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<PaymentResult> {
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  // Get bill details first
  const bill = await getBill(billId, options);
  
  if (bill.paid) {
    throw new Error("Bill already paid");
  }

  // Prepare payment transaction
  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [{ name: "billId", type: "bytes32" }],
      name: "payBill",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    });

  const clause = method.asClause(billId);

  // Send transaction (user will sign in wallet)
  const result = await sendTransaction([clause], {
    comment: `VeGate: Pay Bill ${billId.slice(0, 10)}...`,
    connex,
  });

  // Calculate expected reward
  const baseReward = (BigInt(bill.amount) * BigInt(100)) / BigInt(10000);
  const reward = bill.socialImpact ? baseReward * BigInt(2) : baseReward;

  return {
    txId: result.txid,
    billId,
    success: true,
    b3trReward: reward.toString(),
  };
}

/**
 * Get bill details
 */
export async function getBill(
  billId: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<Bill> {
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [{ name: "billId", type: "bytes32" }],
      name: "getBill",
      outputs: [
        {
          components: [
            { name: "receiver", type: "address" },
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "paid", type: "bool" },
            { name: "socialImpact", type: "bool" },
            { name: "category", type: "string" },
            { name: "createdAt", type: "uint256" },
            { name: "paidAt", type: "uint256" },
            { name: "payer", type: "address" },
            { name: "b3trReward", type: "uint256" },
            { name: "bridgeId", type: "bytes32" },
          ],
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    });

  const result = await method.call(billId);
  const billData = result.decoded[0];

  return {
    billId,
    receiver: billData.receiver,
    token: billData.token,
    amount: billData.amount.toString(),
    paid: billData.paid,
    socialImpact: billData.socialImpact,
    category: billData.category,
    createdAt: Number(billData.createdAt),
    paidAt: Number(billData.paidAt),
    payer: billData.payer,
    b3trReward: billData.b3trReward.toString(),
    bridgeId: billData.bridgeId,
  };
}

/**
 * Get user's created bills
 */
export async function getUserCreatedBills(
  userAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<string[]> {
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [{ name: "user", type: "address" }],
      name: "getUserCreatedBills",
      outputs: [{ name: "", type: "bytes32[]" }],
      stateMutability: "view",
      type: "function",
    });

  const result = await method.call(userAddress);
  return result.decoded[0];
}

/**
 * Get user's paid bills
 */
export async function getUserPaidBills(
  userAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<string[]> {
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [{ name: "user", type: "address" }],
      name: "getUserPaidBills",
      outputs: [{ name: "", type: "bytes32[]" }],
      stateMutability: "view",
      type: "function",
    });

  const result = await method.call(userAddress);
  return result.decoded[0];
}

/**
 * Cancel a bill (only if unpaid)
 */
export async function cancelBill(billId: string): Promise<void> {
  const bill = await getBill(billId);
  
  if (bill.paid) {
    throw new Error("Cannot cancel a paid bill");
  }
  
  // Note: Cancellation logic would need to be added to smart contract
  // For now, we just check if it's cancelable
  throw new Error("Cancellation not yet implemented in smart contract");
}
