# Yayasan Pena Alkarim — Vercel deployment

**Active owner decision, 2026-11-02: Vercel is the active and final hosting target. The Cloudflare migration is discontinued.** Cloudflare-specific deployment tasks are **SUPERSEDED**, not completed. This current section takes precedence over all retained Cloudflare roadmap, milestone, task, evidence and log records, including documents linked below.

## Current configuration and validation

| Item | Current local state |
| --- | --- |
| Framework and adapter | Astro `7.4.4`; `@astrojs/vercel` `11.0.17`, peer Astro `^7.0.0` |
| Runtime | `.nvmrc` `22.23.4`; Node engine `>=22.23.4 <23`; npm `10.9.9` |
| Supabase client | `@supabase/supabase-js` `2.118.0`; integration unchanged |
| Rendering | `output: 'server'`, `compressHTML: true`, `session: false`; `/`, `/pengurus`, `/galeri` SSR; `/admin` prerendered |
| Build output | `.vercel/output`; function runtime `nodejs22.x`; admin HTML under `.vercel/output/static/admin/index.html` |
| Target inputs | `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are embedded at build time; public client key only; rebuild for each approved target |
| Git exclusions | `.env*`, `.vercel/`, `supabase/.temp/`, `node_modules/`, `.astro/`, `dist/` are ignored; general backup patterns are not yet covered |

The existing `package.json` and `package-lock.json` contain these narrowly scoped overrides:

| Parent | Override | Reason |
| --- | --- | --- |
| `@vercel/routing-utils@6.6.1` | `path-to-regexp: 6.3.0` | Patched same-major route compiler; parent pins the older version |
| `@vercel/cli-config@0.3.5` | `zod: 4.6.7` | Patched same-major validator; removes the old nested copy |
| `@vercel/nft@1.11.0` | `glob: 14.0.3` | Parent's Glob 13 range excludes the fix; brings patched Minimatch `11.0.4` and Path Scurry `3.0.0` |

The Glob major override was checked against the API/options used by NFT, Node 22 support, nine fixture combinations, dynamic asset/module tracing, route conversion and config validation. Reassess these overrides when the parent versions change. Do not downgrade Astro or apply forced audit fixes.

Prior local Vercel validation passed `npm ci`, `npm ls --all`, `npm run check`, `npm run build`, and `npm audit` (0 vulnerabilities after resolving the initial 7 high / 3 moderate findings). Check retained one existing unused `Gallery` import hint. Route/runtime configuration and the 402-file function inventory matched the pre-fix build. Builds used loopback dummy Supabase inputs; no live integration, Preview or Production acceptance was established. These are prior results, not new application tests performed by this documentation update.

## Current release status

Local preparation is complete; the next step is another read-only pre-commit review. Preview and Production release gates remain **PENDING**. Vercel project ownership/settings, approved target-specific inputs, Preview verification, recoverable deployment identity, production domain/DNS authority and database/Auth/Storage recovery readiness still need evidence. Supabase backup/restore and domain activation remain unverified; historical access reports do not establish current authority.

Use the [current roadmap](ROADMAP.md), [current runbook](RUNBOOK.md), [current decisions](DECISIONS.md) and [changelog](CHANGELOG.md). No deployment is authorized by these documents. Repository publication, Preview creation, Production promotion and DNS changes require their applicable explicit authorization. Supabase schema/data/RLS/Auth/Storage changes remain outside this migration and require separate owner/database-developer coordination.

## Historical evidence policy

The [original logs](../log1.md), [patch preview](../log2.md), [database report](../log-schema-db-supabase/schema-db.md), [incident evidence](evidence/failure-10013.md), [milestones](milestones/M0.md) and [task inventory](ROADMAP.md#historical-archive--superseded-cloudflare-execution-plan) remain historical records. Their versions, statuses, commands and approval boundaries describe earlier work. A historical DONE result is preserved as an actual past local result; it does not complete a discontinued deployment task or approve a Vercel release. Error 10013 remains an unresolved historical Cloudflare incident, not a prerequisite for Vercel release.

## Historical archive — SUPERSEDED Cloudflare execution plan

**Historical record only.** The entire disclosure below preserves the previous document verbatim. Its commands, task states, version choices and approval assessments apply to their original dates. Cloudflare-specific deployment tasks are **SUPERSEDED**, not completed; do not execute the archived plan. Unchanged linked milestone/task/evidence files and original logs have the same historical status for hosting. The current Vercel section above takes precedence. Supabase proposals remain subject to separate review and authorization.

<details>
<summary>Preserved historical Cloudflare records — not active instructions</summary>

# Yayasan Pena Alkarim deployment remediation

This is the documentation-driven roadmap for Astro, Cloudflare Workers and Supabase remediation. **M0.1 is DONE; M0.2 is BLOCKED by missing owner-confirmed target separation and recovery evidence.** **M0.3 scope/approval documentation is prepared; M0.3 remains BLOCKED by M0.2 and missing implementation/handoff approvals.** **M1.1 is DONE** under the user’s explicit local-only exception; Node 22.23.4/npm 10.9.9 verified. **M1.2 is DONE** under the owner-approved local Astro 7.4.4/Cloudflare 14.4.3 migration; final audits, Astro check and local build passed. **M1.3 and local milestone M1 are DONE** after clean isolated installation/static checking/audit, with no implementation changes. The other 18 tasks remain NOT_STARTED. Stop before M2; no deployment has occurred.

## Navigation

- [ROADMAP](ROADMAP.md): complete milestone/task inventory and dependency order.
- [RUNBOOK](RUNBOOK.md): future local validation, release, diagnosis and recovery procedures.
- [DECISIONS](DECISIONS.md): proposed choices, unknowns and independent approval gates.
- [CHANGELOG](CHANGELOG.md): documentation creation and verification record.
- Milestones: [M0](milestones/M0.md), [M1](milestones/M1.md), [M2](milestones/M2.md), [M3](milestones/M3.md), [M4](milestones/M4.md), [M5](milestones/M5.md), [M6](milestones/M6.md), [M7](milestones/M7.md). Each links three individual task files.

## Authorization boundary

The initial roadmap request authorized repository reads and Markdown creation under docs/deployment/ only. Subsequent explicit M0.1 and M0.2 instructions authorize their local read-only diagnostics, evidence creation and related deployment status updates. The subsequent M1.1 request authorizes engines/.nvmrc edits and scoped runtime installation/selection only, with a task-specific local dependency exception. SQL/account access, deployment, commit, push, merge, reset and later implementation remain unauthorized. The subsequent user request authorizes M0.3 documentation preparation only; M1.1 and the subsequently approved M1.2 local migration/validation have executed; The subsequent M1.3 request authorizes and completes local clean-install/static verification; M2 onward remain unstarted. The M1.2 record includes the owner-approved revised versions, necessary closing-tag correction and all actual validation outcomes. The three supporting documents remain unchanged.

Infrastructure M1/M2/M5 and the Cloudflare parts of M6/M7 are separate from database M3/M4 and database parts of M6/M7. **Every Supabase database change requires coordination with the database developer**, including schema, policies, grants, membership and Storage. Remote inspection, mutation and Worker release need distinct authorization.

## Repository evidence, reviewed 2026-10-30

Baseline: branch `fix/cloudflare-deployment`, HEAD `82ca4b807f8dc337205c48ae3bb5c703f172edfe`. Initial tracked diff was empty; only the three supplied Markdown documents were untracked. The previous audit/preview context was recovered from these documents.

| Evidence | Observed fact / limit |
| --- | --- |
| [log1](../log1.md) | Prior repository audit and proposal, including Workers packaging, SESSION, environment contract and 10013 hypotheses. Not proof of current remote state. |
| [log2](../log2.md) | Phase 1 patch preview; no patch applied. Candidate versions and earlier registry checks must be revalidated in M1. |
| [Database report](../log-schema-db-supabase/schema-db.md) | Repository schema/query comparison only; explicitly does not inspect live Supabase. |
| [Manifest](../../package.json), [lockfile](../../package-lock.json) | Locked Astro 5.18.2, Vercel 8.2.11, Supabase 2.118.0, check 0.9.11, TypeScript 5.9.3. Manifest ranges differ from locks; Supabase lock metadata requires Node >=22. |
| [Astro config](../../astro.config.mjs) | Vercel adapter and output: server active. |
| [Clients](../../src/lib/supabase.ts), [environment types](../../src/env.d.ts) | Browser/SSR use PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY through import.meta.env; SSR disables persisted sessions/refresh. |
| [Queries](../../src/lib/data.ts), [home](../../src/pages/index.astro) | Homepage awaits getPrestasi; errors propagate via must(). Program expects foto_urls array. |
| [Admin shell](../../src/pages/admin/index.astro), [script](../../src/scripts/admin.ts) | Prerendered shell, browser Auth/CRUD/settings/Storage. UI visibility is not authorization. |
| [SQL](../../supabase/schema.sql) | Destructive DROP … CASCADE; six content tables, no prestasi, program.foto_url text; broad authenticated writes and bucket-only Storage mutation rules. Not a production repair migration. |
| [.gitignore](../../.gitignore) | Ignores .env.example as well as real env; later task permits tracking an empty example. |
| Read-only filesystem inventory | No repository Wrangler config, .nvmrc, migration directory or CI workflow found; public contains favicon.png. Dashboard/production settings remain unknown. |

Structural exploration used codebase-memory status/schema, symbol search, getPrestasi trace/snippet and coverage check. Graph generation: 2026-10-27T13:36:03Z. SQL partial parsing and lockfile/public gaps were addressed by direct source reads/inventory; absence findings rely on filesystem inspection, not graph absence. No index mutation was requested.

## Invariants and limits

Preserve /, /pengurus and /galeri SSR, prerendered /admin, markup/styles/content/order, photo handling and business workflows. The intended security change removes ordinary authenticated mutation rights. Broader cleanup/reorder/runtime-env/index/bucket changes are deferred; if an existing issue blocks acceptance, record it and obtain separately scoped remediation.

Error 10013 has no established cause. Owner-supplied historical evidence records two October 27 runs failing at assets-upload-session after successful automatic Cloudflare adapter rebuilds, with Wrangler 4.153.0 and 37 assets each. HTTP status and API request-specific correlation identifier are unavailable in supplied logs. Adapter causation is not inferred. Actual Supabase schema/policies/grants/data/Auth/Storage, current CI settings, token scope and recovery versions remain unknown until separately authorized evidence exists.

## Status policy

NOT_STARTED → IN_PROGRESS only after authorization and actual work. BLOCKED records a blocker, owner and next action. DONE requires actual applicable command/manual outcomes, identity/checksum, timestamp and reviewer. Reopen affected records when inputs change. **M0.1 and M1.1–M1.3 are DONE.** See [M0.1 baseline](evidence/baseline.md) and [historical incident record](evidence/failure-10013.md) for completed evidence review and explicit limitations; the original roadmap snapshot above is historical.

M0.2 collected [resource ownership and targets](evidence/targets.md) and a [recovery readiness assessment](evidence/recovery.md). GitHub origin identity is locally confirmed; the resume confirms deployment-owner management of GitHub/Workers, production main, npm run build, npx wrangler deploy and accepted Supabase Developer access to zbswlphvzytaqazxwvnc. Owner/Admin permissions are not inferred. Selected yayasanpenaalkarim.or.id has unconfirmed activation. Target separation and Worker/database/Auth/Storage recovery evidence remain missing; Supabase backup and restore are **UNVERIFIED**. Acceptance criterion 1 remains unmet.

Documentation-only M0.3 preparation is complete in [draft scope and approval checklists](evidence/approvals.md). Its task status is BLOCKED: mandatory M0.2 dependency and local scope/design/handoff approvals remain unmet. G1 now has separate repository, installation, local build/testing and isolated local SQL gates; all implementation gates remain pending. The later M1.1 instruction grants a local-only exception solely for that runtime task; M0.2/M0.3 remain BLOCKED and other implementation gates pending. See [runtime evidence](evidence/runtime.md). Safest next task: collect the outstanding owner-supplied target/recovery package for M0.2. See [recovery blockers](evidence/recovery.md#outstanding-production-blockers).


</details>
