# Vercel decisions and release gates

**Active owner decision, 2026-11-02: Vercel is the active and final hosting target. Cloudflare migration is discontinued.** The current register below supersedes the archived deployment choices and execution permissions for hosting. Original evidence and actual prior local results remain intact. Cloudflare-specific deployment tasks are **SUPERSEDED**, not completed.

## Current decision register

| ID | State | Decision and evidence boundary |
| --- | --- | --- |
| V01 | ACCEPTED — owner | Use Vercel. The old Cloudflare rollout sequence is SUPERSEDED as an execution plan, including M2.1–M2.3, M5.1, M6.2, M7.2 and Cloudflare-specific portions of mixed tasks. Cancellation supplies no task completion or remote release permission. |
| V02 | IMPLEMENTED LOCALLY | Astro `7.4.4`, Vercel adapter `11.0.17`, Supabase client `2.118.0`; Node `22.23.4`, npm `10.9.9`, Node engine `>=22.23.4 <23`. Prior Astro 5 and Cloudflare adapter candidates are historical, not active options. |
| V03 | IMPLEMENTED LOCALLY | Preserve public SSR and prerendered `/admin`; `output: 'server'`, `compressHTML: true`, `session: false`; Vercel function runtime `nodejs22.x`. Existing application/Supabase behavior and the markup fix are retained. |
| V04 | VERIFIED LOCALLY | Scope overrides to Routing Utils 6.6.1 → Path-to-regexp 6.3.0, CLI Config 0.3.5 → Zod 4.6.7, NFT 1.11.0 → Glob 14.0.3. Parent pins/ranges prevented ordinary patched resolution. Glob brings Minimatch 11.0.4; the cross-major override passed targeted API/fixture/tracing and full build checks. Revisit overrides with parent upgrades. |
| V05 | VERIFIED LOCALLY, LIMITED | Prior clean install/full tree/check/build/audit passed; audit 0; one unused-import hint. Dummy loopback Supabase inputs and local artifact assertions do not prove live integration, authorization, Preview or Production readiness. |
| V06 | RETAINED BOUNDARY | Supabase integration/credentials/schema/data/RLS are unchanged. Historical database proposals remain unimplemented proposals; separate database-developer coordination and authorization are required for inspection or mutation. Backup/restore and live compatibility/security remain release evidence requirements. |
| V07 | PENDING | Confirm Vercel owner/project/settings/triggers, isolated Preview inputs, Production inputs/branch, domain/DNS authority, recoverable deployment or initial-release recovery plan, observation thresholds and handover owners. |

The earlier D02, D05–D07 and Cloudflare choices in D11/D12 are SUPERSEDED for hosting. D03's earlier lower engine bound is superseded by V02. Historical G2/G3/G6 Cloudflare release/diagnostic requirements do not gate the Vercel path. General evidence, database authorization, recovery and publication boundaries are carried forward below; historical records do not authorize new actions.

## Current gates and authorization

| Gate | Required outcome | Current state |
| --- | --- | --- |
| Local preparation | Reviewed Astro 7/Vercel configuration, compatible overrides, local installation/tree/check/build/audit and SSR/admin artifacts | Prior local scope authorized and validated; no new application validation in this documentation pass |
| Repository pre-commit/publication | Another read-only pre-commit review with exact stage list, secret/ignore checks and current documentation; publication only when explicitly authorized | Review PENDING; stage/commit/push/merge NOT AUTHORIZED |
| Preview | Confirm actual project/owner/settings and isolated inputs; review concrete candidate/test/recovery plan; explicitly authorize Preview creation and covered tests | PENDING; no release or remote mutation authorized |
| Production inspection/database work | Confirm any required read access, live compatibility/security and backup/restore evidence; separately review and authorize any actual remediation | PENDING; this migration grants no production access or database changes |
| Production release/DNS | Accepted Preview, approved Production candidate/inputs, confirmed branch/domain authority, application/data recovery and monitoring; explicit authorization for promotion and any DNS action | PENDING; not authorized or executed |

