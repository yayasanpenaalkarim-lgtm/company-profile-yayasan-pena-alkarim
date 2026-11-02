# M0.2 resource ownership and deployment dependencies

- Captured at: **2026-10-30T13:59:00+00:00** (UTC).
- Task: [M0.2](../tasks/M0.2.md), explicitly authorized by user's “Execute task M0.2 — Resource and Recovery Ownership” instruction.
- Reviewer: Codex acting as technical lead; initial local review; subsequent user confirmations are attributed below. No account lookup performed.
- Status: **BLOCKED** — target separation, remaining role assignments and mandatory recovery evidence are missing; management ownership is partially confirmed.
- Prerequisite: [M0.1 DONE](../tasks/M0.1.md); [baseline](baseline.md) and [historical incidents](failure-10013.md#current-evidence-and-provenance) reviewed.
- Boundary: local repository reads and docs/deployment updates only. No env values/credentials, DNS/network lookups, GitHub API, Cloudflare/Supabase access or resource changes.

## Resume assessment — 2026-11-01

Source: user’s “Resume M0.2 — Resource and Recovery Ownership” message, supplying confirmed information. Reviewer: Codex. These are user-supplied confirmations; no independent remote inspection was performed. Earlier local observations retain their original timestamps.

- Deployment owner manages the GitHub repository and Cloudflare Workers; specific administrator/token permissions and recovery authority are not inferred.
- Cloudflare production branch: `main`. Build: `npm run build`. Deploy: `npx wrangler deploy`. These are confirmed settings, not commands executed in this pass.
- Deployment owner accepted a Supabase invitation and holds **Developer** access to project reference `zbswlphvzytaqazxwvnc`. This does not establish Owner/Admin permissions, backup/restore authority, database-developer handoff acceptance or environment separation.
- Supabase backup capability: **UNVERIFIED**. Supabase restore capability: **UNVERIFIED**. No plan, retention, backup artifact, restore permission or successful restore is assumed.
- Selected domain: `yayasanpenaalkarim.or.id`; activation is **UNCONFIRMED**. Registrar/DNS authority, records and Worker route mapping remain unknown.

## Evidence classification

**Confirmed local** means read directly from Git/repository at the captured revision. **Owner-supplied historical** means the October 27 structured account recorded in M0.1, without independent remote verification. **User-confirmed current** means supplied in the 2026-11-01 resume message, without remote verification. **Proposed responsibility** is a role needing a named assignee and acceptance, not an ownership claim. **UNKNOWN** means evidence was not supplied.

## Known components and resource ownership matrix

| Resource | Confirmed identity / integration evidence | Confirmed owner / operator | Proposed responsible role; confirmation needed |
| --- | --- | --- | --- |
| GitHub repository | Local origin resolves to [yayasanpenaalkarim-lgtm/company-profile-yayasan-pena-alkarim](https://github.com/yayasanpenaalkarim-lgtm/company-profile-yayasan-pena-alkarim); remote string sanitized before recording, no network request | Deployment owner manages repository (user-confirmed); specific admin/recovery permissions UNKNOWN | Deployment owner confirms repository administrator, release permissions and recovery custodian |
| Source/deployment branch | Active local fix/cloudflare-deployment at 82ca4b807f8dc337205c48ae3bb5c703f172edfe; local main and cached origin/main point to same commit | Deployment owner; production branch main confirmed | Deployment owner confirms staging branch and remaining protection/trigger rules (production main confirmed); active branch is not proof of deployed source |
| Cloudflare Workers project/account | Historical Cloudflare Workers deployment attempted; exact account/Worker identity UNKNOWN | Deployment owner manages Cloudflare Workers; specific account role UNKNOWN | Deployment owner supplies non-secret account/Worker aliases and confirms operator/access scope |
| Build/deploy runner | Historical npm run build and npx wrangler deploy; Wrangler 4.153.0, successful automatic Cloudflare adapter rebuild, 37 assets | Deployment owner confirms npm run build and npx wrangler deploy; runner administrator/provider UNKNOWN | Deployment owner confirms actual provider (including whether Workers Builds), install command, root directory, runtime and trigger details (build/deploy commands confirmed) |
| Worker assets/routes/bindings | Historical assets-upload-session failed twice; current tracked config still Vercel/server output; no tracked Wrangler/config/CI paths in bounded inventory | Route/binding operator UNKNOWN | Infrastructure operator confirms active routes, domains, deployed version and bindings; no successful upload/release inferred |
| SESSION KV | Distinct staging/production KV is proposed by roadmap, not a confirmed provisioned resource | Namespace custodian UNKNOWN | Infrastructure owner confirms actual namespace aliases, environment bindings and lifecycle/recovery owner |
| Supabase database | Source integrates Supabase through PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY; project reference zbswlphvzytaqazxwvnc confirmed; account/region and environment mapping UNKNOWN | Deployment owner accepted invitation; Developer role confirmed. Project Owner/Admin and named database developer UNKNOWN | Deployment owner identifies database developer; developer confirms project aliases, migration history, schema/policies/grants and backup/restore ownership |
| Supabase Auth | Browser client uses normal session persistence; SSR client disables persistence/auto-refresh in src/lib/supabase.ts; M0.1 supporting evidence describes browser login | Auth administrator and initial admin identities UNKNOWN | Database developer confirms provider/signup/redirect configuration and trusted admin enrollment process; do not disclose secrets/user identifiers here |
| Supabase Storage | Supporting schema report describes foto bucket integration; SQL definition is not proof of actual bucket public state, content or policies | Storage/backup operator UNKNOWN | Database developer confirms bucket configuration, policy ownership and independent object recovery coverage |
| Domain registrar | Selected domain yayasanpenaalkarim.or.id; activation UNCONFIRMED; registrar UNKNOWN | Registrant/registrar operator UNKNOWN | Deployment owner identifies registrar, domain alias and recovery authority; do not infer from repository/foundation name |
| Authoritative DNS/custom domain | No confirmed zones/nameservers/records/custom Worker routes | DNS operator UNKNOWN | Deployment owner supplies sanitized record/route evidence and authoritative provider; Workers usage does not establish Cloudflare DNS ownership |

The remote path confirms local repository configuration only; it does not prove GitHub reachability, current remote state, permissions, branch deployment settings or release ownership. No account identifiers, domain names or Supabase project aliases were guessed.

## Staging / production target separation

| Dimension | Staging | Production | Confirmation required from |
| --- | --- | --- | --- |
| Source branch / trigger | UNKNOWN | main confirmed; trigger/protection details UNKNOWN | Deployment owner |
| Cloudflare account / Worker alias | UNKNOWN | UNKNOWN | Deployment owner / infrastructure operator |
| Routes / domain / DNS mapping | UNKNOWN | Selected yayasanpenaalkarim.or.id; activation and target mapping UNCONFIRMED | Deployment owner / DNS operator |
| SESSION namespace / binding | UNKNOWN | UNKNOWN | Infrastructure operator |
| Supabase project alias / Auth / Storage mapping | UNKNOWN | UNKNOWN | Database developer |
| Build-time public inputs / secret-store owner | UNKNOWN | UNKNOWN | Deployment owner + database developer |
| Active / recoverable Worker version | UNKNOWN | UNKNOWN | Infrastructure/recovery operator |
| Database backup and object recovery reference | UNKNOWN | UNKNOWN | Database developer / backup owner |

Project zbswlphvzytaqazxwvnc is identified, but its staging/production assignment and a distinct counterpart are UNKNOWN. Supabase backup and restore are **UNVERIFIED**.

Target separation is **not verified**. Do not reuse a local Git branch, historical build or proposed Wrangler environment as proof of resource isolation.

## Named-role handoff matrix

| Role required by task instruction 3 | Named assignee / acceptance evidence | Evidence provider / next action |
| --- | --- | --- |
| Database developer | UNKNOWN / not supplied | Deployment owner names developer; developer confirms schema/Auth/Storage and recovery responsibilities |
| Infrastructure operator | Deployment owner manages Workers; detailed access/recovery scope not supplied | Deployment owner names operator and confirms account/Worker/binding/route scope |
| Release approver | UNKNOWN / not supplied | Deployment owner names approver and approval scope; task execution permission is not release approval |
| Backup owner | UNKNOWN / not supplied | Deployment owner/database developer name custodian and provide backup/restore evidence |
| Recovery operator | UNKNOWN / not supplied | Deployment owner names operator and confirms ability to restore Worker/settings and coordinate database recovery |
| Registrar/DNS operator | UNKNOWN / not supplied | Deployment owner confirms provider, operator and record/route authority |

User is confirmed as the provider of the task authorization and relayed incident evidence. The resume confirms the deployment owner’s management roles and Supabase Developer access; no personal identity, Owner/Admin access or recovery authority is inferred. Codex is the documentation collector/reviewer, not a claimed account operator.

## Confirmed configuration and current limitations

- package.json build script is astro build; astro.config.mjs still selects @astrojs/vercel with output: server. No package/config changes were made.
- Historical runs: npm run build, npx wrangler deploy, Wrangler 4.153.0, successful automatic @astrojs/cloudflare configuration/rebuild and 37 assets before assets-upload-session error 10013. The resume separately confirms npm run build and npx wrangler deploy as current commands; versions and outcomes above remain historical.
- Current install command, CI provider, Node/npm in the historical runner, build root, trigger/protection details and protected secret-store ownership remain UNKNOWN; production branch main is confirmed. Local baseline Node/npm is not the Cloudflare build environment.
- The runtime, pinned Cloudflare adapter/Wrangler, explicit ASSETS/SESSION config and separate environment definitions in the roadmap are proposals, not provisioned infrastructure.
- Source client reads build-time public Supabase variable names; changing runtime settings alone cannot be assumed to change compiled browser inputs. No actual values were inspected.
- Supabase schema/policies/Auth/users/Storage and backups are not verified live. Destructive supabase/schema.sql must not be treated as a recovery migration.
- Both historical failures remain unresolved. Error: "An unknown error has occurred. [code: 10013]". HTTP response status and API request-specific identifier are unavailable; root cause UNKNOWN. No adapter causation, successful deployment or working production service inferred.

## Dependency sequence for future recovery/release review

Repository/branch identity and release ownership → confirmed build environment/public-input mapping → distinct Worker/assets/SESSION/routes and DNS mapping → database-developer-confirmed schema/Auth/Storage compatibility and backup recovery → verified staging/recovery rehearsal → separately approved production release.

This is documentation of dependencies, not execution of M0.3 or later work. See [recovery assessment](recovery.md) for evidence requirements and production blockers.

## Exact missing evidence blocking M0.2

- **B-M0.2-01 — remaining owner/target confirmation (partially resolved):** GitHub/Workers management, production main, build/deploy commands and Supabase Developer access are confirmed. Remaining named role assignments/acceptances and a sanitized staging/production mapping for Worker/account, branch/triggers, routes/DNS, KV and Supabase projects; remaining CI provider/install/runtime/root/trigger configuration. Provider: deployment owner, infrastructure operator and database developer. Required by acceptance criterion 1 (“Owners confirm target separation and recovery evidence”).
- **B-M0.2-02 — recovery proof:** Active and known-good recoverable Worker versions with compatible settings/operator, or an owner-reviewed concrete alternative; database/Storage backup and restore references with named custodians. Provider: deployment owner/recovery operator and database developer/backup owner. Same acceptance criterion; unknown recovery targets explicitly block production.

These items require owner-supplied confirmation, not unauthorized account queries. Until confirmed, M0.2 remains BLOCKED. Documentation-only M0.3 preparation could proceed under a separate instruction; formal completion remains dependent on M0.2. No M0.3 work is authorized or executed here.

## Local evidence collection and provenance

Collection at 2026-10-30T13:59:00+00:00: Git diagnostics exited 0 (HEAD, branch, full status, diff stats/check, local/cached refs and five-entry history query). Sanitized git remote get-url origin exited 0; only safe GitHub owner/repository identity recorded. No fetch/remote verification. Inventory of tracked configuration candidates found no Wrangler, CI provider, .nvmrc or infrastructure/DNS definition among the selected path/name patterns; no claim about untracked/ignored/external dashboard configuration.

Read only: package.json, astro.config.mjs, .gitignore, root README, src/lib/supabase.ts, src/env.d.ts and destructive opening of supabase/schema.sql. Original M0.1 artifacts remain unchanged. Before/after file hashes protect all 66 existing Git-listed regular files; task-specific documentation commands and final scope results are recorded in [M0.2](../tasks/M0.2.md).
