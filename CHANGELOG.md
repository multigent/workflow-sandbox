## [v0.1.4] - 2026-08-16 (beta.1)

### Changed
- `titleCase` is now acronym-aware (keeps known acronyms intact) — PR #27 (Closes #26).
- README install instructions clarified: no lockfile → do not use `npm ci`; run `npm test` / `node --test` — PR #24.

### Docs
- Added `e2e/issue-30.md` for workflow E2E verification — PR #31 (Closes #30).

### Notes
- First weekly_beta cut for v0.1.4 from `main` @ `a7e42ffee13e6e06913ab0daf6309dad2d502475`.
- Based on current main tip (not a fast-forward of hotfix/v0.1.3 tip); main and v0.1.3 were diverged at cut time.
- package.json bumped 0.1.0 → 0.1.4 on `release/v0.1.4`.
- Tag `v0.1.4-beta.1` is a GitHub pre-release for QA/Human companion; stable `v0.1.4` requires Sunday Human `ship_stable`.

## [v0.1.3] - 2026-08-15

### Changed
- Version bump 0.1.1 -> 0.1.3 (hotfix, PATCH, +2).
- Hotfix routing validation per release_context doc-20260815-05r78x.
- No content delta from v0.1.1 stable.

### Notes
- Second hotfix cycle after v0.1.1 stable (first was v0.1.2 routing validation wfr-0ru7cz5m).
- candidate_ref = fix/release-install-instruction @ 22c15a47, content-equivalent to
  v0.1.1 cherry-pick 074c77803 (same tree aec4cf76...); no actionable cherry-pick needed.
- Repository state at trigger time: no [release_blocker] / [hotfix] / [P0] issues,
  no open PRs requiring urgent fix.
- prerelease=true per release_context doc hard constraint (candidate verification only).
- Stable v0.1.3 release is NOT created in this cycle; it must be created by stable_publish
  node after Human ship_stable decision.

## [v0.1.2] - 2026-08-15

### Changed
- Version bump 0.1.1 -> 0.1.2 (hotfix, PATCH).
- Hotfix routing validation only; no content delta from v0.1.1.

### Notes
- First hotfix cycle after v0.1.1 stable.
- No new commits cherry-picked; README, src/calculator.js, test/calculator.test.js
  all identical to v0.1.1 (verified via compare API + content SHA256).
- Repository state at trigger time had no [release_blocker] / [hotfix] / [P0]
  labeled issues, no open PRs, no critical bug reports.

## [v0.1.1] - 2026-08-15

### Added
- Initial stable release of multigent/workflow-sandbox.
- `multiply(a, b)` arithmetic helper with full node:test coverage
  (positive, zero, single-negative, double-negative) — PR #20.
- `square(n)` arithmetic helper — PR #18.
- `subtract(a, b)` arithmetic helper — PR #9.

### Fixed
- Subtract helper regression: `a+b` corrected to `a-b` (PR #9 round-2).

### Notes
- First stable tag on the repository; subsequent weekly_beta cycles will
  follow the GitHub Beta-Stable release workflow.
- 0.x semver: API not yet stable; breaking changes allowed before 1.0.
