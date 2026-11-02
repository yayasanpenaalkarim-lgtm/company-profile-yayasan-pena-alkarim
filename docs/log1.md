The repair should proceed through a reproducible Cloudflare build, local database compatibility and authorization tests, then an explicitly approved staging deployment. Migrating adapters is necessary for the intended target, but it does not guarantee resolution of error 10013.

No repository files were changed. No deployment, SQL execution, production Supabase access, commit, or push was performed.

The earlier audit text is unavailable in this conversation. The findings below were reverified against the clean checkout at 82ca4b807f8dc337205c48ae3bb5c703f172edfe; earlier deployment logs remain unverified.

Confirmed evidence

| Finding | Evidence and implication |
|---|---|
| Astro is locked to 5.18.2; Vercel adapter to 8.2.11. | package-lock.json; astro.config.mjs currently uses vercel(). |
| @astrojs/cloudflare@12.6.13 is compatible. | Its published package declares Astro ^5.7.0. Pin this version for the migration; current adapter documentation includes newer-major behavior that must not be copied indiscriminately. |
| The v12 adapter emits dist/_worker.js/index.js, with client assets in dist. | Verified in the published v12.6.13 package. This also matches Cloudflare’s documented Astro deployment layout. Cloudflare Astro guide |
| v12.6.13 configures a SESSION KV session driver by default when no driver is supplied. | Verified in its package source. The application itself uses Supabase browser authentication and contains no Astro.session usage. |
| Both Supabase clients use import.meta.env.PUBLIC_SUPABASE_*. | src/lib/supabase.ts (src/lib/supabase.ts:3). Build-time substitution matters for both browser and SSR bundles. |
| The locked Supabase client is 2.118.0, requiring Node ≥22. | package-lock.json. Astro’s lower historical Node minimum is insufficient for this dependency set. |
| /admin is prerendered; public pages use SSR. | admin/index.astro (src/pages/admin/index.astro:7), astro.config.mjs. |
| Application/schema mismatches exist. | prestasi is queried but absent from SQL; program.foto_urls is expected but SQL defines foto_url. |
| SQL grants writes to every authenticated user. | The content policy uses unconditional USING (true) and WITH CHECK (true); photo mutation policies check only authentication and bucket. |
| The supplied schema is destructive. | supabase/schema.sql (supabase/schema.sql:7) starts with DROP TABLE … CASCADE. It must not be used as a production repair migration. |
| No tracked Wrangler configuration or CI workflow exists at this revision. | Git tree inspection. Dashboard build/deploy commands are outside repository evidence. |

Unconfirmed hypotheses: Wrangler may be performing automatic migration because configuration is absent; error 10013 may involve Cloudflare infrastructure, authorization, or asset packaging; production Supabase may already contain schema changes absent from this repository. None should be treated as established fact.

Prioritized implementation plan

All changes and commands below are proposed for a later authorized implementation.

