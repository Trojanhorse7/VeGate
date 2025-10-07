'use client';

import { useEffect, useState } from 'react';
import { PaymentPage } from '@/components/payment/PaymentPage';

export default function PayBillPage({
  params,
}: {
  params: { billId: string };
}) {
  const [fullBillId, setFullBillId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch full bill ID from database using short ID
    fetch(`/api/bills/by-short-id/${params.billId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Bill not found');
        return res.json();
      })
      .then((data) => {
        setFullBillId(data.bill.billId);
      })
      .catch((err) => {
        console.error('Error fetching bill:', err);
        setError(err.message);
      });
  }, [params.billId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!fullBillId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">Loading payment...</p>
      </div>
    );
  }

  return <PaymentPage billId={fullBillId} />;
}
