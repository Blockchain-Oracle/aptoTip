# 🌐 **TipLink: Network Configuration Guide**

## 📋 **Overview**

TipLink supports multiple Aptos networks for different use cases:
- **Devnet**: Development and testing (default)
- **Testnet**: Pre-production testing with test tokens
- **Mainnet**: Production with real transactions

## ⚙️ **Environment Configuration**

### **1. Basic Setup**

Copy the example environment file and configure your network:

```bash
cp .env.example .env.local
```

### **2. Network Selection**

Set your desired network in `.env.local`:

```bash
# For Development (default)
NEXT_PUBLIC_APTOS_NETWORK=devnet

# For Testing
NEXT_PUBLIC_APTOS_NETWORK=testnet

# For Production
NEXT_PUBLIC_APTOS_NETWORK=mainnet
```

## 🔗 **Network URLs**

### **Devnet (Development)**
```bash
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com
```

### **Testnet (Testing)**
```bash
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com
```

### **Mainnet (Production)**
```bash
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.mainnet.aptoslabs.com
```

## 🎯 **Network-Specific Considerations**

### **Devnet**
- ✅ **Free tokens**: Use faucet for unlimited test APT
- ✅ **Fast deployment**: Quick contract deployment
- ✅ **No real value**: Safe for development
- ⚠️ **Resets**: Network may reset periodically
- ⚠️ **Limited features**: Some features may not be available

### **Testnet**
- ✅ **Stable**: More stable than devnet
- ✅ **Test tokens**: Free test APT from faucet
- ✅ **Production-like**: Similar to mainnet behavior
- ⚠️ **Limited faucet**: Daily limits on test tokens
- ⚠️ **Not production**: Still for testing only

### **Mainnet**
- ✅ **Real transactions**: Actual value and real users
- ✅ **Full features**: All Aptos features available
- ✅ **Production ready**: Live application
- ⚠️ **Real costs**: Gas fees and real APT required
- ⚠️ **No faucet**: Must acquire real APT

## 🚀 **Quick Network Switching**

### **Method 1: Environment Variables**

1. **Update `.env.local`**:
```bash
# Switch to testnet
NEXT_PUBLIC_APTOS_NETWORK=testnet
```

2. **Restart development server**:
```bash
npm run dev
```

### **Method 2: UI Network Switcher**

The app includes a network switcher component that can be used in development:

```tsx
import { NetworkSwitcher } from '@/components/ui/network-switcher';

// In your component
<NetworkSwitcher />
```

### **Method 3: Network Indicator**

Show current network status:

```tsx
import { NetworkIndicator } from '@/components/ui/network-switcher';

// In your header/footer
<NetworkIndicator />
```

## 🔧 **Contract Deployment**

### **Devnet Deployment**
```bash
# Deploy to devnet
aptos move publish --named-addresses TipLink=0x8176111060a311a98b3a374d3afdd5c7e1428ee89caa18080f910b88165797eb --profile devnet
```

### **Testnet Deployment**
```bash
# Deploy to testnet
aptos move publish --named-addresses TipLink=0x8176111060a311a98b3a374d3afdd5c7e1428ee89caa18080f910b88165797eb --profile testnet
```

### **Mainnet Deployment**
```bash
# Deploy to mainnet (be careful!)
aptos move publish --named-addresses TipLink=0x8176111060a311a98b3a374d3afdd5c7e1428ee89caa18080f910b88165797eb --profile mainnet
```

## 📊 **Network Comparison**

| Feature | Devnet | Testnet | Mainnet |
|---------|--------|---------|---------|
| **Purpose** | Development | Testing | Production |
| **Tokens** | Free (faucet) | Free (limited) | Real APT |
| **Stability** | Unstable | Stable | Very Stable |
| **Cost** | Free | Free | Gas fees |
| **Reset** | Yes | No | No |
| **Users** | Developers | Testers | Real users |

## 🛡️ **Security Considerations**

### **Development (Devnet/Testnet)**
- ✅ Safe to experiment
- ✅ No real value at risk
- ✅ Can reset and try again
- ✅ Share private keys for testing

### **Production (Mainnet)**
- ⚠️ **Never share private keys**
- ⚠️ **Test thoroughly first**
- ⚠️ **Use secure key management**
- ⚠️ **Monitor transactions carefully**

## 🔄 **Migration Between Networks**

### **Devnet → Testnet**
1. Deploy contracts to testnet
2. Update environment variables
3. Test with testnet faucet
4. Verify all functionality

### **Testnet → Mainnet**
1. **Thorough testing** on testnet
2. Deploy contracts to mainnet
3. Update environment variables
4. **Acquire real APT** for gas fees
5. **Monitor closely** for issues

## 📝 **Environment File Template**

```bash
# ================================
# NETWORK CONFIGURATION
# ================================

# Choose your network
NEXT_PUBLIC_APTOS_NETWORK=devnet

# Optional: Custom RPC URLs
# NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
# NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com

# ================================
# CONTRACT ADDRESSES
# ================================

# Update these after deploying to your chosen network
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_MODULE_ADDRESS=0x...

# ================================
# OTHER CONFIGURATION
# ================================

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
DATABASE_URL="postgresql://..."
UPLOADTHING_SECRET=your_uploadthing_secret
```

## 🎯 **Best Practices**

### **Development Workflow**
1. **Start with devnet** for initial development
2. **Move to testnet** for integration testing
3. **Deploy to mainnet** only when ready

### **Testing Strategy**
- **Unit tests**: Run on all networks
- **Integration tests**: Use testnet
- **User acceptance**: Use testnet with real users
- **Production**: Monitor mainnet closely

### **Monitoring**
- **Devnet**: Monitor for network resets
- **Testnet**: Monitor faucet limits
- **Mainnet**: Monitor transactions and errors

## 🆘 **Troubleshooting**

### **Common Issues**

**Network not connecting:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_APTOS_NETWORK

# Verify RPC URL is accessible
curl https://fullnode.devnet.aptoslabs.com/v1
```

**Faucet not working:**
```bash
# Check faucet URL
curl https://faucet.devnet.aptoslabs.com

# Try alternative faucet
curl https://faucet.testnet.aptoslabs.com
```

**Contract not found:**
- Verify contract address is correct for current network
- Check if contract was deployed to the right network
- Ensure module address matches contract address

## 📚 **Additional Resources**

- [Aptos Developer Setup](https://aptos.dev/en/build/get-started/developer-setup)
- [Aptos TypeScript SDK](https://aptos.dev/en/build/sdks/ts-sdk)
- [Aptos Explorer](https://explorer.aptoslabs.com)
- [Aptos Faucet](https://faucet.devnet.aptoslabs.com)

---

**Remember**: Always test thoroughly on devnet and testnet before deploying to mainnet! 🚀 