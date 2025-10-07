import { getVeWorldConnex } from "../vechain/connex";
import { CONTRACT_ADDRESSES, B3TR_ABI } from "../vechain/contracts";

export interface RewardInfo {
  totalEarned: string;
  balance: string;
  pendingRewards: string;
}

/**
 * Calculate expected reward for payment
 */
export function calculateReward(
  amount: string | bigint,
  socialImpact: boolean = false
): string {
  const amountBigInt = typeof amount === "string" ? BigInt(amount) : amount;
  
  // Base reward: 1% (100 basis points / 10000)
  const baseReward = (amountBigInt * BigInt(100)) / BigInt(10000);
  
  // Social impact: 2x multiplier
  const finalReward = socialImpact ? baseReward * BigInt(2) : baseReward;
  
  return finalReward.toString();
}

/**
 * Get user's B3TR balance
 */
export async function getRewardBalance(
  walletAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<string> {
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].B3TRRewards;

  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    });

  const result = await method.call(walletAddress);
  return result.decoded[0].toString();
}

/**
 * Get total rewards earned by user
 */
export async function getTotalRewardsEarned(
  walletAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<string> {
  const connex = options?.connex || getVeWorldConnex();
  const network = options?.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  const method = connex.thor
    .account(contractAddress)
    .method({
      inputs: [{ name: "user", type: "address" }],
      name: "getUserRewards",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    });

  const result = await method.call(walletAddress);
  return result.decoded[0].toString();
}

/**
 * Get comprehensive reward info for user
 */
export async function getRewardInfo(
  walletAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<RewardInfo> {
  const [balance, totalEarned] = await Promise.all([
    getRewardBalance(walletAddress, options),
    getTotalRewardsEarned(walletAddress, options),
  ]);

  return {
    totalEarned,
    balance,
    pendingRewards: "0", // Would require additional tracking
  };
}

/**
 * Format B3TR amount for display
 */
export function formatB3TR(amount: string | bigint): string {
  const amountBigInt = typeof amount === "string" ? BigInt(amount) : amount;
  const b3tr = Number(amountBigInt) / 10 ** 18;
  
  return b3tr.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

/**
 * Get reward multiplier text
 */
export function getRewardMultiplierText(socialImpact: boolean): string {
  return socialImpact ? "2x Social Impact Bonus" : "Standard Reward";
}

/**
 * Calculate potential rewards for bill
 */
export function calculatePotentialReward(
  billAmount: string,
  socialImpact: boolean
): {
  amount: string;
  formatted: string;
  multiplier: string;
} {
  const reward = calculateReward(billAmount, socialImpact);
  
  return {
    amount: reward,
    formatted: formatB3TR(reward),
    multiplier: getRewardMultiplierText(socialImpact),
  };
}