Approvals persist within their stated scope; do not re-request an already authorized action. The present owner request authorizes only the five deployment entry documents and their documentation checks. Hosting selection is not release approval. Historical error 10013 and Cloudflare recovery gaps are retained incident evidence, not active Vercel prerequisites. Refer to [ROADMAP](ROADMAP.md) and [RUNBOOK](RUNBOOK.md) for the current gate sequence.

## Historical archive — SUPERSEDED Cloudflare execution plan

**Historical record only.** The entire disclosure below preserves the previous document verbatim. Its commands, task states, version choices and approval assessments apply to their original dates. Cloudflare-specific deployment tasks are **SUPERSEDED**, not completed; do not execute the archived plan. Unchanged linked milestone/task/evidence files and original logs have the same historical status for hosting. The current Vercel section above takes precedence. Supabase proposals remain subject to separate review and authorization.

<details>
<summary>Preserved historical Cloudflare records — not active instructions</summary>

# Decisions and approvals

Implementation choices below are **PROPOSED** unless marked as documentation constraints. This document grants no implementation or remote permission.

## Decision register

| ID | State | Choice and rationale | Required verification |
| --- | --- | --- | --- |
| D01 | Documentation constraint | Markdown only under docs/deployment; preserve original evidence. | No application, dependency, SQL, account, deployment or Git write operations. |
| D02 | PROPOSED | Preserve locked Astro 5.18.2 / Supabase 2.118.0; replace Vercel with Cloudflare 12.6.13 and direct Wrangler 4.59.2 from log2. | M1 rechecks version-specific metadata, peers, engines, advisories and complete lockfile. Candidates are not claims of newest/safe versions. |
| D03 | ACCEPTED for M1.1 local runtime only; see dated exception | Exact Node 22 patch; log2 candidate 22.23.4 / npm 10.9.9, engines >=22.12.0 <23. | Verify official release provenance/maintenance; exact approved runtime consistent in .nvmrc and CI. |
| D04 | PROPOSED | Keep server output/public SSR/prerendered admin, UI and business workflows. | Same-fixture visual/browser/API verification; source fixes need separate scope. |
| D05 | PROPOSED | Explicit wrangler.jsonc main dist/_worker.js/index.js, assets dist/ASSETS, nodejs_compat, fixed date 2026-01-16. | Confirm installed adapter/CLI behavior locally/staging; date reviewed rather than automatically today's date. |
| D06 | PROPOSED | Retain reported v12 default SESSION KV initially; distinct explicit namespaces/bindings per environment. | Verify selected adapter source; Supabase browser auth does not replace KV. Do not assume newer-major session:false options. Provisioning separately authorized. |
| D07 | PROPOSED | Exclude Worker code, _routes.json/maps from static upload; preserve admin/_astro/favicon and asset-first SSR fallthrough, no SPA fallback. | Actual inventory, dry-run and HTTP body probes; Worker main still bundled. |
| D08 | PROPOSED | Keep existing public import.meta.env build inputs and rebuild per target. No service/secret key in browser or SSR inputs. | Validator checks public-key type/target without logging values; runtime-only binding edits cannot alter compiled client. |
| D09 | PROPOSED — DB developer | Add prestasi and program.foto_urls text[] via versioned additive migration; retain foto_url and existing data/arrays. | Reconcile types/history; abort incompatible drift; no destructive bootstrap or fabricated seed content. |
| D10 | PROPOSED — DB developer | Owner-managed private.site_admins plus hardened private.is_site_admin(); admin-only content/foto mutations and intended public reads. | Owner/search_path/grants review, atomic policy replacement, required Storage SELECT and real ordinary/admin/revoked API matrix. |
| D11 | OPEN | One authoritative release system; Workers Builds or approved alternative. GitHub Actions validation-only if chosen. | Actual commands/triggers/runtime recorded; no duplicate deploys or framework auto-migration. |
| D12 | PROPOSED | Staging first, database developer prepares DB before Worker; separate production gates and recoverable release. | Local/staging parity/security, backup/restore evidence, rehearsed Worker recovery, accepted monitoring thresholds/duration. |
| D13 | Evidence constraint | Two owner-supplied October 27 runs failed at assets-upload-session after successful auto-configured Cloudflare builds; 10013 cause unknown. | HTTP status/correlation identifier unavailable; retain limitations. Automatic configuration is observed historical behavior, not proof the adapter caused the error. |
| D14 | Deferred scope | Admin cleanup/reorder/partial-operation issues, runtime-env refactor, indexing and additional bucket limits. | If a defect blocks acceptance, stop and obtain separate scoped fix; no silent refactor or false DONE. |

