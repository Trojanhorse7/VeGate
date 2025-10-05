'use client';

import { useState } from 'react';
import { useBill } from '@/hooks/useBill';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Wallet, AlertCircle } from 'lucide-react';

export function CreateBillForm() {
  const { create, isCreating } = useBill();
  const { address, isConnected } = useWallet();
  const [formData, setFormData] = useState({
    token: '0x0000000000000000000000000000000000000000', // VET
    amount: '',
    socialImpact: false,
    category: 'E-commerce' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bill = await create(formData);
    if (bill) {
      // Redirect to QR page or show modal
      window.location.href = `/bills/${bill.billId}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Payment Bill</CardTitle>
        <CardDescription>
          Generate a QR code for VET payments with zero gas fees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected && (
          <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your VeWorld wallet using the button in the top
              right corner to create bills.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Token</Label>
            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
              <div className="flex-1">
                <p className="text-sm font-medium">VET (VeChain Token)</p>
                <p className="text-xs text-muted-foreground">
                  Gasless payments with zero fees
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue children={''} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Subscription">Subscription</SelectItem>
                <SelectItem value="Donation">Donation</SelectItem>
                <SelectItem value="Utility">Utility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="social-impact">Social Impact Payment</Label>
              <p className="text-sm text-muted-foreground">
                Enable 2x B3TR rewards for donations
              </p>
            </div>
            <Switch
              id="social-impact"
              checked={formData.socialImpact}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, socialImpact: checked })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreating || !isConnected}
          >
            {!isConnected ? (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet First
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                {isCreating ? 'Creating...' : 'Generate Payment Bill'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
