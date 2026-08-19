## [v0.1.5-beta.1] - 2026-08-19

### Added
- Divide helper unit test coverage expanded to 8 new boundary cases
  (non-integer quotient, negative dividend, negative divisor, both-negative
  operands, dividend zero, divisor one, floating point operands, divide-by-zero
  error message explicitly mentioning "zero") â€” PR #33 (Closes #32).
- Test count: 19 â†’ 27 (`npm test`).

### Changed
- None.

### Fixed
- None.

### Notes
- Weekly beta cycle. Source unchanged: `src/calculator.js` already provides
  `divide(a, b)` matching spec; only test coverage was expanded.
- Cut from `main` @ `6eb35ce88388f022de769263a0b57b3da1cac32f` (Merge PR #33).
- Release branch `release/v0.1.5` created from main tip.
- package.json bumped 0.1.0 â†’ 0.1.5 on `release/v0.1.5`.
- Tag `v0.1.5-beta.1` is a GitHub pre-release for QA + Human companion.
  Stable `v0.1.5` requires Sunday Human `ship_stable` via stable_publish node.
- 0.x semver: API not yet stable; breaking changes allowed before 1.0.

## [v0.1.4] - 2026-08-16 (beta.1)

### Changed
- `titleCase` is now acronym-aware (keeps known acronyms intact) â€” PR #27 (Closes #26).
- README install instructions clarified: no lockfile â†’ do not use `npm ci`; run `npm test` / `node --test` â€” PR #24.

### Docs
- Added `e2e/issue-30.md` for workflow E2E verification â€” PR #31 (Closes #30).

### Notes
- First weekly_beta cut for v0.1.4 from `main` @ `a7e42ffee13e6e06913ab0daf6309dad2d502475`.
- Based on current main tip (not a fast-forward of hotfix/v0.1.3 tip); main and v0.1.3 were diverged at cut time.
- package.json bumped 0.1.0 â†’ 0.1.4 on `release/v0.14`.
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
- Repository state at trigger time: no [release_bloÚÙ\—HÈÚİš^HÈÔH\ÜİY\Ëˆ›ÈÜ[ˆœÈ™\]Z\š[™È\™Ù[š^‚‹H™\™[X\ÙO]YH\ˆ™[X\ÙWØÛÛ^ØÈ\™ÛÛœİ˜Z[
Ø[™Y]H™\šYšXØ][ÛˆÛ›JK‚‹HİX›HŒŒKŒÈ™[X\ÙH\È“ÕÜ™X]Y[ˆ\ÈŞXÛNÈ]]\İ™HÜ™X]YHİX›WÜX›\Úˆ›ÙHY\ˆ[X[ˆÚ\ÜİX›HXÚ\Ú[Û‹‚‚ˆÈÈİŒŒKŒ—HHŒ‹LLMB‚ˆÈÈÈÚ[™ÙY‹H™\œÚ[Ûˆ[\ŒKŒHOˆŒKŒˆ
İš^UÒ
K‚‹Hİš^›İ][™È˜[Y][ÛˆÛ›NÈ›ÈÛÛ[[Hœ›ÛHŒŒKŒK‚‚ˆÈÈÈ›İ\Â‹Hš\œİİš^ŞXÛHY\ˆŒŒKŒHİX›K‚‹H›È™]ÈÛÛ[Z]ÈÚ\œK\XÚÙYÈ‘PQQKÜ˜ËØØ[İ[]Ü‹šœË\İØØ[İ[]Ü‹\İšœÂˆ[Y[XØ[ÈŒŒKŒH
™\šYšYYšXHÛÛ\\™HTH
ÈÛÛ[ÒLMŠK‚‹H™\ÜÚ]ÜHİ]H]šYÙÙ\ˆ[YHY›ÈÜ™[X\ÙWØ›ØÚÙ\—HÈÚİš^HÈÔBˆX™[Y\ÜİY\Ë›ÈÜ[ˆœË›ÈÜš]XØ[YÈ™\ÜË‚‚ˆÈÈİŒŒKŒWHHŒ‹LLMB‚ˆÈÈÈYY‹H[š]X[İX›H™[X\ÙHÙˆultigent/workflow-sandbox.
- `multiply(a, b)` arithmetic helper with full node:test coverage
  (positive, zero, single-negative, double-negative) â€” PR #20.
- `square(n)` arithmetic helper â€” PR #18.
- `subtract(a, b)` arithmetic helper â€” PR #9.

### Fixed
- Subtract helper regression: `a+b` corrected to `a-b` (PR #9 round-2).

### Notes
- First stable tag on the repository; subsequent weekly_beta cycles will
  follow the GitHub Beta-Stable release workflow.
- 0.x semver: API not yet stable; breaking changes allowed before 1.0.
