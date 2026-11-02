# Vercel deployment runbook

**Active owner decision, 2026-11-02: Vercel is the active and final hosting target; Cloudflare migration is discontinued.** Cloudflare-specific deployment tasks and all executable procedures in the archive below are **SUPERSEDED**, not completed. Only this current section describes the release path. It grants no permission to publish, access production or deploy.

## Local validation

Use the existing repository root, Node `22.23.4` and npm `10.9.9`. Confirm actual versions after selecting the runtime; `.nvmrc` alone does not switch the shell. Preserve working changes. Use approved loopback dummy public Supabase inputs for build-only validation; do not copy production credentials or treat that output as a release candidate.

When local validation is authorized, the existing scripts are:

```sh
node --version
npm --version
npm ci
npm ls --all
npm run check
npm run build
npm audit
```

Keep Astro `7.4.4`, `@astrojs/vercel` `11.0.17` and the reviewed scoped overrides described in [README](README.md). Reassess advisories and override compatibility if dependencies change. No forced audit fixes or major downgrades. These commands are reference instructions; none were rerun by this documentation-only update.

Inspect `.vercel/output/config.json` and `functions/_render.func/.vc-config.json`: runtime `nodejs22.x`; `/`, `/pengurus`, `/galeri` route to SSR; `.vercel/output/static/admin/index.html` exists. Verify referenced browser assets and ensure server code, credentials and private build files are not publicly served. Preserve `session: false`; Supabase browser authentication remains independent of Astro sessions. Adapter-managed Vercel output is the active packaging contract.

## Preview preparation and release gate

Confirm the Vercel team/project owner, repository root, Preview branch/triggers, preset Astro, Node 22.x, install `npm ci` and build `npm run build`. Use the framework/adapter output settings rather than a static-only `dist` override. Select one authoritative release path; ensure repository publication or automatic triggers cannot bypass the intended approval boundary.

Confirm an approved isolated Supabase target for Preview. Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in the appropriate Vercel environment before building; use only the intended public client key. Values are compiled into browser/SSR output, so rebuild after changing them and for each target. Never record their values in documentation or logs. Protect target inputs from untrusted branches. Keep `.env*`, local temporary metadata and `.vercel/` excluded from Git; inspect backup files before staging.

Prepare a concrete candidate, project/settings summary, remaining risks and verification/recovery procedure for final Preview approval. Create the Preview only after the applicable explicit authorization. Record its actual deployment identity and sanitized build results. On the approved test target, verify public SSR/content freshness, `/admin`, assets, browser/SSR logs, login/logout, CRUD/settings and upload/remove workflows, and the intended authorization behavior. Mutation tests require approved disposable fixtures and the corresponding database-owner authorization; do not test against production by default. Any failed compatibility/security check blocks Production and requires separately scoped remediation.

## Production readiness and release gate

Require accepted Preview evidence and confirmed Production project/branch/domain/DNS authority. Historical `main` and domain statements need current confirmation. Obtain approved Production public inputs and rebuild; do not reuse a dummy/Preview artifact with a different embedded project.

Require database-developer sign-off on existing schema/data/Auth/Storage and intended RLS behavior plus verified backup/restore ownership and procedure. Historical reports are not proof of current live state. This hosting migration authorizes no SQL, schema, data, RLS, credentials, admin enrollment or Storage changes. Any required inspection/remediation needs separate scope and authorization; never run the repository bootstrap SQL as a production repair.

Before seeking final release approval, prepare the target-specific candidate, an actual known-good Vercel deployment and recovery steps, or a reviewed initial-release recovery procedure if no prior deployment exists. Define owners, monitoring duration/error thresholds, stop criteria and the independent database/Auth/Storage recovery boundary. An application rollback cannot restore database state.

Production promotion and DNS changes require their applicable explicit authorization. After an approved release, record deployment/build identity, domain mappings, UTC time and operator; perform only covered verification actions, observe the agreed thresholds and execute only the approved recovery procedure when necessary. Never invent a recoverable deployment ID or declare completion from a successful upload alone.

## Evidence and boundaries

