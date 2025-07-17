# 🔄 TipLink Refactoring Guide: Mock Data → Real Data

This guide documents the complete integration ready for refactoring from mock data to real database + blockchain data.

## 📋 **Current State**

### ✅ **What's Complete:**
- All API routes implemented
- All hooks ready for use
- Database schema with Drizzle ORM
- Blockchain integration with Aptos contracts
- TanStack Query for state management

### ❌ **What Needs Refactoring:**
- Components still using `getRestaurantBySlug()` from mock data
- Need to replace with `useProfile(slug)` hooks

---

## 🎣 **Available Hooks**

### **Profile Hooks** (`src/hooks/useProfiles.ts`)

```typescript
import { 
  useProfiles, 
  useProfile, 
  useRestaurants, 
  useCreators,
  useRestaurantsByLocation,
  useCreatorsByTag,
  isRestaurant,
  isCreator 
} from '@/hooks/useProfiles';

// Get all profiles with filtering
const { data: profiles } = useProfiles({ 
  category: 'restaurant', 
  limit: 10 
});

// Get single profile by ID or slug
const { data: profile, isLoading } = useProfile('marios-pizza-nyc');

// Get restaurants only
const { data: restaurants } = useRestaurants(10);

// Get creators only
const { data: creators } = useCreators(10);

// Get restaurants by location
const { data: nycRestaurants } = useRestaurantsByLocation('New York', 'NY', 10);

// Get creators by tag
const { data: musicCreators } = useCreatorsByTag('music', 10);

// Type guards
if (isRestaurant(profile)) {
  // profile has restaurant fields
  console.log(profile.address, profile.city);
}

if (isCreator(profile)) {
  // profile has creator fields
  console.log(profile.followers, profile.portfolioImages);
}
```

### **Tips Hooks** (`src/hooks/useTips.ts`)

```typescript
import { useTips, useAllTips, useSendTip } from '@/hooks/useTips';

// Get tips for a specific profile
const { data: tips } = useTips(profileId);

// Get all tips across platform
const { data: allTips } = useAllTips(50);

// Send a tip
const sendTip = useSendTip();
await sendTip.mutateAsync({
  profileId: 'profile-id',
  amount: 1000, // $10.00 in cents
  message: 'Great service!',
  tipperAddress: '0x123...',
  tipperAccount: keylessAccount // Optional for blockchain
});
```

### **Blockchain Hooks** (`src/hooks/useBlockchain.ts`)

```typescript
import { 
  useTipBreakdown, 
  usePlatformConfig, 
  useBlockchainProfile,
  useSendBlockchainTip,
  useProfileExists 
} from '@/hooks/useBlockchain';

// Calculate tip breakdown (fees)
const { data: breakdown } = useTipBreakdown(1000); // $10.00
// breakdown = { netAmount: 9.80, platformFee: 0.20 }

// Get platform configuration
const { data: platformConfig } = usePlatformConfig();

// Get blockchain profile data
const { data: blockchainProfile } = useBlockchainProfile(walletAddress);

// Send tip on blockchain
const sendBlockchainTip = useSendBlockchainTip();
await sendBlockchainTip.mutateAsync({
  tipperAccount: keylessAccount,
  recipientAddress: '0x456...',
  amount: 10.00,
  message: 'Great service!'
});

// Check if profile exists on blockchain
const { data: exists } = useProfileExists(walletAddress);
```

### **Keyless Account Hook** (`src/hooks/useKeylessAccount.ts`)

```typescript
import { useKeylessAccount } from '@/hooks/useKeylessAccount';

const { keylessAccount, address, loading, error } = useKeylessAccount(googleIdToken);
```

---

## 🔌 **API Routes Reference**

### **Profiles**
- `GET /api/profiles` - List all profiles with filtering
- `POST /api/profiles` - Create new profile (with blockchain integration)
- `GET /api/profiles/[identifier]` - Get single profile by ID or slug
- `GET /api/profiles/restaurant` - Get restaurants with location filtering
- `GET /api/profiles/creator` - Get creators with tag filtering

### **Tips**
- `GET /api/profiles/[identifier]/tips` - Get tips for a profile
- `POST /api/profiles/[identifier]/tips` - Create tip (with blockchain integration)
- `GET /api/tips` - Get all tips across platform

### **Blockchain**
- `GET /api/blockchain/sync` - Get platform configuration
- `POST /api/blockchain/sync` - Sync blockchain data with database
- `GET /api/blockchain/tip-breakdown` - Calculate tip fees
- `POST /api/blockchain/send-tip` - Send tip on blockchain
- `GET /api/blockchain/profile/[address]` - Get blockchain profile
- `GET /api/blockchain/profile/[address]/exists` - Check profile exists

---

## 🔄 **Refactoring Examples**

### **Example 1: Tip Page Refactoring**

**Before (Mock Data):**
```typescript
import { getRestaurantBySlug } from '@/lib/mock-data';

export default function TipPage({ params }: { params: { slug: string } }) {
  const restaurant = getRestaurantBySlug(slug);
  
  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.address}</p>
    </div>
  );
}
```

