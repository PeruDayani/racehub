All the documentation can be found in [this Notion page](
https://www.notion.so/perudayani/Tech-Setup-28f6a6748589802e8cd2f174f34e9d8d?source=copy_link)

What follows is a messy dialogue of what goes on in Peru's head as he is coding.

### WOW, there's a lot to do

### Mobile App

> Let's cut our first release this weekend - Peru, Oct 31st

> Tomorrow has arrived - Peru, Oct 27th

> We're starting on the Mobile App next :) - Peru, Oct 25th

> Please start on the Mobile App soon  - Peru, Oct 16th

> Can the website goal for v1 be a 10 friend event? Then my brain won't worry about every feature on the website - Peru, Oct 17th


#### Small things that will go a long way

- Button to create mock race
- Wire up UserContext

#### A defintely doable albeit long list of everything else for MVP

---- Race Curation ----
- Waivers Input -> Basic waiver + Custom upload
- Waivers Signing -> Users sign + Stored in DB
- Discount Codes -> Creating and managing
- Discount Codes -> Using + counter
- Payment Config -> Connect back accounts
- Emails -> Authentication Workflow
- Emails -> Ticket confirmation
- Emails -> Reminders
- Marketing -> Customizable Emails

--- Ticketing ----
- Dashboard signup stats
- Dashboard revenue stats
- User Management -> big one

---- Race Day ----

- Check in users
- Quick process payments

--- 3rd time's the charm ----

- Search sentence filter: I want to run x km in y city ...
- Stripe Tax
- Stripe Discounts
- Stripe Elements to allow for custom inputs
- Authentication Modals
- Better Navigation
- Better Create Workflow
- Multiple tickets?
- Manual Type definition?
- Prod Migrations on deploy via Vercel hook?
- Autosave hook
- Relational tables can be directly updated?
- Define Supabase Buckets using migrations
- Define Supabase RLS using Drizzle: https://orm.drizzle.team/docs/rls#using-with-supabase

### Supabase

Local supabase setup:
- Run supabase locally using docker for testing.
- `supabase init` to create a config folder
- `supabase start` to start the supabase server in dockernpm
- `supabase stop` to stop the docker instance, data will persist.

Local supbase info
```
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
         MCP URL: http://127.0.0.1:54321/mcp
    Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
     Mailpit URL: http://127.0.0.1:54324
 Publishable key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
      Secret key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local
```

Src: https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos


### Drizzle

Src: https://orm.drizzle.team/docs/get-started/supabase-new

Schema & Migrations
- Update the schema in db/schema.
- Generate a migration using `npx drizzle-kit generate`
- Apply the migration using `npx drizzle-kit migrate`
- Created `npm run migrate` to do both of these.

### Supabase User Auth

Src: https://supabase.com/docs/guides/auth

Overview
- JWTs for Authentication
- JWT is stored in the cookie
- Cookie is stored on the client side browser
- Cookie is send to the server with every request
- Cookie is authenticated and refreshed by the middleware
- supabase.getUser() is the best authentication as it hits the database.
- I like and will be using fucking server actions.

- https://github.com/supabase/supabase/issues/19883#issuecomment-2094656180
- https://supabase.com/docs/guides/auth/managing-user-data#using-triggers

### Prod Migrations
- Switch the DATABASE_URL in .env
- Run `npm run migrate`
- This is bad and I will clean up the workflow

### Stripe!!
- There's so much happening here, and so much more to do
- Everything starts in the Stripe dashboard: https://dashboard.stripe.com/acct_1SCM6MJHWd8FMlJA/test/payments
- The STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY define which stripe project/env we are connected to. 
- Both local and prod are currently pointing to the Sandbox env.

- Once we are connected to a Stripe account, the magic starts from the CheckoutButton.tsx
- We require Auth to buy a ticket.
- We call the /api/stripe/checkout endpoint which gives us a URL for the stripe connect page
- This API endpoint passes in a PriceObject to the stripe checkout session. The Metadata passed in gets passed through the webhook to our api endpoint.
- We redirect the users to this page
- This page handles checkout
- On successfully checkout, a Webhook (configured on the Stripe Dashboard) is triggered
- We are currently only listening to the checkout.session.completed on the Sandbox webhook.
- STRIPE_WEBHOOK_SECRET is the Webhook secret key. 
- This webhook calls the /api/stripe/webhook route
- We can then save our ticket in the DB and send emails and whatever else.

- For local testing
- In a new Iterm run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- This will give you a STRIPE_WEBHOOK_SECRET for local testing
- Disabling the webhook seemed to have worked. But that'll be a headache.
- Having both the webhook and local listener results in both getting called, which will mess up the prod DB during local dev.
- Probably two sandboxes is the way to go. Dev and Stg.