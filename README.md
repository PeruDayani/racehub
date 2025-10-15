Take 2!

### Supabase

Local supabase setup:
- Run supabase locally using docker for testing.
- `supabase init` to create a config folder
- `supabase start` to start the supabase server in docker
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
- Can I wire this up to a Vercel action somehow?

TODO:
- How to define RLS for Supabase?
- https://orm.drizzle.team/docs/rls#using-with-supabase

### Okay, up next

- Great fucking work.
- Wire up a very simple race public page

- STRIPE!!
- Focus in on the ticket workflow.

And then after that we have:
- Dashboard stats
- Racer ticket view
- QR codes
- Improving the Race Preview/Public pages
- Adding more fields to the RaceEditor
- All Races Search page
- Upload workflow
- Emails

- God lord, I'm going to learn a lot