'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, QrCode, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import QR reader to avoid SSR issues
const QrReader = dynamic(
  () => import('react-qr-reader').then((mod) => mod.QrReader),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading camera...</p>
      </div>
    ),
  }
);

export default function ScanQRPage() {
  const [billId, setBillId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleScan = (result: any) => {
    if (result) {
      try {
        // Extract bill ID from QR code data
        const data = result?.text || result;

        // If it's a URL, extract the bill ID from it
        if (data.includes('/pay/')) {
          const billIdFromUrl = data.split('/pay/')[1]?.split('?')[0];
          if (billIdFromUrl) {
            router.push(`/pay/${billIdFromUrl}`);
          }
        } else {
          // Assume the QR code contains the bill ID directly
          router.push(`/pay/${data}`);
        }
      } catch (err) {
        setError('Invalid QR code. Please try again.');
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setError(
      'Unable to access camera. Please check permissions or enter bill ID manually.'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (billId.trim()) {
      router.push(`/pay/${billId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/vegate-logo.png"
            alt="VeGate Logo"
            width={80}
            height={80}
            unoptimized
          />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Scan QR Code</h1>
          <p className="text-lg text-muted-foreground">
            Pay bills instantly with zero gas fees
          </p>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              {showScanner ? 'Scanning QR Code' : 'Pay Bill'}
            </CardTitle>
            <CardDescription>
              Scan a QR code or manually enter the bill ID to proceed with
              payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* QR Scanner */}
            {showScanner ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-accent">
                  <QrReader
                    onResult={handleScan}
                    constraints={{ facingMode: 'environment' }}
                    containerStyle={{ width: '100%' }}
                    videoContainerStyle={{ paddingTop: '100%' }}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScanner(false);
                    setError('');
                  }}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Scanner
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-accent/10 rounded-full p-6">
                      <Camera className="w-12 h-12 text-accent" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Ready to Scan</p>
                    <p className="text-sm text-muted-foreground">
                      Click the button below to start scanning
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowScanner(true);
                      setError('');
                    }}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              </div>
            )}

            {/* Divider */}
            {!showScanner && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or enter manually
                    </span>
                  </div>
                </div>

                {/* Manual Entry Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="billId">Bill ID</Label>
                    <Input
                      id="billId"
                      type="text"
                      placeholder="Enter bill ID (e.g., bill_123abc...)"
                      value={billId}
                      onChange={(e) => setBillId(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can find the bill ID in the QR code or payment link
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!billId.trim()}
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                {/* Info */}
                <div className="pt-4 border-t border-border">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Bills are paid using VET tokens on VeChain</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>
                        All transactions are gasless thanks to VIP-191 fee
                        delegation
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>Earn B3TR rewards for every payment you make</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Don't have a bill to pay?
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/create')}
          >
            Create a Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
