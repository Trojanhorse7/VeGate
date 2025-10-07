# @vegate/sdk

> Official SDK for VeGate - Bill payments on VeChainThor with B3TR rewards

[![npm version](https://img.shields.io/npm/v/@vegate/sdk.svg)](https://www.npmjs.com/package/@vegate/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Features

- � **Bill Payments** - Create and pay bills on VeChain
- 🎁 **B3TR Rewards** - Earn 1-2 B3TR per transaction
- 📱 **QR Code Generation** - Built-in QR code support
- 🔗 **VeChainThor Integration** - Native VeChain blockchain support
- 💪 **TypeScript First** - Full type safety
- 📦 **Tree-shakable** - ESM and CJS builds
- ⚡ **Lightweight** - Minimal dependencies

## 🚧 Coming Soon

### WanBridge Integration
Cross-chain bill payments are in development! Soon you'll be able to:
- Pay VeChain bills with assets from other chains (Ethereum, BSC, Polygon, etc.)
- Bridge tokens seamlessly with WanBridge
- Track bridge status and history
- Get real-time quotes for cross-chain transactions

### VIP-191 Fee Delegation (Future)
Gasless transactions may be added as a premium feature in the future, depending on user demand and use cases.

### Enhanced Analytics
- Transaction history tracking
- Reward analytics dashboard
- Payment trend insights

---

## 📦 Installation

```bash
npm install @vegate/sdk
# or
pnpm add @vegate/sdk
# or
yarn add @vegate/sdk
```

---

## 🎯 Quick Start

### Create a Payment Bill

```typescript
import { createBill } from '@vegate/sdk';

const bill = await createBill(walletAddress, {
  amount: '1000000000000000000', // 1 VET in wei
  currency: 'VET',
  category: 'shopping',
  description: 'Online purchase',
  socialImpact: true // Enable 2x rewards
});

console.log('Bill ID:', bill.billId);
console.log('QR Code:', bill.qrCode);
```

### Generate QR Code

```typescript
import { generateQR, generateBrandedQR } from '@vegate/sdk';

// Simple QR code
const qrDataUrl = await generateQR('bill_123456');

// Branded QR code with logo
const brandedQR = await generateBrandedQR('bill_123456', {
  logo: '/logo.png',
  width: 400,
  margin: 2
});
```

### Pay a Bill

```typescript
import { payBill } from '@vegate/sdk';

const receipt = await payBill(billId, payerAddress);

console.log('Transaction Hash:', receipt.txHash);
console.log('B3TR Rewards:', receipt.rewards);
```

### Check Reward Balance

```typescript
import { getRewardBalance, formatB3TR } from '@vegate/sdk';

const balance = await getRewardBalance(walletAddress);
const formatted = formatB3TR(balance);

console.log(`Balance: ${formatted} B3TR`);
```

---

## 📚 API Reference

### Bill Management

#### `createBill(creatorAddress, billData)`

Create a new payment bill.

**Parameters:**
- `creatorAddress` (string) - Wallet address of bill creator
- `billData` (BillData) - Bill configuration object
  - `amount` (string) - Payment amount in wei
  - `currency` (string) - Currency code (VET, VTHO)
  - `category` (string) - Bill category
  - `description` (string, optional) - Bill description
  - `socialImpact` (boolean, optional) - Enable 2x rewards

**Returns:** `Promise<Bill>`

```typescript
const bill = await createBill('0x...', {
  amount: '1000000000000000000',
  currency: 'VET',
  category: 'shopping',
  socialImpact: true
});
```

#### `getBill(billId)`

Fetch bill details by ID.

**Parameters:**
- `billId` (string) - Unique bill identifier

**Returns:** `Promise<Bill>`

```typescript
const bill = await getBill('bill_123456');
```

#### `payBill(billId, payerAddress)`

Pay an existing bill.

**Parameters:**
- `billId` (string) - Bill ID to pay
- `payerAddress` (string) - Wallet address of payer

**Returns:** `Promise<PaymentReceipt>`

```typescript
const receipt = await payBill('bill_123456', '0x...');
```

---

### QR Code Generation

#### `generateQR(data, options?)`

Generate a QR code as data URL.

**Parameters:**
- `data` (string) - Data to encode (bill ID or URL)
- `options` (QROptions, optional) - QR code options
  - `width` (number) - QR code width (default: 300)
  - `margin` (number) - Margin size (default: 1)
  - `errorCorrectionLevel` (string) - Error correction ('L', 'M', 'Q', 'H')

**Returns:** `Promise<string>` - Base64 data URL

```typescript
const qr = await generateQR('bill_123456', {
  width: 400,
  margin: 2,
  errorCorrectionLevel: 'H'
});
```

#### `generateBrandedQR(data, options)`

Generate a branded QR code with logo.

**Parameters:**
- `data` (string) - Data to encode
- `options` (BrandedQROptions) - Branding options
  - `logo` (string) - Logo image URL or data URL
  - `width` (number) - QR code width
  - `margin` (number) - Margin size
  - `logoSize` (number) - Logo size percentage (default: 20)

**Returns:** `Promise<string>` - Base64 data URL

```typescript
const qr = await generateBrandedQR('bill_123456', {
  logo: '/logo.png',
  width: 500,
  logoSize: 25
});
```

#### `generateQRSVG(data, options?)`

Generate QR code as SVG string.

**Returns:** `Promise<string>` - SVG markup

```typescript
const svg = await generateQRSVG('bill_123456');
```

#### `downloadQR(dataUrl, filename?)`

Download QR code as PNG file.

**Parameters:**
- `dataUrl` (string) - QR code data URL
- `filename` (string, optional) - Download filename (default: 'qrcode.png')

```typescript
const qr = await generateQR('bill_123456');
downloadQR(qr, 'payment-qr.png');
```

---

### Rewards

#### `getRewardBalance(walletAddress, network?)`

Get user's B3TR token balance.

**Parameters:**
- `walletAddress` (string) - Wallet address
- `network` (string, optional) - Network ('main' or 'test', default: 'test')

**Returns:** `Promise<string>` - Balance in wei

```typescript
const balance = await getRewardBalance('0x...');
```

#### `getTotalRewardsEarned(walletAddress, network?)`

Get total B3TR rewards earned by user.

**Returns:** `Promise<string>` - Total rewards in wei

```typescript
const earned = await getTotalRewardsEarned('0x...');
```

#### `getRewardInfo(walletAddress, network?)`

Get comprehensive reward information.

**Returns:** `Promise<RewardInfo>`
- `balance` (string) - Current balance
- `totalEarned` (string) - Total earned
- `pendingRewards` (string) - Pending rewards

```typescript
const info = await getRewardInfo('0x...');
console.log('Balance:', info.balance);
console.log('Total Earned:', info.totalEarned);
```

#### `calculateReward(amount, socialImpact?)`

Calculate expected reward for a payment.

**Parameters:**
- `amount` (string | bigint) - Payment amount in wei
- `socialImpact` (boolean, optional) - Apply 2x multiplier

**Returns:** `string` - Reward amount in wei

```typescript
const reward = calculateReward('1000000000000000000', true);
// Returns: 2% of amount (with social impact bonus)
```

#### `formatB3TR(amount)`

Format B3TR amount for display.

**Parameters:**
- `amount` (string | bigint) - Amount in wei

**Returns:** `string` - Formatted amount

```typescript
const formatted = formatB3TR('1500000000000000000');
// Returns: "1.50 B3TR"
```

---

### VeChain Integration

#### `getVeWorldConnex()`

Get Connex instance from VeWorld wallet.

**Returns:** `Connex`

```typescript
const connex = getVeWorldConnex();
const bestBlock = connex.thor.status.head;
```

#### `isVeWorldAvailable()`

Check if VeWorld wallet is available.

**Returns:** `boolean`

```typescript
if (isVeWorldAvailable()) {
  // Wallet is available
}
```

---

## 🔧 TypeScript Types

All types are exported for your convenience:

```typescript
import type {
  Bill,
  BillData,
  BillStatus,
  PaymentReceipt,
  RewardInfo,
  QROptions,
  BrandedQROptions
} from '@vegate/sdk';
```

### Bill

```typescript
interface Bill {
  billId: string;
  creatorAddress: string;
  amount: string;
  currency: string;
  category: string;
  description?: string;
  status: BillStatus;
  qrCode: string;
  createdAt: Date;
  paidAt?: Date;
  socialImpact: boolean;
}
```

### BillData

```typescript
interface BillData {
  amount: string;
  currency: string;
  category: string;
  description?: string;
  socialImpact?: boolean;
}
```

### PaymentReceipt

```typescript
interface PaymentReceipt {
  txHash: string;
  billId: string;
  payerAddress: string;
  amount: string;
  rewards: string;
  timestamp: Date;
}
```

### RewardInfo

```typescript
interface RewardInfo {
  balance: string;
  totalEarned: string;
  pendingRewards: string;
}
```

---

## 🌐 Network Configuration

The SDK works with both VeChain mainnet and testnet:

```typescript
// Testnet (default)
const balance = await getRewardBalance(address, 'test');

// Mainnet
const balance = await getRewardBalance(address, 'main');
```

**Smart Contract Addresses:**

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| VeGate | `0xdb1a6e06db5e37c1ad3e6ee03cdd9f77b4f9b9df` | TBA |
| X2EarnRewardsPool | `0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38` | TBA |

---

## 🎨 Examples

### Complete Payment Flow

```typescript
import {
  createBill,
  generateBrandedQR,
  payBill,
  getRewardInfo
} from '@vegate/sdk';

// 1. Create bill
const bill = await createBill(creatorAddress, {
  amount: '1000000000000000000', // 1 VET
  currency: 'VET',
  category: 'shopping',
  socialImpact: true
});

// 2. Generate QR code
const qrCode = await generateBrandedQR(bill.billId, {
  logo: '/logo.png',
  width: 400
});

// 3. Display QR to payer
// (In your UI)

// 4. Payer scans and pays
const receipt = await payBill(bill.billId, payerAddress);

// 5. Check rewards
const rewards = await getRewardInfo(payerAddress);
console.log('Earned:', formatB3TR(rewards.totalEarned));
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { getRewardBalance, formatB3TR } from '@vegate/sdk';

function useRewards(address: string) {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    getRewardBalance(address)
      .then(bal => setBalance(formatB3TR(bal)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [address]);

  return { balance, loading };
}
```

---

## 🔐 Security

- All transactions are signed by the user's wallet
- No private keys are stored or transmitted
- Smart contracts are audited and verified
- Fee delegation via VeBetterDAO

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/Trojanhorse7/VeGate/blob/main/CONTRIBUTING.md)

---

## 📄 License

MIT © Trojanhorse7

---

## 🔗 Links

- [Documentation](https://github.com/Trojanhorse7/VeGate)
- [GitHub Repository](https://github.com/Trojanhorse7/VeGate)
- [Issue Tracker](https://github.com/Trojanhorse7/VeGate/issues)
- [VeChain Docs](https://docs.vechain.org)
- [VeBetterDAO](https://www.vebetterdao.org)

---

## 💬 Support

- GitHub Issues: [Report a bug](https://github.com/Trojanhorse7/VeGate/issues)
- Discord: Join VeChain community
- Twitter: [@VeGate](#)

---

**Made with ❤️ for the VeChain ecosystem**
