CREATE TABLE "race_option_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"race_option_id" integer NOT NULL,
	"label" text NOT NULL,
	"price_cents" integer NOT NULL,
	"max_participants" integer,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"race_id" integer NOT NULL,
	"name" text NOT NULL,
	"distance_km" numeric NOT NULL,
	"start_time" time NOT NULL,
	"cutoff_time" time NOT NULL,
	"course_map_url" text,
	"is_virtual" boolean DEFAULT false NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"description" text,
	"age_min" integer,
	"age_max" integer,
	"gender_category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "race_option_prices" ADD CONSTRAINT "race_option_prices_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_option_prices" ADD CONSTRAINT "race_option_prices_race_option_id_race_options_id_fk" FOREIGN KEY ("race_option_id") REFERENCES "public"."race_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_options" ADD CONSTRAINT "race_options_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;