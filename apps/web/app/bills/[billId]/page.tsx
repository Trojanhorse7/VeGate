'use client';

import { useEffect, useState } from 'react';
import { QRDisplay } from '@/components/qr/QRDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { getFullBillId, getShortBillId } from '@vegate/sdk';

export default function BillDetailsPage({
  params,
}: {
  params: { billId: string };
}) {
  const shortBillId = params.billId; // URL param is already the short ID
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    const fetchBill = async () => {
      try {
        // Fetch by short bill ID
        const res = await fetch(`/api/bills/by-short-id/${shortBillId}`);

        if (res.status === 404 && retryCount < maxRetries) {
          // Bill not in database yet, retry
          retryCount++;
          console.log(
            `Bill not found, retrying... (${retryCount}/${maxRetries})`
          );
          setTimeout(fetchBill, retryDelay);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch bill');
        }

        const data = await res.json();
        setBill(data.bill);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching bill:', err);
        setError(err.message || 'Failed to load bill');
        setLoading(false);
      }
    };

    fetchBill();
  }, [shortBillId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/pay/${shortBillId}`;
    navigator.clipboard.writeText(url);
    toast.success('Payment link copied');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">Loading bill details...</p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error || 'Bill not found'}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">{bill.amount} VTHO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{bill.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                {bill.paid ? (
                  <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Paid
                  </Badge>
                ) : (
                  <Badge>Unpaid</Badge>
                )}
              </div>
              {bill.socialImpact && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Social Impact</span>
                  <Badge variant="secondary">2x Rewards</Badge>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-sm">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2">
            <Button
              onClick={handleCopyLink}
              className="w-full"
              variant="outline"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Payment Link
            </Button>
            <Button
              onClick={async () => {
                if (navigator.share) {
                  navigator.share({
                    title: 'VeGate Payment',
                    url: `${window.location.origin}/pay/${shortBillId}`,
                  });
                }
              }}
              className="w-full"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share QR Code
            </Button>
          </div>
        </div>

        <div>
          <QRDisplay billId={bill.billId} />
        </div>
      </div>
    </div>
  );
}
