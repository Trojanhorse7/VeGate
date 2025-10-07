'use client';

import { useState, useEffect } from 'react';
import { generateBrandedQR, downloadQR, getShortBillId } from '@vegate/sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRDisplayProps {
  billId: string;
  baseUrl?: string;
}

export function QRDisplay({ billId, baseUrl }: QRDisplayProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [shortBillId, setShortBillId] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  useEffect(() => {
    // Generate short bill ID hash
    getShortBillId(billId)
      .then((shortId) => {
        setShortBillId(shortId);
        const url = `${baseUrl || window.location.origin}/pay/${shortId}`;
        setPaymentUrl(url);

        // Generate branded QR with VeGate logo using SHORT bill ID
        return generateBrandedQR(
          shortId,
          {
            size: 512,
            logo: '/vegate-logo.png', // VeGate logo from public folder
            logoSize: 20, // 20% of QR size
            errorCorrectionLevel: 'H', // High correction for logo
            backgroundColor: '#FFFFFF',
            foregroundColor: '#000000',
          },
          baseUrl
        );
      })
      .then(setQrCode)
      .catch((error) => {
        console.error(
          'Failed to generate branded QR, falling back to standard:',
          error
        );
        // Fallback to standard QR if branded fails
        import('@vegate/sdk').then(({ generateQR }) => {
          generateQR(shortBillId, baseUrl).then(setQrCode);
        });
      });
  }, [shortBillId, baseUrl]);

  const handleDownload = () => {
    if (qrCode) {
      downloadQR(qrCode, `vegate-bill-${billId.slice(0, 8)}.png`);
      toast.success('QR code downloaded');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast.success('Payment link copied');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VeGate Payment',
          text: 'Pay with VeGate',
          url: paymentUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
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
            <img
              src={qrCode}
              alt="Payment QR Code"
              className="w-64 h-64 rounded-lg"
            />
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
