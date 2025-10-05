"use client";

import { useState, useCallback } from "react";
import { createBill, payBill, getBill, generateBillId } from "@vegate/sdk";
import { toast } from "sonner";
import { useWallet } from "./useWallet";

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
        toast.error("Wallet Not Ready", {
          description: "Please wait for wallet connection to complete, then try again",
        });
        return null;
      }

      setIsCreating(true);

      try {
        console.log("Creating bill with address:", address);
        console.log("Bill params:", params);
        console.log("Connex available:", !!connex);

        // Generate bill ID on frontend
        const billId = generateBillId(address);
        console.log("Generated billId:", billId);

        // Create bill on-chain - pass connex and userAddress
        const { txId } = await createBill(params, { 
          connex, 
          userAddress: address,
          network: "test"
        });
        console.log("Transaction ID:", txId);

        // Save to backend
        const response = await fetch("/api/bills/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            billId,
            receiver: address,
            token: params.token,
            amount: params.amount,
            socialImpact: params.socialImpact,
            category: params.category,
            createdBy: address,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save bill to database");
        }

        const data = await response.json();

        toast.success("Bill created successfully!", {
          description: `Transaction: ${txId.slice(0, 10)}...`,
        });

        setIsCreating(false);
        return data.bill;
      } catch (error: any) {
        console.error("Failed to create bill:", error);
        
        // Better error messages
        let errorMessage = "Failed to create bill";
        let errorDescription = error?.message || "Please try again";
        
        if (error?.message?.includes("wallet not connected") || 
            error?.message?.includes("not available") ||
            error?.message?.includes("Connex")) {
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
    [address]
  );

  const pay = useCallback(async (billId: string) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return null;
    }

    setIsPaying(true);

    try {
      // Pay bill on-chain
      const result = await payBill(billId);

      // Update backend
      await fetch(`/api/bills/${billId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payer: address,
          txHash: result.txId,
          b3trReward: result.b3trReward,
        }),
      });

      toast.success("Payment successful!", {
        description: `Earned ${result.b3trReward} B3TR rewards`,
      });

      setIsPaying(false);
      return result;
    } catch (error: any) {
      console.error("Failed to pay bill:", error);
      toast.error("Payment failed", {
        description: error?.message || "Please try again",
      });
      setIsPaying(false);
      return null;
    }
  }, [address]);

  const fetch = useCallback(async (billId: string) => {
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
    fetch,
    isCreating,
    isPaying,
  };
}
