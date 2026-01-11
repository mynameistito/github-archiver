# Release Process

This document details the automated release process for GitHub Archiver CLI using semantic-release.

## How Releases Work

### 1. Commit Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features → **minor** version bump (1.0.0 → 1.1.0)
- `fix:` - Bug fixes → **patch** version bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` - Breaking changes → **major** version bump (1.0.0 → 2.0.0)
- `chore:`, `docs:`, `test:` - No version bump

### 2. Automatic Trigger

Push to `main` branch triggers the release workflow:

1. Semantic release analyzes commits and determines version bump
2. Package version is updated, published to npm
3. GitHub release is created with changelog
4. Git tag is created automatically

### 3. Trusted Publishing

Uses OpenID Connect (OIDC) for secure, tokenless authentication:

- No npm tokens required - eliminates security risks
- Short-lived, cryptographically-signed tokens for each publish
- Works with personal GitHub accounts

### 4. Node Version Requirements

- Package runs on Node 18+ (see `package.json` engines)
- Release workflow uses Node 22+ (semantic-release requirement)
- CI tests on Node 18 and 22 for maximum compatibility

### 5. Example Workflow

```bash
git checkout main
git pull
# Make your commits with conventional format
git commit -m "feat: add support for custom config file"
git push
# Release happens automatically!
```

## Trusted Publishing Setup

This project uses npm's **Trusted Publishing** feature for secure, tokenless package publishing.

### Setup (one-time)

1. Go to https://www.npmjs.com/package/github-archiver/settings
2. Under **Trusted Publisher**, click **GitHub Actions**
3. Fill in:
   - **Organization or user**: `mynameistito`
   - **Repository**: `github-archiver`
   - **Workflow filename**: `release.yml`
4. Click **Set up connection**
5. (Recommended) Enable **"Require two-factor authentication and disallow tokens"**

That's it! No tokens to manage, rotate, or worry about.

## Commit Message Examples

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

## Manual Releases

If you need to publish without merging to main:

```bash
npm run release -- --no-ci
```

## Release Workflow Details

The `.github/workflows/release.yml` file handles:

- Running tests on Node 18 and 22
- Building the project
- Publishing to npm using Trusted Publishing
- Creating GitHub releases with changelog
- Managing version tags automatically

## Troubleshooting

### Release Not Triggered

- Ensure commits follow conventional commit format
- Check that workflow file is named `release.yml`
- Verify GitHub Actions permissions are enabled

### Publish Failed

- Check npm Trusted Publisher configuration
- Ensure package name in package.json matches npm registry
- Verify semantic-release version range is valid

### Version Bump Incorrect

- Review commit history for proper prefixes
- Check that `BREAKING CHANGE:` is in commit body (footer)
- Ensure no duplicate release tags exist
