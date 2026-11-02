# M0.3 scope and approval checklist

- Prepared at: 2026-11-01T15:30:52+00:00 (UTC).
- Reviewer/documentation preparer: Codex; no deployment-owner or database-developer sign-off claimed.
- Authorization: user’s “Prepare M0.3 — Scope and Approval (documentation only)” request.
- State: **DRAFT — NOT APPROVED FOR IMPLEMENTATION**. [M0.3](../tasks/M0.3.md) is **BLOCKED** by M0.2 and missing scope/handoff approvals.
- Repository identity: fix/cloudflare-deployment at 82ca4b807f8dc337205c48ae3bb5c703f172edfe; no publication or remote verification.
- Actual permission: repository reads and Markdown changes under docs/deployment only. Everything proposed below needs its applicable gate; writing a checklist grants no permission.

## Proposed permitted scope

The remediation aims to produce a reproducible Astro Cloudflare Worker build, explicit environment/asset/session configuration and a separately reviewed Supabase compatibility/security plan. The following is the proposed allowlist for future approval, not permission to edit these files now.

| Workstream / proposed owner | Proposed local files and actions | Boundary / acceptance evidence |
| --- | --- | --- |
| Infrastructure M1 / deployment owner assigns operator | package.json (engines/scripts/dependencies), package-lock.json, .nvmrc, astro.config.mjs; select/pin runtime, replace Vercel adapter with reviewed Cloudflare adapter and Wrangler | Runtime/peer/engine/maintenance checks, reviewed lockfile and reproducible install/check; no unrelated dependency upgrades |
| Worker packaging M2 / infrastructure operator | wrangler.jsonc, .gitignore, empty .env.example, scripts/validate-env.mjs, public/.assetsignore, scripts/verify-worker-artifacts.mjs, package.json scripts | Explicit Worker entry/assets/SESSION, reviewed compatibility date, target-specific public build inputs, asset exclusion and SSR checks; local config does not provision resources |
| Integration M5 / infrastructure operator with DB developer | Conditional .github/workflows/validate.yml if selected, docs/deployment/RUNBOOK.md and task evidence; local generated state under ignored paths or /tmp | One release system, same-fixture UI/API parity; CI design does not authorize enabling remote execution or automatic deployment |
| Local database design/tests M3–M4 / named database developer | scripts/db/local-harness.mjs, package.json local DB scripts, supabase/tests/ fixtures and test scripts, and the three additive migration files already scoped by M3.2/M4.1/M4.2 | Separate repository and isolated local SQL/test approvals, accepted fixtures/tooling, preservation/replay/RLS tests; preparing a migration file does not authorize applying it |
| Remote database / database developer and authorized operator | Separately approved inspection, target-specific migration/enrollment and API tests for staging, then production | No remote action belongs to the local infrastructure scope. Schema, data, Auth, grants, policies, membership and Storage each require explicit coverage |
| Remote Cloudflare / deployment owner and authorized operator | Separately approved staging Worker/KV/bindings/routes/deploy; later production release and observation | Exact account/Worker/environment/resource identities, compatible recovery target, candidate identity and explicit authorization required |

Existing task specifications remain the exact future file scope. No blanket src/ edits are proposed. Source defects that block acceptance require a separately reviewed file/action scope. Serialize shared package.json/package-lock.json edits between infrastructure and database workstreams.

## Application invariants and exclusions

Preserve SSR for /, /pengurus and /galeri; preserve prerendered /admin. Preserve markup, styles, content, ordering, photo representation/handling and existing login, CRUD, settings and upload workflows. Future validation must compare the same fixtures and exercise routes, authentication and photo operations.

The intended authorization correction is server-enforced administrator-only mutations; ordinary authenticated write access is removed only through the approved database security workstream. Public reads and administrator business workflows must continue. Hiding controls is not authorization.

No redesign, business refactor, content cleanup/reordering, runtime-environment refactor, indexing or extra bucket restrictions are included. Do not execute destructive supabase/schema.sql, replace production data with fixtures, introduce service/secret keys into browser inputs, or assume Worker rollback restores database/Auth/Storage. Credentials stay in approved stores, never this evidence file.

## Design choices awaiting review

