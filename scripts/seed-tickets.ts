import "dotenv/config";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import { db } from "../app/lib/db";
import {
  profiles,
  raceOptionPrices,
  raceOptions,
  races,
  tickets,
} from "../drizzle/schema";

/**
 * Seed script to create dummy tickets for testing dashboard stats
 *
 * Usage:
 *   npm run db:seed:tickets
 *   npm run db:seed:tickets -- --raceId=1 --count=50
 *   npm run db:seed:tickets -- --raceId=1 --count=50 --mixed-status
 */

const DEFAULT_COUNT = 20;
const PAYMENT_STATUSES = ["paid", "pending", "failed"] as const;

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (flag: string): string | null => {
  const arg = args.find((a) => a.startsWith(`--${flag}=`));
  return arg ? arg.split("=")[1] : null;
};

const raceIdArg = getArg("raceId");
const countArg = getArg("count");
const mixedStatus = args.includes("--mixed-status");

const targetRaceId = raceIdArg ? parseInt(raceIdArg, 10) : null;
const ticketCount = countArg ? parseInt(countArg, 10) : DEFAULT_COUNT;

async function seedTickets() {
  console.log("🎫 Starting ticket seed...\n");

  try {
    // Get all users
    let users = await db.select({ id: profiles.id }).from(profiles);

    if (users.length === 0) {
      console.error("❌ No users found in database.");
      console.error("   Please create at least one user first.");
      process.exit(1);
    }

    console.log(`✓ Found ${users.length} user(s)`);

    // Get races with their options and prices
    let racesQuery = db
      .select({
        raceId: races.id,
        raceName: races.name,
      })
      .from(races);

    if (targetRaceId) {
      racesQuery = racesQuery.where(
        eq(races.id, targetRaceId),
      ) as typeof racesQuery;
    }

    const availableRaces = await racesQuery;

    if (availableRaces.length === 0) {
      console.error("❌ No races found.");
      if (targetRaceId) {
        console.error(`   Race ID ${targetRaceId} does not exist.`);
      } else {
        console.error("   Please create at least one race first.");
      }
      process.exit(1);
    }

    console.log(`✓ Found ${availableRaces.length} race(s)`);

    // Get race options and prices for the available races
    const raceIds = availableRaces.map((r) => r.raceId);
    const options = await db
      .select({
        optionId: raceOptions.id,
        raceId: raceOptions.raceId,
        optionName: raceOptions.name,
      })
      .from(raceOptions)
      .where(inArray(raceOptions.raceId, raceIds));

    if (options.length === 0) {
      console.error("❌ No race options found for available races.");
      console.error("   Please create race options first.");
      process.exit(1);
    }

    console.log(`✓ Found ${options.length} race option(s)`);

    const optionIds = options.map((o) => o.optionId);
    const prices = await db
      .select({
        priceId: raceOptionPrices.id,
        optionId: raceOptionPrices.raceOptionId,
        priceCents: raceOptionPrices.priceCents,
      })
      .from(raceOptionPrices)
      .where(inArray(raceOptionPrices.raceOptionId, optionIds));

    if (prices.length === 0) {
      console.error("❌ No race option prices found.");
      console.error("   Please create race option prices first.");
      process.exit(1);
    }

    console.log(`✓ Found ${prices.length} price option(s)\n`);

    // Create a map for quick lookup
    const pricesByOption = new Map<number, typeof prices>();

    for (const price of prices) {
      if (!pricesByOption.has(price.optionId)) {
        pricesByOption.set(price.optionId, []);
      }
      pricesByOption.get(price.optionId)?.push(price);
    }

    // Generate tickets
    const ticketsToInsert = [];
    const now = new Date();

    console.log(`Creating ${ticketCount} ticket(s)...`);

    for (let i = 0; i < ticketCount; i++) {
      // Pick a random race
      const race =
        availableRaces[Math.floor(Math.random() * availableRaces.length)];

      // Pick a random option for this race
      const raceOptionsForRace = options.filter(
        (o) => o.raceId === race.raceId,
      );
      if (raceOptionsForRace.length === 0) continue;

      const option =
        raceOptionsForRace[
          Math.floor(Math.random() * raceOptionsForRace.length)
        ];

      // Pick a random price for this option
      const pricesForOption = pricesByOption.get(option.optionId);
      if (!pricesForOption || pricesForOption.length === 0) continue;

      const price =
        pricesForOption[Math.floor(Math.random() * pricesForOption.length)];

      // Pick a random user
      const user = users[Math.floor(Math.random() * users.length)];

      // Determine payment status
      let paymentStatus: string;
      let amountPaidCents: number;
      let finalAmountCents: number;

      if (mixedStatus) {
        // Mix of payment statuses
        const statusIndex = Math.floor(Math.random() * PAYMENT_STATUSES.length);
        paymentStatus = PAYMENT_STATUSES[statusIndex];

        finalAmountCents = price.priceCents || 5000; // Default to $50.00 if no price

        if (paymentStatus === "paid") {
          amountPaidCents = finalAmountCents;
        } else if (paymentStatus === "pending") {
          amountPaidCents = 0;
        } else {
          // failed
          amountPaidCents = 0;
        }
      } else {
        // All paid (for testing revenue stats)
        paymentStatus = "paid";
        finalAmountCents = price.priceCents || 5000;
        amountPaidCents = finalAmountCents;
      }

      // Generate unique Stripe session ID
      const stripeSessionId = `cs_test_${randomUUID().replace(/-/g, "")}`;
      const stripePaymentIntentId = `pi_${randomUUID().replace(/-/g, "")}`;

      // Add some variation to amounts (discounts, taxes)
      const discountAmountCents =
        Math.random() > 0.7
          ? Math.floor(finalAmountCents * 0.1) // 10% discount sometimes
          : 0;
      const taxAmountCents =
        Math.random() > 0.5
          ? Math.floor(finalAmountCents * 0.08) // 8% tax sometimes
          : 0;

      ticketsToInsert.push({
        userId: user.id,
        raceId: race.raceId,
        raceOptionId: option.optionId,
        raceOptionPriceId: price.priceId,
        stripeSessionId,
        stripePaymentIntentId,
        stripePaymentIntentStatus: paymentStatus,
        amountPaidCents,
        currency: "usd",
        discountAmountCents:
          discountAmountCents > 0 ? discountAmountCents : null,
        taxAmountCents: taxAmountCents > 0 ? taxAmountCents : null,
        finalAmountCents,
        metadata: {
          seedScript: true,
          createdAt: now.toISOString(),
        },
        createdAt: new Date(
          now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(), // Random date in last 30 days
        updatedAt: new Date().toISOString(),
      });
    }

    // Insert tickets (using onConflictDoNothing to handle duplicate session IDs)
    console.log("Inserting tickets into database...\n");

    let insertedCount = 0;
    const batchSize = 50;

    for (let i = 0; i < ticketsToInsert.length; i += batchSize) {
      const batch = ticketsToInsert.slice(i, i + batchSize);

      const results = await db
        .insert(tickets)
        .values(batch)
        .onConflictDoNothing({ target: tickets.stripeSessionId })
        .returning({ id: tickets.id });

      insertedCount += results.length;
    }

    console.log(`✅ Successfully created ${insertedCount} ticket(s)!`);

    if (insertedCount < ticketCount) {
      console.log(
        `⚠️  ${ticketCount - insertedCount} ticket(s) were skipped (likely duplicate session IDs)`,
      );
    }

    // Show summary by race
    console.log("\n📊 Summary by race:");
    for (const race of availableRaces) {
      const raceTickets = ticketsToInsert.filter(
        (t) => t.raceId === race.raceId,
      );
      const paidTickets = raceTickets.filter(
        (t) => t.stripePaymentIntentStatus === "paid",
      );
      const totalRevenue = paidTickets.reduce(
        (sum, t) => sum + t.amountPaidCents,
        0,
      );

      console.log(`\n  ${race.raceName} (ID: ${race.raceId}):`);
      console.log(`    Total tickets: ${raceTickets.length}`);
      console.log(`    Paid tickets: ${paidTickets.length}`);
      console.log(`    Total revenue: $${(totalRevenue / 100).toFixed(2)}`);
    }

    console.log("\n✨ Seed complete!\n");
  } catch (error) {
    console.error("❌ Error seeding tickets:", error);
    process.exit(1);
  }
}

// Run the seed
seedTickets()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
