"use client";

import { useState, useCallback } from "react";
import { generateBillId, CONTRACT_ADDRESSES, VEGATE_ABI, encodeFunction, formatVET, parseVET, waitForTransaction, getShortBillId } from "@vegate/sdk";
import { toast } from "sonner";
import { useWallet } from "./useWallet";

// Minimal ERC20 ABI for approve and allowance functions
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  }
];

export interface CreateBillParams {
  token: string;
  amount: string;
  socialImpact: boolean;
  category: "Donation" | "Subscription" | "E-commerce" | "Utility";
}

export function useBill() {
  const { address, connex } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const create = useCallback(
    async (params: CreateBillParams) => {
      if (!address) {
        toast.error("Wallet Not Connected", {
          description: "Please click the wallet button in the top right to connect your VeWorld wallet",
        });
        return null;
      }

      if (!connex) {
        toast.error("Please connect your wallet", {
          description: "Connex is not available. Please make sure VeWorld is connected.",
        });
        return null;
      }

      setIsCreating(true);

      try {
        const billId = generateBillId(address);

        // Find the createBill function in ABI
        type AbiItem = { type?: string; name?: string };
        const createBillAbi = (VEGATE_ABI as ReadonlyArray<AbiItem>).find(
          (item): item is Required<Pick<AbiItem, 'name' | 'type'>> & AbiItem =>
            !!item && item.name === 'createBill' && item.type === 'function'
        );

        if (!createBillAbi) {
          throw new Error('createBill function not found in ABI');
        }

        // VeGate only accepts VET (address(0))
        const VET_TOKEN = '0x0000000000000000000000000000000000000000';
        
        // Encode using our SDK helper
        const amountInWei = parseVET(params.amount);
        
        const encodedData = encodeFunction(createBillAbi, [
          billId,
          VET_TOKEN, // Force VET token (address(0))
          amountInWei,
          params.socialImpact,
          params.category
        ]);

        const clause = {
          to: CONTRACT_ADDRESSES.test.VeGate,
          value: '0',
          data: encodedData
        };

        // Execute transaction
        const result = await connex.vendor
          .sign('tx', [clause])
          .signer(address)
          .comment(`Create bill: ${params.category}`)
          .request();

        if (!result) {
          throw new Error('Transaction was rejected');
        }

        // Generate short bill ID for URLs
        const shortBillId = await getShortBillId(billId);

        // Save to backend (store amount in wei, not decimal VET)
        const response = await fetch("/api/bills/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            billId: billId,
            shortBillId: shortBillId,
            receiver: address,
            token: params.token,
            amount: amountInWei, // ✅ Store in wei, not decimal
            socialImpact: params.socialImpact,
            category: params.category,
            createdBy: address,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save bill to database");
        }

        const responseData = await response.json();

        toast.success("Bill created successfully!", {
          description: "Redirecting to payment page...",
        });

        setIsCreating(false);
        return responseData.bill;
      } catch (error: any) {
        console.error("Failed to create bill:", error);
        
        // Better error messages
        let errorMessage = "Failed to create bill";
        let errorDescription = error?.message || "Please try again";
        
        if (error?.message?.includes("wallet not connected") || 
            error?.message?.includes("not available")) {
          errorMessage = "Wallet Not Connected";
          errorDescription = "Please connect your VeWorld wallet using the button in the top right corner";
        } else if (error?.message?.includes("rejected") || error?.message?.includes("denied")) {
          errorMessage = "Transaction Rejected";
          errorDescription = "You rejected the transaction in your wallet";
        } else if (error?.message?.includes("insufficient")) {
          errorMessage = "Insufficient Balance";
          errorDescription = "You don't have enough VTHO to create this bill";
        }
        
        toast.error(errorMessage, {
          description: errorDescription,
        });
        setIsCreating(false);
        return null;
      }
    },
    [address, connex]
  );

  const pay = useCallback(async (billId: string) => {
    if (!address) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first",
      });
      return null;
    }

    if (!connex) {
      toast.error("Please connect your wallet", {
        description: "Connex is not available. Please make sure VeWorld is connected.",
      });
      return null;
    }

    setIsPaying(true);

    try {
      // Step 1: Fetch bill details
      const billData = await fetchBill(billId);
      if (!billData) {
        throw new Error('Bill not found');
      }

      const { token: tokenAddress, amount: billAmount } = billData;
      // Amount is already in wei from database, no need to convert
      const requiredAmount = billAmount;
      
      // VeGate only accepts VET (native token)
      const isVET = tokenAddress === '0x0000000000000000000000000000000000000000' || 
                    tokenAddress === '0x0' ||
                    tokenAddress === null ||
                    tokenAddress === undefined ||
                    !tokenAddress;

      // CHECK: Only VET payments are supported
      if (!isVET) {
        throw new Error('VeGate only accepts VET payments. Please create a bill with VET token.');
      }

      // Process VET payment (no approval needed!)
      toast.loading("Processing VET payment...", { id: "vet-payment" });
        
        // For VET, we just need to send the value with the transaction
        const payBillAbi = (VEGATE_ABI as ReadonlyArray<{ type?: string; name?: string }>).find(
          (item): item is Required<Pick<{ type?: string; name?: string }, 'name' | 'type'>> & { type?: string; name?: string } =>
            !!item && item.name === 'payBill' && item.type === 'function'
        );

        if (!payBillAbi) {
          throw new Error('payBill function not found in ABI');
        }

        const encodedData = encodeFunction(payBillAbi, [billId]);

        const clause = {
          to: CONTRACT_ADDRESSES.test.VeGate,
          value: requiredAmount, // ✅ Send VET in the value field!
          data: encodedData
        };

        // Execute transaction
        const result = await connex.vendor
          .sign('tx', [clause])
          .signer(address)
          .comment(`Pay bill with VET: ${billId}`)
          .request();

        if (!result) {
          throw new Error('Transaction was rejected');
        }

        toast.dismiss("vet-payment");
        toast.loading("Waiting for transaction confirmation...", {
          id: result.txid,
        });

        // Wait for transaction receipt
        const receipt = await waitForTransaction(connex, result.txid);

        // Check if transaction reverted
        if (receipt.reverted) {
          toast.dismiss(result.txid);
          throw new Error('Transaction failed on-chain. The transaction was reverted.');
        }

        // Fetch bill from blockchain to get the actual B3TR reward
        const blockchainBill = await connex.thor
          .account(CONTRACT_ADDRESSES.test.VeGate)
          .method(VEGATE_ABI.find(item => item.name === 'getBill')!)
          .call(billId);

        const b3trReward = blockchainBill.decoded?.[0]?.b3trReward || "0";

        // Transaction succeeded, now update backend
        const response = await fetch(`/api/bills/${billId}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payer: address,
            txHash: result.txid,
            b3trReward: b3trReward.toString(),
          }),
        });

        toast.dismiss(result.txid); // Dismiss loading toast first

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Database update failed:", errorData);
          throw new Error(errorData.error || "Failed to update bill in database");
        }

        toast.success("VET payment successful!", {
          description: `Transaction: ${result.txid.slice(0, 10)}...`,
        });

        setIsPaying(false);
        return { txId: result.txid, success: true };

    } catch (error: any) {
      console.error("Failed to pay bill:", error);
      // Dismiss any pending toasts
      toast.dismiss("vet-payment");
      if (connex) {
        toast.dismiss(); // Dismiss all toasts
      }
      toast.error("Payment failed", {
        description: error?.message || "Please try again",
      });
      setIsPaying(false);
      return null;
    }
  }, [address, connex]);

  const fetchBill = useCallback(async (billId: string) => {
    try {
      const response = await fetch(`/api/bills/${billId}`);
      if (!response.ok) {
        throw new Error("Bill not found");
      }
      const data = await response.json();
      return data.bill;
    } catch (error) {
      console.error("Failed to fetch bill:", error);
      return null;
    }
  }, []);

  return {
    create,
    pay,
    fetchBill,
    isCreating,
    isPaying,
  };
}