D02–D12 in [DECISIONS](../DECISIONS.md) remain proposed/open. Existing adapter/Wrangler and Node/npm version candidates are historical proposals, not current recommendations or approved versions; no registry/release/advisory revalidation was performed here.

Deployment owner/technical lead must review exact versions/lockfile, fixed compatibility date, adapter/session behavior, ASSETS/SESSION bindings, asset routing/exclusion, build-time public inputs and one authoritative release system. Database developer must review prestasi, program.foto_urls text[]/retained foto_url, array/backfill/null semantics, actual migration history and preservation; private.site_admins/private.is_site_admin(), function ownership/search_path/grants, admin enrollment/revocation, RLS and Storage policy atomicity. Rejected candidates need a dated alternative and affected-task review before implementation.

## Approval gates

All future gates below are **PENDING** (G7 remains NOT AUTHORIZED). These refine existing G1–G6; they do not replace or grant them. Each approval covers only its listed action/target and must name an actor, scope and evidence reference.

| Gate | Required approval and concrete review package | Actor / condition |
| --- | --- | --- |
| Documentation preparation (current request) | Markdown under docs/deployment, read-only evidence review and local documentation checks | GRANTED by user for this pass only; stop after preparation |
| G1-R repository modifications | Exact file allowlist above, selected design/version choices, owner assignment and preservation criteria; local database files approved separately | Deployment owner; database developer accepts DB design/files. M0.2/M0.3 dependencies remain in force |
| G1-I installation/tooling/network | Exact Node/npm/adapter/Wrangler and local DB tooling versions; package resolution/install commands, registry/network access, lockfile effects and generated directories | Deployment owner; DB developer for DB tooling. Repository edit permission alone does not authorize installation |
| G1-B local build/testing | Reviewed install/build/check/artifact commands, local preview/browser probes, generated paths, safe fixture inputs, no deploy hooks or production services | Deployment owner; DB developer approves any DB-backed test. A production-connected build/SSR request is not assumed local-only |
| G1-D isolated local SQL/Auth/Storage tests | Harness identity, disposable local database/services, fixture and test scripts/checksums, credentials isolation and cleanup scope | Database developer plus deployment owner; no production project or production credentials. Local SQL remains separately gated |
| G2-D staging database | Verified staging project distinct from production; separate read-only inspection and reviewed migration/enrollment/test actions, checksums, backup/recovery, stop conditions | DB developer and authorized DB operator; M5.3 prerequisites and explicit staging DB permission |
| G2-C staging Cloudflare | Exact staging account/Worker/KV/routes, per-target build/candidate, bindings, version/recovery plan and probes | Deployment owner/operator; DB prepared and verified first, distinct from production; no inferred DNS permission |
| G3 extra remote diagnosis | Exact isolated diagnostic resources/actions/logs/cost/cleanup scope for error 10013 | Separate deployment-owner approval; root cause remains unknown |
| G4 production read-only inspection | Exact project, inspection statements/probes and operator, drift/history/policy/grant scope; no writes | Deployment owner and DB developer; separate from production mutation |
| G5 production SQL/migrations/Auth/Storage writes | Post-inspection reviewed migration/test checksums, enrollment scope, preservation and drift assessment, verified backup/restore coverage/authority, maintenance window/write control and stop/recovery plan | Explicit DB developer/deployment-owner approval with authorized executor. No blanket SQL approval; changes to reviewed scripts require renewed scope review |
| G6 production Worker deployment | Approved staging evidence, resolved mandatory dependencies, final artifact/source/config identity, per-target build, production Worker/account/KV/routes, known-good recovery target, observation duration/thresholds and operator | Explicit deployment-owner release approval after concrete candidate review; database work verified before Worker release |
| DNS/domain changes (within applicable G2-C/G6 scope) | Exact zone/provider/records/routes, authority, activation status and rollback snapshot | Separate explicit coverage by deployment owner/DNS operator; selected domain alone grants nothing |
| G7 Git publication/external messages | Specific commit/push/merge or recipient/message request | NOT AUTHORIZED; excluded from this pass and future local edit approvals |

Confirmed production branch main and commands npm run build / npx wrangler deploy are configuration evidence, not authorization to run them. No deploy, SQL, build, installation or remote command was executed in this pass. No executable remote command package is fabricated for unknown targets.

