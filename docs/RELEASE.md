# Release Process

This project uses **Changesets** for version management and publishing.

## Overview

The release process is **two-step and automated**:

1. **Developer creates changesets** - Explicit intent for what's being released
2. **GitHub Actions automates the rest** - Creates version PR, then publishes

## For Contributors

### Creating a Changeset

When you've made changes that should be included in a release:

1. **Create a changeset file:**
   ```bash
   bun run changeset:add
   ```

2. **Answer the prompts:**
   - Which packages are affected? → Select `github-archiver`
   - What's the type of change? → Choose:
     - `patch` - bug fixes (1.0.0 → 1.0.1)
     - `minor` - new features (1.0.0 → 1.1.0)
     - `major` - breaking changes (1.0.0 → 2.0.0)
   - Write a description of your change

3. **Commit the generated changeset file:**
   ```bash
   git add .changeset/*.md
   git commit -m "docs: add changeset for feature X"
   ```

4. **Push your branch and open a PR as usual**

### Automated Release

Once your PR is merged to `main`:

1. GitHub Actions detects the changeset files
2. Creates a "Version Packages" PR with:
   - Updated `package.json` version
   - Updated `CHANGELOG.md` with your descriptions
   - GitHub links to commits and PRs
3. Merge the "Version Packages" PR
4. GitHub Actions automatically:
   - Publishes to npm
   - Creates a GitHub release
   - Tags the commit with the version

### Changeset File Format

Example: `.changeset/excited-newts-talk.md`

```markdown
---
"github-archiver": minor
---

Add support for custom GitHub token configuration in config file
```

**Note:** Changeset filenames are auto-generated with whimsical names (e.g., `silly-cats-dance.md`). Edit the description after generation if needed.

## For Maintainers

### Understanding Releases

**What triggers a release?**
- Any changeset file committed to main
- Automatic via GitHub Actions (no manual intervention needed)

**What happens?**
1. Action detects changeset files
2. Runs validation (tests, lint, typecheck, build)
3. Creates "Version Packages" PR with:
   - Version bumps in `package.json`
   - Updated `CHANGELOG.md` with GitHub links
   - Changeset files consumed
4. After PR merge: Automatically publishes to npm

### Merging the "Version Packages" PR

When GitHub Actions creates a "Version Packages" PR:
- Review the version bump (patch/minor/major)
- Review the changelog entries with GitHub links
- Merge to trigger automatic publish

### Release Changelog

The changelog is auto-generated with GitHub links:

```markdown
## 1.1.0

### Minor Changes

- [abc123d](https://github.com/mynameistito/github-archiver/commit/abc123d) ([#42](https://github.com/mynameistito/github-archiver/pull/42)): Add custom token config support
```

### Manual Publishing (if needed)

If automation fails, you can publish manually on the commit with updated versions:

```bash
bun run changeset:publish
```

### Troubleshooting

**Action not creating PR?**
- Check that changesets exist in `.changeset/` directory
- Verify `GITHUB_TOKEN` and `NPM_TOKEN` secrets are configured
- Review workflow logs in GitHub Actions

**Publish failed?**
- Verify `NPM_TOKEN` has publish permissions
- Check npm registry status
- Review the error in GitHub Actions logs

**Version bump incorrect?**
- Verify correct changeset type was selected (patch/minor/major)
- Check that description was provided
- Ensure changeset file syntax is valid (YAML front matter)

## Versioning Strategy

This project uses **Semantic Versioning**:

- **patch**: Bug fixes, minor improvements (1.0.0 → 1.0.1)
- **minor**: New features, backward compatible (1.0.0 → 1.1.0)
- **major**: Breaking changes, incompatible updates (1.0.0 → 2.0.0)

Choose the appropriate type when creating your changeset.

## GitHub Releases

After publishing, a GitHub Release is automatically created with:
- Release notes generated from CHANGELOG.md
- Direct link to the npm package
- Git tag for the release (v1.1.0, etc.)

## Environment & CI/CD

**Required Secrets:**
- `GITHUB_TOKEN` - Auto-provided by GitHub Actions
- `NPM_TOKEN` - Set in repository settings with publish permissions

**Node Version:** 22.x (tested on 24.x and 25.x in CI)  
**Package Manager:** Bun

**Publishing Method:** OIDC trusted publishing with npm

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

## See Also

- [Contributing Guidelines](../CONTRIBUTING.md#release-process)
- [Changesets Documentation](https://github.com/changesets/changesets)
