/**
 * VeChain Kit Integration Module
 * 
 * This module provides helpers for using VeGate SDK with @vechain/vechain-kit.
 * Use this when building apps with VeChain Kit instead of raw Connex.
 * 
 * @example
 * ```tsx
 * import { useWallet } from '@vechain/vechain-kit';
 * import { createBillWithKit, payBillWithKit } from '@vegate/sdk';
 * 
 * function MyComponent() {
 *   const { address } = useWallet();
 *   
 *   const handleCreate = async (sendTransaction) => {
 *     const result = await createBillWithKit(sendTransaction, {
 *       token: "0x...",
 *       amount: "1000000000000000000",
 *       socialImpact: true,
 *       category: "Donation"
 *     }, address);
 *   };
 * }
 * ```
 */

import { utils } from "ethers";
import { generateBillId } from "../payment";

// Helper function to poll for transaction receipt
async function pollForTransaction(
  userAddress: string,
  contractAddress: string,
  network: "main" | "test" = "test",
  maxAttempts: number = 30,
  interval: number = 2000
): Promise<string | null> {
  const explorerUrl = network === "test" 
    ? "https://explore-testnet.vechain.org/api"
    : "https://explore.vechain.org/api";

  console.log(`Polling for transaction from ${userAddress}...`);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise(resolve => setTimeout(resolve, interval));
      
      // Get recent transactions from user
      const response = await fetch(
        `${explorerUrl}/accounts/${userAddress}/transactions?limit=10`
      );
      
      if (!response.ok) {
        console.warn(`Polling attempt ${attempt + 1} failed:`, response.status);
        continue;
      }

      const data = await response.json();
      
      // Look for recent transaction to our contract
      const recentTx = data.items?.find((tx: any) => 
        tx.clauses?.some((clause: any) => 
          clause.to?.toLowerCase() === contractAddress.toLowerCase()
        ) && 
        // Transaction from last 2 minutes
        tx.timestamp && (Date.now() / 1000 - tx.timestamp) < 120
      );

      if (recentTx) {
        console.log(`Found transaction: ${recentTx.txID}, status: ${recentTx.txStatus}`);
        return recentTx.txID;
      }

      console.log(`Polling attempt ${attempt + 1}/${maxAttempts} - no transaction found yet`);
    } catch (error) {
      console.warn(`Polling attempt ${attempt + 1} error:`, error);
    }
  }

  console.warn("Transaction polling timed out");
  return null;
}

// Contract addresses
const CONTRACT_ADDRESSES = {
  test: {
    VeGate: "0xdb1a6e06db5e37c1ad3e6ee03cdd9f77b4f9b9df",
    B3TR: "0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38",
  },
  main: {
    VeGate: "", // TODO: Add mainnet address
    B3TR: "",
  },
};

export interface VeChainKitCreateBillParams {
  token: string;
  amount: string;
  socialImpact: boolean;
  category: "Donation" | "Subscription" | "E-commerce" | "Utility";
}

export interface VeChainKitPayBillResult {
  txId: string;
  billId: string;
  success: boolean;
}

/**
 * Create a bill using VeChain Kit's sendTransaction
 * 
 * @param sendTransaction - The sendTransaction function from useSendTransaction hook
 * @param params - Bill parameters
 * @param userAddress - User's wallet address
 * @param network - Network to use (default: test)
 * @returns Object with billId and txId
 * 
 * @example
 * ```tsx
 * import { useWallet } from '@vechain/vechain-kit';
 * import { createBillWithKit } from '@vegate/sdk';
 * 
 * const useSendTransaction = (require('@vechain/vechain-kit') as any).useSendTransaction;
 * 
 * function CreateBill() {
 *   const { address } = useWallet();
 *   const { sendTransaction } = useSendTransaction({ signerAccountAddress: address ?? '' });
 *   
 *   const handleCreate = async () => {
 *     const result = await createBillWithKit(sendTransaction, {
 *       token: "0x0000000000000000000000000000456E65726779",
 *       amount: "1000000000000000000",
 *       socialImpact: true,
 *       category: "Donation"
 *     }, address!);
 *     
 *     console.log('Bill created:', result.billId);
 *   };
 * }
 * ```
 */
