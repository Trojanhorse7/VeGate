'use client';

import { useEffect, useState } from 'react';
import { useBill } from '@/hooks/useBill';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { CheckCircle2, Coins } from 'lucide-react';
import { formatB3TR, calculatePotentialReward, formatVET } from '@vegate/sdk';

interface PaymentPageProps {
  billId: string;
}

export function PaymentPage({ billId }: PaymentPageProps) {
  const { isConnected } = useWallet();
  const { pay, isPaying, fetchBill } = useBill();
  const [bill, setBill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBill(billId).then((data) => {
      setBill(data);
      setIsLoading(false);
    });
  }, [billId, fetchBill]);

  const handlePay = async () => {
    const result = await pay(billId);
    if (result) {
      // Refresh bill data
      const updatedBill = await fetchBill(billId);
      setBill(updatedBill);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Bill not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reward = calculatePotentialReward(bill.amount, bill.socialImpact);

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Details</CardTitle>
            {bill.paid ? (
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                Paid
              </Badge>
            ) : (
              <Badge>Unpaid</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">{formatVET(bill.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{bill.category}</span>
            </div>
            {bill.socialImpact && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Social Impact</span>
                <Badge variant="secondary">2x Rewards</Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receiver</span>
              <span className="font-mono text-sm">
                {bill.receiver.slice(0, 6)}...{bill.receiver.slice(-4)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-medium">B3TR Reward</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {formatB3TR(reward.amount)} B3TR
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {reward.multiplier}
            </p>
          </div>

          {!isConnected ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to pay
              </p>
              <ConnectWallet />
            </div>
          ) : bill.paid ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">Payment Completed</p>
              <p className="text-sm text-muted-foreground mt-1">
                Earned {formatB3TR(bill.b3trReward)} B3TR
              </p>
            </div>
          ) : (
            <Button
              onClick={handlePay}
              disabled={isPaying}
              className="w-full"
              size="lg"
            >
              {isPaying ? 'Processing...' : `Pay ${formatVET(bill.amount)}`}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
