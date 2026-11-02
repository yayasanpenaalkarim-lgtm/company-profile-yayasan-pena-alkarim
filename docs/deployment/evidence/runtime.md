# M1.1 local runtime verification

- Assessed/completed at: 2026-11-01T15:39:38+00:00 (UTC); reviewer: Codex.
- Authorization: user’s “Execute M1.1 according to docs/deployment/tasks/M1.1.md” request, explicitly permitting a **local-only M1.1 exception while M0.2 remains BLOCKED**. This waives the M0.3 prerequisite for this task only, not any acceptance check, recovery requirement or later task gate.
- Repository: fix/cloudflare-deployment, HEAD 82ca4b807f8dc337205c48ae3bb5c703f172edfe; branch checked before changes and at final validation. No commit/push/merge/deploy.
- Result: **DONE**. Selected Node **22.23.4**, bundled npm **10.9.9**; .nvmrc contains 22.23.4. package.json engines: node >=22.12.0 <23, npm 10.9.9. Exact npm engines records the verified package manager; engines are advisory without enforcement settings.

## Provenance, maintenance and advisory review

Reviewed official sources during this execution (2026-11-01):

| Official source | Finding / selection consequence |
| --- | --- |
| [Node release index](https://nodejs.org/dist/index.json) | Latest listed 22.x entry v22.23.4, security=true, bundled npm 10.9.9 and linux-x64 availability. Retain the original task candidate, now revalidated |
| [Node 22.23.4 release notes](https://nodejs.org/en/blog/release/v22.23.4) | Published security release dated October 21, 2026; includes fixes across TLS, DNS, Brotli and HTTP |
| [October security announcement](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) and [advisory index](https://nodejs.org/en/blog/vulnerability) | Reviewed current announcement/index; selected patch addresses the announced 22.x security fixes. This is a point-in-time runtime review, not a claim that every application/dependency vulnerability is absent |
| [Node Release Working Group schedule](https://github.com/nodejs/Release#release-schedule) | Node 22 is Maintenance LTS, scheduled end-of-life April 30, 2027. Future maintenance/review required; Node 24/26 migration is outside M1.1 |

The distribution index dates the artifact October 20, while release notes date the announcement October 21; both were observed, neither date is invented. No replacement candidate was necessary. Adapter/Wrangler selection remains M1.2 and is not approved by this runtime decision.

## Installation and shell selection

Entry shell: Node v26.12.1 / npm 11.20.0 at /home/linuxbrew/.linuxbrew/bin. Existing nvm contained Node v24.15.0 and v24.22.1, but no 22.x runtime.

With approved filesystem/network escalation, sourced existing /home/latif/.nvm/nvm.sh and ran nvm install 22.23.4 then nvm use 22.23.4. Download: https://nodejs.org/dist/v22.23.4/node-v22.23.4-linux-x64.tar.xz. nvm reported “Checksums matched!” using sha256sum; archive SHA-256:

```text
1805bcd35e6815559bd2eb97db438d3fdb0eb3a5e6a977b7c1badca76337e9ce
```

Installed runtime: /home/latif/.nvm/versions/node/v22.23.4/bin/node; npm is bundled under that installation. No repository npm install/ci, npm upgrade or dependency resolution was performed. No global shell/profile/default-alias change was requested or performed.

Initial nvm install/use command exited 0, but nvm’s message showed npm 11.20.0 and actual node --version still returned v26.12.1: Linuxbrew preceded NVM_BIN on PATH. Direct installed-binary probes returned v22.23.4 and npm 10.9.9. Validation then explicitly prepended the selected nvm bin directory and cleared shell command hashing. Do not treat the nvm banner as verification.

For a new terminal using the same existing tooling, from repository root:

```sh
source /home/latif/.nvm/nvm.sh
nvm use
export PATH="$NVM_BIN:$PATH"
hash -r
node --version
npm --version
```

The explicit PATH selection is local to that shell; .nvmrc does not automatically switch every shell. Later CI must select this exact Node/npm pairing separately. No CI settings were changed.

## Local validation and actual results

After selecting the installed runtime first on PATH:

| Actual command/check | Exit / observed result |
| --- | --- |
| node --version | 0; v22.23.4 |
| npm --version | 0; 10.9.9 |
| cat .nvmrc | 0; 22.23.4 |
| node -e "console.log(require('./package.json').engines)" | 0; node >=22.12.0 <23, npm 10.9.9 |
| git diff --check | 0 |
| Additional semver/package assertion script in /tmp | Initial sandbox attempt exited 1 (spawnSync git EPERM); approved outside-sandbox rerun exited 0. No remote calls or application execution |
| Locked engine assertions | All **231** declared Node/npm engine constraints across package-lock.json passed using npm’s bundled semver. Installed npm’s Node range ^18.17.0 or >=20.5.0 also passed |
| Range boundary assertions | Node 20.20.0, 22.11.0, 23.0.0 and entry runtime 26.12.1 rejected by proposed Node engines; selected exact version accepted |
| Manifest preservation | Parsed package.json with engines removed equals original Git HEAD manifest; scripts, dependencies, devDependencies and all other fields unchanged |
| Scope/integrity checks | Before/after file digests and exact file allowlist checked; lockfile, src/, Supabase files, original evidence and M0.2/M0.3 tasks unchanged |

Locked Astro 5.18.2 accepts Node 18.20.8 or ^20.3.0 or >=22.0.0 and npm >=9.6.5; locked Supabase 2.118.0 packages require Node >=22.0.0; TypeScript 5.9.3 requires Node >=14.17. These are read-only lockfile findings, now tested against the selected runtime. Other declared engine constraints also passed; this is engine compatibility, not an Astro build or Cloudflare runtime test. No application check/build, SQL, migrations, Supabase access or release was needed for M1.1.

## Artifact identity

| File | SHA-256 |
| --- | --- |
| package.json | e3e518e681f1eaa0975227d9208e7dd86471afa995e7b05ca0f68604266b9195 |
| package-lock.json | e7ec60ce92fd02280bb84db04b9c95be160ac3b75d0f996695d74f3ab2b8d469 |
| .nvmrc | 0c4bf84f9bedd485b2c4eac05f59e35addc86ce7dbf0d90435528e04384c6314 |

## Acceptance and remaining gates

All four M1.1 acceptance criteria satisfied: official provenance/runtime reviewed and recorded, actual commands/manual assertions with identity, explicit authorization/reviewer/UTC date, scoped runtime-only source edits and preservation evidence. The explicit exception permits this task to finish while M0.2/M0.3 remain blocked.

B-M0.2-01 (remaining ownership/target separation/CI mapping) and B-M0.2-02 (Worker/database/Auth/Storage recovery evidence) remain unresolved. Supabase backup and restore remain UNVERIFIED; Developer access grants no inferred Owner/Admin or restore authority. Domain activation and error 10013 remain unresolved. M0.3 implementation/design/database handoff approvals outside M1.1 remain pending. No database developer sign-off is claimed or needed for this runtime-only action.

Stop after M1.1. M1.2/M1.3 and later tasks remain NOT_STARTED and need their own authorization. Future lockfile regeneration, adapter install/build, remote staging, production or SQL require applicable approvals. Preserve this record when appending future revalidation. Rollback, if later requested, removes only task-added engines/.nvmrc after checking newer edits and selects the prior recorded runtime; do not uninstall unrelated runtimes or reset the repository.
