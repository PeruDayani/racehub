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
- These JWTs are automatically send when using Supabase Data API, enabling RLS.



- https://github.com/supabase/supabase/issues/19883#issuecomment-2094656180
- https://supabase.com/docs/guides/auth/managing-user-data#using-triggers

TODO:
- How to deploy migrations safely?
- How to define RLS for Supabase?
- https://orm.drizzle.team/docs/rls#using-with-supabase

### Okay, up next
- Setup Supabase Auth
- Middlewear to protect (protected) routes, all (public) routes are public
- Sign in modals from supabase ui or something
- client and server side supabase user auth tokens.
- that should be enough to get us up and running with auth.
- and it's already making a lot more sense doing it step by step.

- Understand the different ways of calling supabase
- via Drizzle? we handle auth?
- via js lib? RLS handle auth?
- depending on these two things we will proceed.
