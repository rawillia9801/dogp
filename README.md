# mydogportal.site

Premium breeder operating system for kennel management, breeding program control,
buyer operations, notices, and workflow automation.

## Product Standard

Project-wide product, design, and voice rules are locked in:

- [Product Rules](./PRODUCT_RULES.md)

All admin work must follow that standard without visual or tonal drift.

## Current Application Areas

- Public site
- Authentication
- Admin dashboard
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
- Settings
- Billing
- Buyer portal

## Routes

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
- `/admin/settings`
- `/admin/billing`
- `/portal`

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
