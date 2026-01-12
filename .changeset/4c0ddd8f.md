---
"github-archiver": patch
---

Prevent git tag creation failure when tag already exists

- Add conditional check before creating version tags
- Skip tag creation if it already exists to avoid workflow errors
- Prevents "fatal: tag already exists" error in CI/CD pipeline
- Improves error handling and idempotency of release workflow