Use [ROADMAP](ROADMAP.md) for pending gates and [DECISIONS](DECISIONS.md) for current decisions. Prior local Vercel checks and the zero-finding audit are preserved observations, not Preview/Production acceptance. No remote resource is required merely to complete this documentation update. Commit, push, merge, deployment, DNS and database operations remain outside the current scope. Preserve all historical evidence; do not execute archived commands.

## Historical archive — SUPERSEDED Cloudflare execution plan

**Historical record only.** The entire disclosure below preserves the previous document verbatim. Its commands, task states, version choices and approval assessments apply to their original dates. Cloudflare-specific deployment tasks are **SUPERSEDED**, not completed; do not execute the archived plan. Unchanged linked milestone/task/evidence files and original logs have the same historical status for hosting. The current Vercel section above takes precedence. Supabase proposals remain subject to separate review and authorization.

<details>
<summary>Preserved historical Cloudflare records — not active instructions</summary>

# Deployment remediation runbook

**Future authorized execution only.** No implementation commands in this runbook were run during documentation creation. Do not begin M0.1 automatically. Tasks define prerequisites and exact file scope; proposed scripts, configuration and migrations must exist and be reviewed before use.

## Execution boundary

Use repository root, approved exact Node/npm and locked installed Wrangler. Preserve original documents and unrelated work. No global/latest tooling, astro add, auto-migration/scaffolding, npm audit fix, supabase link/db push, remote reset or destructive bootstrap as repair. Do not dump environment values or store credentials in evidence.

Local DB/Auth/Storage tests reject non-loopback endpoints before connecting and use disposable fixtures. Database developer coordinates every schema/policy/grant/membership/Storage change and remote mutation verification. Source UI/logic fixes require separate scope if they block acceptance.

## 1. Evidence and recovery — M0

After a separate instruction to start, capture HEAD/branch, tracked/untracked changes, document hashes, tools and sanitized failure logs. Record UTC time, full error/status/stage and correlation IDs. Obtain owner-supplied CI/resource/recovery information; remote inspection is not implied.

A Git revision or Vercel artifact is not automatically a recoverable Cloudflare version. Record real known-good Worker version and required bindings/settings or mark recovery unavailable. Missing information remains UNKNOWN and blocks dependent gates. M0.3 records separate local, staging and production permissions.

## 2. Dependency migration — M1

Revalidate log2 runtime/package candidates against official metadata and maintenance/advisories at implementation time. Approve exact Node/npm, edit only scoped manifest/adapter files, generate/review complete lockfile, then under installation permission:

```sh
npm ci
npm ls astro @astrojs/cloudflare @supabase/supabase-js wrangler
npm ls @astrojs/vercel
./node_modules/.bin/wrangler --version
npm run check
npm audit
```

Empty Vercel result/nonzero absence exit is expected; explain it. Checking requires zero errors and warning review. Audit findings require disposition; no audit fix. Installation/checking does not prove build/runtime/deployment readiness.

## 3. Environment and Workers packaging — M2

| Input | Phase | Contract |
| --- | --- | --- |
| PUBLIC_SUPABASE_URL | Browser and SSR build | Approved target/project mapping; loopback only in local mode. |
| PUBLIC_SUPABASE_ANON_KEY | Browser and SSR build | Public client key only; reject service-role/secret keys. |
| Cloudflare credential | Authorized deploy step | Appropriate account/Worker permission; never compiled into application. |
| SESSION | Local emulation and Worker runtime | Confirm selected adapter default; distinct explicit staging/production KV. |
| ASSETS | Workers asset integration | dist eligible assets exclude server code/maps, retain browser files. |

Current source uses import.meta.env. Runtime-only Worker settings cannot change values already compiled into browser/SSR. Build per target. Validator explicitly loads approved env/CI inputs, checks presence/whitespace/formats/key type/project and emits names only. Empty .env.example becomes trackable; working env stays ignored.

After M2 scripts/config exist, use local-only public inputs:

```sh
npm run validate:env -- --target local
npm run check
npm run build
test -f dist/_worker.js/index.js
test -f dist/.assetsignore
npm run verify:artifacts
./node_modules/.bin/wrangler deploy --dry-run --env staging --config wrangler.jsonc --outdir dist/dry-run
```

Proposed public/.assetsignore copied to dist:

