---
"github-archiver": patch
---

Migrate from Vitest to Bun native testing ecosystem and replace @types/node with @types/bun

- Switch test runner from Vitest to Bun's native Jest-compatible test runner
- Remove Vitest dependency and update test scripts to use `bun test`
- Create bunfig.toml with comprehensive test configuration (coverage, timeouts, environment variables)
- Migrate all test files (2 files, 34 tests) to use `bun:test` imports instead of Vitest
- Replace @types/node with @types/bun for better Bun environment compatibility
- All 34 tests pass with 94.39% line coverage
- No breaking changes - all Node.js APIs work seamlessly through Bun's Node.js compatibility layer
