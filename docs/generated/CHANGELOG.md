## [3.0.1](https://github.com/foobaragency/cf-migrations/compare/v3.0.0...v3.0.1) (2022-08-30)


### Bug Fixes

* docs changelog ([2e83c05](https://github.com/foobaragency/cf-migrations/commit/2e83c05cc253be96ad3fad5c799875f7db5139a4))

## [3.0.0](https://github.com/foobaragency/cf-migrations/compare/v2.0.0...v3.0.0) (2022-08-25)

### ⚠ BREAKING CHANGES

- migrate from sequence number to timestamp

### Features

- migrate from sequence number to timestamp ([e3f612f](https://github.com/foobaragency/cf-migrations/commit/e3f612f11bb37453e4962e2abb587b056d31848e))

# [2.0.0](https://github.com/foobaragency/cf-migrations/compare/v1.2.4...v2.0.0) (2021-12-16)

### Bug Fixes

- **package-update:** downgrade chalk ([7414359](https://github.com/foobaragency/cf-migrations/commit/741435908c5a431c5e2c7319564106eca338b98b))
- patch yarn-lock after package update ([563e629](https://github.com/foobaragency/cf-migrations/commit/563e629654c40af8fd68e5ea69bfe76bfaa5462d))

### Features

- **copy-scheduled-actions:** copy scheduledActions from previous release ([8dc531a](https://github.com/foobaragency/cf-migrations/commit/8dc531a3fcfb014b7ea237e6c94a6864100eb33d))

### BREAKING CHANGES

- **copy-scheduled-actions:** `copyScheduledActions` and `rateLimit` are used for the scheduledActions feature.

## [1.2.4](https://github.com/foobaragency/cf-migrations/compare/v1.2.3...v1.2.4) (2021-12-14)

### Bug Fixes

- **lint:** changelog format ([c008248](https://github.com/foobaragency/cf-migrations/commit/c0082482a3c55675be570ea1cfcdaf97782e45a6))

## [1.2.3](https://github.com/foobaragency/cf-migrations/compare/v1.2.2...v1.2.3) (2021-10-14)

### Bug Fixes

- paginate getMigrationEntries ([12d33cb](https://github.com/foobaragency/cf-migrations/commit/12d33cbcdb49cc33107a10bbf17a3c58ba20450a))

## [1.2.2](https://github.com/foobaragency/cf-migrations/compare/v1.2.1...v1.2.2) (2021-10-08)

### Bug Fixes

- **dependencies:** upgrade yarn.lock ([f2bd8f9](https://github.com/foobaragency/cf-migrations/commit/f2bd8f9ca27f4f694323a2559969479db206533b))

## [1.2.1](https://github.com/foobaragency/cf-migrations/compare/v1.2.0...v1.2.1) (2021-09-14)

### Bug Fixes

- save deployed migrations even if other migrations failed ([3bb8f29](https://github.com/foobaragency/cf-migrations/commit/3bb8f299574b9bb1f2e4700cc71c9a3ed8976d8d))

# [1.2.0](https://github.com/foobaragency/cf-migrations/compare/v1.1.3...v1.2.0) (2021-09-07)

### Bug Fixes

- executed prettier to fix CHANGELOG.md file ([d07defe](https://github.com/foobaragency/cf-migrations/commit/d07defe09b255efacc8e6f1e5a30153c3885a0a7))

### Features

- change to use fast-glob instead of globby ([09919e8](https://github.com/foobaragency/cf-migrations/commit/09919e85bc8461fc12ade0778acef931267a8013))

## [1.1.3](https://github.com/foobaragency/cf-migrations/compare/v1.1.2...v1.1.3) (2021-09-03)

### Bug Fixes

- trigger npm release ([f75ca7a](https://github.com/foobaragency/cf-migrations/commit/f75ca7a4db3c472b666a2971e02aad67460db3eb))

## [1.1.2](https://github.com/foobaragency/cf-migrations/compare/v1.1.1...v1.1.2) (2021-09-02)

### Bug Fixes

- upgraded contentful-migration 4.0.14 => 4.5.0 ([6da6783](https://github.com/foobaragency/cf-migrations/commit/6da6783f646ac554129d70842e05cf001e77c872))

## [1.1.1](https://github.com/foobaragency/cf-migrations/compare/v1.1.0...v1.1.1) (2021-08-02)

### Bug Fixes

- don't save migrations that were aborted ([7352809](https://github.com/foobaragency/cf-migrations/commit/73528099e7ae087fd6d0900c02202cb17a45bf97))
- duplicate entry in migrationResults ([e18d159](https://github.com/foobaragency/cf-migrations/commit/e18d1598b63f495e5a8d5f5e628515c6dcff77b4))
