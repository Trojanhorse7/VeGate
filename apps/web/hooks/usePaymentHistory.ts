"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "./useWallet";

export interface PaymentHistoryFilters {
  status?: "paid" | "unpaid" | "all";
  category?: string;
  socialImpact?: boolean;
}

export function usePaymentHistory(filters?: PaymentHistoryFilters) {
  const { address } = useWallet();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        wallet: address,
        ...(filters?.status && filters.status !== "all" && { status: filters.status }),
        ...(filters?.category && filters.category !== "all" && { category: filters.category }),
        ...(filters?.socialImpact !== undefined && {
          socialImpact: String(filters.socialImpact),
        }),
      });

      const response = await fetch(`/api/payments/history?${params}`);
      const data = await response.json();

      setHistory(data.history || []);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    refresh: fetchHistory,
  };
}