## Unresolved dependencies carried from M0.2

| Blocker | Missing evidence / effect | Owner and next action |
| --- | --- | --- |
| B-M0.2-01 (partially resolved) | Remaining named DB/backup/recovery/release/DNS role acceptances; exact Worker/account/KV/environment/Supabase separation; CI provider/install/runtime/root/trigger details; domain activation/authority | Deployment owner assigns operators and supplies sanitized target/CI/DNS mapping; DB developer confirms database environment mapping. Prevents M0.2 and formal M0.3 completion |
| B-M0.2-02 | Active/known-good recoverable Worker version with settings/operator or concrete reviewed alternative; database/Auth backup coverage and restore proof; separate Storage object recovery; custodians/authority and recovery objectives | Deployment owner/recovery operator and DB developer/backup owner supply evidence. Prevents M0.2/M0.3 completion and production readiness |
| B-M0.3-01 | Proposed local scope, versions/design, installation/testing permissions and database handoff not accepted | Deployment owner and named DB developer review checklist below; documentation authorization does not satisfy implementation acceptance |
| Unresolved release constraints | Error 10013 has unknown cause; domain yayasanpenaalkarim.or.id activation UNCONFIRMED; live schema/history and safe target mapping not established | Operators provide separately authorized diagnostics/inspection evidence at the applicable gates; no working release claimed |

Supabase project reference zbswlphvzytaqazxwvnc is confirmed; environment assignment is UNKNOWN. Deployment owner accepted an invitation with **Developer** access. Do not infer Owner/Admin, schema ownership, restore authority or acceptance as the database developer. Backup capability **UNVERIFIED**; restore capability **UNVERIFIED**. See authoritative [targets](targets.md), [recovery](recovery.md) and [M0.2 acceptance](../tasks/M0.2.md).

M0.2 remains a mandatory predecessor. Current instruction authorizes preparation despite the block; it does not waive that dependency, complete M0.3 or start M1–M7. Remote gate approvals are future release requirements, not permissions that must all be exercised to complete M0.3; M0.3 requires explicit local authorization/handoff and separate tracking of those gates plus its prerequisite.

## Deployment-owner scope approval checklist

All unchecked; no approval inferred from ownership or this preparation request.

- [ ] Name infrastructure operator, release approver and recovery/DNS custodians; confirm exact targets and authority; resolve B-M0.2-01.
- [ ] Supply reviewed Worker and coordinated database/Auth/Storage recovery evidence; resolve B-M0.2-02.
- [ ] Approve G1-R exact infrastructure files/actions and application invariants; select or reject each applicable D02–D12 proposal with reasons/alternatives.
- [ ] Approve G1-I exact versions/install/network/tooling scope and lockfile handling separately.
- [ ] Approve G1-B exact local build/check/preview/browser scope and isolated inputs; confirm commands do not trigger deployment or production access.
- [ ] Name database developer and accept handoff boundaries/shared-file coordination; retain G1-D and all remote database permissions separately.
- [ ] Confirm one release system and staged gate order; retain G2-D, G2-C, G3, G4, G5, G6, DNS and G7 as independently tracked permissions.
- [ ] Record sign-off actor/date/action/file/target/constraints/evidence using the record below; do not treat checklist completion as a production release.

## Database-developer scope approval checklist

All unchecked; deployment owner’s Supabase Developer role is not this sign-off.

- [ ] Name developer and authorized DB/backup/restore operators; confirm project/environment mapping, applicable permissions and actual schema/migration history.
- [ ] Accept M3/M4 ownership and integration/release DB handoffs; review local DB file scope and tooling/fixtures; approve G1-D only for disposable isolated services.
- [ ] Approve additive prestasi/program.foto_urls compatibility, retention/backfill/null/array semantics, drift abort conditions and preservation/replay tests.
- [ ] Approve trusted admin membership/function ownership, enrollment/revocation custodian, grants/search_path, content/Storage RLS policy design and anonymous/ordinary/admin/revoked API matrix.
- [ ] Supply backup/retention/restore evidence for schema/data/Auth plus separate Storage object bytes/reference reconciliation and recovery objectives; verify restore authority without assuming Owner/Admin.
- [ ] Accept separately gated staging inspection/migration/tests, production inspection G4 and exact production SQL G5; no destructive bootstrap or production fixtures.
- [ ] Accept database-before-Worker ordering, app/schema compatibility and recovery coordination; record actor/date/exact evidence reference below.

