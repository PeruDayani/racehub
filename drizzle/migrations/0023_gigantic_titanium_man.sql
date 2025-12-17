ALTER TABLE "route_points" ALTER COLUMN "route_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "route_points" ADD COLUMN "point_index" integer NOT NULL;