| Phase | Task | Files affected | Proposed change | Risk | Validation | Acceptance criteria | Rollback strategy |
|---|---|---|---|---|---|---|---|
| 0 — P0 | Preserve evidence and recovery information | Proposed docs/deployment-runbook.md | Record baseline revision, sanitized failure details, current CI settings, Worker identity, active version, routes, and available recovery target. | Low; incomplete evidence could lead to incorrect diagnosis. | Verify revision and clean status; review existing deployment logs without exposing tokens. | Build, asset-upload, Worker-upload, and runtime failures are distinguishable; recovery target is documented or explicitly unavailable. | No infrastructure change; discard documentation changes if needed. |
| 1 — P0 | Pin runtime and migrate adapter | package.json, package-lock.json, astro.config.mjs, new .nvmrc | Retain Astro 5.18.2 and Supabase 2.118.0; remove Vercel; pin Cloudflare 12.6.13 and Wrangler 4.59.2. Standardize on a maintained Node 22 patch, at least 22.12.0. | Medium; dependency and Workers runtime differences. | Commands A below; inspect lockfile diff for unrelated upgrades. | Correct adapter resolves with no invalid peers; Vercel dependency/import removed; type checking passes. | Restore the reviewed baseline package/config files and reinstall from the baseline lockfile. No production impact. |
| 2 — P0 | Make environment and packaging deterministic | New wrangler.jsonc, public/.assetsignore, .env.example, validation scripts; .gitignore, package.json, README/runbook | Add explicit Worker configuration, exclusions, environment validation, build-artifact validation, and local Workers preview. Track only empty environment examples. | High if server code becomes a public asset or the wrong Supabase project is embedded. | Commands B; inspect asset inventory; local requests to SSR, admin, assets, and excluded paths. | Correct entrypoint exists; exclusions survive build; intended assets are present; no private credentials/server source are served; environment failures reveal names only. | Revert configuration/scripts; rebuild using the previous reviewed configuration. |
| 3 — P0 | Repair schema compatibility locally | New supabase/migrations/<timestamp>_content_compatibility.sql; schema documentation; proposed local schema tests | Add prestasi; add and backfill program.foto_urls while retaining foto_url; never reset tables or overwrite existing arrays. | Medium; deployed schema may differ from repository SQL. | Local-only migration tests against both the baseline and a populated fixture; verify row counts, IDs, image preservation, and application queries. | No lost rows or overwritten existing arrays; all expected tables/columns match queries; migration safely aborts on unexpected types. | Retain additive objects and roll back application behavior. Do not drop columns/tables containing new data. |
| 4 — P0 | Enforce explicit admin authorization | New admin/RLS migration; local authorization tests; src/scripts/admin.ts if adding access feedback | Introduce owner-managed admin membership; replace broad content and storage write policies with explicit authorization. Preserve intended public reads. | High; incorrect policies can expose writes or lock out administrators. | Anonymous, authenticated non-admin, admin, and revoked-admin test matrix below. | Only designated admins mutate content/photos; non-admin denials leave data and objects unchanged; public reads continue. | Before commit, transaction rollback. After application, correct policies or temporarily disable writes; do not restore unrestricted authenticated writes. |
| 5 — P1 | Make CI deterministic | package.json, runbook; new validation-only .github/workflows/validate.yml if GitHub Actions is selected; Cloudflare dashboard settings | Install with npm ci; validate, check, build, verify artifacts; use explicit Wrangler config and the locked CLI. Remove framework detection/migration commands from deployment. | Medium; dashboard and repository pipelines can diverge or deploy twice. | Clean CI build; compare tracked files before/after pipeline; inspect sanitized command logs. | CI performs no adapter installation, dependency rewrite, scaffolding, or automatic framework migration; one deployment system owns releases. | Restore recorded CI settings and retain the last working release. |
| 6 — P1 | Diagnose 10013 and validate staging | Runbook; separate staging environment settings | After approval, deploy to an isolated staging Worker using staging Supabase and KV; run the diagnostic procedure below. | Medium; remote writes and resource creation require separate authorization. | Successful asset session/upload, Worker upload, route checks, admin CRUD/photo tests, authorization tests. | Staging operates correctly and error 10013 is resolved or isolated with actionable evidence. | Restore prior staging version; keep production routes untouched. |
| 7 — P2 | Approved production rollout | Reviewed release/configuration; production settings; separately approved migrations | Confirm backup/recovery readiness; apply approved additive database changes before dependent application release; deploy and monitor. | High; production authorization and data changes. | Public page checks, asset checks, SSR errors, intended admin access, denied non-admin writes, recorded release/version. | No SSR/schema/binding errors; correct content; admin-only mutations; tested release rollback available. | Restore previous known-good Worker/version and required settings. Keep additive schema and secure RLS; repair forward if necessary. |

Phases 3–4 can be prepared independently of Cloudflare packaging. Production rollout requires all preceding acceptance criteria.

Permanent Cloudflare configuration

Proposed root wrangler.jsonc, with identifiers replaced only after target approval:

{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "<approved-worker-name>",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-01-16",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "kv_namespaces": [
    {
      "binding": "SESSION",
      "id": "<approved-session-namespace-id>"
    }
  ]
}

The compatibility date is a proposed fixed starting point aligned with the selected adapter’s release-era dependencies. Validate it locally and in staging; change it through review rather than substituting the current date on every build.

Additional requirements:

- Use distinct Worker identities and KV namespaces for staging and production. Declare environment-specific bindings explicitly rather than assuming inheritance.
- Preserve output: 'server' and /admin prerendering.
- Retain the v12 default KV driver and explicitly provision/bind SESSION for the initial migration. Supabase browser sessions do not use this KV, but the selected adapter configures it. Removing that default is a separate, version-specific optimization.
- Do not assume a newer adapter’s session: false behavior applies to v12.
- Keep asset-first routing initially; verify public SSR routes fall through to the Worker. Do not enable SPA fallback for this SSR site.

Proposed public/.assetsignore, copied into dist during the build:

_worker.js
_worker.js/**
_routes.json
**/*.map

