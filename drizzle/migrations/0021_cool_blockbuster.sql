CREATE TABLE "route_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_name" text NOT NULL,
	"lat" double precision NOT NULL,
	"lon" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
