# Product Rules

These rules define the product standard for the entire `mydogportal.site`
system. They apply to all public pages, admin workspaces, shared UI, layouts,
navigation, copy, and product decisions unless the product owner explicitly
changes them.

## Brand Positioning

`mydogportal.site` is a premium breeder operating system for serious dog breeders.

It is a structured breeder-native system built around:

- breeding program operations
- dogs, litters, and puppies
- buyers and applications
- payments, documents, and delivery
- automation and communication

## Product Truth Rule

Repository documentation and public copy must distinguish between:

- confirmed implemented workspaces,
- active scaffolded workspaces,
- planned deepening layers.

Do not describe scaffolded/gated areas as if they are feature-complete if the
route and service layer do not yet prove that maturity.

## 1. Visual Identity

- Use a dark premium UI for breeder/admin operational workspaces.
- Use deep navy, charcoal, and near-black surfaces.
- Use warm gold and bronze as the primary accent family.
- Use subtle gradients and restrained glow where they strengthen hierarchy.
- Panels should feel like glass-style operational surfaces with depth.
- Public marketing pages may remain light if premium and clean.
- Do not introduce legacy pedigree UI styling.
- Do not introduce generic startup styling.

The system should feel:

- dense but controlled
- powerful
- structured
- high-end

## 2. Product Feel

- The product must feel like a serious breeder operating system.
- Confirmed modules should feel production-ready.
- Scaffolded modules should still feel polished, but documentation must stay honest about completion depth.
- The product must not feel like a template.
- The product must not feel lightweight or empty.

## 3. Layout Rules

- Avoid excessive small cards.
- Prefer grouped panels, workspaces, rails, tables, and timelines.
- Maintain hierarchy with a primary workspace, supporting panels, and a utility rail.
- Keep interfaces dense but controlled.
- Keep layouts elegant rather than sparse.
- Do not introduce filler sections.

## 4. Voice and Copy Rules

All user-facing text must be:

- clear and confident
- breeder-specific
- operational
- professional without sounding corporate
- simple without being dumbed down

Do not use:

- generic SaaS phrases
- "streamline your workflow"
- unsupported claims of full completion
- "coming soon" on paid surfaces
- developer-facing language
- placeholder language

Every sentence should read like it belongs in a real paid product.

## 5. Route Integrity Rule

The `/admin` route family is the primary production-facing breeder workspace.
The `/dashboard` route family currently exists as a compatibility/legacy layer and must be documented or consolidated intentionally.
Do not pretend the route model is singular until repository cleanup is complete.

## 6. Subscription Integrity Rule

All public pricing, upgrade prompts, and sales copy must align with the actual code plan model:

- Starter
- Professional
- Premium

Do not invent alternate plan names in public copy that do not map to repository gating.

## Implementation Guardrails

- Preserve the premium breeder operating system across dashboard,
  breeding, dogs, litters, puppies, buyers, applications, payments, documents,
  transportation, automation, settings, billing, and public-facing pages.
- Keep hierarchy stronger than decoration.
- Replace weak empty states with guided operational actions.
- Keep customer-facing language polished, direct, and breeder-specific.
- Treat every screen as a paid production product, not a concept surface.
