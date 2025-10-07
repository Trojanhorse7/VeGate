
# 🚪 VeGate

[![NPM](https://img.shields.io/npm/v/vegate-sdk?color=cb3837&label=SDK%20on%20npm&logo=npm)](https://www.npmjs.com/package/vegate-sdk)

> Seamless bill payments on VeChainThor with B3TR rewards

[![VeChain](https://img.shields.io/badge/VeChain-Testnet-00bfff?logo=vechain)](https://testnet.vechain.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

VeGate is a modern payment infrastructure built on VeChainThor that enables seamless bill creation and payment with QR codes, minimal transaction fees, and automatic B3TR rewards from VeBetterDAO.


---
## ✨ Features

### 🎯 Core Functionality
- **Bill Creation & Management** - Create payment bills with QR codes
- **QR Code Payments** - Scan and pay instantly via QR codes
- **VeChain Integration** - Native VeChainThor blockchain support
- **B3TR Rewards** - Earn 1-2 B3TR tokens per transaction
- **Payment History** - Track all your transactions

### 💳 Payment Features
- **VET Token Support** - Pay with VET tokens
- **Minimal Fees** - Only ~0.02 VET (~$0.0002 USD) per transaction
- **Instant Confirmation** - Transactions confirmed in ~10 seconds
- **Social Impact Multiplier** - 2x rewards for social impact payments

### 🎁 Rewards System
- **Automatic Distribution** - B3TR rewards credited automatically
- **VeBetterDAO Integration** - Powered by VeBetterDAO X2Earn
- **Reward Tracking** - View your total earnings

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **VeWorld Wallet** ([Download](https://www.veworld.net/))
- **VeChain Testnet VET** ([Faucet](https://faucet.vecha.in/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Trojanhorse7/VeGate.git
cd VeGate

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
cp packages/contract/.env.example packages/contract/.env
cp packages/database/.env.example packages/database/.env

# Run database migrations
cd packages/database
pnpm prisma migrate dev
cd ../..

# Build the SDK
cd packages/sdk
pnpm build
cd ../..

# Start the development server
cd apps/web
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
VeGate/
├── apps/
│   └── web/                    # Next.js web application
│       ├── app/                # App router pages
│       ├── components/         # React components
│       ├── hooks/              # Custom React hooks
│       └── lib/                # Utility functions
│
├── packages/
│   ├── contract/               # Smart contracts
│   │   ├── contracts/          # Solidity contracts
│   │   ├── scripts/            # Deployment scripts
│   │   └── deployments/        # Deployment records
│   │
│   ├── database/               # Database package
│   │   └── prisma/             # Prisma schema & migrations
│   │
│   └── sdk/                    # VeGate SDK
│       └── src/                # SDK source code
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # System architecture
│   └── ...
│
├── ROADMAP.md                  # Feature roadmap
├── PRODUCTION_CHECKLIST.md     # Production deployment guide
└── README.md                   # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Hooks + React Query

### Blockchain
- **Network:** VeChainThor (Testnet)
- **Wallet:** VeWorld via @vechain/dapp-kit-react
- **Library:** Connex 2.x
- **Contracts:** Solidity 0.8.20

### Backend
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **API:** Next.js API Routes

### Development
- **Monorepo:** pnpm workspaces + Turbo
- **Package Manager:** pnpm 8+
- **Linting:** ESLint + Prettier

---

## 📖 Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - System design and architecture
- **[Roadmap](./ROADMAP.md)** - Feature roadmap and future plans
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Deployment guide
- **[SDK Documentation](./packages/sdk/README.md)** - SDK usage guide

---

## 🎮 Usage

### Create a Bill

1. Connect your VeWorld wallet
2. Navigate to "Create Bill"
3. Enter amount, category, and description
4. Toggle "Social Impact" for 2x rewards
5. Submit and get your shareable QR code

### Pay a Bill

1. Scan the QR code or visit the payment link
2. Connect your VeWorld wallet
3. Review the bill details and B3TR reward
4. Click "Pay" and confirm in VeWorld
5. Transaction confirmed + B3TR rewards credited! 🎉

### View History

- Navigate to "Dashboard" → "History"
- View all your payments and rewards
- Export transaction history

---

## 🌟 Key Features in Detail

### Minimal Transaction Fees
- VeChainThor's efficient blockchain enables extremely low fees
- Average cost: ~0.02 VET (~$0.0002 USD) per transaction
- Predictable costs for users

### B3TR Rewards
- **1 B3TR** per normal payment
- **2 B3TR** for social impact payments
- Automatically credited via VeBetterDAO X2Earn
- Track earnings in dashboard

### QR Code Generation
- Instant QR code creation
- Shareable payment links
- Works on any device
- No app installation required

### Smart Contracts
- **VeGate Contract** - Handles bill creation and payments
- **Secure & Audited** - Built with OpenZeppelin standards
- **Event Emission** - Track all transactions on-chain

---

## 🔧 Development

### Available Scripts

```bash
# Root directory
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm dev              # Start dev server
pnpm clean            # Clean all build artifacts

# Web app (apps/web)
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# SDK (packages/sdk)
pnpm build            # Build SDK
pnpm dev              # Watch mode

# Contracts (packages/contract)
pnpm compile          # Compile contracts
pnpm deploy           # Deploy to testnet
pnpm test             # Run tests

# Database (packages/database)
pnpm prisma migrate dev    # Run migrations
pnpm prisma studio         # Open Prisma Studio
```

### Environment Variables

See each package's `.env.example` for required variables:
- `apps/web/.env` - Web app configuration
- `packages/contract/.env` - Contract deployment
- `packages/database/.env` - Database connection

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy!

### Deploy Smart Contracts to Mainnet

```bash
cd packages/contract

# Update hardhat.config.ts with mainnet settings
# Add VECHAIN_MAINNET_MNEMONIC to .env

pnpm run deploy:mainnet

# Update contract addresses in packages/sdk/src/vechain/contracts.ts
```

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Priority Areas
- WanBridge cross-chain integration
- UI/UX improvements
- Documentation
- Testing
- Bug fixes

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🔗 Links

- **Website:** [https://vegate.app](https://vegate.app) (Coming Soon)
- **GitHub:** [https://github.com/Trojanhorse7/VeGate](https://github.com/Trojanhorse7/VeGate)
- **VeChain Explorer (Testnet):** [https://explore-testnet.vechain.org](https://explore-testnet.vechain.org)
- **VeBetterDAO:** [https://vebetterdao.org](https://vebetterdao.org)
- **VeGate SDK:** [VeGate SDK on npm](https://www.npmjs.com/package/vegate-sdk)

---

## 🙏 Acknowledgments

- **VeChain Foundation** - For the VeChainThor blockchain
- **VeBetterDAO** - For the B3TR rewards system
- **OpenZeppelin** - For secure smart contract libraries
- **Vercel** - For hosting and deployment

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Trojanhorse7/VeGate/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Trojanhorse7/VeGate/discussions)

---

<div align="center">
  <p>Made with ❤️ for the VeChain ecosystem</p>
  <p>
    <a href="https://github.com/Trojanhorse7/VeGate">⭐ Star us on GitHub</a>
  </p>
</div>
