# Database Seed Scripts

## Seed Tickets Script

This script creates dummy tickets in your local database for testing dashboard stats.

### Prerequisites

- At least one user in your database (in `profiles`)
- At least one race with race options and price options configured

### Basic Usage

```bash
# Create 20 tickets (default) across all races
npm run db:seed:tickets

# Create tickets for a specific race
npm run db:seed:tickets -- --raceId=1

# Create a specific number of tickets
npm run db:seed:tickets -- --count=50

# Create tickets with mixed payment statuses (paid, pending, failed)
npm run db:seed:tickets -- --count=50 --mixed-status

# Combine options
npm run db:seed:tickets -- --raceId=1 --count=100 --mixed-status
```

### Options

- `--raceId=<id>`: Create tickets for a specific race (optional, defaults to all races)
- `--count=<number>`: Number of tickets to create (optional, defaults to 20)
- `--mixed-status`: Create tickets with mixed payment statuses instead of all "paid" (optional)

### What the Script Does

1. Finds all users in your database
2. Finds races (optionally filtered by `raceId`)
3. Finds race options and prices for those races
4. Creates dummy tickets with:
   - Random users from your database
   - Random race options and prices
   - Realistic Stripe session IDs and payment intent IDs
   - Various payment amounts (with occasional discounts/taxes)
   - Random creation dates within the last 30 days
   - Payment status: "paid" by default, or mixed if `--mixed-status` is used

### Example Output

```
🎫 Starting ticket seed...

✓ Found 3 user(s)
✓ Found 2 race(s)
✓ Found 5 race option(s)
✓ Found 10 price option(s)

Creating 20 ticket(s)...
Inserting tickets into database...

✅ Successfully created 20 ticket(s)!

📊 Summary by race:

  Chicago 5k (ID: 1):
    Total tickets: 12
    Paid tickets: 12
    Total revenue: $1,200.00

  New York Marathon (ID: 2):
    Total tickets: 8
    Paid tickets: 8
    Total revenue: $4,000.00

✨ Seed complete!
```

### Notes

- The script uses `onConflictDoNothing` to prevent duplicate session IDs
- All tickets created by the script have `metadata.seedScript: true` for easy identification
- To delete seed tickets, you can run: `psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "DELETE FROM tickets WHERE metadata->>'seedScript' = 'true';"`