## Approval gates

| Gate | When | Explicit action/target required | Coordination | State |
| --- | --- | --- | --- | --- |
| G0 | Before M0.1 | Instruction to begin baseline execution | User / technical lead | Granted: user's explicit M0.1 execution request; no later tasks authorized |
| G1 | M0.3 before implementation | Separate G1-R file/design scope, G1-I installation/tooling/network, G1-B local build/testing, G1-D isolated SQL/Auth/Storage tests; see approvals.md | User/deployment owner; database developer for DB | All subgates PENDING; documentation preparation only granted |
| G2 | Before staging | Separate DB inspection/migration/enrollment/test actions and Cloudflare Worker/KV/binding/deploy actions | User / DB developer / operator | Pending |
| G3 | If additional remote diagnostics needed | Isolated diagnostic Worker identities/resources/probes | User / operator | Pending |
| G4 | Before production inspection | Read-only schema/policies/grants/history inspection and operator | User / database developer | Pending |
| G5 | After inspection before SQL writes | Exact migrations/checksums, enrollment, backup/recovery, timing/verification | User / database developer | Pending |
| G6 | Before production Worker release | Candidate/account/Worker/routes/bindings/per-target build, recovery and observation criteria | User / release operator | Pending |
| G7 | Only if requested | Commit, push, merge or external support/public message | User | Not authorized |

Approvals persist for their stated action/target; record them once and do not re-request the same authorized scope. Dependencies do not expand permission. Prepare concrete reviewed local results before seeking final deployment approval. Credentials or project IDs are not proof of access authorization.

## M0.2 resume — 2026-11-01

User confirms deployment-owner management of GitHub/Workers, production main, npm run build, npx wrangler deploy, accepted Supabase Developer access to zbswlphvzytaqazxwvnc, and selected yayasanpenaalkarim.or.id (activation UNCONFIRMED). No Owner/Admin or recovery authority is inferred. Supabase backup and restore are **UNVERIFIED**. B-M0.2-01 is partially resolved; remaining mappings/roles/CI details and B-M0.2-02 recovery proof keep M0.2 BLOCKED. These confirmations supersede earlier unknown statements only for the supplied fields.

Documentation-only M0.3 preparation is possible under a separate instruction without clearing recovery gates. The existing M0.2 dependency still gates formal completion/downstream work unless explicitly revised. M0.3 remains NOT_STARTED; G1–G7 remain unchanged. Safest next task: gather remaining M0.2 owner-supplied target/recovery evidence.

## M0.3 documentation preparation — 2026-11-01

Prepared at 2026-11-01T15:30:52+00:00 (UTC), Codex, under user’s explicit “Prepare M0.3 — Scope and Approval (documentation only)” instruction. [Draft scope and approval checklist](evidence/approvals.md) separates local infrastructure, local database artifacts/tests, staging and production actions. G1-R/I/B/D refine G1 without granting permission; G2-D/G2-C distinguish staging DB from Cloudflare. G4 inspection, G5 exact production SQL and G6 Worker release remain separate. DNS changes need explicit authority/action coverage. G7 remains NOT AUTHORIZED.

M0.3 is **BLOCKED** after authorized preparation: B-M0.2-01/B-M0.2-02 mandatory dependencies remain unresolved and B-M0.3-01 tracks pending local implementation/design/tooling/test approvals and database-developer handoff. D02–D12 remain proposed/open; no versions or migration designs approved by this pass. M0.2 dependency unchanged; no exception granted and no M1–M7 work started. Earlier NOT_STARTED/stop-before-M0.3 statements describe prior assessments and are superseded for current scheduling only.

