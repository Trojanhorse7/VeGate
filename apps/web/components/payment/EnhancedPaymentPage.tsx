'use client';

import { useEffect, useState } from 'react';
import { useBill } from '@/hooks/useBill';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { CrossChainPayment } from '@/components/payment/CrossChainPayment';
import { CheckCircle2, Coins, Wallet, Globe } from 'lucide-react';
import { formatB3TR, calculatePotentialReward } from '@vegate/sdk';

interface EnhancedPaymentPageProps {
  billId: string;
}

export function EnhancedPaymentPage({ billId }: EnhancedPaymentPageProps) {
  const { isConnected } = useWallet();
  const { pay, isPaying, fetch } = useBill();
  const [bill, setBill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'vechain' | 'crosschain'>(
    'vechain'
  );

  useEffect(() => {
    fetch(billId).then((data) => {
      setBill(data);
      setIsLoading(false);
    });
  }, [billId, fetch]);

  const handleVeChainPay = async () => {
    const result = await pay(billId);
    if (result) {
      const updatedBill = await fetch(billId);
      setBill(updatedBill);
    }
  };

  const handleCrossChainSuccess = async () => {
    // Refresh bill data after cross-chain payment completes
    const updatedBill = await fetch(billId);
    setBill(updatedBill);
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
    <div className="container max-w-4xl mx-auto py-12">
      <div className="grid gap-6 md:grid-cols-[1fr_400px]">
        {/* Left Column - Bill Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Details</CardTitle>
              {bill.paid ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Paid
                </Badge>
              ) : (
                <Badge>Unpaid</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bill Information */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill ID</span>
                <span className="font-mono text-sm">
                  {billId.slice(0, 10)}...{billId.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-lg">
                  {bill.amount} VTHO
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{bill.category}</span>
              </div>
              {bill.socialImpact && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Social Impact</span>
                  <Badge variant="secondary">2x Rewards 🌱</Badge>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receiver</span>
                <span className="font-mono text-sm">
                  {bill.receiver.slice(0, 6)}...{bill.receiver.slice(-4)}
                </span>
              </div>
            </div>

            {/* B3TR Reward Preview */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-medium">B3TR Reward</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  {formatB3TR(reward.amount)} B3TR
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {reward.multiplier}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically credited upon successful payment
              </p>
            </div>

            {/* Payment Status */}
            {bill.paid && (
              <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-lg font-semibold text-green-700">
                  Payment Completed
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Earned {formatB3TR(bill.b3trReward)} B3TR 🎉
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Payment Options */}
        <div className="space-y-6">
          {!isConnected ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 py-6">
                  <Wallet className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Connect your wallet to pay this bill
                  </p>
                  <ConnectWallet />
                </div>
              </CardContent>
            </Card>
          ) : !bill.paid ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as any)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="vechain" className="gap-2">
                      <Wallet className="h-4 w-4" />
                      VeChain
                    </TabsTrigger>
                    <TabsTrigger value="crosschain" className="gap-2">
                      <Globe className="h-4 w-4" />
                      Any Chain
                    </TabsTrigger>
                  </TabsList>

                  {/* VeChain Payment */}
                  <TabsContent value="vechain" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Pay directly with VET or VTHO from your VeChain wallet
                      </div>

                      <div className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Network:
                          </span>
                          <span className="font-medium">VeChain</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Gas Fee:
                          </span>
                          <span className="font-medium text-green-600">
                            FREE ⚡
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Speed:</span>
                          <span className="font-medium">~10 seconds</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleVeChainPay}
                        disabled={isPaying}
                        className="w-full"
                        size="lg"
                      >
                        {isPaying ? 'Processing...' : `Pay ${bill.amount} VTHO`}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Cross-Chain Payment */}
                  <TabsContent value="crosschain" className="mt-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      Pay with ETH, BTC, USDT, BNB, or tokens from 40+ chains
                    </div>

                    <CrossChainPayment
                      billId={billId}
                      billAmount={bill.amount}
                      billToken={bill.token}
                      recipientAddress={bill.receiver}
                      onSuccess={handleCrossChainSuccess}
                      onCancel={() => setPaymentMethod('vechain')}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
                  <p className="text-xl font-semibold mb-2">Bill Paid! 🎉</p>
                  <p className="text-sm text-muted-foreground">
                    Thank you for your payment
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Coins className="h-4 w-4 text-blue-600" />
                  About B3TR Rewards
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• Earn 1 B3TR per successful payment</li>
                  <li>• Get 2 B3TR for social impact payments</li>
                  <li>• Rewards credited automatically</li>
                  <li>• Works with both payment methods</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
