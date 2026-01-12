# GitHub Archiver CLI

[![CI](https://github.com/mynameistito/github-archiver/actions/workflows/ci.yml/badge.svg)](https://github.com/mynameistito/github-archiver/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/github-archiver)](https://www.npmjs.com/package/github-archiver)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A powerful CLI for mass archiving GitHub repositories with parallel processing and comprehensive error handling.

## Features

- ✨ **Mass Archive** - Archive multiple repositories in parallel
- 🔐 **Secure Auth** - Token stored locally at `~/.github-archiver/config.json`
- ⚡ **Parallel Processing** - Configurable concurrency (1-50)
- 📋 **Flexible Input** - Load repos from editor, file, or stdin
- 🔍 **Validation** - Dry-run mode to validate without archiving
- 📊 **Progress Tracking** - Real-time progress bars and ETA
- 🛡️ **Error Recovery** - Comprehensive error handling with helpful guidance
- 📝 **Detailed Logging** - Structured logging to files and console

## Installation

```bash
npm install -g github-archiver
```

or with Bun:

```bash
bun install -g github-archiver
```

### From Source

```bash
git clone https://github.com/mynameistito/github-archiver.git
cd github-archiver
bun install && bun run build
bun install -g .
```

### Development

```bash
bun install
bun run dev -- <command>
```

**Note:** This project is optimized for [Bun](https://bun.sh). While it works with Node.js (v22+), Bun provides faster installation, execution, and development experience.

## Quick Start

```bash
# Authenticate
github-archiver auth login

# Archive (opens editor to input repos)
github-archiver archive
```

## Commands

### `auth`

Manage GitHub authentication.

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `auth login`   | Authenticate with Personal Access Token |
| `auth logout`  | Remove stored token                |
| `auth status`  | Check authentication status        |

### `archive`

Archive multiple repositories.

```bash
github-archiver archive [options]
```

| Option                | Default | Description                            |
| --------------------- | ------- | -------------------------------------- |
| `--file <path>`       | -       | Read repository URLs from file         |
| `--stdin`             | -       | Read from stdin                        |
| `--dry-run`           | false   | Validate without archiving             |
| `--concurrency <n>`   | 3       | Parallel operations (1-50)             |
| `--timeout <n>`       | 300     | API timeout in seconds (10-3600)       |
| `--verbose`           | false   | Enable verbose logging                 |
| `--force`             | false   | Skip confirmation prompts               |

**Examples:**

```bash
# Interactive (opens editor)
github-archiver archive

# From file
github-archiver archive --file repos.txt

# From stdin
cat repos.txt | github-archiver archive --stdin

# Dry-run
github-archiver archive --file repos.txt --dry-run

# High concurrency
github-archiver archive --file repos.txt --concurrency 10

# Force without confirmation
github-archiver archive --file repos.txt --force
```

## Input Format

Supported formats:

- HTTPS: `https://github.com/owner/repo` or `https://github.com/owner/repo.git`
- SSH: `git@github.com:owner/repo.git` or `git@github.com:owner/repo`
- Shorthand: `owner/repo`

**File Example:**

```
# Repositories to archive
https://github.com/facebook/react
torvalds/linux
owner/private-repo

# Comments ignored
https://github.com/nodejs/node
```

## GitHub Token Requirements

- **Scope**: `repo` (Full control of private repositories)
- **Minimum Permissions**: Push access to target repositories

**Generate token:** https://github.com/settings/tokens/new → Create with `repo` scope → Run `github-archiver auth login`

## Output Example

```
🔐 Checking authentication...
✅ Authenticated as: username

📝 Getting repositories...
📋 Will archive 5 repositories:
   1. facebook/react
   2. torvalds/linux
   3. owner/repo-1
   4. owner/repo-2
   5. owner/repo-3

Are you sure you want to archive these repositories? [y/N]: y

Starting to archive repositories... (concurrency: 3)

[=======================     ] 4/5 (80%) - owner/repo-3

┌────────────────────────────────────┐
│  Archive Operation Summary         │
├────────────────────────────────────┤
│ Successful: 5                      │
│ Skipped:    0                      │
│ Failed:     0                      │
├────────────────────────────────────┤
│ Total:      5                      │
│ Duration:   2m 45s                 │
└────────────────────────────────────┘

✅ All repositories processed successfully!
```

## Troubleshooting

### Authentication

**No token found**: Run `github-archiver auth login`

**Invalid/expired token**: Generate new token at https://github.com/settings/tokens → `auth logout` → `auth login`

### Permissions

**Permission denied**: Verify repo ownership/push access, check `repo` scope, ensure repo isn't already archived

### Rate Limiting

**Rate limit exceeded**: Wait (resets hourly), lower `--concurrency 1`, increase `--timeout 600`

### Network

**Network error/timeout**: Check connection, GitHub API may be unavailable, retry with `--timeout 600`

### Repository Not Found

**Repository not found**: Verify URL, check if deleted, confirm GitHub access

## Configuration

**Config**: `~/.github-archiver/config.json` (Linux/macOS) or `%USERPROFILE%\.github-archiver\config.json` (Windows)

**Logs**: `~/.github-archiver/logs/` (Linux/macOS) or `%USERPROFILE%\.github-archiver\logs\` (Windows)

## Architecture

```
src/
├── commands/      # CLI commands (auth, archive)
├── services/      # GitHub API, archiving, auth management
├── utils/         # Parsing, formatting, logging
├── types/         # TypeScript definitions
└── constants/     # Configuration constants

tests/
└── unit/          # Unit tests
```

**Core Services:**

- **GitHubService**: GitHub API interactions with retry logic
- **Archiver**: Parallel archiving with p-queue
- **AuthManager**: Secure token storage
- **InputHandler**: Input from editor, file, or stdin
- **ProgressDisplay**: Progress bar and summary output

## Development

```bash
bun install

# Development commands
bun run typecheck    # Check TypeScript
bun run test         # Run unit tests
bun run test:coverage  # Run tests with coverage
bun run build        # Build production bundle
bun run lint         # Check code style
bun run format       # Auto-format code
bun run dev -- auth login  # Run dev mode
```

**Using npm instead?**

```bash
npm install
npm run typecheck    # Equivalent commands
npm run test
npm run build
npm run lint
npm run format
```

### Code Standards

This project uses **Ultracite** (Biome) for:
- Strict TypeScript (no implicit `any`)
- Accessibility, performance, security best practices
- Consistent formatting
- Comprehensive error handling

**Run code quality checks:**

```bash
# Check for issues
bun run lint

# Auto-fix and format code
bun run format
```

See `AGENTS.md` for detailed code standards and best practices.

## Release Process

This project uses **semantic-release** for automated versioning and publishing.

**Commit format** (Conventional Commits):
- `feat:` → minor bump
- `fix:` → patch bump
- `BREAKING CHANGE:` → major bump
- `chore:`, `docs:`, `test:` → no bump

Pushing to `main` triggers automatic release. See [docs/RELEASE.md](docs/RELEASE.md) for detailed setup and workflow.

## Contributing

1. Install dependencies: `bun install`
2. Follow code standards: `bun run format`
3. Add tests for new features
4. Ensure `bun run typecheck` and `bun run test` pass
5. Create pull request with clear description

**Before committing:**

```bash
bun run format    # Auto-fix code style
bun run lint      # Check for issues
bun run typecheck # Verify TypeScript
bun run test      # Run test suite
bun run build     # Build production bundle
```

## License

MIT - See LICENSE file for details.

## Support

Check the [Troubleshooting](#troubleshooting) section or open an issue on GitHub.

## Runtime & Tooling

- **Runtime**: [Bun](https://bun.sh) (primary) or Node.js 22+
- **Package Manager**: Bun (recommended) or npm
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **GitHub API**: Octokit
- **Logging**: Winston
- **Code Quality**: Biome (via Ultracite preset)
- **Task Queue**: p-queue
- **Release Management**: Changesets

## Acknowledgments

Built with TypeScript, Commander.js, Octokit, Winston, Biome, and optimized for Bun runtime.

---

[Releases](https://github.com/mynameistito/github-archiver/releases)