**After (Real Data):**
```typescript
import { useProfile, useTips, useTipBreakdown, useSendTip } from '@/hooks';

export default function TipPage({ params }: { params: { slug: string } }) {
  const { data: profile, isLoading } = useProfile(params.slug);
  const { data: tips } = useTips(profile?.id || '');
  const { data: breakdown } = useTipBreakdown(selectedAmount);
  const sendTip = useSendTip();
  
  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;
  
  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.address}</p>
      <p>Total Tips: ${(profile.totalTips / 100).toFixed(2)}</p>
    </div>
  );
}
```

### **Example 2: Profile List Refactoring**

**Before (Mock Data):**
```typescript
import { mockRestaurants } from '@/lib/mock-data';

export function RestaurantList() {
  return (
    <div>
      {mockRestaurants.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

**After (Real Data):**
```typescript
import { useRestaurants } from '@/hooks/useProfiles';

export function RestaurantList() {
  const { data: restaurants, isLoading, error } = useRestaurants(10);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {restaurants?.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

---

## 🗄️ **Database Schema**

### **Tables**
```typescript
// Base profile table
profiles {
  id: string (primary key)
  slug: string (unique)
  walletAddress: string (unique)
  name: string
  bio: string
  category: 'restaurant' | 'creator'
  imageUrl: string
  bannerUrl: string
  verified: boolean
  totalTips: number (in cents)
  tipCount: number
  averageTip: number (in cents)
  createdAt: timestamp
  updatedAt: timestamp
}

// Restaurant-specific data
restaurants {
  id: string (references profiles.id)
  address: string
  city: string
  state: string
  phone: string
  website: string
  hours: jsonb
  tags: string[]
}

// Creator-specific data
creators {
  id: string (references profiles.id)
  followers: number
  portfolioImages: string[]
  tags: string[]
  socialLinks: jsonb
}

// Tips table
tips {
  id: string (primary key)
  profileId: string (references profiles.id)
  profileSlug: string
  tipperAddress: string
  amount: number (in cents)
  message: string
  transactionHash: string
  createdAt: timestamp
}
```

---

## 🔗 **Blockchain Integration**

### **Contract Functions**
- `create_profile(user: &signer, profile_type: u8)` - Create profile on blockchain
- `send_tip(tipper: &signer, recipient: address, amount: u64, message: String)` - Send tip
- `get_profile(user: address)` - Get profile data
- `profile_exists(user: address)` - Check if profile exists
- `calculate_tip_breakdown(amount: u64)` - Calculate fees

### **Admin Key Strategy**
- Profile creation uses admin private key (simplifies UX)
- Tip sending uses user's keyless account (for actual money transfer)
- Platform fee: 2% automatically deducted

---

## 🚀 **Migration Steps**

### **Step 1: Environment Setup**
```bash
# Add to .env.local
ADMIN_PRIVATE_KEY="your_private_key_here"
```

### **Step 2: Initialize Platform**
```typescript
// One-time setup (run in admin script)
import { tippingService } from '@/lib/contracts/tipping-service';
await tippingService.initializePlatform();
```

### **Step 3: Replace Mock Data Imports**
```typescript
// Remove these imports
import { getRestaurantBySlug, mockRestaurants } from '@/lib/mock-data';

// Add these imports
import { useProfile, useRestaurants } from '@/hooks/useProfiles';
```

### **Step 4: Update Components**
- Replace `getRestaurantBySlug(slug)` with `useProfile(slug)`
- Replace `mockRestaurants` with `useRestaurants()`
- Add loading and error states
- Update data access patterns

### **Step 5: Test Integration**
- Test profile creation flow
- Test tip sending flow
- Verify blockchain integration
- Check database synchronization

---

## 🎯 **Key Benefits After Refactoring**

1. **Real-time Data** - Live updates from database and blockchain
2. **Type Safety** - Full TypeScript support with Drizzle ORM
3. **Performance** - Intelligent caching with TanStack Query
4. **Scalability** - Proper database structure for growth
5. **Blockchain Integration** - Real Aptos transactions
6. **User Experience** - Loading states, error handling, optimistic updates

---

## 📝 **Common Patterns**

### **Loading States**
```typescript
const { data, isLoading, error } = useProfile(slug);

if (isLoading) return <Skeleton />;
if (error) return <ErrorComponent error={error} />;
if (!data) return <NotFound />;
```

### **Optimistic Updates**
```typescript
const sendTip = useSendTip();
await sendTip.mutateAsync(tipData);
// TanStack Query automatically invalidates and refetches
```

### **Error Handling**
```typescript
const { data, error } = useProfile(slug);

if (error) {
  console.error('Profile fetch failed:', error);
  // Handle error appropriately
}
```

---

## 🔧 **Troubleshooting**

### **Common Issues**
1. **Profile not found** - Check if profile exists in database
2. **Blockchain errors** - Verify contract deployment and admin key
3. **Database connection** - Check DATABASE_URL in environment
4. **CORS issues** - Ensure API routes are properly configured

### **Debug Commands**
```bash
# Check database
pnpm db:studio-drizzle

# Seed database
pnpm db:seed

# Check blockchain
curl /api/blockchain/sync
```

---

This guide provides everything needed to successfully refactor from mock data to real data with full blockchain integration! 🚀 