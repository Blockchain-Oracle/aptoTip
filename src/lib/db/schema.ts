import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Profiles table (base for both restaurants and creators)
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  slug: text('slug').notNull().unique(),
  walletAddress: text('wallet_address').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  category: text('category', { enum: ['restaurant', 'creator'] }).notNull(),
  imageUrl: text('image_url'),
  bannerUrl: text('banner_url'),
  verified: boolean('verified').default(false),
  totalTips: integer('total_tips').default(0),
  tipCount: integer('tip_count').default(0),
  averageTip: integer('average_tip').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Restaurants table (extends profiles)
export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  phone: text('phone'),
  website: text('website'),
  hours: jsonb('hours').$type<Record<string, string>>(),
  tags: jsonb('tags').$type<string[]>(),
});

// Creators table (extends profiles)
export const creators = pgTable('creators', {
  id: text('id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  followers: integer('followers').default(0),
  portfolioImages: jsonb('portfolio_images').$type<string[]>(),
  tags: jsonb('tags').$type<string[]>(),
  socialLinks: jsonb('social_links').$type<{
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  }>(),
});

// Tips table
export const tips = pgTable('tips', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  profileSlug: text('profile_slug').notNull(),
  tipperAddress: text('tipper_address').notNull(),
  amount: integer('amount').notNull(), // in cents
  message: text('message'),
  transactionHash: text('transaction_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Recent tips for creators (denormalized for performance)
export const recentTips = pgTable('recent_tips', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  creatorId: text('creator_id').notNull().references(() => creators.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  message: text('message'),
  timestamp: text('timestamp').notNull(), // human readable like "2 hours ago"
  anonymous: boolean('anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Types for TypeScript
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Restaurant = typeof restaurants.$inferSelect & Profile;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type Creator = typeof creators.$inferSelect & Profile;
export type NewCreator = typeof creators.$inferInsert;
export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;
export type RecentTip = typeof recentTips.$inferSelect;
export type NewRecentTip = typeof recentTips.$inferInsert; 