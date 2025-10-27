import { relations } from "drizzle-orm";
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
import { DEFAULT_SOCIAL_MEDIA, DEFAULT_WEBSITE } from "@/app/lib/constants";
import type {
  Media,
  RaceStatus,
  SocialMedia,
  Sponsorship,
  Website,
} from "@/app/lib/types";

// =============================
// Tables
// =============================

export const profiles = pgTable("profiles", {
  // Matches id from auth.users table in Supabase
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "no action" }),
  profileMedia: jsonb("profile_media").$type<Media>(),
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
  userId: uuid("user_id").references(() => authUsers.id, {
    onDelete: "no action",
  }),
  status: text("status").$type<RaceStatus>().notNull().default("draft"),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  addressId: integer("addressId").references(() => addresses.id),
  date: date("date"),
  registrationDeadline: date("registration_deadline"),
  sponsorships: jsonb("sponsorships")
    .$type<Sponsorship[]>()
    .default([])
    .notNull(),
  website: jsonb("website").$type<Website>().notNull().default(DEFAULT_WEBSITE),
  socialMedia: jsonb("social_media")
    .$type<SocialMedia>()
    .default(DEFAULT_SOCIAL_MEDIA)
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const raceOptions = pgTable("race_options", {
  id: serial("id").primaryKey().notNull(),
  raceId: integer("race_id")
    .notNull()
    .references(() => races.id, { onDelete: "cascade" }),
  name: text("name"),
  distanceKm: numeric("distance_km"),
  startTime: time("start_time"),
  cutoffTime: time("cutoff_time"),
  courseMapUrl: text("course_map_url"),
  isVirtual: boolean("is_virtual").notNull().default(false),
  isFree: boolean("is_free").notNull().default(false),
  description: text("description"),
  ageMin: integer("age_min"),
  ageMax: integer("age_max"),
  genderCategory: text("gender_category").notNull().default("all"),
  position: integer("position"),
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

  label: text("label"),
  priceCents: integer("price_cents"),

  expiresAt: timestamp("expires_at", { mode: "string" }),
  maxParticipants: integer("max_participants"),

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

// =============================
// Relations
// =============================

export const profilesRelations = relations(profiles, ({ one }) => ({
  address: one(addresses, {
    fields: [profiles.addressId],
    references: [addresses.id],
  }),
}));

export const racesRelations = relations(races, ({ one, many }) => ({
  address: one(addresses, {
    fields: [races.addressId],
    references: [addresses.id],
  }),
  options: many(raceOptions),
  optionPrices: many(raceOptionPrices),
}));

export const raceOptionsRelations = relations(raceOptions, ({ one, many }) => ({
  race: one(races, {
    fields: [raceOptions.raceId],
    references: [races.id],
  }),
  prices: many(raceOptionPrices),
}));

export const raceOptionPricesRelations = relations(
  raceOptionPrices,
  ({ one }) => ({
    race: one(races, {
      fields: [raceOptionPrices.raceId],
      references: [races.id],
    }),
    raceOption: one(raceOptions, {
      fields: [raceOptionPrices.raceOptionId],
      references: [raceOptions.id],
    }),
  }),
);
