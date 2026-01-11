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

### From Source

```bash
git clone https://github.com/mynameistito/github-archiver.git
cd github-archiver
npm install && npm run build
npm install -g .
```

### Development

```bash
npm install
npm run dev -- <command>
```

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

| Command | Description |
|---------|-------------|
| `auth login` | Authenticate with Personal Access Token |
| `auth logout` | Remove stored token |
| `auth status` | Check authentication status |

### `archive`

Archive multiple repositories.

```bash
github-archiver archive [options]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--file <path>` | - | Read repository URLs from file |
| `--stdin` | - | Read from stdin |
| `--dry-run` | false | Validate without archiving |
| `--concurrency <n>` | 3 | Parallel operations (1-50) |
| `--timeout <n>` | 300 | API timeout in seconds (10-3600) |
| `--verbose` | false | Enable verbose logging |
| `--force` | false | Skip confirmation prompts |

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

╔════════════════════════════════════╗
║       Archive Operation Summary    ║
╠════════════════════════════════════╣
║ ✅ Successful:  5                  ║
║ ⚠️  Skipped:     0                  ║
║ ❌ Failed:      0                  ║
╠════════════════════════════════════╣
║ Total:         5                   ║
║ Duration:      2m 45s              ║
╚════════════════════════════════════╝

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
npm install
npm run typecheck    # Check TypeScript
npm run test         # Run unit tests
npm run build        # Build production bundle
npm run lint         # Check code style
npm run format       # Auto-format code
```

### Code Standards

This project uses **Ultracite** (Biome) for:
- Strict TypeScript (no implicit `any`)
- Accessibility, performance, security best practices
- Consistent formatting
- Comprehensive error handling

See `AGENTS.md` for details.

## Release Process

This project uses **semantic-release** for automated versioning and publishing.

**Commit format** (Conventional Commits):
- `feat:` → minor bump
- `fix:` → patch bump
- `BREAKING CHANGE:` → major bump
- `chore:`, `docs:`, `test:` → no bump

Pushing to `main` triggers automatic release. See [docs/RELEASE.md](docs/RELEASE.md) for detailed setup and workflow.

## Contributing

1. Follow code standards (`npm run format`)
2. Add tests for new features
3. Ensure `npm run typecheck` and `npm run test` pass
4. Create pull request with clear description

## License

MIT - See LICENSE file for details.

## Support

Check the [Troubleshooting](#troubleshooting) section or open an issue on GitHub.

## Acknowledgments

Built with TypeScript, Commander.js, Octokit, Winston, and Biome.

---

Current version: 1.0.0 | [Releases](https://github.com/mynameistito/github-archiver/releases)
