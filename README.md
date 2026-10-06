# DataScout

DataScout compares Nigerian data reseller prices side by side, with network filters, plan comparisons, an admin dashboard, and advertising spaces.

## Features

- Compare up to three plans by price, network, size, type and validity.
- Username/password admin login with server-protected plan and advertisement management.
- Three banner placements with image uploads and sponsor links.
- Imported website-sourced prices and 150 submitted CSV listings, labelled separately.
- Server-rendered catalogue and responsive layouts with a custom DataScout logo.

## Stack

React, TypeScript and Vinext, with Cloudflare D1 for records and R2 for advertisement images. This version is built for OpenAI Sites / Cloudflare Workers. It is not a MySQL or ordinary PHP hosting deployment.

## Development

Requires Node.js 22.13 or newer and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

D1 and R2 bindings are declared in `.openai/hosting.json`. Configure the `DB` database and `AD_IMAGES` bucket in the runtime. Apply the migrations under `drizzle/` in order; development needs local database setup before the catalogue can load.

## Admin configuration

Configure `ADMIN_USERNAME` and secret `ADMIN_PASSWORD_HASH` in the runtime environment. The password hash format is `pbkdf2$100000$<salt>$<hex-digest>` using PBKDF2-SHA256, a UTF-8 salt string and a 32-byte digest. Credentials are not included in this repository.

Open `/admin/login` to manage plans and ad banners. Runtime records, login sessions and uploaded ads remain in the hosted database/bucket; this repository contains the application source and imported catalogue datasets.

## Price provenance

Submitted CSV prices and descriptions are unverified. Missing website URLs and validity periods are not inferred. Confirm terms and current prices directly with the reseller before buying.
