'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowRight,
  Clock,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getSupportedChains,
  getSupportedTokens,
  createCrossChainTx,
  waitForBridgeCompletion,
  type SupportedChain,
  type Token,
  type BridgeTransaction,
} from '@vegate/sdk';

interface CrossChainPaymentProps {
  billId: string;
  billAmount: string;
  billToken: string;
  recipientAddress: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CrossChainPayment({
  billId,
  billAmount,
  billToken,
  recipientAddress,
  onSuccess,
  onCancel,
}: CrossChainPaymentProps) {
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<BridgeTransaction | null>(
    null
  );
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [step, setStep] = useState<
    'select' | 'approve' | 'bridge' | 'complete'
  >('select');

  const chains = getSupportedChains();
  const allTokens = getSupportedTokens();

  // Filter tokens for selected chain
  const availableTokens = allTokens.filter(
    (token) => token.chain === selectedChain
  );

  const getEstimatedTime = (chain: string) => {
    const times: Record<string, string> = {
      BTC: '~60 min',
      ETH: '~5 min',
      BNB: '~3 min',
      MATIC: '~2 min',
      AVAX: '~1 min',
      SOL: '~30 sec',
      TRX: '~3 min',
      ADA: '~5 min',
    };
    return times[chain] || '~5 min';
  };

  const handleBridge = async () => {
    if (!selectedChain || !selectedToken) {
      setError('Please select chain and token');
      return;
    }

    setIsLoading(true);
    setError('');
    setStep('bridge');

    try {
      // Get user's address from wallet
      const userAddress = await getUserAddress(selectedChain);

      // Create cross-chain transaction
      const result = await createCrossChainTx({
        fromChain: selectedChain,
        toChain: 'VET',
        fromAccount: userAddress,
        toAccount: recipientAddress,
        fromToken: selectedToken,
        toToken: billToken,
        amount: billAmount,
        partner: 'vegate',
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create transaction');
      }

      // Check if approval is needed (ERC20 tokens)
      if (result.data.approveCheck) {
        setStep('approve');
        await handleApproval(result.data.approveCheck);
      }

      // Sign and send transaction
      const tx = await signTransaction(result.data.tx, selectedChain);
      setTxHash(tx.hash);

      // Monitor bridge status
      setBridgeStatus({
        txHash: tx.hash,
        status: 'pending',
        timestamp: Date.now(),
        tokenPair: '',
        lockHash: '',
        sendAmount: billAmount,
        receiveAmount: result.data.receiveAmount,
      });

      const finalStatus = await waitForBridgeCompletion(
        tx.hash,
        (status) => {
          setBridgeStatus(status);
        },
        false, // mainnet
        60 // 10 minutes max
      );

      if (finalStatus.status === 'Success') {
        setStep('complete');
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Bridge transaction failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process cross-chain payment');
      setStep('select');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (approveCheck: any) => {
    // Implementation for ERC20 approval
    // This would interact with the user's wallet
    console.log('Approval needed:', approveCheck);
  };

  const signTransaction = async (txData: any, chain: string) => {
    // Implementation for signing transaction with appropriate wallet
    // MetaMask for EVM chains, Phantom for Solana, etc.
    console.log('Signing transaction:', txData, chain);

    // Placeholder - actual implementation would use wallet connectors
    return { hash: '0x...' };
  };

  const getUserAddress = async (chain: string): Promise<string> => {
    // Get user's address from connected wallet
    // Would use WalletConnect, MetaMask, etc.
    return '0x...';
  };

  if (step === 'bridge' || step === 'approve') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 'approve' && 'Approve Token'}
            {step === 'bridge' && 'Bridging in Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={
                  bridgeStatus?.status === 'Processing'
                    ? 'default'
                    : 'secondary'
                }
              >
                {bridgeStatus?.status || 'Initiating...'}
              </Badge>
            </div>

            {txHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">TX Hash:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </code>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Time:</span>
              <span>{getEstimatedTime(selectedChain)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{
                width: bridgeStatus?.status === 'Processing' ? '60%' : '30%',
              }}
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please wait while your transaction is being processed. Do not
              close this window.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            Bridge Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <p className="text-lg mb-2">
              ✅ Your payment has been bridged successfully!
            </p>
            <p className="text-sm text-muted-foreground">
              Tokens are now available on VeChain
            </p>
          </div>

          <div className="space-y-2 bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Sent:</span>
              <span className="font-medium">
                {bridgeStatus?.sendAmount} (from {selectedChain})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Received:</span>
              <span className="font-medium">
                {bridgeStatus?.receiveAmount} VTHO
              </span>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your bill will be paid automatically with the bridged tokens.
            </AlertDescription>
          </Alert>

          <Button onClick={onSuccess} className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay with Crypto from Any Chain</CardTitle>
        <p className="text-sm text-muted-foreground">
          Bridge tokens from 40+ chains to pay this bill
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chain Selection */}
        <div className="space-y-2">
          <Label>Select Source Chain</Label>
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a blockchain..." />
            </SelectTrigger>
            <SelectContent>
              {chains
                .filter((chain) => chain.symbol !== 'VET') // Exclude VeChain
                .map((chain) => (
                  <SelectItem key={chain.symbol} value={chain.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{chain.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {getEstimatedTime(chain.symbol)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Token Selection */}
        {selectedChain && (
          <div className="space-y-2">
            <Label>Select Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a token..." />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center justify-between w-full">
                      <span>{token.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {token.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Bridge Info */}
        {selectedChain && selectedToken && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{selectedChain}</span>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">VeChain (VET)</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Estimated Time:</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{getEstimatedTime(selectedChain)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            A small bridge fee will be deducted from the amount received. Your
            tokens will arrive on VeChain and the bill will be paid
            automatically.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBridge}
            className="flex-1"
            disabled={!selectedChain || !selectedToken || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Bridge & Pay'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
