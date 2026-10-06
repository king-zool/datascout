# DataScout

Compare Nigerian data reseller prices, with a private username/password admin dashboard and three advertisement placements. This GitHub version runs on Next.js and Vercel; it is independent of the existing Sites deployment.

## Deploy to Vercel

1. Import this repository into Vercel using the **Next.js** framework preset. Keep the build command `pnpm run build` and output directory `.next`. Use Node.js 22.
2. Create a **libSQL-compatible Turso database**. Copy its database URL and auth token into the Vercel environment variables below. Do not use a local SQLite file on Vercel.
3. In Vercel Storage, create a **private Blob store**, connect it to this project, and ensure `BLOB_READ_WRITE_TOKEN` is available.
4. Set `ADMIN_USERNAME`. Generate a password hash locally with `pnpm admin:hash`, then copy the printed hash into `ADMIN_PASSWORD_HASH`. Keep these credentials in environment settings, never in GitHub.
5. Initialize the database once. Locally, put the Turso settings in `.env.local`, run `pnpm install`, then `pnpm db:migrate`. This applies versioned SQL migrations atomically and safely skips already applied migrations. Do this before opening the deployment.
6. Redeploy on Vercel after changing environment settings. Open `/admin/login` to manage plans and ad slots. The dashboard redirects visitors who are not signed in.

| Environment variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL` | Remote libSQL database URL from Turso |
| `TURSO_AUTH_TOKEN` | Database auth token, server-only |
| `BLOB_READ_WRITE_TOKEN` | Private Vercel Blob token, supplied by connected store |
| `ADMIN_USERNAME` | Admin username |
| `ADMIN_PASSWORD_HASH` | Generated PBKDF2 hash, including all `$` separators |

A successful build does not create these services or configure their secrets. Missing database settings cause a visible catalogue loading error; missing admin settings prevent login; missing Blob settings prevent ad uploads.

## Local development

Use Node.js 22 and pnpm. Add the variables above to `.env.local`, then run:

```sh
pnpm install
pnpm db:migrate
pnpm dev
```

For local testing only, `TURSO_DATABASE_URL=file:./datascout.db` works without a Turso token. Use a remote database for production. Run `pnpm build` and `pnpm start` for a production build.

## Catalogue and existing data

A snapshot of all 180 current plans from the existing site is bundled, including the 150 submitted CSV plans and admin-added data. Its versioned import runs once on first use and preserves subsequent edits and deletions. Submitted prices are explicitly marked unverified; missing reseller URLs and validity remain unspecified.

The catalogue snapshot was exported on 6 October 2026. Later changes on the old site will not synchronize automatically. Ad images, sessions and environment secrets are not transferred by a GitHub push. Re-upload existing advertisement images in the new dashboard. The current catalogue and logo are included.

## Security

Admin passwords use PBKDF2-SHA256. Sessions are hashed in the database, expire after 12 hours, and are revoked on logout. Write endpoints require admin authentication and matching origin. Login attempts are rate limited. Advertisement images stay in private storage and are served through an endpoint that checks active status or admin access.
