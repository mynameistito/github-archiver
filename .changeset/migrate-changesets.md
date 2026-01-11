---
"github-archiver": patch
---

Migrate from semantic-release to @changesets/cli for better release control

- Replace semantic-release with @changesets/cli for explicit version management
- Add GitHub-linked changelog generation with PR/commit references
- Update to two-step release process (Version Packages PR + manual merge)
- Integrate with bun for improved package management
- Update Node requirement to 22+ (aligns with actual dependencies)
- Update CI/CD workflows to use bun exclusively
