# M1.3 reproducible installation and compatibility evidence

- Completion assessed at: 2026-11-01T16:31:36+00:00 (UTC).
- Reviewer: Codex; authorization: user’s “Execute M1.3 according to docs/deployment/tasks/M1.3.md” instruction, local dependency/static validation only. No database-developer or release approval inferred.
- Repository: fix/cloudflare-deployment, HEAD 82ca4b807f8dc337205c48ae3bb5c703f172edfe; branch and HEAD unchanged.
- Prerequisites: M1.1 and M1.2 explicitly verified DONE in their existing completion records. This is authorized local M1.3 validation; M0.2/M0.3 blockers and remote gates remain in force.
- Result: **DONE**. No source/config/manifest/lockfile modification required. This file is execution evidence required by the existing task, not a new plan/task/roadmap.

## Isolated clean install and provenance

Created /tmp/m13-clean-validation-bnitdhop from **22 current working files**: package.json, package-lock.json, astro.config.mjs, tsconfig.json, .nvmrc, src/ and public/. These include the uncommitted approved M1.1/M1.2 changes. Every copied input matched its repository SHA-256 before installation and remained identical after all validation. The directory initially had no node_modules, .astro, .env/.dev.vars/credentials or Git metadata; it is an isolated snapshot, not a separate Git branch/checkout. The original working tree and existing untracked documentation were preserved.

Under Node **22.23.4** and npm **10.9.9** selected from existing nvm first on PATH, ran **npm ci** with default dependency lifecycle behavior (no --ignore-scripts). Explicit installation/network escalation approved. Exit 0: **323 packages added, 324 audited**, zero vulnerabilities. No lock generation/update, install overrides, audit fix, force flags or peer bypass. The installed native Sharp module loaded successfully.

The prior M1.2 installation used --ignore-scripts; this task independently validates clean default npm ci. Snapshot identity follows the current working bytes, not Git HEAD alone, which still precedes the local migration. Reproduction is verified for Linux x64 and the selected Node/npm/lockfile; other platforms and future advisory state require their own validation.

## Exact versions and compatibility

| Component | Lockfile and fresh installed version |
| --- | --- |
| astro | 7.4.4 |
| @astrojs/cloudflare | 14.4.3 |
| @supabase/supabase-js | 2.118.0 |
| wrangler | 4.156.0 |
| @astrojs/check | 0.9.11 |
| typescript | 5.9.3 |
| sharp | 0.35.5 |
| vite | 8.3.5 |

All direct pins match the root lock entry and actual fresh package manifests. Root dependencies, devDependencies and engines agree exactly. Cloudflare’s declared Astro/Wrangler peers are satisfied; full npm ls --all exits 0 with no invalid peers or missing required packages. Nested Vite-plugin Wrangler **4.154.0** and published beta Miniflare transitives **5.20261023.1-beta / 5.20261023.3-beta** remain as reviewed in M1.2; no deduplication/upgrade was forced during this task.

Inspected **244 Node/npm engine constraints** and **440 non-root registry URL/integrity records**. All applicable Linux x64 engine constraints pass. The existing optional Windows 32-bit @img/sharp-win32-ia32 binary requires Node ^20.9.0; it is not applicable to this installation and Windows 32-bit support is not claimed. npm ci performed its normal integrity/platform checks; no binary/platform metadata was edited.

## Commands and actual outcomes

Dependency/CLI/check/audit commands below ran from /tmp/m13-clean-validation-bnitdhop; Git diagnostics ran in the original repository. Logs and supplemental read-only validation scripts are under /tmp; durable outcomes are recorded here.

| Actual command/check | Exit / result |
| --- | --- |
| git branch --show-current; prerequisite-record review | 0; fix/cloudflare-deployment, M1.1/M1.2 DONE |
| node --version; npm --version | 0; v22.23.4 / 10.9.9 |
| Original working tree npm ls of selected runtime/checking packages | 0; current installed versions agree with approved lock |
| npm ci | 0; fresh default installation, 323 packages added; no manifest/lock rewrite |
| npm ls astro @astrojs/cloudflare @supabase/supabase-js wrangler | 0; Astro 7.4.4, Cloudflare 14.4.3, Supabase 2.118.0, direct Wrangler 4.156.0; nested Wrangler 4.154.0 explicitly visible |
| npm ls @astrojs/vercel | **1 / empty**; expected absence, not a failing required dependency |
| npm ls --all --json | 0; no invalid/missing required dependencies; one locked optional WASM artifact annotated extraneous as assessed below |
| ./node_modules/.bin/wrangler --version | 0; 4.156.0; WRANGLER_LOG_PATH=/tmp/m13-wrangler-version.log and WRANGLER_SEND_METRICS=false |
| npm run check | 0; **16 files, 0 errors, 0 warnings, 1 hint**: unused Gallery import at src/pages/index.astro:3; left unchanged |
| npm audit --json | 0; **0 info / 0 low / 0 moderate / 0 high / 0 critical**, 0 total vulnerabilities; advisory metadata represents 440 dependency records including optional/platform packages |
| Supplemental compatibility/graph assertions | Final exit 0; exact versions/root metadata, platform engines, integrity presence, required peers and Sharp native module validated. Initial overstrict graph assertion and outdated native filename assumption described below; neither changed install behavior |
| Snapshot before/after digests | PASS; all 22 inputs in isolated copy and original repository unchanged by installation/checking |
| git diff --check; git status --short --untracked-files=all | 0; code diff unchanged from entry; only task-scoped evidence/status documentation changes |

