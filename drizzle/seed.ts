// drizzle/seed.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 1️⃣ Connect to your database
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a postgres connection
const client = postgres(databaseUrl);

// Create a drizzle instance
export const db = drizzle(client, { schema });

const userId = "4be993c2-f24a-4f69-9070-3700992daea5";

async function main() {
  console.log("🌱 Seeding database...");

  // Delete tables
  await db.delete(schema.addresses);
  await db.delete(schema.races);
  await db.delete(schema.raceOptionPrices);
  await db.delete(schema.raceOptions);

  // Insert address
  const [address] = await db
    .insert(schema.addresses)
    .values({
      type: "race",
      line1: "123 Trail Run Ave",
      city: "Boulder",
      state: "CO",
      postalCode: "80302",
      country: "USA",
    })
    .returning();

  // Insert a race
  const [_race] = await db
    .insert(schema.races)
    .values({
      userId: userId, // must exist in auth.users if FK enforced
      name: "Boulder Mountain Run",
      addressId: address.id, // string is fine for Drizzle date
    })
    .returning();

  console.log("✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
