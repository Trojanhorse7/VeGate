import { getVeWorldConnex } from "./connex";
import { createDelegatedTransaction, FeeDelegationOptions } from "./fee-delegation";

export interface TransactionOptions {
  gas?: number;
  gasPriceCoef?: number;
  delegated?: boolean;
  delegationOptions?: FeeDelegationOptions;
  comment?: string;
}

/**
 * Sign and send transaction
 * Works with VeChain Kit - automatically uses connected wallet
 * 
 * @example
 * ```tsx
 * import { useWallet } from '@vechain/vechain-kit';
 * import { sendTransaction } from '@vegate/sdk';
 * 
 * function MyComponent() {
 *   const { account, connection } = useWallet();
 *   const connex = (window as any).connex;
 *   
 *   const handlePay = async () => {
 *     if (!connection.isConnected) {
 *       throw new Error("Please connect your wallet first");
 *     }
 *     
 *     const result = await sendTransaction(clauses, { connex });
 *   };
 * }
 * ```
 */
export async function sendTransaction(
  clauses: Connex.VM.Clause[],
  options: TransactionOptions & { connex?: Connex } = {}
): Promise<Connex.Vendor.TxResponse> {
  const connex = options.connex || getVeWorldConnex();
  
  // Verify Connex is available
  if (!connex) {
    console.error("Connex not available. Window object:", typeof window !== 'undefined' ? {
      hasConnex: !!((window as any).connex),
      connexKeys: (window as any).connex ? Object.keys((window as any).connex) : [],
    } : 'not in browser');
    
    throw new Error(
      "VeWorld wallet not connected. Please connect your wallet first."
    );
  }
  
  console.log("Connex available:", {
    hasVendor: !!connex.vendor,
    hasThor: !!connex.thor,
    vendorKeys: connex.vendor ? Object.keys(connex.vendor) : [],
  });

  const vendor = connex.vendor;
  
  if (!vendor || !vendor.sign) {
    console.error("Vendor or sign method not available:", {
      hasVendor: !!vendor,
      hasSign: vendor ? !!vendor.sign : false,
    });
    throw new Error("Wallet signing interface not available. Please ensure your wallet is properly connected.");
  }

  // Use fee delegation if specified
  if (options.delegated && options.delegationOptions) {
    return createDelegatedTransaction(clauses, options.delegationOptions);
  }

  // Standard transaction signing (works with VeChain Kit)
  const signingService = vendor.sign("tx", clauses);

  if (options.gas) {
    signingService.gas(options.gas);
  }

  if (options.gasPriceCoef) {
    (signingService as any).gasPriceCoef(options.gasPriceCoef);
  }

  if (options.comment) {
    signingService.comment(options.comment);
  }

  const result = await signingService.request();
  return result;
}

/**
 * Wait for transaction receipt
 */
export async function waitForReceipt(
  txId: string,
  maxAttempts: number = 30
): Promise<Connex.Thor.Transaction.Receipt> {
  const connex = getVeWorldConnex();
  
  for (let i = 0; i < maxAttempts; i++) {
    const receipt = await connex.thor.transaction(txId).getReceipt();
    
    if (receipt) {
      return receipt;
    }
    
    // Wait 2 seconds before next attempt
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  
  throw new Error(`Transaction receipt not found after ${maxAttempts} attempts`);
}

/**
 * Get transaction details
 */
export async function getTransaction(
  txId: string
): Promise<Connex.Thor.Transaction | null> {
  const connex = getVeWorldConnex();
  return connex.thor.transaction(txId).get();
}

/**
 * Check transaction status
 */
export async function getTransactionStatus(txId: string): Promise<{
  confirmed: boolean;
  reverted: boolean;
  receipt: Connex.Thor.Transaction.Receipt | null;
}> {
  const connex = getVeWorldConnex();
  const receipt = await connex.thor.transaction(txId).getReceipt();
  
  return {
    confirmed: !!receipt,
    reverted: receipt?.reverted || false,
    receipt,
  };
}

/**
 * Decode event logs from receipt
 */
export function decodeEventLogs(
  receipt: Connex.Thor.Transaction.Receipt,
  eventABI: any
): any[] {
  const connex = getVeWorldConnex();
  const abi = connex.thor.account("0x").event(eventABI);
  
  return receipt.outputs.flatMap((output) =>
    output.events
      .filter((event) => event.topics[0] === (abi as any).signature)
      .map((event) => (abi as any).decode(event.data, event.topics))
  );
}