Astro check used PUBLIC_SUPABASE_URL=http://127.0.0.1:9 and PUBLIC_SUPABASE_ANON_KEY=m13-local-validation-only, plus ASTRO_TELEMETRY_DISABLED=1 and WRANGLER_SEND_METRICS=false. No production credentials were copied or loaded; no Supabase API/SQL or remote Cloudflare operation was requested. Build, preview/browser/API tests and M2 were not executed by M1.3. The earlier successful build remains M1.2 evidence, not a new test claimed here.

## Dependency-tree annotation assessment

Full npm tree output contains one unique annotation (repeated at root and package node): **extraneous: @img/sharp-wasm32@0.35.5**. npm ls --all itself exits 0. A supplemental assertion treating every annotation as a blocker initially exited 1; the artifact was investigated without deleting packages or changing the lock.

The exact package is already in package-lock.json, optional=true, with registry URL and SHA-512 integrity. Its declared locked parents are @img/sharp-freebsd-wasm32 (os=freebsd) and @img/sharp-webcontainers-wasm32 (cpu=wasm32), both referencing exact 0.35.5. The annotation is consistent with a locked leaf installed while its platform-specific parents are skipped; that explanation is an inference from the graph, not a claim about undocumented npm internals. No unpinned package or required peer defect was found. Installed Sharp actually loads **node_modules/@img/sharp-linux-x64/lib/sharp-linux-x64-0.35.5.node** and reports Sharp 0.35.5 / librsvg 2.63.2. It is not using the WASM fallback in this environment.

A supplemental native-module assertion also initially exited 1 because it expected the older filename sharp-linux-x64.node; it was corrected against the actual versioned native-module path. Final assertions distinguish this exact reviewed optional annotation from any other tree problem, still reject invalid/missing required dependencies, and require the Linux native binding. No source/dependency changes or command flags were used to hide either diagnostic failure.

Disposition: **documented nonblocking locked optional-package annotation**, not a security exception or unresolved required-dependency blocker. The clean lock-based install, required graph, native module, static check and audit all pass. Future npm/platform changes may alter optional artifact selection and should retain this limitation in verification reports.

## Preserved scripts, configuration and required application dependencies

The four original Git HEAD scripts remain byte-for-byte identical in the current manifest: dev=astro dev, build=astro build, preview=astro preview, check=astro check. Config bytes match completed M1.2: Cloudflare adapter, output: server, compressHTML: true, session: false, imageService: passthrough. .nvmrc/engines remain approved Node 22.23.4, Node >=22.23.4 <23 and exact npm 10.9.9.

Supabase 2.118.0 and the application’s existing integration/query/auth/upload files are unchanged. @astrojs/check 0.9.11 and TypeScript 5.9.3 remain installed and operational. @astrojs/vercel is absent from manifest, lock and installation; optional @vercel/functions/oidc unstorage driver packages documented in M1.2 are not the removed adapter. The M1.2 one-tag source correction is preserved without new edits.

No business logic, UI, page rendering declarations, credentials, schema/data/RLS, infrastructure configuration or existing implementation scripts changed in M1.3. This verifies preservation and static compatibility; it does not establish browser parity or real Supabase/Workers integration, which remain later task requirements.

## Verified input identity (SHA-256)

| File | Before and after SHA-256 |
| --- | --- |
| package.json | 351dce9200aded3c821ac4929d22a3f47bbfb1839b8de0614c6876cd800adab4 |
| package-lock.json | d8830987057aae0b3d95cafe5452d67eaa6f4fc361a107b1b6a266f96212eb17 |
| astro.config.mjs | 3466c41b3655fd004e0fc67493b4c9a9d16f4ee6b4829f2648f93f99bd7831d9 |
| tsconfig.json | b5b0a5b04a14cddd7713c5e1c82e86c79c17c2f86b170e26e9b170b3d5e01cd9 |
| .nvmrc | 0c4bf84f9bedd485b2c4eac05f59e35addc86ce7dbf0d90435528e04384c6314 |

## Acceptance and remaining blockers

All four M1.3 acceptance criteria satisfied: fresh reproducible install, unchanged manifest/lock, valid required graph and reviewed optional annotation, no blocking check/security finding, actual outcomes/identity, explicit user authorization/reviewer/UTC timestamp and scoped documentation-only repository delta. M1.3 DONE; M1’s three local tasks now verified. Existing M0.2/M0.3 blockers are not cleared by this local milestone result.

Remaining: M0.2 B-M0.2-01/B-M0.2-02 ownership/target separation/recovery evidence; Supabase backup/restore UNVERIFIED and domain activation UNCONFIRMED; M0.3 approvals outside authorized local work; historical Cloudflare 10013 root cause UNKNOWN. M2.1 explicitly depends on M0.2 as well as M1.3. Stop before M2; no automatic workstream/deployment authorization. No commit/push/merge/deploy performed.

If future verification fails, reopen the affected M1.2/M1.3 records and preserve current changes before any separately authorized dependency correction. No rollback/reset/cleanup of original working files was needed or performed. Isolated dependencies/.astro/logs remain under /tmp; existing repository documentation and local implementation changes remain intact.
