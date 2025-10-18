ALTER TABLE "races" ALTER COLUMN "website" SET DEFAULT '{"description":"","sections":[]}'::jsonb;--> statement-breakpoint
ALTER TABLE "races" ALTER COLUMN "website" SET NOT NULL;