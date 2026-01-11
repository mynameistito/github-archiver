# GitHub Archiver CLI

[![CI](https://github.com/mynameistito/github-archiver/actions/workflows/ci.yml/badge.svg)](https://github.com/mynameistito/github-archiver/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/github-archiver)](https://www.npmjs.com/package/github-archiver)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A powerful command-line tool for mass archiving GitHub repositories with parallel processing, comprehensive error handling, and user-friendly feedback.

## Features

✨ **Mass Archive Repositories** - Archive multiple GitHub repositories in parallel
🔐 **Secure Authentication** - Token stored locally in `~/.github-archiver/config.json`
⚡ **Parallel Processing** - Archive multiple repos simultaneously (configurable 1-50 concurrency)
📋 **Multiple Input Methods** - Load repos from editor, file, or stdin
🔍 **Validation** - Dry-run mode to validate without archiving
📊 **Progress Tracking** - Real-time progress bars and ETA
🛡️ **Error Recovery** - Comprehensive error handling with helpful guidance
📝 **Detailed Logging** - Structured logging to files and console

## Installation

### npm

```bash
npm install -g github-archiver
```

### From Source

```bash
git clone https://github.com/mynameistito/github-archiver.git
cd github-archiver
npm install
npm run build
npm install -g .
```

### Development

```bash
npm install
npm run dev -- <command>
```

## Quick Start

### 1. Authenticate with GitHub

```bash
github-archiver auth login
# Paste your GitHub Personal Access Token when prompted
```

### 2. Archive Repositories

```bash
github-archiver archive
# Opens your default text editor to enter repository URLs
```

## Commands

### `auth`

Manage GitHub authentication.

#### `auth login`
Authenticate with GitHub using a Personal Access Token.

```bash
github-archiver auth login
```

#### `auth logout`
Remove stored GitHub token.

```bash
github-archiver auth logout
```

#### `auth status`
Check current authentication status.

```bash
github-archiver auth status
```

### `archive`

Archive multiple GitHub repositories.

```bash
github-archiver archive [options]
```

#### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--file <path>` | - | Read repository URLs from file |
| `--stdin` | - | Read repository URLs from stdin |
| `--dry-run` | false | Validate without archiving |
| `--concurrency <n>` | 3 | Number of parallel operations (1-50) |
| `--timeout <n>` | 300 | API timeout in seconds (10-3600) |
| `--verbose` | false | Enable verbose logging |
| `--force` | false | Skip confirmation prompts |

#### Examples

**Interactive (opens editor):**
```bash
github-archiver archive
```

**From file:**
```bash
github-archiver archive --file repos.txt
```

**From stdin:**
```bash
cat repos.txt | github-archiver archive --stdin
```

**Dry-run (validate only):**
```bash
github-archiver archive --file repos.txt --dry-run
```

**Fast processing (higher concurrency):**
```bash
github-archiver archive --file repos.txt --concurrency 10
```

**Force without confirmation:**
```bash
github-archiver archive --file repos.txt --force
```

## Input Format

Repository URLs can be specified in three formats:

### HTTPS Format
```
https://github.com/owner/repo
https://github.com/owner/repo.git
```

### SSH Format
```
git@github.com:owner/repo.git
git@github.com:owner/repo
```

### Shorthand Format
```
owner/repo
```

### File Example

```
# Repositories to archive
https://github.com/facebook/react
torvalds/linux
owner/private-repo

# Comments are ignored
https://github.com/nodejs/node
```

## GitHub Token Requirements

You need a GitHub Personal Access Token with the following:

- **Scope**: `repo` (Full control of private repositories)
- **Minimum Permissions**: Push access to repositories you want to archive

### How to Generate a Token

1. Go to https://github.com/settings/tokens/new
2. Create a new token with `repo` scope
3. Copy the token and run `github-archiver auth login`

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

### Authentication Issues

**Error: No GitHub token found**
- Run: `github-archiver auth login`
- Ensure you have a valid Personal Access Token with `repo` scope

**Error: Invalid or expired token**
- Generate a new token at https://github.com/settings/tokens
- Run: `github-archiver auth logout` then `github-archiver auth login`

### Permission Issues

**Error: Permission denied for owner/repo**
- Verify you are the repository owner or have push access
- Check that your token has the `repo` scope
- The repository must not be archived yet

### Rate Limiting

**Error: GitHub API rate limit exceeded**
- Wait a few minutes (rate limit resets hourly)
- Use lower concurrency: `--concurrency 1`
- Increase timeout: `--timeout 600`

### Network Issues

**Error: Network error or timeout**
- Check your internet connection
- GitHub API may be temporarily unavailable
- Try again in a moment
- Increase timeout: `--timeout 600`

### Repository Not Found

**Error: Repository not found**
- Verify the repository URL is correct
- The repository may have been deleted
- Check your GitHub access to the repository

## Configuration

Configuration is stored at:
- **Linux/macOS**: `~/.github-archiver/config.json`
- **Windows**: `%USERPROFILE%\.github-archiver\config.json`

Logs are stored at:
- **Linux/macOS**: `~/.github-archiver/logs/`
- **Windows**: `%USERPROFILE%\.github-archiver\logs\`

## Architecture

```
src/
├── commands/        # CLI commands (auth, archive)
├── services/        # GitHub API, archiving, auth management
├── utils/           # Utilities (parsing, formatting, logging)
├── types/           # TypeScript type definitions
└── constants/       # Configuration constants and messages

tests/
└── unit/            # Unit tests for utilities
```

### Core Services

- **GitHubService**: Handles GitHub API interactions with retry logic
- **Archiver**: Manages parallel repository archiving with p-queue
- **AuthManager**: Manages secure token storage
- **InputHandler**: Handles input from editor, file, or stdin
- **ProgressDisplay**: Manages progress bar and summary output

## Development

### Setup

```bash
npm install
npm run typecheck
npm run test
npm run build
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev -- <cmd>` | Run CLI in development mode |
| `npm run typecheck` | Check TypeScript compilation |
| `npm run test` | Run unit tests |
| `npm run build` | Build production bundle |
| `npm run lint` | Check code style |
| `npm run format` | Auto-format code |

### Code Standards

This project uses **Ultracite**, a zero-config preset that enforces:

- Strict TypeScript with no implicit `any`
- Accessibility, performance, and security best practices
- Consistent formatting via Biome
- Comprehensive error handling

See `AGENTS.md` for detailed standards.

### Testing

```bash
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report
```

## Release Process

This project uses **semantic-release** for automated versioning and publishing to npm.

### How Releases Work

1. **Commit Format**: Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New features → **minor** version bump (1.0.0 → 1.1.0)
   - `fix:` - Bug fixes → **patch** version bump (1.0.0 → 1.0.1)
   - `BREAKING CHANGE:` - Breaking changes → **major** version bump (1.0.0 → 2.0.0)
   - `chore:`, `docs:`, `test:` - No version bump

2. **Automatic Trigger**:
   - Push to `main` branch triggers the release workflow
   - Semantic release analyzes commits and determines version bump
   - Package version is updated, published to npm
   - GitHub release is created with changelog
   - Git tag is created automatically

3. **Trusted Publishing**:
   - Uses OpenID Connect (OIDC) for secure, tokenless authentication
   - No npm tokens required - eliminates security risks
   - Short-lived, cryptographically-signed tokens for each publish
   - Works with personal GitHub accounts

4. **Node Version Requirements**:
   - Package runs on Node 18+ (see `package.json` engines)
   - Release workflow uses Node 22+ (semantic-release requirement)
   - CI tests on Node 18 and 22 for maximum compatibility

5. **Example Workflow**:
   ```bash
   git checkout main
   git pull
   # Make your commits with conventional format
   git commit -m "feat: add support for custom config file"
   git push
   # Release happens automatically!
   ```

### Trusted Publishing Setup

This project uses npm's **Trusted Publishing** feature for secure, tokenless package publishing.

**Setup (one-time):**
1. Go to https://www.npmjs.com/package/github-archiver/settings
2. Under **Trusted Publisher**, click **GitHub Actions**
3. Fill in:
   - **Organization or user**: `mynameistito`
   - **Repository**: `github-archiver`
   - **Workflow filename**: `release.yml`
4. Click **Set up connection**
5. (Recommended) Enable **"Require two-factor authentication and disallow tokens"**

That's it! No tokens to manage, rotate, or worry about.</think></tool_call>

### Commit Message Examples

```bash
# Feature (minor version bump)
git commit -m "feat: add support for custom config file"

# Bug fix (patch version bump)
git commit -m "fix: handle empty repository list gracefully"

# Breaking change (major version bump)
git commit -m "feat!: change CLI command structure

BREAKING CHANGE: The 'auth' subcommand is now required"

# No release
git commit -m "chore: update dependencies"
git commit -m "docs: clarify installation steps"
git commit -m "test: add unit tests for parser"
```

### Manual Releases

If you need to publish without merging to main:
```bash
npm run release -- --no-ci
```

## Contributing

Contributions are welcome! Please:

1. Follow the code standards (run `npm run format`)
2. Add tests for new features
3. Ensure `npm run typecheck` and `npm run test` pass
4. Create a pull request with a clear description

## License

MIT - See LICENSE file for details

## Support

Having issues? Check the [Troubleshooting](#troubleshooting) section or open an issue on GitHub.

## Acknowledgments

- Built with TypeScript, Commander.js, Octokit, and Winston
- Uses Biome for code formatting and linting
- Inspired by the need for efficient GitHub repository management

## Version

Current version: 1.0.0

For the latest updates and release notes, visit: https://github.com/mynameistito/github-archiver/releases