Safe independent work is read-only evidence review and docs/deployment planning/checklists. Future local implementation/builds may be technically independent of production recovery, but require applicable approval and predecessor completion or an explicit local-only dependency exception. Remote gates/recovery blockers remain mandatory. No source/package/infrastructure change, SQL, install/build, resource operation or publication occurred.

## Unresolved facts and owners

- M0.2 authorization: user's explicit “Execute task M0.2 — Resource and Recovery Ownership” request permits local read-only Git/repository inspection and docs/deployment updates only. Assessment at 2026-10-30T13:59:00+00:00: BLOCKED on acceptance criterion 1, B-M0.2-01 (owner/target/CI confirmations) and B-M0.2-02 (recoverable Worker and database/Auth/Storage evidence). [Targets](evidence/targets.md) and [recovery](evidence/recovery.md) distinguish local facts from proposed roles/unknown capabilities. M0.3/G1 and all remote gates remain pending.

- M0.1 execution record: baseline captured at 2026-10-30T13:47:41+00:00; completion assessed at 2026-10-30T13:54:18+00:00. Deployment-owner historical evidence supplied via user's resume message resolves B-M0.1-01; all M0.1 criteria satisfied, DONE. See [baseline](evidence/baseline.md) and [incident record](evidence/failure-10013.md). G1–G7 remain unchanged.
- Infrastructure owner: current CI commands/runtime/triggers, Cloudflare account/Worker/routes, active/recoverable versions, SESSION resources and token scope.
- Failure owner / technical lead: preserve unavailable HTTP status/API correlation identifier and unknown asset bytes/manifest, incident revision/runtime/configuration and exact auto-selected adapter version. Times, commands, Wrangler 4.153.0, stage, full message and 37 assets per incident are now recorded. Root cause remains unknown; these diagnostic gaps do not block completed baseline documentation.
- Database developer: actual schema/types/history/policies/grants, bucket settings, Auth configuration, admin enrollment and array/backfill/null handling.
- Technical lead: candidate runtime/dependency advisory/maintenance review. No registry/official release revalidation was done in this documentation pass.
- Release/backup owners: verified restore capability, compatibility of rollback Worker and accepted monitoring duration/thresholds.

Unknowns block dependent gates; they do not authorize production access. Append future decisions with date, actor, exact choice, evidence, alternatives and affected task IDs. Preserve prior entries.


## M1.1 local-only exception and runtime decision — 2026-11-01

At 2026-11-01T15:39:38+00:00 (UTC), Codex executed the user’s explicit M1.1 request on fix/cloudflare-deployment. This authorizes scoped engines/.nvmrc modifications, nvm runtime installation/selection and local runtime/engine validation despite M0.2/M0.3 being BLOCKED. It supersedes earlier “no exception”/documentation-only statements solely for M1.1. G1-R/I/B are satisfied only for these runtime actions; no app build, adapter/dependency install, database work, remote action or publication is covered.

D03 candidates Node 22.23.4/npm 10.9.9 revalidated against official release index/security notes/support schedule and selected without substitution. .nvmrc pins 22.23.4; engines node >=22.12.0 <23 and exact npm 10.9.9. Existing nvm installation checksum verified. All 231 declared locked Node/npm engine constraints passed; lockfile unchanged. Linuxbrew shadowed nvm initially; explicit NVM_BIN PATH prepend is required in this environment before verification. [Runtime evidence](evidence/runtime.md) contains commands, provenance/limitations and hashes. Future CI must agree; no CI edited.

M1.1 DONE. M0.2 recovery/ownership and M0.3 remaining implementation/design/handoff blockers unchanged; M1.2 onward require their own authorization. G1-D and G2–G7 unchanged. No production readiness or database-developer approval claimed. Stop after M1.1.

## M1.2 preflight security stop — 2026-11-01

Assessed at 2026-11-01T15:48:00+00:00 (UTC), Codex, under user’s explicit local-only M1.2 authorization on fix/cloudflare-deployment. M1.1 DONE verified. Current request covers metadata/network resolution and scoped migration only, with stop-on-blocker constraint; earlier no-later-task authorization statements remain historical for M1.2 and current for M1.3 onward. No new planning document created.

