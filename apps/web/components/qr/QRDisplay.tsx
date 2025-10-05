"use client";

import { useState, useEffect } from "react";
import { generateQR, downloadQR } from "@vegate/sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

interface QRDisplayProps {
  billId: string;
  baseUrl?: string;
}

export function QRDisplay({ billId, baseUrl }: QRDisplayProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const paymentUrl = `${baseUrl || window.location.origin}/pay/${billId}`;

  useEffect(() => {
    generateQR(billId, baseUrl).then(setQrCode);
  }, [billId, baseUrl]);

  const handleDownload = () => {
    if (qrCode) {
      downloadQR(qrCode, `vegate-bill-${billId.slice(0, 8)}.png`);
      toast.success("QR code downloaded");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast.success("Payment link copied");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "VeGate Payment",
          text: "Pay with VeGate",
          url: paymentUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {qrCode ? (
            <img src={qrCode} alt="Payment QR Code" className="w-64 h-64 rounded-lg" />
          ) : (
            <div className="w-64 h-64 bg-secondary animate-pulse rounded-lg" />
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <div className="w-full p-3 bg-secondary rounded-lg text-center">
            <p className="text-xs text-muted-foreground mb-1">Payment Link</p>
            <p className="text-sm font-mono break-all">{paymentUrl}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
