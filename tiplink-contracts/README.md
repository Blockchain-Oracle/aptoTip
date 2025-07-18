This is hard for me# TipLink Smart Contract

**Deployed on Aptos Devnet**

- **Contract Address**: `b9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a`
- **Module Name**: `tipping_system`
- **Full Module ID**: `b9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a::tipping_system`
- **Network**: Devnet
- **Explorer**: [View Contract](https://explorer.aptoslabs.com/account/b9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a?network=devnet)

## 🏗️ Contract Functions

### **Entry Functions (Transactions)**

#### 1. `initialize_platform(admin: &signer)`
- **Purpose**: Initialize the platform (run once)
- **Who**: Contract admin only
- **Parameters**: None (uses admin signer)

#### 2. `create_profile(user: &signer, profile_type: u8)`
- **Purpose**: Create restaurant or creator profile
- **Parameters**:
  - `profile_type`: `1` for restaurant, `2` for creator
- **Events**: Emits `ProfileEvent`

#### 3. `send_tip(tipper: &signer, recipient: address, amount: u64, message: String)`
- **Purpose**: Send tip to restaurant/creator
- **Parameters**:
  - `recipient`: Address of tip recipient
  - `amount`: Tip amount in octas (1 APT = 100,000,000 octas)
  - `message`: Tip message
- **Fee**: 2% platform fee
- **Events**: Emits `TipEvent`

### **View Functions (Read-only)**

#### 1. `get_profile(user: address)`
- **Returns**: `(address, u8, u64, u64, u64, u64, bool, u64)`
  - owner, profile_type, tips_received, tips_sent, count_received, count_sent, active, created_at

#### 2. `profile_exists(user: address)`
- **Returns**: `bool`

#### 3. `get_platform_config()`
- **Returns**: `(u64, address, bool, u64, u64)`
  - fee_rate, treasury, paused, total_volume, total_fees

#### 4. `calculate_tip_breakdown(amount: u64)`
- **Returns**: `(u64, u64)`
  - net_amount, platform_fee

## 📊 Events

### `TipEvent`
```move
struct TipEvent {
    tipper: address,
    recipient: address,
    amount: u64,
    platform_fee: u64,
    net_amount: u64,
    timestamp: u64,
    message: String,
    tip_id: u64,
}
```

### `ProfileEvent`
```move
struct ProfileEvent {
    owner: address,
    profile_type: u8,
    action: String, // "created", "updated", "deactivated"
    timestamp: u64,
}
```

## 🚀 Frontend Integration

### **TypeScript SDK Usage**

```typescript
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const CONTRACT_ADDRESS = "b9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a";
const MODULE_NAME = "tipping_system";

// Create Profile
const createProfile = async (keylessAccount, profileType) => {
  const transaction = await aptos.transaction.build.simple({
    sender: keylessAccount.accountAddress,
    data: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::create_profile`,
      functionArguments: [profileType],
    },
  });
  
  return await aptos.signAndSubmitTransaction({
    signer: keylessAccount,
    transaction,
  });
};

// Send Tip
const sendTip = async (keylessAccount, recipient, amount, message) => {
  const transaction = await aptos.transaction.build.simple({
    sender: keylessAccount.accountAddress,
    data: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_tip`,
      functionArguments: [recipient, amount, message],
    },
  });
  
  return await aptos.signAndSubmitTransaction({
    signer: keylessAccount,
    transaction,
  });
};

// Get Profile
const getProfile = async (address) => {
  const result = await aptos.view({
    payload: {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_profile`,
      functionArguments: [address],
    },
  });
  return result[0];
};
```

### **Amount Conversions**

```typescript
// Convert APT to Octas
const aptToOctas = (apt) => Math.floor(apt * 100_000_000);

// Convert Octas to APT  
const octasToApt = (octas) => octas / 100_000_000;

// Example tip amounts
const TIP_AMOUNTS = {
  small: aptToOctas(0.01),   // 1,000,000 octas
  medium: aptToOctas(0.05),  // 5,000,000 octas  
  large: aptToOctas(0.1),    // 10,000,000 octas
};
```

## 🧪 Testing

All tests pass successfully:

```bash
aptos move test
```

- ✅ Platform initialization
- ✅ Profile creation  
- ✅ Tip flow with fee calculation
- ✅ Error handling (duplicate profiles)

## 🔧 Development Commands

```bash
# Compile contract
aptos move compile

# Run tests
aptos move test

# Deploy to devnet
aptos move publish --named-addresses tiplink_contracts=default

# Initialize platform (run once after deployment)
aptos move run --function-id default::tipping_system::initialize_platform
```

## 📱 Profile Types

- `1` = Restaurant
- `2` = Creator  
- `0` = Generic tipper (auto-created)

## 💰 Fee Structure

- **Platform Fee**: 2% (200 basis points)
- **Example**: $10 tip = $9.80 to recipient + $0.20 platform fee
- **Treasury**: `b9df0f08ed0cc8168bbf8cda8b67124a83a2dbf0d1e57221bb5a3d9123b2e16a`

## 🎯 Next Steps

1. **Initialize Platform**: Run `initialize_platform()` once
2. **Frontend Integration**: Use provided TypeScript examples
3. **Google OAuth**: Configure keyless accounts
4. **Database Setup**: Sync events for rich profile data
5. **Testing**: Use devnet for development and testing 