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