Confirm the actual upload inventory excludes the Worker directory and source maps while retaining /admin, /_astro/*, and the favicon. Cloudflare reads .assetsignore from the assets directory; exclusions do not replace the Worker main entrypoint. Asset configuration

Environment contract

| Variable | Build time | Runtime under existing code |
|---|---|---|
| PUBLIC_SUPABASE_URL | Required for browser and SSR compilation. | The compiled URL must be available in the deployed bundle; a separate Worker binding is not required. |
| PUBLIC_SUPABASE_ANON_KEY | Required. Must be the public anon/publishable client key appropriate to the selected project. | The compiled public key is used by SSR and browser clients. Worker-only settings cannot repair an incorrectly built client bundle. |
| Supabase service-role/secret key | Not required. | Not required; must never enter a PUBLIC_* variable or browser bundle. |
| Cloudflare deployment token | Deployment step only. | Not an application runtime variable. |
| SESSION | Declare configuration for local adapter tooling. | KV binding required by the proposed retained session driver. |

Consequences:

- Build separately for staging and production when their Supabase values differ.
- Changing Worker runtime bindings alone does not update these import.meta.env references.
- SSR public reads should continue using public-key/RLS access.
- A future runtime-variable refactor would need a separate server configuration path; browser configuration would still need build-time or explicitly designed public configuration.

The proposed environment validator should check presence, whitespace, URL structure, expected project identity, and public-key type without printing values. Reject secret/service-role keys; never log decoded JWT payloads, headers, passwords, or full environment dumps. Local checks must reject production targets.

Use Node 22, with one maintained patch pinned consistently in .nvmrc, CI, and Workers Builds. The selected Wrangler requires Node ≥20; the locked Supabase client raises the effective minimum to ≥22.

Proposed validation commands

These are instructions for implementation; they were not run.

A — dependency migration, performed once during development:

npm uninstall @astrojs/vercel
npm install --save-exact astro@5.18.2 @astrojs/cloudflare@12.6.13 @supabase/supabase-js@2.118.0
npm install --save-dev --save-exact wrangler@4.59.2

node --version
npm ls astro @astrojs/cloudflare @supabase/supabase-js wrangler
npm run check

Expected: approved Node 22 patch; expected direct versions; no invalid peers; zero checking errors. Review warnings and unrelated lockfile changes before proceeding.

B — reproducible build and local packaging checks:

npm ci
node scripts/validate-env.mjs
npm run check
npm run build
test -f dist/_worker.js/index.js
test -f dist/.assetsignore
node scripts/verify-worker-artifacts.mjs
./node_modules/.bin/wrangler dev --local --config wrangler.jsonc

The two scripts are proposed files, not existing commands. They should report only pass/fail and non-sensitive diagnostics.

With exclusively local Supabase configuration:

curl --fail --silent --output /dev/null http://localhost:8787/
curl --fail --silent --output /dev/null http://localhost:8787/pengurus
curl --fail --silent --output /dev/null http://localhost:8787/galeri
curl --fail --silent --output /dev/null http://localhost:8787/admin/
curl --fail --silent --output /dev/null http://localhost:8787/favicon.png

Expected: successful intended responses, correctly loaded CSS/JavaScript, and no missing binding or schema errors. Separately verify requests under /_worker.js/ and source-map paths never return their underlying files.

Proposed local database test entrypoints:

npm run test:schema:local
npm run test:rls:local

Implement these with a hard loopback-host check and disposable fixtures. They must refuse production URLs and must not run the destructive repository schema against a remote database.

CI’s eventual deployment step should invoke the installed Wrangler with --config wrangler.jsonc and an explicit approved environment. It must never use astro add, scaffolding, @latest, or dependency installation during deployment.

Non-destructive database design

For the compatibility migration:

1. Create prestasi with id bigint generated always as identity primary key, deskripsi text not null, and urutan integer not null default 0. Add grants and RLS before exposing it.
2. Add program.foto_urls text[] for the baseline schema. Backfill existing nonempty foto_url values into one-element arrays; use empty arrays otherwise.
3. Preserve foto_url and all existing identifiers, descriptions, ordering, and storage objects.
4. If an existing foto_urls column is already populated or uses JSONB, stop for schema reconciliation rather than coercing it blindly.
5. Record the migration once; repeated validation must not repopulate deliberately removed photos.
6. Do not seed invented achievements or overwrite existing settings. Additional site_settings keys fit the existing key/value table and do not require columns.

The missing prestasi table can break homepage SSR because getPrestasi() propagates query errors. The missing image-array column can cause absent public images and failed admin writes. These are confirmed repository/schema incompatibilities, not proof of production schema state.

For authorization, prefer an owner-managed allowlist:

- Store approved user UUIDs in private.site_admins; browser roles cannot alter membership.
- Provide a narrowly scoped private.is_site_admin() helper using auth.uid().
- Make it STABLE SECURITY DEFINER, with an empty fixed search_path, fully qualified references, and a trusted owner.
- Revoke default public execution; grant only necessary schema usage/function execution.
- Do not base administrator status on user-editable metadata or merely on successful login.

Apply this policy matrix:

| Resource | Public/ordinary authenticated reads | Admin mutation policies |
|---|---|---|
| site_settings, program, poin_misi, pengurus, kegiatan, footer_link, prestasi | SELECT USING (true) for intentionally public content. | INSERT: admin WITH CHECK; UPDATE: admin USING and WITH CHECK; DELETE: admin USING. |
| storage.objects, bucket foto | Preserve public image delivery through the public bucket; restrict object listing as needed. | Bucket condition and admin predicate for INSERT/UPDATE/DELETE. Add admin SELECT access needed for supported storage mutations. |

Remove the old broad policies in the same transaction as the replacement. Adding restrictive-looking policies alongside permissive policies does not eliminate the existing access path. Review overlapping policies and use explicit grants for the named tables and any required sequences. Supabase documents both policy composition and storage operation requirements. Database RLS, Storage access control

Required local authorization tests:

| Identity | Content writes | Photo mutations | Public reads |
|---|---|---|---|
| Anonymous | Denied | Denied | Allowed |
| Authenticated non-admin | Denied | Denied | Allowed |
| Approved admin | Allowed | Allowed within foto | Allowed |
| Admin after membership revocation | Denied | Denied | Allowed |

Test INSERT, UPDATE, DELETE, settings upsert, and storage operations separately. Check actual affected rows/object state: RLS denial may appear as zero affected rows rather than an explicit error. The admin UI should communicate unauthorized access, but RLS remains the enforcement boundary.

Error 10013 diagnostic procedure

1. Locate the failing stage. Preserve sanitized logs identifying whether failure occurs at POST …/assets-upload-session, asset upload, Worker version upload, or application execution. Record UTC time, HTTP status, complete error messages, Wrangler version, configuration identity, request/Ray identifiers when available, and asset counts/sizes.
2. Validate packaging locally. Confirm the entrypoint, asset directory, ignore rules, eligible asset inventory, current plan limits, and absence of server files or credentials. Local success does not prove remote upload-session health.
3. Check authorization after approval. Confirm token validity, account scope, Worker identity, and CI credentials. The upload-session API requires Workers Scripts Write. KV provisioning can require separate permissions; custom-domain changes can require additional permissions. Upload-session API
4. Classify using evidence:

| Evidence | Interpretation | Next action |
|---|---|---|
| HTTP 401/403, explicit permission/account errors | Authorization is the leading cause. | Correct token scope/account targeting; do not repeatedly rebuild assets. |
| Explicit invalid manifest, path, size, or file-count errors | Asset configuration is the leading cause. | Correct the documented violation and compare inventories. |
| HTTP 5xx/internal error with valid authorization and a minimal asset reproduction | Platform/account state becomes a stronger hypothesis. | Correlate with incident history and escalate with sanitized evidence. |
| Only numeric code 10013 | Insufficient evidence. | Obtain HTTP status and full message before choosing a remedy. |

5. Reproduce remotely only after approval, using an isolated diagnostic Worker: first a trivial Worker, then the same Worker with one harmless asset, then the application inventory. Vary one factor at a time. This distinguishes general publishing, assets infrastructure, and application packaging.
6. If evidence points to Cloudflare, submit the minimal reproduction, timestamps, identifiers, version, and sanitized configuration to support. Cloudflare’s SDK tracker records internal/platform investigations for this endpoint, but those reports do not establish this deployment’s cause. Issue #13118, Issue #11153

Decisions requiring approval before implementation

- Authorize repository edits and the proposed pinned adapter/runtime choices.
- Select the authoritative CI system and approve its recorded build/deployment settings.
- Confirm staging/production Worker identities, Supabase project mapping, and separate KV resources.
- Approve the administrator allowlist design and initial admin identities.
- Separately authorize local SQL testing, remote diagnostics/staging deployment, and any later production migration/release.

Production schema inspection and migration require a later explicit authorization. This plan does not authorize production access, automatic migration, deployment, commits, or pushes.