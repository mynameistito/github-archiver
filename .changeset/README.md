# Changesets

When you want to create a changeset, run:

```bash
bun changeset:add
```

This will prompt you to:
1. Select which package(s) to release (github-archiver)
2. Choose the type of version bump (major, minor, patch)
3. Write a description of the change

The changeset file will be created in `.changeset/` directory.

Commit this file with your changes.

When the PR is merged to main, GitHub Actions will:
1. Create a "Version Packages" PR
2. Update versions and CHANGELOG.md
3. When that PR is merged, automatically publish to npm
