"use client";

import { useEffect, useState } from "react";
import { QRDisplay } from "@/components/qr/QRDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function BillDetailsPage({ params }: { params: { billId: string } }) {
  const [bill, setBill] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/bills/${params.billId}`)
      .then((res) => res.json())
      .then((data) => setBill(data.bill));
  }, [params.billId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/pay/${params.billId}`;
    navigator.clipboard.writeText(url);
    toast.success("Payment link copied");
  };

  if (!bill) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
                  <Badge variant="success">Paid</Badge>
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
            <Button onClick={handleCopyLink} className="w-full" variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy Payment Link
            </Button>
            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "VeGate Payment",
                    url: `${window.location.origin}/pay/${params.billId}`,
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
          <QRDisplay billId={params.billId} />
        </div>
      </div>
    </div>
  );
}
