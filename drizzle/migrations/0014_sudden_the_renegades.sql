CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"race_id" integer NOT NULL,
	"race_option_id" integer NOT NULL,
	"race_option_price_id" integer NOT NULL,
	"stripe_session_id" text NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"stripe_payment_intent_status" text NOT NULL,
	"amount_paid_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"discount_amount_cents" integer,
	"tax_amount_cents" integer,
	"final_amount_cents" integer NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_race_option_id_race_options_id_fk" FOREIGN KEY ("race_option_id") REFERENCES "public"."race_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_race_option_price_id_race_option_prices_id_fk" FOREIGN KEY ("race_option_price_id") REFERENCES "public"."race_option_prices"("id") ON DELETE no action ON UPDATE no action;