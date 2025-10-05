"use client";

import { useRewards } from "@/hooks/useRewards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Gift } from "lucide-react";
import { formatB3TR } from "@vegate/sdk";

export function RewardsSummary() {
  const { totalEarned, balance, isLoading } = useRewards();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-7 w-24 bg-secondary animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold text-primary">
              {formatB3TR(totalEarned)} B3TR
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-7 w-24 bg-secondary animate-pulse rounded" />
          ) : (
            <div className="text-2xl font-bold">{formatB3TR(balance)} B3TR</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Reward</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">
            Pay to Earn
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            1% base • 2x for social impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
