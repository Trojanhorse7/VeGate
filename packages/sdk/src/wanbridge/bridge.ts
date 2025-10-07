import { createCrossChainTx, waitForBridgeCompletion, getBridgeStatus, BridgeParams, BridgeTransaction, CreateTxResponse } from "./wanbridge-api";

export interface CrossChainPaymentParams {
  billId: string;
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAccount: string;
  toAccount: string;
  amount: string;
}

export interface CrossChainPaymentResult {
  txHash: string;
  bridgeTransaction: BridgeTransaction;
  txResponse: CreateTxResponse;
}

export async function initiateCrossChainPayment(
  params: CrossChainPaymentParams,
  onProgress?: (status: string) => void,
  isTestnet: boolean = true
): Promise<CrossChainPaymentResult> {
  if (onProgress) onProgress("Creating bridge transaction...");
  
  const bridgeParams: BridgeParams = {
    fromChain: params.fromChain,
    toChain: params.toChain || "vechain",
    fromToken: params.fromToken,
    toToken: params.toToken,
    fromAccount: params.fromAccount,
    toAccount: params.toAccount,
    amount: params.amount,
    partner: "vegate",
  };

  const txResponse = await createCrossChainTx(bridgeParams, isTestnet);
  if (!txResponse.success) throw new Error(txResponse.error || "Failed to create bridge transaction");

  const txHash = "0x...";
  if (onProgress) onProgress("Monitoring bridge progress...");
  
  const bridgeTransaction = await waitForBridgeCompletion(txHash, (status) => {
    if (onProgress) onProgress(`Bridge status: ${status.status}`);
  }, isTestnet);

  return { txHash, bridgeTransaction, txResponse };
}

export async function checkBridgeStatus(txHash: string, isTestnet: boolean = true): Promise<BridgeTransaction> {
  return getBridgeStatus(txHash, isTestnet);
}

export function estimateCrossChainTime(sourceChain: string): number {
  const estimates: Record<string, number> = { ethereum: 900, eth: 900, bsc: 600, bnb: 600, polygon: 300, matic: 300 };
  return estimates[sourceChain.toLowerCase()] || 600;
}

export type { BridgeParams, BridgeTransaction, CreateTxResponse };
