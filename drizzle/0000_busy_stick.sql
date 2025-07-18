CREATE TABLE "creators" (
	"id" text PRIMARY KEY NOT NULL,
	"followers" integer DEFAULT 0,
	"portfolio_images" jsonb,
	"tags" jsonb,
	"social_links" jsonb
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"wallet_address" text NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"category" text NOT NULL,
	"image_url" text,
	"banner_url" text,
	"verified" boolean DEFAULT false,
	"total_tips" integer DEFAULT 0,
	"tip_count" integer DEFAULT 0,
	"average_tip" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "profiles_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "recent_tips" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_id" text NOT NULL,
	"amount" integer NOT NULL,
	"message" text,
	"timestamp" text NOT NULL,
	"anonymous" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"phone" text,
	"website" text,
	"hours" jsonb,
	"tags" jsonb
);
--> statement-breakpoint
CREATE TABLE "tips" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"profile_slug" text NOT NULL,
	"tipper_address" text NOT NULL,
	"amount" integer NOT NULL,
	"message" text,
	"transaction_hash" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "creators" ADD CONSTRAINT "creators_id_profiles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_tips" ADD CONSTRAINT "recent_tips_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_id_profiles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tips" ADD CONSTRAINT "tips_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;