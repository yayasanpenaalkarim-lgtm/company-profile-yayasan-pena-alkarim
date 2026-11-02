# M0.1 baseline evidence

- Captured at: **2026-10-30T13:47:41+00:00** (UTC; local shell clock).
- Task: [M0.1](../tasks/M0.1.md), authorized by the user's instruction “Execute task M0.1 — Baseline Evidence”.
- Collector/reviewer: Codex acting as technical lead; historical incident evidence subsequently supplied by the deployment owner through the user's resume message. No independent remote verification performed.
- Current task outcome: **DONE** at 2026-10-30T13:54:18+00:00; initial missing-evidence blocker resolved by owner-supplied historical incident documentation.
- Scope: local repository/configuration and supplied Markdown evidence only. No remote account inspection, SQL, install, build, check, deployment or Git publication.

## Confirmed baseline

| Field | Observed value |
| --- | --- |
| HEAD | `82ca4b807f8dc337205c48ae3bb5c703f172edfe` |
| Branch | `fix/cloudflare-deployment` |
| Tracked working-tree diff | Empty at capture |
| Staged diff | Empty at capture |
| Working tree overall | Not clean: 40 pre-existing untracked documentation files |
| Untracked composition | 37 roadmap files plus the three original supporting documents |
| Node | `v26.12.1` |
| npm | `11.20.0` |
| Current Astro configuration | Vercel adapter; `output: 'server'` |
| Locally installed Wrangler package | `node_modules/wrangler/package.json` absent; no CLI was downloaded or invoked |
| Wrangler used in failed deployment | UNKNOWN; current local state does not identify incident tooling |
| Original incident log | Not supplied; see [failure record](failure-10013.md) |

