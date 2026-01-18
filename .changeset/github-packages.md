---
github-archiver: minor
---

## Add GitHub Packages Publishing Support

Adds dual-registry publishing to both npm and GitHub Packages registries with OIDC trusted publishing.

### Added

- GitHub Packages npm registry support - package published as `@mynameistito/github-archiver`
- `.npmrc` configuration for GitHub Packages registry routing
- GitHub Packages publishing step in release workflow with automatic version checking
- OIDC trusted publishing for enhanced security (no manual tokens required)

### Changed

- Updated release workflow permissions to include `packages: write` for GitHub Packages access
- Release workflow now publishes to both npm (`github-archiver`) and GitHub Packages (`@mynameistito/github-archiver`) simultaneously
