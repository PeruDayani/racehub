import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable("profiles", {
  // Matches id from auth.users table in Supabase
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "no action" }),
  profileImageURL: text("profile_image_url"),
  addressId: integer("address_id").references(() => addresses.id),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  tShirtSize: text("t_shirt_size"),
  phoneNumber: text("phone_number"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactEmail: text("emergency_contact_email"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const races = pgTable("races", {
  id: serial("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "no action" }),
  status: text("status").notNull().default("draft"),
  name: text("name").notNull(),
  addressId: integer("addressId")
    .notNull()
    .references(() => addresses.id),
  date: date("date").notNull(),
  registrationDeadline: date("registration_deadline").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const raceOptions = pgTable("race_options", {
  id: serial("id").primaryKey().notNull(),
  raceId: integer("race_id")
    .notNull()
    .references(() => races.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  distanceKm: numeric("distance_km").notNull(),
  startTime: time("start_time").notNull(),
  cutoffTime: time("cutoff_time").notNull(),
  courseMapUrl: text("course_map_url"),
  isVirtual: boolean("is_virtual").notNull().default(false),
  isFree: boolean("is_free").notNull().default(false),
  description: text("description"),
  ageMin: integer("age_min"),
  ageMax: integer("age_max"),
  genderCategory: text("gender_category").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const raceOptionPrices = pgTable("race_option_prices", {
  id: serial("id").primaryKey().notNull(),
  raceId: integer("race_id")
    .notNull()
    .references(() => races.id, { onDelete: "cascade" }),
  raceOptionId: integer("race_option_id")
    .notNull()
    .references(() => raceOptions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  priceCents: integer("price_cents").notNull(),
  maxParticipants: integer("max_participants"),
  startsAt: timestamp("starts_at", { mode: "string" }).notNull(),
  endsAt: timestamp("ends_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const sponsorships = pgTable("sponsorships", {
  id: serial("id").primaryKey().notNull(),
  raceId: integer("race_id")
    .notNull()
    .references(() => races.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  tier: text("tier").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const raceWebsites = pgTable("race_websites", {
  id: serial("id").primaryKey().notNull(),
  raceId: integer("race_id")
    .notNull()
    .references(() => races.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  sections: jsonb("sections"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: serial().primaryKey().notNull(),
  type: text().notNull(),
  line1: text().notNull(),
  line2: text(),
  city: text().notNull(),
  state: text().notNull(),
  postalCode: text("postal_code").notNull(),
  country: text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
