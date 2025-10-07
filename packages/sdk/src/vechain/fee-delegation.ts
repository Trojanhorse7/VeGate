import { getVeWorldConnex } from "./connex";

export interface FeeDelegationOptions {
  gasPayer?: string; // VIP-191 gas payer address (sponsor)
  beneficiary?: string; // Optional beneficiary address
}

/**
 * Create transaction with fee delegation (VIP-191)
 * Uses direct sponsor address instead of delegator URL
 * 
 * @param clauses - Transaction clauses
 * @param options - Fee delegation options with gasPayer address
 */
export async function createDelegatedTransaction(
  clauses: Connex.VM.Clause[],
  options: FeeDelegationOptions = {}
): Promise<Connex.Vendor.TxResponse> {
  const connex = getVeWorldConnex();
  const vendor = connex.vendor;

  // Request user signature
  const signingService = vendor.sign("tx", clauses);
  
  // Enable VIP-191 fee delegation if gas payer is provided
  if (options.gasPayer) {
    // Set gas payer address - VIP-191 protocol
    // The wallet will handle obtaining the sponsor's signature
    signingService.gas(200000); // Set reasonable gas limit
    signingService.delegate(options.gasPayer);
  }

  if (options.beneficiary) {
    signingService.comment(`VeGate payment - beneficiary: ${options.beneficiary}`);
  }

  // Sign and send transaction
  // For VIP-191: user signs first, then sponsor signature is added by wallet/connex
  const result = await signingService.request();
  return result;
}

/**
 * Estimate gas for transaction
 */
export async function estimateGas(
  clauses: Connex.VM.Clause[],
  caller: string
): Promise<number> {
  const connex = getVeWorldConnex();
  
  const outputs = await Promise.all(
    clauses.map((clause) =>
      connex.thor
        .account(clause.to || "0x0000000000000000000000000000000000000000")
        .method(clause.data ? JSON.parse(clause.data) : {})
        .caller(caller)
        .gas(1000000) // Max gas for estimation
        .call()
    )
  );

  // Sum up gas used
  const totalGas = outputs.reduce((sum: number, output: any) => sum + (output.gasUsed || 0), 0);
  
  // Add 20% buffer
  return Math.ceil(totalGas * 1.2);
}

/**
 * Check if address has sufficient VTHO for sponsoring
 */
export async function canSponsorTransaction(
  sponsorAddress: string,
  estimatedGas: number = 200000
): Promise<boolean> {
  const connex = getVeWorldConnex();
  
  try {
    // Get VTHO balance
    const account = await connex.thor.account(sponsorAddress).get();
    const vthoBalance = BigInt(account.energy);
    
    // Estimate cost (gas * base gas price)
    const basGasPrice = BigInt(1000000000000000); // 0.001 VTHO per gas (typical)
    const estimatedCost = BigInt(estimatedGas) * basGasPrice;
    
    return vthoBalance >= estimatedCost;
  } catch {
    return false;
  }
}
