


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" integer NOT NULL,
    "type" "text" NOT NULL,
    "line1" "text" NOT NULL,
    "line2" "text",
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "postal_code" "text" NOT NULL,
    "country" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."addresses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."addresses_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."addresses_id_seq" OWNED BY "public"."addresses"."id";



CREATE TABLE IF NOT EXISTS "public"."practice_runs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "ticket_id" "uuid",
    "started_at" timestamp without time zone NOT NULL,
    "ended_at" timestamp without time zone,
    "total_distance_meters" numeric DEFAULT '0'::numeric,
    "total_duration_seconds" integer DEFAULT 0,
    "average_pace_seconds_per_km" numeric,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."practice_runs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "profile_media" "text",
    "address_id" integer,
    "date_of_birth" "date",
    "gender" "text",
    "t_shirt_size" "text",
    "phone_number" "text",
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "emergency_contact_email" "text",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "mobile_app" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."race_option_prices" (
    "id" integer NOT NULL,
    "race_id" integer NOT NULL,
    "race_option_id" integer NOT NULL,
    "label" "text",
    "price_cents" integer,
    "max_participants" integer,
    "expires_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."race_option_prices" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."race_option_prices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."race_option_prices_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."race_option_prices_id_seq" OWNED BY "public"."race_option_prices"."id";



CREATE TABLE IF NOT EXISTS "public"."race_options" (
    "id" integer NOT NULL,
    "race_id" integer NOT NULL,
    "name" "text",
    "distance_km" numeric,
    "start_time" time without time zone,
    "cutoff_time" time without time zone,
    "course_map_url" "text",
    "is_virtual" boolean DEFAULT false NOT NULL,
    "is_free" boolean DEFAULT false NOT NULL,
    "description" "text",
    "age_min" integer,
    "age_max" integer,
    "gender_category" "text" DEFAULT 'all'::"text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "position" integer
);


ALTER TABLE "public"."race_options" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."race_options_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."race_options_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."race_options_id_seq" OWNED BY "public"."race_options"."id";



CREATE TABLE IF NOT EXISTS "public"."races" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "name" "text" NOT NULL,
    "addressId" integer,
    "date" "date",
    "registration_deadline" "date",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "slug" "text" NOT NULL,
    "sponsorships" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "website" "jsonb" DEFAULT '{"sections": [], "description": ""}'::"jsonb" NOT NULL,
    "social_media" "jsonb" DEFAULT '[{"url": "", "platform": "facebook"}, {"url": "", "platform": "instagram"}, {"url": "", "platform": "youtube"}, {"url": "", "platform": "tiktok"}, {"url": "", "platform": "x"}, {"url": "", "platform": "linkedin"}, {"url": "", "platform": "linktree"}]'::"jsonb" NOT NULL,
    "waivers" "jsonb",
    "start_lat" double precision,
    "start_lon" double precision,
    "end_lat" double precision,
    "end_lon" double precision,
    "gpx" "jsonb"
);


ALTER TABLE "public"."races" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."races_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."races_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."races_id_seq" OWNED BY "public"."races"."id";



CREATE TABLE IF NOT EXISTS "public"."run_locations" (
    "id" integer NOT NULL,
    "run_id" "uuid",
    "latitude" numeric NOT NULL,
    "longitude" numeric NOT NULL,
    "accuracy" numeric,
    "altitude" numeric,
    "heading" numeric,
    "speed" numeric,
    "timestamp" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."run_locations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."run_locations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."run_locations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."run_locations_id_seq" OWNED BY "public"."run_locations"."id";



CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "race_id" integer NOT NULL,
    "race_option_id" integer NOT NULL,
    "race_option_price_id" integer NOT NULL,
    "stripe_session_id" "text" NOT NULL,
    "stripe_payment_intent_id" "text" NOT NULL,
    "stripe_payment_intent_status" "text" NOT NULL,
    "amount_paid_cents" integer NOT NULL,
    "currency" "text" NOT NULL,
    "discount_amount_cents" integer,
    "tax_amount_cents" integer,
    "final_amount_cents" integer NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."addresses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."addresses_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."race_option_prices" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."race_option_prices_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."race_options" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."race_options_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."races" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."races_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."run_locations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."run_locations_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."practice_runs"
    ADD CONSTRAINT "practice_runs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."race_option_prices"
    ADD CONSTRAINT "race_option_prices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."race_options"
    ADD CONSTRAINT "race_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "races_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "races_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."run_locations"
    ADD CONSTRAINT "run_locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_stripe_session_id_unique" UNIQUE ("stripe_session_id");



ALTER TABLE ONLY "public"."practice_runs"
    ADD CONSTRAINT "practice_runs_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id");



ALTER TABLE ONLY "public"."practice_runs"
    ADD CONSTRAINT "practice_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."race_option_prices"
    ADD CONSTRAINT "race_option_prices_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."race_option_prices"
    ADD CONSTRAINT "race_option_prices_race_option_id_race_options_id_fk" FOREIGN KEY ("race_option_id") REFERENCES "public"."race_options"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."race_options"
    ADD CONSTRAINT "race_options_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "races_addressId_addresses_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id");



ALTER TABLE ONLY "public"."races"
    ADD CONSTRAINT "races_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."run_locations"
    ADD CONSTRAINT "run_locations_run_id_practice_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."practice_runs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_race_option_id_race_options_id_fk" FOREIGN KEY ("race_option_id") REFERENCES "public"."race_options"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_race_option_price_id_race_option_prices_id_fk" FOREIGN KEY ("race_option_price_id") REFERENCES "public"."race_option_prices"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."addresses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."practice_runs" TO "anon";
GRANT ALL ON TABLE "public"."practice_runs" TO "authenticated";
GRANT ALL ON TABLE "public"."practice_runs" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."race_option_prices" TO "anon";
GRANT ALL ON TABLE "public"."race_option_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."race_option_prices" TO "service_role";



GRANT ALL ON SEQUENCE "public"."race_option_prices_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."race_option_prices_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."race_option_prices_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."race_options" TO "anon";
GRANT ALL ON TABLE "public"."race_options" TO "authenticated";
GRANT ALL ON TABLE "public"."race_options" TO "service_role";



GRANT ALL ON SEQUENCE "public"."race_options_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."race_options_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."race_options_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."races" TO "anon";
GRANT ALL ON TABLE "public"."races" TO "authenticated";
GRANT ALL ON TABLE "public"."races" TO "service_role";



GRANT ALL ON SEQUENCE "public"."races_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."races_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."races_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."run_locations" TO "anon";
GRANT ALL ON TABLE "public"."run_locations" TO "authenticated";
GRANT ALL ON TABLE "public"."run_locations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."run_locations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."run_locations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."run_locations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;
