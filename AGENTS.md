This is a Next.js 16 App Router fundraising site managed with `pnpm` and deployed on Vercel.

## Project context

- This site exists to support Nate Atkins and raise money for CHOP childhood cancer care and research.
- Nate was born on May 2, 2025. In late June, vomiting and unusual sleepiness led to an emergency CHOP visit, where doctors discovered hydrocephalus caused by a rare choroid plexus tumor.
- The current site copy emphasizes gratitude toward CHOP, support from family and community, and hope for other families facing pediatric brain cancer.
- Treat donation UX and fundraiser copy as mission-critical. Prefer clarity, trust, accessibility, and emotional restraint over cleverness or aggressive conversion language.
- Preserve factual details already present in the repo unless the user explicitly asks to revise them.

## Design system context

- The current visual language is campaign-specific, not generic SaaS UI.
- The local Paper board `Go Nate Go Design System` defines the active foundation set for this repo.
- Core palette from that board:
  - `#2A3F54` primary background / homepage shell
  - `#3F5D81` section blue
  - `#42A8A9` action teal
  - `#EEF5FB` donation surface
  - `#223B54` ink
  - `#F7FBFF` snow
  - `#D8EFF5` pill mist
  - `#9FC5D8` soft border
- Typography from the board:
  - `Lilita One` for hero marks and short, emphatic section headlines
  - `Work Sans` for body copy, labels, buttons, helper text, and UI controls
- Scale and shape guidance from the board:
  - section rhythm `24 / 32 / 48`
  - card corners `24-32px`
  - button corners `14-22px`
  - shadows should stay soft and low contrast
- Prefer warm, hopeful, family-centered presentation over corporate polish. The design should feel personal, optimistic, and trustworthy.
- Reuse the existing visual motifs already present across the homepage and donate flow: rounded cards, soft gradients, subtle texture, shark/Nate imagery, dark campaign sections paired with lighter donation/editorial sections, and approachable motion.
- Component guidance from the board:
  - CTA buttons should feel buoyant, with heavy Work Sans, oversized height, generous radius, and teal reserved for emphasis
  - pills and tags should use mist tints, teal strokes, and uppercase micro-labels
  - cards should use white or pale-tint surfaces, soft corners, low-contrast borders, and calm shadows
- Pattern guidance from the board:
  - alternate deep blue campaign sections with lighter editorial and checkout surfaces
  - keep transitions soft and rounded rather than using hard dividers
- Board do/don't guidance:
  - do lead with big, short Lilita headlines, keep body copy in Work Sans, use teal as a deliberate action or emphasis color, and preserve breathing room
  - avoid tiny radii, hard black shadows, oversaturated color stacks, or generic SaaS neutrals
- If extending the design system, keep components visually aligned with the fundraising pages instead of defaulting back to stock shadcn styling.

## Project guidelines

- Use `pnpm` for repo commands.
- Run `pnpm lint` after code changes. Run `pnpm exec tsc --noEmit` after TypeScript changes because `next.config.mjs` sets `typescript.ignoreBuildErrors = true`, so `pnpm build` will not catch type regressions.
- Keep pages, layouts, and route handlers in the App Router structure under `app/**`. API endpoints for this project live in `app/api/**`.
- Reuse the existing shadcn/ui layer in `components/ui/**` and shared helpers in `hooks/**` and `lib/**` instead of creating parallel utilities.
- Canonical shared hooks live in `hooks/**`. Prefer `@/hooks/use-haptic-feedback`, `@/hooks/use-mobile`, and `@/hooks/use-toast` over duplicate copies elsewhere.
- Preserve the established campaign brand unless the user explicitly wants a redesign: `Lilita One` for headings, `Work Sans` for body copy, dark slate-blue surfaces, and teal primary accents.
- This project uses Framer Motion heavily for reveal and carousel interactions. Keep motion tasteful and respect reduced-motion behavior where it already exists.
- Use the `useHapticFeedback()` wrapper instead of calling `web-haptics` directly.
- The live fundraising card reads from `/api/donations`, which proxies DonorDrive team `15164`. Preserve the ETag passthrough and `Cache-Control: s-maxage=15, stale-while-revalidate=60` behavior when touching donation progress logic.
- The active donation checkout flow is `app/donate/page.tsx` -> `/api/stripe/checkout-session` -> `app/donate/return/page.tsx`.
- Keep server-only Stripe code in `lib/stripe.ts`. Required Stripe environment variables are `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- For Stripe work in this repo, prefer the current Checkout Session based flow over introducing direct Charges or legacy card integrations.
- `app/donate/return/page.tsx` currently handles both Checkout Session and Payment Intent return states. If you change the checkout architecture, update both paths deliberately rather than letting one drift.
- Deploy from the repository root: `/Users/Matt.Atkins/Code/go-nate-go-1`.
- Default to preview deployments. Only deploy to production when the user explicitly asks for production.

## Skills

### Available skills

- workflow: Workflow orchestration for complex coding tasks. Use for any non-trivial task in this repo so work starts with a plan, clear verification, and a deliberate refinement pass. (file: /Users/Matt.Atkins/.codex/skills/workflow/SKILL.md)
- stripe-best-practices: Best practices for building Stripe integrations. Use when changing donation checkout, payment APIs, Stripe configuration, or the overall payment architecture in this project. (file: /Users/Matt.Atkins/.codex/skills/stripe-best-practices/SKILL.md)
- typescript-strict-rules: Enforce strict TypeScript and React code quality rules for generated or edited code. Use when creating or modifying `.ts` or `.tsx` files in this project. (file: /Users/Matt.Atkins/.codex/skills/typescript-strict-rules/SKILL.md)
- vercel-deploy: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment". (file: /Users/Matt.Atkins/.codex/skills/vercel-deploy/SKILL.md)
