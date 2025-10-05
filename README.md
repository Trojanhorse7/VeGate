# 🚀 VeGate# VeGate - Gasless Payments on VeChainThor



<div align="center">> **Instant QR-code payment solution with B3TR rewards and IPFS proof storage**



![VeGate Logo](./public/vegate-logo.png)VeGate is a comprehensive payment infrastructure built on VeChainThor that enables merchants, NGOs, and individuals to create and process payments with zero gas fees, instant B3TR rewards, and transparent proof verification via IPFS.



**Gasless Payments & Instant Rewards on VeChainThor**## 🎯 Hackathon Quick Start (3 Days)



[![VeChain](https://img.shields.io/badge/VeChain-TestNet-blue)](https://testnet.vechain.org)### Day 1: Setup & Deploy (4+4 hours)

[![VeBetterDAO](https://img.shields.io/badge/VeBetterDAO-Integrated-green)](https://vebetterdao.org)```bash

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)# 1. Clone and install

git clone <your-repo>

[Demo](https://vegate.app) • [Documentation](./docs) • [Report Bug](https://github.com/yourusername/vegate/issues)cd VeGate

pnpm install

</div>

# 2. Deploy contracts (see packages/contract/DEPLOYMENT.md)

---cd packages/contract

cp .env.example .env

## ✨ What is VeGate?# Add your VECHAIN_TESTNET_MNEMONIC

pnpm run deploy

VeGate revolutionizes blockchain payments by making them **free, instant, and rewarding**. Built on VeChainThor with seamless VeBetterDAO integration, VeGate enables users to create payment bills, share them via QR codes, and earn **B3TR rewards** automatically—all with **zero gas fees**.

# 3. Configure web app

### 🎯 Key Featurescd ../../apps/web

cp .env.example .env.local

- **🆓 Zero Gas Fees**: VIP-191 fee delegation - users never pay for transactions# Update NEXT_PUBLIC_VEGATE_CONTRACT and NEXT_PUBLIC_B3TR_CONTRACT

- **🎁 Automatic Rewards**: Earn 1-2 B3TR tokens per payment via VeBetterDAO```

- **📱 QR Code Payments**: Generate shareable QR codes for instant payments

- **🌍 Social Impact**: 2x rewards for social impact payments### Day 2-3: Build & Polish

- **⚡ Instant Settlement**: Payments and rewards distributed in secondsSee `HACKATHON_TODO.md` for detailed day-by-day tasks.

- **🔒 Secure & Transparent**: Smart contract-based, fully auditable

## 🚀 Features

---

### Core MVP (Implemented)

## 🎥 Demo- ✅ **Bill Creation**: Create payment bills with customizable amounts, tokens, and metadata

- ✅ **Gasless Payments**: VIP-191 fee delegation for zero-gas user experience  

<div align="center">- ✅ **B3TR Rewards**: Instant 1% cashback (2x for social impact payments)

- ✅ **QR Code Payments**: Generate and scan QR codes for instant payment

### Create Bill → Share QR → Get Paid → Earn Rewards- ✅ **VeWorld Integration**: Seamless wallet connection with VeWorld browser extension

- ✅ **IPFS Proof Storage**: Pinata integration for immutable payment proofs

![VeGate Demo](./docs/demo.gif)

### Enhanced Features (In Progress)

</div>- 🔄 **Social Impact Toggle**: 2x B3TR rewards for donations and impact-driven payments

- 🔄 **Branded QR Codes**: Customizable QR codes with logos and brand colors

---- 🔄 **Payment History Dashboard**: Complete transaction tracking with filters

- ✅ **Cross-Chain Payments**: WanBridge integration for 40+ chains (NEW! 🎉)

## 🏗️ Architecture

### SDK Toolkit

```- ✅ **Payment Module**: Create bills, process payments, query status

┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐- ✅ **QR Tools**: Generate standard QR codes

│  User    │ ───> │  VeGate  │ ───> │ VeChain  │ ───> │  B3TR    │- ✅ **Rewards Module**: Calculate and track B3TR rewards

│ (VeWorld)│ Bill │ Contract │ VTHO │   Node   │  🎁  │ Rewards  │- ✅ **VeChain Integration**: Connex, fee delegation, transactions

└──────────┘      └──────────┘      └──────────┘      └──────────┘- ✅ **IPFS Module**: Pinata upload helpers

   No Gas         Smart Contract    VIP-191 Free      Automatic- ✅ **WanBridge Integration**: Cross-chain payments from 40+ blockchains

   Required       Verification      Transactions      Distribution

```## 🌉 NEW: Cross-Chain Payments



### Tech Stack**Pay VeGate bills with ANY cryptocurrency from 40+ chains!**



- **Blockchain**: VeChainThor TestNet```

- **Smart Contracts**: Solidity 0.8.20ETH → VeGate Bill ✅

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSSBTC → VeGate Bill ✅

- **Wallet**: VeChain Kit (VeWorld integration)USDT (ETH/BNB/TRON) → VeGate Bill ✅

- **Database**: PostgreSQL (Supabase)SOL → VeGate Bill ✅

- **Rewards**: VeBetterDAO X2EarnRewardsPoolAnd 36+ more chains!

- **SDK**: Custom TypeScript SDK for payments & QR generation```



---**Key Features:**

- 🌍 **40+ Source Chains**: Ethereum, Bitcoin, Solana, BNB, Polygon, Avalanche, Cardano, Tron, etc.

## 🚀 Quick Start- 🔗 **Automatic Bridging**: WanBridge handles cross-chain transfers automatically

- 🦊 **Multi-Wallet Support**: MetaMask, Phantom, Unisat, TronLink, Lace, Keplr, WalletConnect

### Prerequisites- 🎁 **B3TR Rewards Still Work**: Earn 1-2 B3TR even when paying from other chains

- ⚡ **No VeChain Wallet Needed**: Users can pay without any VeChain setup

- Node.js 18+

- pnpm 8+**📚 Documentation:**

- VeWorld wallet ([Download](https://www.veworld.net/))- **Setup Guide**: See `CROSS_CHAIN_SETUP.md`

- **Feature Details**: See `CROSS_CHAIN_FEATURE.md`

### Installation- **Integration Guide**: See `WANBRIDGE_INTEGRATION.md`



```bash**🎯 Impact:** Expands addressable market from ~1M VeChain users to **500M+ crypto users**!

# Clone repository

git clone https://github.com/yourusername/vegate.git## 📦 Monorepo Structure

cd vegate```

VeGate/

# Install dependencies├── apps/

pnpm install│   └── web/              # Next.js 14 Web Application

├── packages/

# Set up environment│   ├── contract/         # Solidity Contracts (VeGate, B3TRRewards)

cp apps/web/.env.example apps/web/.env│   ├── sdk/              # TypeScript SDK (@vegate/sdk)

cp packages/contract/.env.example packages/contract/.env│   └── database/         # Prisma Schema (optional)

├── HACKATHON_TODO.md     # 3-Day Implementation Plan

# Configure environment variables (see below)└── README.md             # This file

``````



### Environment Setup## � Prerequisites



Edit `apps/web/.env`:- **Node.js** 18+ ([download](https://nodejs.org))

- **pnpm** (`npm install -g pnpm`)

```env- **VeChain Wallet** with testnet VET ([faucet](https://faucet.vecha.in/))

# VeChain Network- **Pinata Account** ([sign up](https://pinata.cloud) - free tier)

NEXT_PUBLIC_VECHAIN_NETWORK=test

NEXT_PUBLIC_VECHAIN_NODE_URL=https://testnet.vechain.org## 🚀 Installation & Setup



# Deployed Contracts### 1. Install Dependencies

NEXT_PUBLIC_VEGATE_CONTRACT=0xdb1a6e06db5e37c1ad3e6ee03cdd9f77b4f9b9df

NEXT_PUBLIC_B3TR_CONTRACT=0x0000000000000000000000000000000000000000```bash

# From project root

# VeBetterDAOpnpm install

NEXT_PUBLIC_X2EARN_REWARDS_POOL=0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38```



# Database (Supabase)### 2. Deploy Smart Contracts

DATABASE_URL=postgresql://...

DIRECT_URL=postgresql://...**Detailed guide:** See `packages/contract/DEPLOYMENT.md`



# Application```bash

NEXT_PUBLIC_APP_URL=http://localhost:3000cd packages/contract

```

# Configure environment

### Run Development Servercp .env.example .env

# Edit .env and add your VECHAIN_TESTNET_MNEMONIC

```bash

# Start all services (SDK + Web)# Compile contracts

pnpm devnpx hardhat compile



# Or run individually# Deploy to VeChain testnet

pnpm --filter @vegate/sdk dev    # SDK in watch modepnpm run deploy

pnpm --filter @vegate/web dev    # Web app```

```

**Output Example:**

Open [http://localhost:3000](http://localhost:3000) 🎉```

Deploying from: 0xYourAddress

---B3TRRewards deployed to: 0xB3TR_ADDRESS

VeGate deployed to: 0xVEGATE_ADDRESS

## 📖 Usage✓ Authorization complete

```

### 1. Create a Payment Bill

### 3. Configure Web Application

```typescript

import { createBill } from '@vegate/sdk';```bash

import { useWallet } from '@vechain/vechain-kit';cd ../../apps/web



function CreateBillComponent() {# Create environment file

  const { account } = useWallet();cp .env.example .env.local

  

  const handleCreate = async () => {# Edit .env.local and update:

    const result = await createBill(account.address, {# - NEXT_PUBLIC_VEGATE_CONTRACT=0xVEGATE_ADDRESS (from deployment)

      token: '0x0000000000000000000000000000456E65726779', // VTHO# - NEXT_PUBLIC_B3TR_CONTRACT=0xB3TR_ADDRESS (from deployment)

      amount: '1000000000000000000', // 1 VTHO# - PINATA_JWT=your_pinata_jwt (from https://pinata.cloud)

      socialImpact: true, // 2x rewards```

      category: 'Donation'

    });### 4. Update SDK Contract Addresses

    

    console.log('Bill created:', result.billId);Edit `packages/sdk/src/vechain/contracts.ts`:

  };

}```typescript

```export const CONTRACTS = {

  testnet: {

### 2. Generate QR Code    VEGATE: '0xVEGATE_ADDRESS',  // ← Paste from deployment

    B3TR: '0xB3TR_ADDRESS',      // ← Paste from deployment

```typescript  },

import { generateQR } from '@vegate/sdk';};

```

const qrCode = await generateQR(billId, 'https://vegate.app');

// Returns base64 PNG data URL### 5. Start Development Server

```

```bash

### 3. Pay a Billcd apps/web

pnpm dev

```typescript```

import { payBill } from '@vegate/sdk';

Visit http://localhost:3000

const result = await payBill(billId);

console.log('Earned rewards:', result.b3trReward); // "2000000000000000000" (2 B3TR)## 🎮 Usage Examples

```

### Create a Bill

---

```typescript

## 📦 Project Structureimport { createBill } from '@vegate/sdk';



```const bill = await createBill({

vegate/  amount: '100',

├── apps/  token: 'VTHO',

│   └── web/                    # Next.js web application  description: 'Coffee payment',

│       ├── app/                # App router pages  socialImpact: false

│       ├── components/         # React components});

│       └── hooks/              # Custom React hooks```

│

├── packages/### Process Payment

│   ├── contract/               # Smart contracts

│   │   ├── contracts/          # Solidity contracts```typescript

│   │   └── scripts/            # Deployment scriptsimport { payBill } from '@vegate/sdk';

│   │

│   ├── sdk/                    # TypeScript SDKconst result = await payBill({

│   │   └── src/  billId: 'bill_123',

│   │       ├── payment/        # Payment functions  proofImage: file, // Upload to IPFS automatically

│   │       ├── qr/             # QR code generation  useGasless: true  // Enable VIP-191 fee delegation

│   │       ├── rewards/        # B3TR rewards});

│   │       └── vechain/        # VeChain integration```

│   │

│   └── database/               # Prisma database### Check Rewards

│       └── prisma/

│           └── schema.prisma   # Database schema```typescript

│import { getRewardsBalance } from '@vegate/sdk';

├── docs/                       # Documentation

└── public/                     # Static assetsconst balance = await getRewardsBalance(userAddress);

```console.log(`B3TR Balance: ${balance}`);

```

---

## 📚 Documentation

## 🔧 Development

- **Smart Contracts:** `packages/contract/README.md`

### Build SDK- **SDK Documentation:** `packages/sdk/README.md`

- **Deployment Guide:** `packages/contract/DEPLOYMENT.md`

```bash- **Hackathon Plan:** `HACKATHON_TODO.md`

cd packages/sdk

pnpm build## 🏗️ Architecture

```

### Smart Contracts

### Deploy Contracts

- **VeGate.sol**: Core payment processing contract

```bash- **B3TRRewards.sol**: ERC20 reward token with minting

cd packages/contract

### Frontend Stack

# Compile

npx hardhat compile- **Next.js 14**: React framework with App Router

- **TypeScript**: Type-safe development

# Deploy to VeChain TestNet- **Tailwind CSS**: Utility-first styling

npx hardhat run scripts/deploy-vechain.ts --network vechain_testnet- **Connex**: VeChain wallet integration

```

### Backend Integration

### Database Migration

- **Pinata IPFS**: Immutable proof storage

```bash- **VeChain SDK**: Blockchain interaction

cd packages/database- **Fee Delegation**: VIP-191 gasless transactions



# Generate Prisma Client## 🧪 Testing

npx prisma generate

```bash

# Push schema to database# Test smart contracts

npx prisma db pushcd packages/contract

```npx hardhat test



### Run Tests# Test web app

cd apps/web

```bashpnpm test

# Run all tests

pnpm test# Run all tests

pnpm test

# Run specific package tests```

pnpm --filter @vegate/sdk test

pnpm --filter @vegate/web test## 🚀 Deployment

```

### Deploy Smart Contracts

---

```bash

## 🎁 How Rewards Workcd packages/contract

pnpm run deploy

VeGate integrates with **VeBetterDAO's X2EarnRewardsPool** for automatic B3TR distribution:```



1. **User pays a bill** → VeGate contract called### Deploy Web App (Vercel)

2. **Payment verified** → Smart contract validates transaction

3. **B3TR calculated** → 1% of payment amount (base)```bash

4. **Social Impact** → 2x multiplier if enabledcd apps/web

5. **Rewards distributed** → Automatically via VeBetterDAOvercel deploy

```

### Reward Formula

## 🔑 Key Technologies

```typescript

Base Reward = Payment Amount × 0.01- **Blockchain**: VeChainThor (VIP-191 fee delegation)

Social Impact = Base Reward × 2- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin 5.0

Final Reward = Social Impact ? (Base × 2) : Base- **Frontend**: Next.js 14, React 18, TypeScript 5.3

```- **Development**: Hardhat, Turbo, pnpm

- **Storage**: Pinata IPFS

**Example:**- **Deployment**: Vercel, VeChain testnet

- Payment: 100 VTHO

- Base Reward: 1 B3TR## 📖 Resources

- With Social Impact: 2 B3TR ✨- **VeChain Docs**: https://docs.vechain.org

- **VeChain Testnet Explorer**: https://explore-testnet.vechain.org

---- **VeChain Faucet**: https://faucet.vecha.in

- **Pinata IPFS**: https://docs.pinata.cloud

## 🔐 Smart Contracts- **VeWorld Wallet**: https://www.veworld.net

- **Fee Delegation**: https://docs.vechain.org/core-concepts/transactions/meta-transaction-features

### VeGate Contract- **VeBetterDAO**: https://www.vebetterdao.org



**Address (TestNet)**: `0xdb1a6e06db5e37c1ad3e6ee03cdd9f77b4f9b9df`## 🤝 Contributing



**Key Functions:**Contributions are welcome! Please read our contributing guidelines and submit PRs.

- `createBill()` - Create payment bill

- `payBill()` - Process payment and distribute rewards## 📄 License

- `getBill()` - Get bill details

MIT License - see LICENSE file for details

### VeBetterDAO Integration

## 🏆 Hackathon Information

**X2EarnRewardsPool**: `0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38`

**Built for:** VeChain Hackathon 2024

VeGate is a registered VeBetterDAO app with automatic reward distribution.**Track:** VeBetterDAO / Sustainability

**Timeline:** 3 days

---**Team:** [Your Team Name]



## 🌐 API Reference### Key Differentiators



### SDK Functions1. ✅ **Gasless UX**: VIP-191 fee delegation for zero-gas payments

2. ✅ **IPFS Proofs**: Immutable payment verification via Pinata

```typescript3. ✅ **B3TR Rewards**: Integration with VeBetterDAO reward system

// Payment4. ✅ **Social Impact**: 2x rewards for impact-driven payments

createBill(userAddress, params)5. ✅ **QR Payments**: Simple, accessible payment flow

payBill(billId)

getBill(billId)### Demo Script

generateBillId(userAddress)

1. **Connect Wallet** (VeWorld browser extension)

// QR Codes2. **Create Bill** (merchant creates payment request)

generateQR(billId, baseUrl, options)3. **Generate QR Code** (displayed for customer)

generateBrandedQR(billId, options, baseUrl)4. **Scan & Pay** (customer scans, approves gasless transaction)

downloadQR(dataUrl, filename)5. **Upload Proof** (photo uploaded to IPFS automatically)

6. **Earn B3TR** (instant 1-2% cashback in B3TR tokens)

// Rewards7. **View History** (complete payment trail with IPFS proofs)

calculateReward(amount, socialImpact)

getRewardBalance(walletAddress)## 📞 Support

getTotalRewardsEarned(walletAddress)

formatB3TR(amount)- **Discord**: [Your Discord]

- **Email**: [Your Email]

// VeChain- **Twitter**: [@YourTwitter]

sendTransaction(clauses, options)- **GitHub Issues**: [Link to Issues]

getVeWorldConnex()

```---



Full API documentation: [SDK Docs](./docs/SDK_DOCUMENTATION.md)**Made with ❤️ for VeChain ecosystem**

- Event emission for tracking

---

### Mobile App (`packages/mobile`)

## 🤝 ContributingReact Native application for mobile payments.



We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.### UI Components (`packages/ui`)

Shared component library built with React and Tailwind CSS.

### Development Workflow

## 🌐 Deployment

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)### Web App Deployment (Vercel)

3. Commit your changes (`git commit -m 'Add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)1. **Fork this repository**

5. Open a Pull Request

2. **Deploy to Vercel:**

---   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vegate)



## 📄 License3. **Set Environment Variables:**

   ```

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

---   NEXT_PUBLIC_VEGATE_CONTRACT=your_deployed_vegate_contract_address

   NEXT_PUBLIC_B3TR_CONTRACT=your_deployed_b3tr_contract_address

## 🙏 Acknowledgments   ```



- **VeChain Foundation** - For VeChainThor blockchain and VIP-191 fee delegation### Alternative Deployment Options

- **VeBetterDAO** - For X2EarnRewardsPool integration and B3TR rewards

- **VeWorld** - For wallet infrastructure- **Netlify**: Connect GitHub repo and deploy

- **Community** - For testing and feedback- **Railway**: Deploy with one click

- **Docker**: Use provided Dockerfile

---- **Self-hosted**: Build and serve static files



## 📞 Contact & Support## 🧪 Testing



- **Website**: [vegate.app](https://vegate.app)The project includes comprehensive testing:

- **Documentation**: [docs/](./docs)

- **Issues**: [GitHub Issues](https://github.com/yourusername/vegate/issues)```bash

- **Twitter**: [@VeGateApp](https://twitter.com/VeGateApp)# Test smart contracts

- **Discord**: [Join Community](https://discord.gg/vegate)cd packages/contract

pnpm test

---

# Test web application

## 🗺️ Roadmapcd packages/web

pnpm test

### Phase 1: Core Features ✅

- [x] Gasless payments# Run all tests

- [x] QR code generationpnpm test:all

- [x] B3TR rewards integration```

- [x] VeChain Kit wallet

**Contract Testing Results:**

### Phase 2: Enhanced Features 🚧- ✅ Bill creation and management

- [ ] Cross-chain payments (WanBridge)- ✅ Payment processing

- [ ] IPFS metadata storage- ✅ Double payment prevention

- [ ] Advanced analytics dashboard- ✅ Event emission

- [ ] Mobile app- ✅ Gas optimization



### Phase 3: Ecosystem 🔮## 📱 Usage Guide

- [ ] Merchant API

- [ ] Recurring payments### For Merchants (Bill Creators)

- [ ] Multi-token support

- [ ] Social features & leaderboard1. **Connect Wallet**: Link your Web3 wallet

2. **Create Bill**: Set amount, token, and description

---3. **Share QR Code**: Send QR code to your customer

4. **Receive Payment**: Get notified when payment is received

<div align="center">

### For Customers (Payers)

**Built with ❤️ on VeChainThor**

1. **Scan QR Code**: Use the app or any QR scanner

Made for [VeChain Hackathon 2025](https://vechain.org)2. **Review Payment**: Check amount and details

3. **Pay**: Complete payment (gasless transaction)

⭐ Star us on GitHub — it helps!4. **Confirmation**: Receive payment confirmation



[Website](https://vegate.app) • [Docs](./docs) • [Twitter](https://twitter.com/VeGateApp)## 🔧 Development



</div>### Local Development


```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm dev

# Start specific package
pnpm dev:web     # Web app only
pnpm dev:mobile  # Mobile app only
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:web
pnpm build:mobile
```

## 🌍 Supported Networks

- **VeChain TestNet** (Primary)
- **VeChain MainNet** (Coming soon)

## 🔗 Important Links

- **Live Demo**: [vegate.vechain.network](https://vegate.vechain.network)
- **Contract Explorer**: [View on VeChain Explorer](https://explore-testnet.vechain.org)
- **Documentation**: [docs/](./docs/)
- **VeChain Network**: [vechain.org](https://vechain.org)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/vegate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/vegate/discussions)
- **Discord**: [Join our Discord](https://discord.gg/vechain)

## 🎯 Roadmap

- [x] Core payment functionality
- [x] QR code integration
- [x] Gasless transactions
- [x] Web application
- [ ] Mobile application release
- [ ] Multi-chain support
- [ ] Advanced analytics
- [ ] Merchant dashboard
- [ ] Recurring payments
- [ ] Invoice management

---

**Built with ❤️ on VeChainThor**

*Empowering the future of digital payments through blockchain technology.*