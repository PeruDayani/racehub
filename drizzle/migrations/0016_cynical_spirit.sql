CREATE TABLE "practice_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"ticket_id" uuid,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp,
	"total_distance_meters" numeric DEFAULT '0',
	"total_duration_seconds" integer DEFAULT 0,
	"average_pace_seconds_per_km" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "run_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" uuid,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"accuracy" numeric,
	"altitude" numeric,
	"heading" numeric,
	"speed" numeric,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "practice_runs" ADD CONSTRAINT "practice_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_runs" ADD CONSTRAINT "practice_runs_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "run_locations" ADD CONSTRAINT "run_locations_run_id_practice_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."practice_runs"("id") ON DELETE cascade ON UPDATE no action;