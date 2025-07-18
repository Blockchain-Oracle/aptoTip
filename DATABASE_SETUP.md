# 🗄️ Database Setup Guide - AptoTip

This guide covers the new database integration using **Drizzle ORM** + **TanStack Query** for AptoTip.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (React)       │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • TanStack      │    │ • Drizzle ORM   │    │ • Profiles      │
│   Query Hooks   │    │ • API Routes    │    │ • Restaurants   │
│ • Components    │    │ • Validation    │    │ • Creators      │
│ • State Mgmt    │    │ • Error Handling│    │ • Tips          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Dependencies

### Core Database
- **Drizzle ORM** - Type-safe SQL query builder
- **PostgreSQL** - Primary database
- **@neondatabase/serverless** - Serverless PostgreSQL driver

### Development Tools
- **drizzle-kit** - Database migrations and schema management
- **tsx** - TypeScript execution for seeding

## 🗂️ Database Schema

### Tables Structure

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
  totalTips: number
  tipCount: number
  averageTip: number
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

## 🚀 Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Optional: For development
NEXT_PUBLIC_APTOS_NETWORK="devnet"
NEXT_PUBLIC_APTOS_NODE_URL="https://fullnode.devnet.aptoslabs.com/v1"
```

### 2. Database Migration

```bash
# Generate migration files
pnpm db:generate-drizzle

# Push schema to database
pnpm db:push-drizzle

# Or run migrations
pnpm db:migrate-drizzle
```

### 3. Seed Database

```bash
# Seed with mock data
pnpm db:seed
```

### 4. Database Studio (Optional)

```bash
# Open Drizzle Studio
pnpm db:studio-drizzle
```

## 🎣 TanStack Query Hooks

### Profile Hooks

```typescript
import { useProfiles, useProfile, useRestaurants, useCreators } from '@/hooks/useProfiles';

// Fetch all profiles
const { data: profiles, isLoading, error } = useProfiles();

// Fetch single profile by ID or slug
const { data: profile } = useProfile('marios-pizza-nyc');

// Fetch restaurants only
const { data: restaurants } = useRestaurants(10);

// Fetch creators only
const { data: creators } = useCreators(10);
```

### Tips Hooks

```typescript
import { useTips, useSendTip } from '@/hooks/useTips';

// Fetch tips for a profile
const { data: tips } = useTips('profile-id');

// Send a tip
const sendTip = useSendTip();

const handleTip = async () => {
  await sendTip.mutateAsync({
    profileId: 'profile-id',
    amount: 5.00, // $5.00
    message: 'Great work!',
    tipperAddress: '0x123...',
  });
};
```

## 🔧 API Routes

### Profiles

- `GET /api/profiles` - List all profiles with filtering
- `GET /api/profiles/[identifier]` - Get single profile by ID or slug

### Tips

- `GET /api/profiles/[identifier]/tips` - Get tips for a profile
- `POST /api/profiles/[identifier]/tips` - Create a new tip

## 📊 Data Flow

### 1. Profile Loading
```
Component → useProfile() → API Route → Drizzle Query → Database
```

### 2. Tip Creation
```
Component → useSendTip() → API Route → Drizzle Insert → Database
                    ↓
              Invalidate Queries → Refetch Data
```

### 3. Real-time Updates
```
Blockchain Event → Contract Service → API Route → Database
                                      ↓
                                Invalidate Queries
```

## 🎯 Usage Examples

### Basic Profile List

```tsx
import { useProfiles } from '@/hooks/useProfiles';

export function ProfileList() {
  const { data: profiles, isLoading, error } = useProfiles();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {profiles?.map(profile => (
        <div key={profile.id}>{profile.name}</div>
      ))}
    </div>
  );
}
```

### Profile with Tips

```tsx
import { useProfile } from '@/hooks/useProfiles';
import { useTips } from '@/hooks/useTips';

export function ProfilePage({ slug }: { slug: string }) {
  const { data: profile } = useProfile(slug);
  const { data: tips } = useTips(profile?.id || '');
  
  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>Total Tips: ${(profile?.totalTips || 0) / 100}</p>
      
      <div>
        {tips?.map(tip => (
          <div key={tip.id}>
            ${tip.amount / 100} - {tip.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔄 Migration from Mock Data

### Before (Mock Data)
```typescript
import { mockRestaurants } from '@/lib/mock-data';

// Direct import of static data
const restaurants = mockRestaurants;
```

### After (Database + Hooks)
```typescript
import { useRestaurants } from '@/hooks/useProfiles';

// Dynamic data with caching and real-time updates
const { data: restaurants, isLoading } = useRestaurants();
```

## 🛠️ Development Workflow

### 1. Schema Changes
```bash
# Edit schema in src/lib/db/schema.ts
# Generate migration
pnpm db:generate-drizzle
# Apply migration
pnpm db:push-drizzle
```

### 2. API Development
```bash
# Create new API route in src/app/api/
# Test with curl or Postman
curl http://localhost:3000/api/profiles
```

### 3. Hook Development
```bash
# Create new hook in src/hooks/
# Use in components
# Test with React DevTools
```

## 🔍 Debugging

### Database Queries
```typescript
// Enable query logging in drizzle.config.ts
export default defineConfig({
  verbose: true,
  // ... other config
});
```

### TanStack Query DevTools
```typescript
// Add to your app
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In your layout
<ReactQueryDevtools initialIsOpen={false} />
```

### API Route Testing
```bash
# Test API routes directly
curl -X POST http://localhost:3000/api/profiles/rest_001/tips \
  -H "Content-Type: application/json" \
  -d '{"amount": 5.00, "message": "Test tip", "tipperAddress": "0x123..."}'
```

## 🚀 Production Considerations

### 1. Database Connection Pooling
```typescript
// Use connection pooling for production
import postgres from 'postgres';

const client = postgres(connectionString, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});
```

### 2. Query Optimization
```typescript
// Use indexes for frequently queried fields
// Add to schema.ts
export const profiles = pgTable('profiles', {
  // ... existing fields
}, (table) => ({
  slugIdx: index('slug_idx').on(table.slug),
  categoryIdx: index('category_idx').on(table.category),
}));
```

### 3. Caching Strategy
```typescript
// Optimize cache times based on data volatility
const { data } = useQuery({
  queryKey: ['profile', id],
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
});
```

## 🎉 Benefits

### ✅ Type Safety
- End-to-end TypeScript support
- Compile-time error detection
- Auto-completion in IDE

### ✅ Performance
- Intelligent caching with TanStack Query
- Optimistic updates
- Background refetching

### ✅ Developer Experience
- Hot reloading for schema changes
- Built-in migration system
- Excellent debugging tools

### ✅ Scalability
- Connection pooling
- Query optimization
- Efficient data fetching

## 🔗 Next Steps

1. **Set up your database** with the provided schema
2. **Run migrations** to create tables
3. **Seed the database** with mock data
4. **Replace mock data usage** with hooks in your components
5. **Add more API routes** as needed
6. **Implement blockchain integration** for real tips

This setup provides a solid foundation for your TipLink application with real database persistence, type safety, and excellent developer experience! 🚀 