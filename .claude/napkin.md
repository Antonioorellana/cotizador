# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-08-24] Turbopack can fail in the managed environment during PostCSS processing**
   Do instead: validate production with `next build --webpack` and keep lint and tests in the same check workflow.

## Data & Security Guardrails
1. **[2026-08-24] Demo mode is not production persistence**
   Do instead: keep fictitious browser-only data explicitly labelled until Supabase Auth, RLS, and migrations are configured and verified.
2. **[2026-08-25] OAuth consent is a separate data-sharing authorization**
   Do instead: pause before accepting profile sharing with a provider and obtain explicit user consent even when the technical task is already authorized.
3. **[2026-08-24] Quotation money is integer CLP**
   Do instead: store monetary values as integers, calculate IVA deterministically, and verify database totals against line items.

## Deployment
1. **[2026-08-25] Production database variables must not leak into previews by default**
   Do instead: scope Supabase production variables to Vercel Production until a separate preview database exists.
2. **[2026-08-24] Vercel must detect the project as Next.js**
   Do instead: confirm the framework preset is `nextjs` before diagnosing failed deployments as application bugs.

## User Directives
1. **[2026-08-24] Preserve an auditable quotation workflow**
   Do instead: separate drafts from issued immutable quotations and retain state transitions and audit evidence.
