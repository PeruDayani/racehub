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


TODO:
- How to deploy migrations safely?
- How to define RLS for Supabase?