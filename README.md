# 🎯 **TipLink: Seamless Tipping with Google Authentication**

> *"Tip anyone with just your Google account - no crypto knowledge required"*

## 🌟 **What is TipLink?**

TipLink is a revolutionary tipping platform that brings blockchain payments to mainstream users through Google authentication and Aptos Keyless accounts. Perfect for restaurants and content creators who want to accept tips without the complexity of traditional crypto.

### **Two Core Use Cases:**

1. **🍕 Restaurant QR Code Tipping**
   - Restaurants generate QR codes for tables
   - Customers scan → Google sign-in → instant tip
   - Zero friction, no cash handling

2. **🎨 Creator Profile Tipping**
   - Creators create profiles and share links
   - Fans click → Google sign-in → support creator
   - Direct monetization, no platform fees

## 🚀 **Key Features**

- ✅ **Google Authentication** - No wallets, no complexity
- ✅ **Aptos Keyless Accounts** - Secure, scoped blockchain accounts
- ✅ **Sponsored Transactions** - Zero gas fees for users
- ✅ **Real-time Updates** - Instant tip confirmations
- ✅ **Beautiful UI** - Magic UI components with shadcn/ui
- ✅ **Multi-network Support** - Devnet, Testnet, Mainnet
- ✅ **QR Code System** - Physical-to-digital bridge
- ✅ **Mobile-First Design** - Works on any device

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **UI**: shadcn/ui + Magic UI + Tailwind CSS
- **Blockchain**: Aptos + Keyless Accounts
- **Database**: PostgreSQL + Prisma
- **Authentication**: Google OAuth + Aptos Keyless
- **File Upload**: UploadThing
- **State Management**: Zustand + TanStack Query

## 📦 **Quick Start**

### **1. Clone and Install**

```bash
git clone <repository-url>
cd tiplink
npm install
```

### **2. Environment Setup**

```bash
# Copy environment template
cp .env.example .env.local

# Configure your environment variables
# See NETWORK_SETUP.md for detailed instructions
```

### **3. Database Setup**

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### **4. Start Development**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see TipLink in action!

## 🌐 **Network Configuration**

TipLink supports multiple Aptos networks:

- **Devnet** (default): Development and testing
- **Testnet**: Pre-production testing
- **Mainnet**: Production with real transactions

### **Quick Network Switch**

```bash
# In .env.local
NEXT_PUBLIC_APTOS_NETWORK=devnet    # Development
NEXT_PUBLIC_APTOS_NETWORK=testnet   # Testing
NEXT_PUBLIC_APTOS_NETWORK=mainnet   # Production
```

📖 **Detailed network setup**: See [NETWORK_SETUP.md](./NETWORK_SETUP.md)

## 🏗️ **Project Structure**

```
tiplink/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layouts
│   ├── (public)/          # Public pages
│   ├── tip/               # Tipping flows
│   └── api/               # API routes
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── forms/        # Form components
│   ├── lib/              # Utilities and config
│   │   ├── aptos.ts      # Aptos configuration
│   │   ├── keyless.ts    # Keyless account logic
│   │   └── networks.ts   # Network utilities
│   └── hooks/            # Custom React hooks
├── contracts/            # Move smart contracts
└── prisma/              # Database schema
```

## 🔧 **Configuration**

### **Required Environment Variables**

```bash
# Network
NEXT_PUBLIC_APTOS_NETWORK=devnet

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Database
DATABASE_URL="postgresql://..."

# File Upload
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id

# Contract (deploy your contract first)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### **Optional Configuration**

```bash
# Custom RPC URLs
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com

# Google Maps (for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

## 🎯 **Development Workflow**

### **1. Local Development**
```bash
npm run dev          # Start development server
npm run type-check   # TypeScript checking
npm run lint         # ESLint checking
```

### **2. Database Management**
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:studio    # Open database GUI
npm run db:migrate   # Create migration
```

### **3. Testing**
```bash
npm run test         # Run tests
npm run test:watch   # Watch mode
```

## 🚀 **Deployment**

### **1. Deploy Contracts**

```bash
# Deploy to devnet
aptos move publish --profile devnet

# Deploy to testnet
aptos move publish --profile testnet

# Deploy to mainnet (be careful!)
aptos move publish --profile mainnet
```

### **2. Update Environment**

Update contract addresses in your environment variables after deployment.

### **3. Deploy Frontend**

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🎪 **Demo Features**

### **Restaurant Demo**
1. **QR Code Generation**: Create branded QR codes for tables
2. **Customer Flow**: Scan → Google sign-in → instant tip
3. **Dashboard**: Real-time tip tracking and analytics

### **Creator Demo**
1. **Profile Creation**: Beautiful creator profiles
2. **Fan Tipping**: Direct support without platform fees
3. **Community**: Live tip feed and engagement

### **Technical Highlights**
- **Keyless Accounts**: No wallet complexity
- **Sponsored Transactions**: Zero gas fees
- **Real-time Updates**: Sub-second confirmations
- **Cross-platform**: Works on any device

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 **Documentation**

- [Network Setup Guide](./NETWORK_SETUP.md)
- [Architecture Documentation](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Contract Documentation](./docs/contracts.md)

## 🆘 **Support**

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Aptos Docs](https://aptos.dev)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Aptos ecosystem**

*TipLink makes blockchain payments accessible to everyone through the power of Google authentication and Aptos Keyless accounts.*
