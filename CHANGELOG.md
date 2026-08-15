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
