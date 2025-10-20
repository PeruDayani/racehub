ALTER TABLE "race_option_prices" RENAME COLUMN "ends_at" TO "expires_at";--> statement-breakpoint
ALTER TABLE "race_option_prices" DROP COLUMN "starts_at";--> statement-breakpoint
ALTER TABLE "race_option_prices" DROP COLUMN "position";