## Approval record template

Copy one record per approved/declined action; do not insert credentials or personal admin identifiers. Preserve approved scope across turns; reopen only when target/design/script identity or constraints change.

| Field | Current record |
| --- | --- |
| Gate/action and affected tasks | Documentation preparation for M0.3 only |
| Decision | GRANTED for docs/deployment preparation; implementation approvals PENDING |
| Authority/actor and source | User’s current explicit preparation request; Codex records evidence |
| UTC timestamp / reviewer | 2026-11-01T15:30:52+00:00 / Codex |
| Files/target/commands/checksums | Current deployment documents only; local read/documentation validation; no remote target |
| Preconditions/exclusions | M0.2 remains BLOCKED; no source/packages/infrastructure/SQL/deploy/Git publication |
| Deployment-owner implementation sign-off | NOT SUPPLIED |
| Database-developer handoff/design sign-off | NOT SUPPLIED |

Future sign-off must name gate, approve/decline decision, actor/authority, UTC date, exact files/actions/target, command or migration/artifact identity, prerequisites, exclusions, evidence reference and reviewer. A pending row or checked box without attributed approval is not a grant.

## Safe independent local work while recovery evidence is collected

| Work | Current permission / dependency |
| --- | --- |
| Review existing deployment evidence, draft owner questions, scope/approval records and candidate acceptance criteria in docs/deployment | Safe under documentation scope; collect owner-supplied evidence without account changes |
| Draft fixture/parity/security matrices and recovery/target checklists in Markdown; read-only comparison of existing task proposals | Independent of working remote recovery; no SQL/test harness execution or source edits |
| Inventory local versions/configuration and draft a proposed patch/file plan | Read-only local review can inform a separately requested preparation pass; structural code exploration must use installed codebase-memory skill; no installs or remote probes implied |
| Implement runtime/adapter/config/env/artifact checks and run isolated builds | Technically separable from production recovery, but NOT currently authorized. Requires G1-R/I/B, local isolation and prerequisite completion or an explicit narrowly scoped dependency exception |
| Write migration/test files or run isolated local DB tests | NOT currently authorized. Requires DB design/handoff, G1-R/I/D and applicable prerequisites/explicit local-only exception; never use the unclassified remote Supabase project as the test target |

No dependency exception is granted or applied by this document. Safest immediate next work: collect B-M0.2-01/B-M0.2-02 evidence and obtain attributed responses to these checklists. If local implementation is later requested before recovery is resolved, record exact permitted task/files/commands and an explicit local-only dependency exception; retain all production blockers and do not mark M0.2/M0.3 DONE.

## Preparation validation

Validate git diff --check and nonempty approvals.md, relative document links, Markdown formatting, status counts, file scope and pre/post hashes. These verify documentation only. No manual/API recovery assertion, installation/build/test, SQL or deployment outcome is claimed. Actual outcomes and timestamp are recorded in [M0.3 completion record](../tasks/M0.3.md) and [CHANGELOG](../CHANGELOG.md).

## Subsequent M1.1-only authorization — 2026-11-01

Recorded at 2026-11-01T15:39:38+00:00 (UTC), Codex. User explicitly requested execution of M1.1 as a local-only exception while M0.2 remains BLOCKED. This subsequent instruction grants only engines/.nvmrc edits, runtime installation/selection and M1.1 validation on fix/cloudflare-deployment; it is the narrow local-only exception contemplated above. Installation escalation approved. Earlier pending/no-exception statements remain historical for this task and current for all other scopes.

G1-R/I/B covered only to the extent needed by M1.1; no dependency resolution, application build or later-task execution approved. Node 22.23.4/npm 10.9.9 verified; M1.1 DONE per [runtime evidence](runtime.md). M0.2/M0.3 remain BLOCKED; G1-D, other implementation scopes, DB handoff/design and all remote/publication gates remain unapproved. No deployment-owner blanket implementation sign-off or database-developer acceptance inferred. Stop after M1.1.
