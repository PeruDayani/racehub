DROP TABLE "race_websites" CASCADE;--> statement-breakpoint
DROP TABLE "sponsorships" CASCADE;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "sponsorships" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "races" ADD COLUMN "website" jsonb;