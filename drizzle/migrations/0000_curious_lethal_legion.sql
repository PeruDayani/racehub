CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"profile_media" jsonb,
	"address_id" integer,
	"date_of_birth" date,
	"gender" text,
	"t_shirt_size" text,
	"phone_number" text,
	"emergency_contact_name" text,
	"emergency_contact_phone" text,
	"emergency_contact_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race_option_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"race_option_id" integer NOT NULL,
	"label" text,
	"price_cents" integer,
	"expires_at" timestamp,
	"max_participants" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"name" text,
	"distance_km" numeric,
	"start_time" time,
	"cutoff_time" time,
	"course_map_url" text,
	"is_virtual" boolean DEFAULT false NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"description" text,
	"age_min" integer,
	"age_max" integer,
	"gender_category" text DEFAULT 'all' NOT NULL,
	"position" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"addressId" integer,
	"date" date,
	"registration_deadline" date,
	"sponsorships" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"website" jsonb DEFAULT '{"description":"","sections":[]}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "races_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_option_prices" ADD CONSTRAINT "race_option_prices_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_option_prices" ADD CONSTRAINT "race_option_prices_race_option_id_race_options_id_fk" FOREIGN KEY ("race_option_id") REFERENCES "public"."race_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_options" ADD CONSTRAINT "race_options_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_addressId_addresses_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;