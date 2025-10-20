ALTER TABLE "races" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_slug_unique" UNIQUE("slug");