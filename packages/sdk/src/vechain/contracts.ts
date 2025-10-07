import { getVeWorldConnex } from "./connex";

export interface ContractAddresses {
  VeGate: string;
  B3TRRewards: string;
}

/**
 * Contract addresses by network
 * 
 * UPDATE THESE AFTER DEPLOYMENT:
 * 1. Deploy contracts: cd packages/contract && pnpm run deploy
 * 2. Copy addresses from terminal output
 * 3. Paste below in 'test' section
 * 4. Rebuild SDK: pnpm build
 */
export const CONTRACT_ADDRESSES: Record<"main" | "test", ContractAddresses> = {
  main: {
    VeGate: "0x0000000000000000000000000000000000000000", // Deploy to mainnet
    B3TRRewards: "0x0000000000000000000000000000000000000000",
  },
  test: {
    // ✅ DEPLOYED ON VECHAIN TESTNET - VET ONLY VERSION
    VeGate: "0xcdf1f352fae939eb61b8262859ee9f5f376d21b5", // Deployed: Oct 6, 2025 (VET-ONLY)
    B3TRRewards: "0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38", // VeBetterDAO X2EarnRewardsPool
  },
};

// VeGate Contract ABI (simplified)
export const VEGATE_ABI = [
  {
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
  },
  {
    inputs: [{ name: "billId", type: "bytes32" }],
    name: "payBill",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "billId", type: "bytes32" },
      { name: "payer", type: "address" },
    ],
    name: "payBillSponsored",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
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
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserRewards",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// B3TR Token ABI (ERC20)
export const B3TR_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Get VeGate contract instance
 */
export function getVeGateContract(network: "main" | "test" = "test") {
  const connex = getVeWorldConnex();
  const address = CONTRACT_ADDRESSES[network].VeGate;
  return connex.thor.account(address).method(VEGATE_ABI[0]);
}

/**
 * Get B3TR token contract instance
 */
export function getB3TRContract(network: "main" | "test" = "test") {
  const connex = getVeWorldConnex();
  const address = CONTRACT_ADDRESSES[network].B3TRRewards;
  return connex.thor.account(address).method(B3TR_ABI[0]);
}

/**
 * Update contract addresses after deployment
 */
export function updateContractAddresses(
  network: "main" | "test",
  addresses: Partial<ContractAddresses>
): void {
  CONTRACT_ADDRESSES[network] = {
    ...CONTRACT_ADDRESSES[network],
    ...addresses,
  };
}

/**
 * Encode createBill function call data for dapp-kit-react
 * Use this when calling requestTransaction from @vechain/dapp-kit-react
 * 
 * @example
 * ```tsx
 * import { encodeCreateBillClause, generateBillId } from '@vegate/sdk';
 * import { useWallet } from '@vechain/dapp-kit-react';
 * 
 * const { account, requestTransaction } = useWallet();
 * const billId = generateBillId(account);
 * const clause = encodeCreateBillClause({
 *   billId,
 *   token: "0x0000000000000000000000000000000000000000",
 *   amount: "1000000000000000000",
 *   socialImpact: true,
 *   category: "Donation",
 * });
 * const result = await requestTransaction([clause]);
 * ```
 */
export function encodeCreateBillClause(params: {
  billId: string;
  token: string;
  amount: string;
  socialImpact: boolean;
  category: string;
  network?: "main" | "test";
}): { to: string; value: string; data: string } {
  const network = params.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  // Find createBill ABI
  const createBillABI = VEGATE_ABI.find((item) => item.name === "createBill");
  if (!createBillABI) {
    throw new Error("createBill ABI not found");
  }

  // Use thor-devkit for ABI encoding
  try {
    const { abi } = require("thor-devkit");
    const method = new abi.Function(createBillABI as any);
    const data = method.encode(
      params.billId,
      params.token,
      params.amount,
      params.socialImpact,
      params.category
    );

    return {
      to: contractAddress,
      value: "0",
      data: "0x" + data.toString("hex"),
    };
  } catch (error) {
    // Fallback: construct the clause without encoding (connex will handle it)
    // This requires the caller to have connex available
    throw new Error(
      "thor-devkit not available. Install with: pnpm add thor-devkit"
    );
  }
}

/**
 * Encode payBill function call data for dapp-kit-react
 */
export function encodePayBillClause(params: {
  billId: string;
  network?: "main" | "test";
}): { to: string; value: string; data: string } {
  const network = params.network || "test";
  const contractAddress = CONTRACT_ADDRESSES[network].VeGate;

  const payBillABI = VEGATE_ABI.find((item) => item.name === "payBill");
  if (!payBillABI) {
    throw new Error("payBill ABI not found");
  }

  try {
    const { abi } = require("thor-devkit");
    const method = new abi.Function(payBillABI as any);
    const data = method.encode(params.billId);

    return {
      to: contractAddress,
      value: "0",
      data: "0x" + data.toString("hex"),
    };
  } catch (error) {
    throw new Error(
      "thor-devkit not available. Install with: pnpm add thor-devkit"
    );
  }
}
