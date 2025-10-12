CREATE TABLE "race_websites" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"banner_url" text,
	"sections" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "race_websites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sponsorships" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo_url" text,
	"website_url" text,
	"tier" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "race_websites" ADD CONSTRAINT "race_websites_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;