```text
_worker.js
_worker.js/**
_routes.json
**/*.map
```

Verify actual eligible upload paths/count/sizes/checksums. Retain Worker main for bundling while excluding it from static upload. Require emitted admin HTML, referenced _astro files and favicon. File presence or dry-run alone does not prove public privacy; HTTP body probes follow.

## 4. Database compatibility and authorization — M3/M4

**Database developer coordination required.** M3.1 must publish approved exact local tooling/setup/teardown commands before completion. Local Supabase must include Auth and Storage; plain PostgreSQL alone cannot validate all APIs. Guard DB/API/Storage URLs and redirects before any connection. Original schema.sql can be a disposable local fixture reference only after explicit approval, never a remote repair.

Reserve migration identifiers with developer and reconcile actual ledger:

1. 20261030000100_content_compatibility.sql: compatible prestasi and program.foto_urls; preserve legacy values/arrays/content, RLS/public reads, writes denied pending M4.
2. 20261030000200_admin_membership.sql: private owner-managed membership and hardened helper.
3. 20261030000300_admin_content_storage_rls.sql: atomic replacement of broad write policies, scoped grants and required Storage SELECT.

If identifiers conflict, agree replacements and update all references/checksums before use. Abort incompatible tables/types/policies; do not blindly convert JSONB or replay legacy backfill over intentionally cleared arrays. Never seed fabricated achievements.

After implementation/review:

```sh
node scripts/db/local-harness.mjs --self-test
node scripts/db/local-harness.mjs --check-target
npm run test:schema:local
node supabase/tests/admin-membership.mjs --local
npm run test:rls:local
```

The full RLS runner is implemented in M4.3; earlier design/policy tasks use developer-reviewed local apply/catalog/manual probe attachments without depending on a later runner.

| Identity | Intended public reads | Content/settings mutation | foto upload/update/delete |
| --- | --- | --- | --- |
| Anonymous | Allowed | Denied; no change | Denied; no change |
| Ordinary authenticated | Allowed | Denied; no change | Denied; no change |
| Approved admin | Allowed | Allowed | Allowed within foto |
| Revoked admin with valid session | Allowed | Denied; no change | Denied; no change |

Test all seven tables, settings upsert/returning, generated IDs, ordering, photo overwrite/remove/list scope, other-bucket attempts, self-enrollment and metadata escalation. Privileged clients may set up fixtures but never assert RLS behavior. Verify rows/object bytes before/after; zero-row updates/deletes can appear successful. Public bucket delivery does not imply listing/mutation permission.

## 5. Local parity and CI — M5

After both M2.3 and M4.3 pass, start local runtime with emulated bindings, no remote flags:

```sh
./node_modules/.bin/wrangler dev --local --env staging --config wrangler.jsonc --ip 127.0.0.1 --port 8787 --persist-to /tmp/pena-workers-local
```

In another terminal test /, /pengurus, /galeri, /admin/, favicon and actual referenced JS/CSS. Inspect browser console/SSR logs. Compare same-fixture desktop/mobile screenshots for styling/navigation/text/program slider/gallery/people/order. Test intended admin login/logout/settings/all configured list CRUD/reorder/photo workflows and reflected public content.

Probe /_worker.js/index.js, nested Worker paths, _routes.json and actual source-map paths from inventory. Inspect body/content type; fallback 200 pages can occur, so status alone cannot establish private-file exposure. Underlying Worker/map bytes must never be served.

Select one authoritative release system. CI pins approved runtime, uses npm ci and approved env, check/build/verifier and guarded disposable DB tests where authorized. GitHub workflow, if selected, remains validation-only until independently approved. Protect staging/production secrets from untrusted PRs. Capture successful clean validation and unchanged tracked file hashes.

## 6. Staging and error 10013 — M6

Require M5.3 candidate/approvals. Database developer first verifies staging target/recovery/schema/ledger, applies only reviewed migrations and records preservation/security results. Exact target-specific remote DB commands must be reviewed/attached before execution; this runbook deliberately supplies no remote SQL.

Operator confirms separate staging Worker/KV/bindings and staging Supabase public build inputs, then under explicit staging permission:

