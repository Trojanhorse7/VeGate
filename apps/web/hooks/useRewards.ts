"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "./useWallet";
import { getRewardInfo } from "@vegate/sdk";

export function useRewards() {
  const { address, isConnected } = useWallet();
  const [rewards, setRewards] = useState({
    totalEarned: "0",
    balance: "0",
    pendingRewards: "0",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchRewards = useCallback(async () => {
    if (!address || !isConnected) return;

    setIsLoading(true);

    try {
      // Call SDK directly from client side
  const rewardInfo = await getRewardInfo(address, { network: "test" });
      setRewards(rewardInfo);
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
      // Keep previous rewards on error
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return {
    ...rewards,
    isLoading,
    refresh: fetchRewards,
  };
}