D02 proposed Astro 5.18.2/@astrojs/cloudflare 12.6.13/Wrangler 4.59.2/Supabase 2.118.0 metadata was revalidated. Declared peers/engines overlap, but Astro maintainer GHSA-26w7-cxv4-gfx2 lists critical AVIF-processing RCE affecting <7.2.8; 5.18.2 falls inside. GHSA-98hj-9722-w3j8 also lists conditional JSX/MDX XSS affecting <7.3.2. Application exploitability has not been demonstrated. B-M1.2-01 requires deployment-owner/technical-lead review of a revised compatible version set or reviewed applicability/mitigation resolution. Fixed major-version ranges cannot satisfy adapter 12.6.13’s Astro ^5.7.0 peer; no automatic major upgrade recommended or applied. See [exact primary sources and preflight results](tasks/M1.2.md).

D02 is withheld from implementation pending this security resolution; no changed design/version approved. M1.2 BLOCKED before manifest/lock/config changes or package installation. M1.3 remains NOT_STARTED; recovery/production/SQL/publication gates unchanged. No Cloudflare/Supabase operations. Stop after M1.2.

## M1.2 approved migration and verification — 2026-11-01

At 2026-11-01T16:18:36+00:00 (UTC), Codex completed the owner-approved LOCAL-ONLY Astro 7 M1.2 resume on fix/cloudflare-deployment. This supersedes the earlier D02 candidate-withheld/B-M1.2-01 stop for M1.2 only. Approved exact direct versions: Astro 7.4.4, Cloudflare adapter 14.4.3, Wrangler 4.156.0, unchanged Supabase 2.118.0. Node 22.23.4/npm 10.9.9 retained; lower engine bound tightened to the new verified Node requirement. No database/production/publication gate changed.

Actual outcomes and artifact hashes are in [existing M1.2 execution record](tasks/M1.2.md). Locked Sharp 0.35.5 addresses the newly checked Sharp advisory; targeted declared-range Vite refresh removed an initial moderate 6.4.4 finding and locks 8.3.5. No force, overrides or audit fix. Final lock/installed audits report zero vulnerabilities; full dependency tree valid; checking tools/scripts preserved. Necessary single closing div in pengurus.astro resolves strict compiler rejection; content/styles/scripts/business logic unchanged. Explicit whitespace preservation, image passthrough and unused Astro sessions disabled avoid changed image workflows or new KV/Images resources. Final local check passes (one existing unused-import hint) and local build succeeds with dummy loopback Supabase inputs after sandbox prerender restriction was separately approved for rerun.

M1.2 DONE; this is a local migration decision, not acceptance of old v12-specific packaging assumptions or production target settings. Existing M2 and later work must validate actual new-adapter output under their own authorizations. M0.2/M0.3 blockers remain; M1.3 not started. Stop here.

## M1.3 clean-install verification — 2026-11-01

Completed at 2026-11-01T16:31:36+00:00 (UTC), Codex, under user’s explicit M1.3 request on fix/cloudflare-deployment. Scoped npm ci/network and audit escalation approved. An isolated /tmp snapshot of the actual 22 current working inputs reproduced the approved lock with default npm ci, lifecycle behavior enabled, without editing manifests/config/source/lock. Required versions/peers and native Sharp verified; check passes with one existing unused-import hint, audit zero findings. Exact hashes and command outcomes in [execution evidence](evidence/dependency-validation.md).

Full tree reports one locked optional @img/sharp-wasm32@0.35.5 leaf as extraneous while its platform-specific parents are not applicable. Its lock/integrity/parent provenance and actual Linux native Sharp binding were verified; recorded as nonblocking without graph/flag changes or any security exception. Initial supplemental graph/fallback-filename assumptions were corrected against actual evidence; no required-peer or audit issue hidden.

M1.3 DONE; M1’s three local tasks verified under explicit authorizations. Earlier stop-before-M1.3 statements remain historical. M0.2/M0.3 remain BLOCKED, including M2.1’s M0.2 dependency; G1 permissions outside completed local tasks and all remote/SQL/publication gates unchanged. No new plan, task or roadmap; stop before M2.

</details>
