CREATE TABLE "route_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" integer NOT NULL,
	"lat" double precision NOT NULL,
	"lon" double precision NOT NULL,
	"point_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
