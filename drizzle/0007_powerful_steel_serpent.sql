ALTER TABLE "race_option_prices" ALTER COLUMN "label" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_option_prices" ALTER COLUMN "price_cents" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_option_prices" ALTER COLUMN "starts_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_option_prices" ALTER COLUMN "ends_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_options" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_options" ALTER COLUMN "distance_km" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_options" ALTER COLUMN "start_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_options" ALTER COLUMN "cutoff_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "race_options" ALTER COLUMN "gender_category" SET DEFAULT 'all';--> statement-breakpoint
ALTER TABLE "race_option_prices" ADD COLUMN "position" integer;--> statement-breakpoint
ALTER TABLE "race_options" ADD COLUMN "position" integer;