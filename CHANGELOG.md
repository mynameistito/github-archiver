## [1.0.7](https://github.com/mynameistito/github-archiver/compare/v1.0.6...v1.0.7) (2026-01-11)


### Bug Fixes

* update version number in source code to match package.json ([f9ef48c](https://github.com/mynameistito/github-archiver/commit/f9ef48c344cf46e2ebb37141a9db211bddf57d47))

## [1.0.6](https://github.com/mynameistito/github-archiver/compare/v1.0.5...v1.0.6) (2026-01-11)


### Bug Fixes

* ensure ESM output in bundled dist file ([48a242a](https://github.com/mynameistito/github-archiver/commit/48a242ad0b15c16e78c66aafab69ba84b64590b9))

## [1.0.5](https://github.com/mynameistito/github-archiver/compare/v1.0.4...v1.0.5) (2026-01-11)


### Bug Fixes

* build output as ESM to match package.json type ([e0aadd7](https://github.com/mynameistito/github-archiver/commit/e0aadd740c559333375e57b0f34e7e2d6a04240c))

## [1.0.4](https://github.com/mynameistito/github-archiver/compare/v1.0.3...v1.0.4) (2026-01-11)


### Bug Fixes

* add repository URL to package.json for npm provenance ([02ddb1c](https://github.com/mynameistito/github-archiver/commit/02ddb1c9f4b6a7b7ca91497b2633011accf94356))

## [1.0.3](https://github.com/mynameistito/github-archiver/compare/v1.0.2...v1.0.3) (2026-01-11)

## [1.0.2](https://github.com/mynameistito/github-archiver/compare/v1.0.1...v1.0.2) (2026-01-11)

## [1.0.1](https://github.com/mynameistito/github-archiver/compare/v1.0.0...v1.0.1) (2026-01-11)


### Bug Fixes

* correct relative import path in CLI wrapper ([cc64796](https://github.com/mynameistito/github-archiver/commit/cc64796d2d0a06175faf053d63e9c1e8ffe0d371))

# 1.0.0 (2026-01-11)


### Bug Fixes

* separate CLI wrapper to resolve ESM shebang conflict ([fc9918a](https://github.com/mynameistito/github-archiver/commit/fc9918a46953634b1ad15a0f64175937acb4f29b))

# Changelog

All notable changes to GitHub Archiver will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-11

### Added
- Initial release of GitHub Archiver CLI
- Mass archive GitHub repositories with parallel processing
- Three input methods: editor, file, and stdin
- Secure token management with local storage
- Configurable concurrency (1-50 parallel operations)
- Dry-run mode for validation without archiving
- Real-time progress tracking with ETA
- Comprehensive error handling with recovery suggestions
- Multiple GitHub URL format support:
  - HTTPS: `https://github.com/owner/repo`
  - SSH: `git@github.com:owner/repo.git`
  - Shorthand: `owner/repo`
- Detailed logging to file and console
- Exponential backoff retry logic for transient failures
- Rate limit awareness and handling
- User-friendly output with emojis and formatting
- Complete test coverage for utilities
- TypeScript strict mode for type safety
- Biome formatting and linting enforcement

### Commands
- `auth login` - Authenticate with GitHub
- `auth logout` - Remove stored token
- `auth status` - Check authentication status
- `auth validate` - Validate token
- `archive` - Archive repositories with multiple options

### Features
- Parallel processing with p-queue
- Retry logic with exponential backoff (1s → 2s → 4s)
- Repository validation (exists, permissions, already archived)
- Progress display with progress bars and ETA
- Summary reporting with success/failure/skipped counts
- Detailed error messages with troubleshooting guidance
- Support for configuration files and comments in input

### Documentation
- Comprehensive README with quick start guide
- Installation instructions
- Command reference with examples
- Troubleshooting guide
- Token generation instructions
- Architecture overview

### Testing
- 34 unit tests covering:
  - URL parsing (20+ tests)
  - Output formatting (15+ tests)
- Test utilities for core functionality
- Vitest configuration for fast testing

### Code Quality
- TypeScript strict mode enabled
- 0 compilation errors
- 0 implicit any types
- Ultracite preset for code standards
- Biome for formatting and linting
- Comprehensive error handling
- Clean code architecture

## Unreleased

### Planned Features
- [ ] Batch progress reporting with live updates
- [ ] Support for organization-wide archiving
- [ ] Integration tests for archive command
- [ ] Performance metrics and analytics
- [ ] Configuration file support (.github-archiverrc)
- [ ] Webhook integration for automation
- [ ] GitHub Actions integration
- [ ] Export operation results to JSON/CSV
- [ ] Undo/rollback capability (unarchive)

### Under Consideration
- Docker image distribution
- NPX support for one-time use
- Scheduled archiving via cron
- Repository filtering by criteria (stars, forks, language)
- Batch operations with saved profiles
