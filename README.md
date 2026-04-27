# mydogportal.site

Premium breeder operating system for kennel management, breeding program control,
buyer operations, notices, workflow automation, and buyer-facing records.

## Product Standard

Project-wide product, design, and voice rules are locked in:

- [Product Rules](./PRODUCT_RULES.md)

## Current Confirmed Application Areas

Implemented or actively scaffolded in the repository:

- Public site
- Authentication
- Admin workspace shell
- Dashboard
- Dogs
- Breeding Program
- Litters
- Puppies
- Buyers
- Applications
- Payments
- Documents
- Transportation
- Automation
- Website Builder
- Settings
- Billing
- Buyer portal
- AI assistant layer

## Current Plan Model

The active subscription architecture is:

- Starter
- Professional
- Premium

Feature access and usage limits are gated from these three plans in code.

## Current Route State

Primary production-facing route family:

- `/`
- `/features`
- `/pricing`
- `/sign-in`
- `/sign-up`
- `/admin`
- `/admin/dogs`
- `/admin/breeding-program`
- `/admin/litters`
- `/admin/puppies`
- `/admin/buyers`
- `/admin/applications`
- `/admin/payments`
- `/admin/documents`
- `/admin/transportation`
- `/admin/automation`
- `/admin/website-builder`
- `/admin/settings`
- `/admin/billing`
- `/portal`

Secondary dashboard route family also exists in repository and should be treated as an active compatibility layer under review for consolidation:

- `/dashboard/...`

## Repository Truth Note

Some modules are fully wired with actions and schema support.
Some modules are scaffolded and gated but still require deeper completion.
Documentation should not describe every area as fully mature until route-by-route verification is complete.

## Environment

Set the local environment values in `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is used server-side for protected organization and
account operations.

## Database

Apply the SQL migrations in:

```bash
supabase/migrations/
```

## Development

```bash
npm run dev
npm run lint
npm run build
```
