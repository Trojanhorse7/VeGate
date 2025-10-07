import { getBill, getUserCreatedBills, getUserPaidBills } from "../payment";
import { getRewardInfo } from "../rewards";

export interface PaymentHistoryFilters {
  status?: "paid" | "unpaid" | "all";
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  socialImpact?: boolean;
}

export interface PaymentHistoryItem {
  billId: string;
  amount: string;
  token: string;
  receiver: string;
  payer?: string;
  paid: boolean;
  socialImpact: boolean;
  category: string;
  b3trReward: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface UserStats {
  totalBillsCreated: number;
  totalBillsPaid: number;
  totalRewardsEarned: string;
  totalVolume: string;
  socialImpactCount: number;
}

export interface AnalyticsSummary {
  stats: UserStats;
  history: PaymentHistoryItem[];
  recentActivity: PaymentHistoryItem[];
}

/**
 * Get payment history for a user
 */
export async function getPaymentHistory(
  walletAddress: string,
  filters?: PaymentHistoryFilters,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<PaymentHistoryItem[]> {
  const network = options?.network || "test";
  
  // Get both created and paid bills
  const [createdBillIds, paidBillIds] = await Promise.all([
    getUserCreatedBills(walletAddress, options),
    getUserPaidBills(walletAddress, options),
  ]);

  // Fetch all bill details
  const allBillIds = [...new Set([...createdBillIds, ...paidBillIds])];
  const bills = await Promise.all(
    allBillIds.map((billId) => getBill(billId, options))
  );

  // Convert to history items
  let history: PaymentHistoryItem[] = bills.map((bill) => ({
    billId: bill.billId,
    amount: bill.amount,
    token: bill.token,
    receiver: bill.receiver,
    payer: bill.payer !== "0x0000000000000000000000000000000000000000" ? bill.payer : undefined,
    paid: bill.paid,
    socialImpact: bill.socialImpact,
    category: bill.category,
    b3trReward: bill.b3trReward,
    createdAt: new Date(bill.createdAt * 1000),
    paidAt: bill.paidAt > 0 ? new Date(bill.paidAt * 1000) : undefined,
  }));

  // Apply filters
  if (filters) {
    if (filters.status) {
      if (filters.status === "paid") {
        history = history.filter((h) => h.paid);
      } else if (filters.status === "unpaid") {
        history = history.filter((h) => !h.paid);
      }
    }

    if (filters.category) {
      history = history.filter((h) => h.category === filters.category);
    }

    if (filters.socialImpact !== undefined) {
      history = history.filter((h) => h.socialImpact === filters.socialImpact);
    }

    if (filters.dateFrom) {
      history = history.filter((h) => h.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      history = history.filter((h) => h.createdAt <= filters.dateTo!);
    }
  }

  // Sort by creation date (newest first)
  history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return history;
}

/**
 * Get user statistics
 */
export async function getUserStats(
  walletAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<UserStats> {
  const history = await getPaymentHistory(walletAddress, undefined, options);
  const rewardInfo = await getRewardInfo(walletAddress, options);

  const createdBills = history.filter((h) => h.receiver === walletAddress);
  const paidBills = history.filter((h) => h.payer === walletAddress);
  const socialImpactBills = paidBills.filter((h) => h.socialImpact);

  // Calculate total volume (from paid bills)
  const totalVolume = paidBills.reduce(
    (sum, bill) => sum + BigInt(bill.amount),
    BigInt(0)
  );

  return {
    totalBillsCreated: createdBills.length,
    totalBillsPaid: paidBills.length,
    totalRewardsEarned: rewardInfo.totalEarned,
    totalVolume: totalVolume.toString(),
    socialImpactCount: socialImpactBills.length,
  };
}

/**
 * Get comprehensive analytics summary
 */
export async function getAnalyticsSummary(
  walletAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<AnalyticsSummary> {
  const [stats, history] = await Promise.all([
    getUserStats(walletAddress, options),
    getPaymentHistory(walletAddress, undefined, options),
  ]);

  // Get recent activity (last 10)
  const recentActivity = history.slice(0, 10);

  return {
    stats,
    history,
    recentActivity,
  };
}

/**
 * Export payment history as CSV
 */
export function exportToCSV(history: PaymentHistoryItem[]): string {
  const headers = [
    "Bill ID",
    "Amount",
    "Token",
    "Receiver",
    "Payer",
    "Status",
    "Social Impact",
    "Category",
    "B3TR Reward",
    "Created At",
    "Paid At",
  ];

  const rows = history.map((item) => [
    item.billId,
    item.amount,
    item.token,
    item.receiver,
    item.payer || "N/A",
    item.paid ? "Paid" : "Unpaid",
    item.socialImpact ? "Yes" : "No",
    item.category,
    item.b3trReward,
    item.createdAt.toISOString(),
    item.paidAt ? item.paidAt.toISOString() : "N/A",
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  return csv;
}

/**
 * Get social impact statistics
 */
export async function getSocialImpactStats(
  walletAddress: string,
  options?: { connex?: Connex; network?: "main" | "test" }
): Promise<{
  totalDonations: number;
  totalDonationAmount: string;
  impactRewards: string;
  categories: Record<string, number>;
}> {
  const history = await getPaymentHistory(
    walletAddress,
    { socialImpact: true },
    options
  );

  const totalDonationAmount = history.reduce(
    (sum, bill) => sum + BigInt(bill.amount),
    BigInt(0)
  );

  const impactRewards = history.reduce(
    (sum, bill) => sum + BigInt(bill.b3trReward),
    BigInt(0)
  );

  // Group by category
  const categories: Record<string, number> = {};
  history.forEach((bill) => {
    categories[bill.category] = (categories[bill.category] || 0) + 1;
  });

  return {
    totalDonations: history.length,
    totalDonationAmount: totalDonationAmount.toString(),
    impactRewards: impactRewards.toString(),
    categories,
  };
}