This snapshot precedes M0.1 documentation edits. UNKNOWN/“not supplied” incident fields in this original table describe the initial capture, not the current evidence state; see the [historical incident update](#owner-supplied-historical-incidents-and-completion) and [current incident record](failure-10013.md#current-evidence-and-provenance). The previously generated roadmap files are already untracked at task entry; they are not new implementation artifacts from M0.1. Git diff does not report edits to untracked documents, so before/after content hashes are also used for scope verification.

## Recorded validation commands

All commands ran locally with no stderr and the exit codes below.

| Command | Exit | Observed result |
| --- | --- | --- |
| `git rev-parse HEAD` | 0 | 82ca4b807f8dc337205c48ae3bb5c703f172edfe |
| `git branch --show-current` | 0 | fix/cloudflare-deployment |
| `git status --short --untracked-files=all` | 0 | 40 individually listed untracked paths; full output below. |
| `git diff --check` | 0 | No output |
| `git diff --stat` | 0 | No output |
| `git diff --cached --stat` | 0 | No output |
| `git log -5 --format=%h%x20%cI` | 0 | Two commits available; identities/dates below. |
| `sha256sum docs/log1.md docs/log2.md docs/log-schema-db-supabase/schema-db.md` | 0 | Three hashes recorded below. |
| `node --version` | 0 | v26.12.1 |
| `npm --version` | 0 | 11.20.0 |

The source-only configuration/manifest read and lockfile JSON parse succeeded. No npm scripts or package binaries were run. The runtime above is the observed shell, not the proposed M1 Node 22 runtime.

## Initial working-tree status

```text
?? docs/deployment/CHANGELOG.md
?? docs/deployment/DECISIONS.md
?? docs/deployment/README.md
?? docs/deployment/ROADMAP.md
?? docs/deployment/RUNBOOK.md
?? docs/deployment/milestones/M0.md
?? docs/deployment/milestones/M1.md
?? docs/deployment/milestones/M2.md
?? docs/deployment/milestones/M3.md
?? docs/deployment/milestones/M4.md
?? docs/deployment/milestones/M5.md
?? docs/deployment/milestones/M6.md
?? docs/deployment/milestones/M7.md
?? docs/deployment/tasks/M0.1.md
?? docs/deployment/tasks/M0.2.md
?? docs/deployment/tasks/M0.3.md
?? docs/deployment/tasks/M1.1.md
?? docs/deployment/tasks/M1.2.md
?? docs/deployment/tasks/M1.3.md
?? docs/deployment/tasks/M2.1.md
?? docs/deployment/tasks/M2.2.md
?? docs/deployment/tasks/M2.3.md
?? docs/deployment/tasks/M3.1.md
?? docs/deployment/tasks/M3.2.md
?? docs/deployment/tasks/M3.3.md
?? docs/deployment/tasks/M4.1.md
?? docs/deployment/tasks/M4.2.md
?? docs/deployment/tasks/M4.3.md
?? docs/deployment/tasks/M5.1.md
?? docs/deployment/tasks/M5.2.md
?? docs/deployment/tasks/M5.3.md
?? docs/deployment/tasks/M6.1.md
?? docs/deployment/tasks/M6.2.md
?? docs/deployment/tasks/M6.3.md
?? docs/deployment/tasks/M7.1.md
?? docs/deployment/tasks/M7.2.md
?? docs/deployment/tasks/M7.3.md
?? docs/log-schema-db-supabase/schema-db.md
?? docs/log1.md
?? docs/log2.md
```

## Git history context

`git log -5 --format=%h%x20%cI` returned two available commits:

```text
82ca4b8 2026-10-27T14:29:56+07:00
a83fd30 2026-10-17T13:16:13+07:00
```

Commit dates retain their recorded timezone. They do not identify when the failed deployment ran, its source revision or its deployed version. No remote fetch was performed.

## Dependency/configuration identity

Versions below are read from the repository lockfile, not verified installed packages or fresh registry metadata.

| Locked component | Version |
| --- | --- |
| astro | 5.18.2 |
| @astrojs/vercel | 8.2.11 |
| @supabase/supabase-js | 2.118.0 |
| @astrojs/check | 0.9.11 |
| typescript | 5.9.3 |

Supabase's locked engine field is Node >=22.0.0. The manifest still declares Vercel and ranged Astro/Supabase versions; the proposed adapter patch remains unapplied. Candidate version compatibility/advisories are future M1 work.

| Protected file | SHA-256 at task entry |
| --- | --- |
| package.json | 0d740e71ffde6f83ba60101cf47df88fcbd2b1c92eaf34c70a34b4c740d653ff |
| package-lock.json | e7ec60ce92fd02280bb84db04b9c95be160ac3b75d0f996695d74f3ab2b8d469 |
| astro.config.mjs | e3aa888e326cc74313069ea46c87e5219d8f993cbb492441296d66e2e6866793 |
| docs/log1.md | c40d5aa0074cdc526e658e72a4d5b03136e6a425c9c5c969b549dfdf3d50c05a |
| docs/log2.md | b5fd7d95fc057ef03352733ffad0be1354619638c37aacbc9e9b1802269de58c |
| docs/log-schema-db-supabase/schema-db.md | 7f7952db62308f92f0878a555ba093881632d848080482b30e365e33dfc2e873 |

A before/after digest snapshot covers all 64 existing Git-listed tracked and nonignored untracked regular files. Final scope verification must restrict changed files to M0.1 evidence and related deployment status records. No environment values, credential files or remote URLs were read for this baseline.

## Supporting-document provenance

- [log1](../../log1.md): prior audit/proposal at the same HEAD; explicitly says earlier deployment logs are unverified. It discusses 10013 and diagnostic branches, without reproducing this incident's raw log.
- [log2](../../log2.md): patch preview only; no installation/build/deploy. Proposed Wrangler 4.59.2 is not evidence of the failed deployment's CLI version.
- [Database report](../../log-schema-db-supabase/schema-db.md): dated 2026-10-27, repository-only schema/query analysis. It explicitly says live database state is unknown.

The configuration and locked versions above are freshly confirmed locally. Schema/security findings in those documents are supporting reports, not newly executed database checks or proof of production behavior.

## Evidence inventory and limitations

A local Python inventory of Git-listed tracked and nonignored untracked paths found no files with a .log suffix (exit 0). This bounded inventory excludes ignored caches/credential directories/external accounts and does not prove no logs exist elsewhere. Reviewed supplied Markdown contains diagnostic prose, not original incident output.

Evidence-owner roles are assigned to the user/project deployment owner as provider of the original sanitized log; Codex/technical lead reviews provenance once supplied. Specific infrastructure ownership/resource/recovery collection belongs to M0.2 and was not started.

## Initial outcome and next action (historical; superseded below)

Baseline diagnostics passed. **M0.1 remains BLOCKED**, because the required owner-supplied incident log is unavailable and the failure stage/status/message cannot be verified. The user explicitly requires BLOCKED when evidence is missing, even though the task permits documenting unknowns. The [failure record](failure-10013.md) lists exact missing fields and safe handoff requirements.

Resume only M0.1 when sanitized evidence is supplied. Do not proceed to M0.2, reproduce remotely, install tooling or change application/configuration to fill this evidence gap.

## Initial post-collection documentation verification

At 2026-10-30T13:50:54+00:00, local validation passed: before/after digests restricted existing-file changes to related M0.1 deployment records; all original supporting documents and application/configuration files matched entry hashes. Relative links/anchors, whitespace/fences and task statuses passed. HEAD stayed unchanged; tracked/staged diffs remained empty; git diff --check exited 0. The final validation repeats scope checks after appending this record and the changelog.

Expected final documentation-only delta for this task: two new evidence files and six updated records (README, ROADMAP, M0 milestone, M0.1 task, DECISIONS and CHANGELOG), all under docs/deployment/. There are 42 nonignored untracked documentation paths overall: the original 40 plus these two evidence files. Other 23 tasks remain NOT_STARTED. These checks verify local scope/integrity only; missing incident provenance still prevents DONE.

## Owner-supplied historical incidents and completion

Completion assessment: **2026-10-30T13:54:18+00:00**, Codex acting as technical lead. Authorization/provenance: user's “Resume M0.1 — Baseline Evidence and Incident Documentation” message relaying the deployment owner's historical October 27 evidence.

The [incident record](failure-10013.md#current-evidence-and-provenance) now captures both runs: build starts 09:45:40Z / 09:49:19Z, failures 09:47:07Z / 09:50:40Z, Wrangler 4.153.0, commands npm run build and npx wrangler deploy, initial Vercel adapter, successful automatic Cloudflare adapter rebuild, 37 assets each, failure at assets-upload-session and exact error "An unknown error has occurred. [code: 10013]". All times are on 2026-10-27 UTC.

HTTP status and API request-specific correlation identifier are explicitly UNAVAILABLE in the supplied logs. Asset bytes, detailed manifest, incident revision/runtime/configuration and exact auto-selected adapter version remain UNKNOWN with deployment owner as evidence provider and technical lead as reviewer. No raw log attachment or independent remote verification is claimed. Current repository HEAD is not attributed to either incident.

Task instruction 4 permits unavailable fields recorded with owners. With provenance, commands, times, message and stage documented, all mandatory M0.1 acceptance criteria are satisfied. **B-M0.1-01 is resolved and M0.1 is DONE.** Root cause remains unknown; adapter causation is not inferred. This closes evidence documentation only, not deployment remediation.

### Resume validation

The seven specified local diagnostics were repeated at 2026-10-30T13:54:18+00:00; every command exited 0, with no stderr:

| Check | Result |
| --- | --- |
| git rev-parse HEAD | 82ca4b807f8dc337205c48ae3bb5c703f172edfe |
| git branch --show-current | fix/cloudflare-deployment |
| git status --short --untracked-files=all | 42 documentation files untracked; same individual path set as the prior pass |
| git diff --check | Exit 0, no output |
| sha256sum of three original supporting documents | All hashes match the original table above |
| node --version | v26.12.1 |
| npm --version | 11.20.0 |

Additional git diff --stat and git diff --cached --stat both exited 0 with no output. A new before/after digest snapshot covers all 66 existing Git-listed regular files and limits this resume to eight existing docs/deployment Markdown records. No new file is needed. Final validation checks links/anchors, whitespace/fences, task-status consistency and original/config/source preservation.

No install, build, SQL, account access, deploy or Git publication. M0 remains partially complete (1/3); **stop after M0.1**. M0.2 and all later tasks remain NOT_STARTED and require a separate instruction.