```sh
npm run validate:env -- --target staging
npm run check
npm run build
npm run verify:artifacts
./node_modules/.bin/wrangler deploy --env staging --config wrangler.jsonc
```

Capture sanitized UTC logs with CLI/config identity, stage, HTTP status/full message, count/size, version and request/Ray IDs. Distinguish build, POST assets-upload-session, asset transfer, Worker upload and runtime.

| Evidence | Working interpretation | Next authorized action |
| --- | --- | --- |
| 401/403 or explicit permission/account error | Token scope/account mismatch plausible | Operator checks approved account/permissions; blind rebuild is not diagnosis. |
| Explicit manifest/path/size/count rejection | Packaging/config violation plausible | Compare actual inventory and current official limits for account/tool version; fix and revalidate locally. |
| 5xx/internal after valid auth and minimal reproduction | Platform/account condition more plausible | Correlate status history/timestamps and prepare sanitized reproduction. |
| Numeric 10013 alone | Insufficient evidence | Obtain full stage/status/message; cause remains UNKNOWN. |
| Upload succeeds, runtime fails | Runtime/env/schema/binding issue | Recheck compiled target, SESSION and DB; upload is not acceptance. |

At implementation, confirm version-specific permissions/account limits using official documentation. Earlier evidence reports Workers Scripts Write for upload-session; KV/routes may need additional rights. This is not proof of actual credential scope.

Minimal remote reproduction needs separate diagnostic permission and isolated Worker identities: trivial Worker → one harmless asset → application inventory, one factor at a time. External support/public messages require explicit authorization. Other users' reports do not establish this deployment's cause.

Repeat staging route/UI/admin/security/privacy checks. Rehearse actual Worker recovery with required bindings, restore candidate, reverify and record additive DB compatibility. Prepare concrete production observation duration/error thresholds/stop criteria. Unresolved 10013 or security/parity failure blocks release.

## 7. Production gate and rollout — M7

First obtain explicit read-only production inspection permission for database developer. After schema/ledger reconciliation, verified backup/restore and concrete apply/recovery plan, obtain separate DB mutation/enrollment/test permission and independent Cloudflare release permission. Monitoring/verification actions must also be covered.

Developer applies migrations before dependent Worker and verifies counts/references/effective RLS. No reset/seed bootstrap. Unexpected drift stops rollout for local/staging reproduction and revised review.

Rebuild with production public inputs; staging bytes cannot be reused when embedded project differs. Under separate production release authorization:

```sh
npm ci
npm run validate:env -- --target production
npm run check
npm run build
npm run verify:artifacts
./node_modules/.bin/wrangler deploy --env production --config wrangler.jsonc
```

Record version/config/bindings/routes, migration checksums and UTC release time. Check routes/assets/privacy/content/admin; developer performs only approved mutations on designated test records. Observe accepted duration and thresholds; missing telemetry/failed checks prevent completion.

## Recovery

| Failure | Recovery strategy |
| --- | --- |
| Local dependency/config failure | Preserve newer work; reverse reviewed task-owned hunks, use saved lockfile/runtime. No hard reset/clean. |
| Local SQL failure | Transaction rollback or guarded disposable fixture reset; repair design before promotion. |
| Committed additive schema issue | Retain populated objects and secure RLS; developer-led forward repair, no destructive down migration. |
| Authorization regression | Disable mutations if needed; correct policies securely; never restore broad authenticated writes. |
| Worker regression | Authorized operator restores recorded known-good version with compatible routes/bindings/settings; verify against additive schema/secure RLS. |
| No recoverable Worker | Block release until concrete alternative is reviewed and rehearsed. |
| Data restore required | Separate developer-led restoration permission/procedure; Worker rollback cannot restore DB. |

Exact remote rollback commands depend on real versions/account/CLI and must be attached/reviewed before release. Never invent a version ID. Release permission must cover recovery actor/action. Preserve incident evidence and reopen affected tasks.

## Evidence and completion

Record sanitized command/exits, assertions, target/artifact/config/schema identities, UTC time, approval and reviewer. DONE requires actual acceptance, not a plan or successful upload. Handover includes operational owners, observation results, recovery command attachments, known risks and database developer sign-off. Commit/push/merge remain separately authorized.


</details>
