export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chain: string;
}

export interface BridgeParams {
  fromChain: string;
  toChain: string;
  fromAccount: string;
  toAccount: string;
  fromToken: string;
  toToken: string;
  amount: string;
  partner?: string;
}

export interface CreateTxResponse {
  success: boolean;
  data: {
    tx: { from: string; to: string; value: string; data: string };
    receiveAmount: string;
    chainId: string;
    feeAndQuota: {
      symbol: string;
      networkFee: { value: string; isPercent: boolean };
      operationFee: { value: string; isPercent: boolean };
    };
  };
  error?: string;
}

export interface BridgeTransaction {
  txHash: string;
  status: "pending" | "Processing" | "Success" | "Failed";
  timestamp: number;
  tokenPair: string;
  sendAmount: string;
  receiveAmount: string;
}

const API_URL = "https://api-testnet.wanchain.org";

export async function getSupportedTokens(): Promise<Token[]> {
  return [];
}

export async function getSupportedChains(): Promise<any[]> {
  return [];
}

export async function createCrossChainTx(params: BridgeParams, isTestnet: boolean = false): Promise<CreateTxResponse> {
  const response = await fetch(`${API_URL}/createTx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return response.json();
}

export async function getBridgeStatus(txHash: string, isTestnet: boolean = false): Promise<BridgeTransaction> {
  const response = await fetch(`${API_URL}/status/${txHash}`);
  return response.json();
}

export async function waitForBridgeCompletion(
  txHash: string,
  onProgress?: (status: BridgeTransaction) => void,
  isTestnet: boolean = false,
  maxWaitTime: number = 1800000
): Promise<BridgeTransaction> {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitTime) {
    const status = await getBridgeStatus(txHash, isTestnet);
    if (onProgress) onProgress(status);
    if (status.status === "Success" || status.status === "Failed") return status;
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  throw new Error("Bridge transaction timeout");
}