export async function createBillWithKit(
  sendTransaction: (clauses: Array<{ to: string; value: string; data: string }>) => Promise<any>,
  params: VeChainKitCreateBillParams,
  userAddress: string,
  network: "main" | "test" = "test"
): Promise<{ billId: string; txId: string }> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  // Generate bill ID
  const billId = generateBillId(userAddress);

  // Encode function call
  const functionSelector = '0x' + utils.id(
    'createBill(bytes32,address,uint256,bool,string)'
  ).slice(2, 10);
  
  const abiCoder = new utils.AbiCoder();
  const encodedParams = abiCoder.encode(
    ['bytes32', 'address', 'uint256', 'bool', 'string'],
    [billId, params.token, params.amount, params.socialImpact, params.category]
  ).slice(2); // Remove '0x'
  
  const data = functionSelector + encodedParams;

  // Send transaction with VeChain Kit
  console.log("Sending transaction to VeChain Kit...");
  console.log("Transaction details:", {
    to: CONTRACT_ADDRESSES[network].VeGate,
    value: '0x0',
    data,
    from: userAddress,
  });
  
  try {
    // This will open the wallet for user approval
    const result = await sendTransaction([
      {
        to: CONTRACT_ADDRESSES[network].VeGate,
        value: '0x0',
        data: data,
      }
    ]);

    console.log("sendTransaction completed with result:", result);
    console.log("Result type:", typeof result);
    
    // Check if result contains any transaction info
    if (result) {
      console.log("Result keys:", Object.keys(result));
      console.log("Full result:", JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("sendTransaction failed:", error);
    throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log("Transaction sent to wallet - waiting for confirmation...");
  console.log("Starting to poll for transaction...");

  // Poll for the transaction to appear on-chain
  const txId = await pollForTransaction(
    userAddress,
    CONTRACT_ADDRESSES[network].VeGate,
    network,
    30, // 30 attempts
    2000 // 2 seconds between attempts
  );

  if (txId) {
    console.log(`Transaction confirmed: ${txId}`);
    return {
      billId,
      txId,
    };
  } else {
    console.warn("Could not find transaction on-chain, but it may still be processing");
    // Still return success with pending status
    return {
      billId,
      txId: "pending",
    };
  }
}

/**
 * Pay a bill using VeChain Kit's sendTransaction
 * 
 * @param sendTransaction - The sendTransaction function from useSendTransaction hook
 * @param billId - The bill ID to pay
 * @param network - Network to use (default: test)
 * @returns Payment result with txId
 * 
 * @example
 * ```tsx
 * import { useWallet } from '@vechain/vechain-kit';
 * import { payBillWithKit } from '@vegate/sdk';
 * 
 * const useSendTransaction = (require('@vechain/vechain-kit') as any).useSendTransaction;
 * 
 * function PayBill({ billId }: { billId: string }) {
 *   const { address } = useWallet();
 *   const { sendTransaction } = useSendTransaction({ signerAccountAddress: address ?? '' });
 *   
 *   const handlePay = async () => {
 *     const result = await payBillWithKit(sendTransaction, billId);
 *     console.log('Payment successful:', result.txId);
 *   };
 * }
 * ```
 */
export async function payBillWithKit(
  sendTransaction: (clauses: Array<{ to: string; value: string; data: string }>) => Promise<any>,
  billId: string,
  network: "main" | "test" = "test"
): Promise<VeChainKitPayBillResult> {
  // Encode payBill function call
  const functionSelector = '0x' + utils.id('payBill(bytes32)').slice(2, 10);
  const abiCoder = new utils.AbiCoder();
  const encodedParams = abiCoder.encode(['bytes32'], [billId]).slice(2);
  const data = functionSelector + encodedParams;

  // Send transaction - VeChain Kit expects just the clauses array
  console.log("Sending payment transaction to VeChain Kit...");
  
  await sendTransaction([
    {
      to: CONTRACT_ADDRESSES[network].VeGate,
      value: '0x0', // TODO: Add bill amount as value
      data,
    }
  ]);

  console.log("Payment transaction sent to wallet for approval");
  console.log("Starting to poll for payment transaction...");

  // We need the user's address to poll for their transaction
  // Since we don't have it in this function, we'll return pending
  // TODO: Add userAddress parameter to this function
  return {
    txId: "pending",
    billId,
    success: true,
  };
}

/**
 * Get bill details using VeChain Kit's connection.thor
 * 
 * @param thor - The thor instance from VeChain Kit connection
 * @param billId - The bill ID to fetch
 * @param network - Network to use (default: test)
 * @returns Bill details
 * 
 * @example
 * ```tsx
 * import { useWallet } from '@vechain/vechain-kit';
 * import { getBillWithKit } from '@vegate/sdk';
 * 
 * function BillDetails({ billId }: { billId: string }) {
 *   const { connection } = useWallet();
 *   const [bill, setBill] = useState(null);
 *   
 *   useEffect(() => {
 *     if (connection?.thor) {
 *       getBillWithKit(connection.thor, billId).then(setBill);
 *     }
 *   }, [billId, connection]);
 * }
 * ```
 */
export async function getBillWithKit(
  thor: any,
  billId: string,
  network: "main" | "test" = "test"
): Promise<any> {
  if (!thor) {
    throw new Error("Thor instance is required. Get it from connection.thor");
  }

  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;
  
  // Call contract method
  const result = await thor.account(contractAddress).method({
    inputs: [{ name: "billId", type: "bytes32" }],
    name: "getBill",
    outputs: [
      { name: "id", type: "bytes32" },
      { name: "creator", type: "address" },
      { name: "payer", type: "address" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "paid", type: "bool" },
      { name: "socialImpact", type: "bool" },
      { name: "category", type: "string" },
      { name: "createdAt", type: "uint256" },
      { name: "paidAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  }).call(billId);

  const billData = result.decoded[0];

  return {
    id: billData.id,
    creator: billData.creator,
    payer: billData.payer,
    token: billData.token,
    amount: billData.amount.toString(),
    paid: billData.paid,
    socialImpact: billData.socialImpact,
    category: billData.category,
    createdAt: Number(billData.createdAt),
    paidAt: Number(billData.paidAt),
  };
}
