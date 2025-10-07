/**
 * DAppKit Helper Utilities for VeGate
 * 
 * These utilities help integrate @vechain/dapp-kit-react with VeGate SDK
 * 
 * @module dappkit-helpers
 */

import type { Connex } from "@vechain/connex";
import { abi as thorAbi } from "thor-devkit";

/**
 * Transaction clause for VeChain transactions
 */
export interface TransactionClause {
  to: string;
  value: string;
  data: string;
}

/**
 * Result from a signed transaction
 */
export interface SignedTransaction {
  txid: string;
  signer: string;
}

/**
 * Sign and send a transaction using DAppKit/Connex
 * 
 * @param connex - Connex instance from window
 * @param clauses - Transaction clauses to execute
 * @param signer - Wallet address (from useWallet hook)
 * @param comment - Optional comment for the transaction
 * @returns Transaction result with txid
 * 
 * @example
 * ```typescript
 * const connex = window.connex; // From DAppKit/VeWorld
 * const { account } = useWallet(); // From DAppKit
 * 
 * const clause = {
 *   to: CONTRACT_ADDRESS,
 *   value: "0",
 *   data: encodedData
 * };
 * 
 * const result = await signTransaction(connex, [clause], account, "Create Bill");
 * console.log("Transaction ID:", result.txid);
 * ```
 */
export async function signTransaction(
  connex: any,
  clauses: TransactionClause[],
  signer: string,
  comment?: string
): Promise<SignedTransaction> {
  if (!connex || !connex.vendor) {
    throw new Error("Connex not available. Please connect your wallet.");
  }

  if (!signer) {
    throw new Error("Wallet address required");
  }

  let tx = connex.vendor.sign("tx", clauses).signer(signer);

  if (comment) {
    tx = tx.comment(comment);
  }

  const result = await tx.request();

  if (!result) {
    throw new Error("Transaction was rejected by user");
  }

  return result;
}

/**
 * Wait for a transaction to be mined and get the receipt
 * 
 * @param connex - Connex instance from window
 * @param txid - Transaction ID to wait for
 * @param maxAttempts - Maximum number of attempts (default: 30)
 * @param delayMs - Delay between attempts in milliseconds (default: 2000)
 * @returns Transaction receipt
 * 
 * @example
 * ```typescript
 * const receipt = await waitForTransaction(connex, result.txid);
 * if (receipt.reverted) {
 *   console.error("Transaction reverted");
 * } else {
 *   console.log("Transaction successful!");
 * }
 * ```
 */
export async function waitForTransaction(
  connex: any,
  txid: string,
  maxAttempts: number = 30,
  delayMs: number = 2000
): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const receipt = await connex.thor.transaction(txid).getReceipt();

    if (receipt) {
      return receipt;
    }
  }

  throw new Error(`Transaction receipt not found after ${maxAttempts} attempts`);
}

/**
 * Encode contract function call data using thor-devkit
 * 
 * @param abiFunction - ABI function definition
 * @param params - Function parameters
 * @returns Encoded data string
 * 
 * @example
 * ```typescript
 * const createBillABI = VEGATE_ABI.find(item => item.name === 'createBill');
 * const encodedData = encodeFunction(createBillABI, [amount, token, category]);
 * ```
 */
export function encodeFunction(abiFunction: any, params: any[]): string {
  const func = new thorAbi.Function(abiFunction);
  return func.encode(...params);
}

/**
 * Format VET amount from wei to human-readable format
 * 
 * @param weiAmount - Amount in wei (string or number)
 * @returns Formatted VET amount
 * 
 * @example
 * ```typescript
 * const amount = formatVET("1000000000000000000"); // "1.0000 VET"
 * ```
 */
export function formatVET(weiAmount: string | number): string {
  const wei = BigInt(weiAmount.toString());
  const vet = wei / BigInt(10 ** 18);
  const remainder = wei % BigInt(10 ** 18);
  const decimal = remainder.toString().padStart(18, '0').slice(0, 4);
  return `${vet}.${decimal} VET`;
}

/**
 * Parse VET amount to wei
 * 
 * @param vetAmount - Amount in VET (string or number)
 * @returns Amount in wei
 * 
 * @example
 * ```typescript
 * const wei = parseVET("1.5"); // "1500000000000000000"
 * ```
 */
export function parseVET(vetAmount: string | number): string {
  const [whole, decimal = '0'] = vetAmount.toString().split('.');
  const paddedDecimal = decimal.padEnd(18, '0').slice(0, 18);
  return (BigInt(whole) * BigInt(10 ** 18) + BigInt(paddedDecimal)).toString();
}

/**
 * Check if wallet is connected via DAppKit
 * 
 * @param account - Account address from useWallet hook
 * @returns True if connected
 */
export function isConnected(account: string | null | undefined): boolean {
  return !!account && account.length === 42;
}

/**
 * Truncate address for display
 * 
 * @param address - Full address
 * @param prefixLength - Length of prefix (default: 6)
 * @param suffixLength - Length of suffix (default: 4)
 * @returns Truncated address
 * 
 * @example
 * ```typescript
 * const short = truncateAddress("0x1234567890abcdef1234567890abcdef12345678");
 * // "0x1234...5678"
 * ```
 */
export function truncateAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  if (!address || address.length < prefixLength + suffixLength) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Build a contract interaction clause
 * 
 * @param contractAddress - Contract address
 * @param encodedData - Encoded function call data
 * @param value - Value to send (default: "0")
 * @returns Transaction clause
 * 
 * @example
 * ```typescript
 * const clause = buildClause(
 *   VEGATE_CONTRACT_ADDRESS,
 *   encodedData,
 *   "0"
 * );
 * ```
 */
export function buildClause(
  contractAddress: string,
  encodedData: string,
  value: string = "0"
): TransactionClause {
  return {
    to: contractAddress,
    value,
    data: encodedData,
  };
}

/**
 * Check if a transaction was successful
 * 
 * @param receipt - Transaction receipt
 * @returns True if successful, false if reverted
 */
export function isTransactionSuccessful(receipt: any): boolean {
  return receipt && !receipt.reverted;
}

// Export types
export type { Connex };
