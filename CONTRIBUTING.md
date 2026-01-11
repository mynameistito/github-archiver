# Contributing to GitHub Archiver

Thank you for your interest in contributing to GitHub Archiver! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/mynameistito/github-archiver.git
cd github-archiver

# Install dependencies
npm install

# Verify setup
npm run typecheck
npm run test
npm run build
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive branch names:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `test/` for test additions
- `refactor/` for code improvements

### 2. Make Changes

Follow the code standards below and make atomic commits with clear messages.

### 3. Test Your Changes

```bash
# Run tests
npm run test

# Check TypeScript
npm run typecheck

# Check code style
npm run lint

# Auto-format code
npm run format

# Build the project
npm run build
```

### 4. Submit a Pull Request

Push your branch and create a PR with:
- Clear title describing the change
- Detailed description of what and why
- Reference to any related issues
- Screenshots/examples if applicable

## Code Standards

This project uses **Ultracite** (Biome-based) code standards. Key principles:

### Type Safety
- Always use explicit types for function parameters and returns
- Use `unknown` instead of `any` when type is genuinely unknown
- No implicit `any` allowed
- Leverage TypeScript's type narrowing

### Error Handling
- Throw `Error` objects with descriptive messages, not strings
- Use meaningful error messages with context
- Provide recovery suggestions in user-facing errors
- Use try-catch for async operations appropriately

### Code Organization
- Keep functions focused and reasonably sized
- Extract complex conditions into named boolean variables
- Use early returns to reduce nesting
- Group related code together

### Async/Promises
- Always `await` promises in async functions
- Use `async/await` instead of promise chains
- Handle errors appropriately

### Testing
- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks - use async/await
- Don't use `.only` or `.skip` in committed code
- Keep test suites flat

### Security
- Add `rel="noopener"` when using `target="_blank"`
- Avoid `dangerouslySetInnerHTML`
- Don't use `eval()` or direct `document.cookie` assignment
- Validate and sanitize user input

### Performance
- Avoid spread syntax in loop accumulators
- Use top-level regex literals, not in loops
- Prefer specific imports over namespaces
- Avoid barrel files (index.ts re-exports)

## Before Committing

Always run these checks:

```bash
# Format code
npm run format

# Type check
npm run typecheck

# Run tests
npm run test

# Lint
npm run lint

# Build
npm run build
```

All of these must pass before submitting a PR.

## Architecture Guidelines

### Project Structure

```
src/
├── commands/          # CLI command implementations
├── services/          # Business logic services
├── utils/            # Reusable utilities
├── types/            # TypeScript interfaces and types
└── constants/        # Configuration and constants

tests/
└── unit/             # Unit tests
```

### Adding New Features

1. **Define Types First**: Add interfaces/types in `src/types/`
2. **Create Service**: Add business logic in `src/services/`
3. **Add Utility Functions**: Extract reusable logic to `src/utils/`
4. **Create Command**: Implement CLI command in `src/commands/`
5. **Write Tests**: Add tests in `tests/unit/`
6. **Update Documentation**: Update README and CHANGELOG

### Adding New Commands

1. Create new file in `src/commands/your-command.ts`
2. Export a `createYourCommand()` function returning `Command`
3. Register in `src/index.ts`
4. Add tests in `tests/unit/your-command.test.ts`
5. Document in README.md

Example:
```typescript
// src/commands/your-command.ts
import { Command } from 'commander'

export function createYourCommand(): Command {
  return new Command('your-command')
    .description('What this command does')
    .option('--option <value>', 'Option description')
    .action(async (options) => {
      // Implementation
    })
}
```

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add new feature description
fix: fix specific bug
docs: update documentation
test: add tests for feature
refactor: improve code organization
chore: update dependencies or config
```

Example:
```
feat: add support for archiving by repository age

- Allow filtering repositories older than X days
- Add --min-age and --max-age options
- Add tests for age-based filtering
```

## Pull Request Checklist

Before submitting:

- [ ] Code follows Ultracite standards
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] Code is formatted (`npm run format`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes
- [ ] Related issues are referenced
- [ ] Documentation is updated if needed

## Testing Guidelines

### Unit Tests
- Test utilities and isolated functions
- Use descriptive test names
- Keep tests focused on one thing
- Mock external dependencies

Example:
```typescript
import { describe, it, expect } from 'vitest'
import { URLParser } from '../utils/parser'

describe('URLParser', () => {
  it('should parse HTTPS GitHub URLs', () => {
    const result = URLParser.parseRepositoryUrl('https://github.com/owner/repo')
    expect(result.owner).toBe('owner')
    expect(result.repo).toBe('repo')
  })
})
```

### Integration Tests
- Test command workflows end-to-end
- Use mock GitHub responses
- Verify complete user flows
- Test error scenarios

## Documentation Guidelines

When adding features:

1. Update README.md with:
   - Command description
   - Usage examples
   - Options and parameters
   - Troubleshooting tips

2. Update CHANGELOG.md with:
   - Feature description
   - Breaking changes (if any)
   - Migration guide (if needed)

3. Add code comments for:
   - Complex algorithms
   - Non-obvious business logic
   - Important decisions

## Reporting Issues

When reporting bugs:

1. **Check existing issues** - Don't duplicate
2. **Provide details**:
   - OS and Node version
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages and logs
   - Screenshots if applicable

3. **Example issue**:
   ```
   Title: Archive command fails with permission error
   
   Steps to reproduce:
   1. Run `github-archiver auth login`
   2. Run `github-archiver archive --file repos.txt`
   3. Wait for processing...
   
   Expected: Repositories should be archived
   Actual: Permission denied error appears
   
   Environment:
   - OS: Windows 11
   - Node: 18.12.0
   - CLI version: 1.0.0
   ```

## Feature Requests

When requesting features:

1. **Be specific** about what you need
2. **Explain the use case** and why it's useful
3. **Consider alternatives** you've tried
4. **Provide examples** if applicable

Example:
```
Title: Add option to archive repositories by age

Description:
I need a way to archive all repositories that haven't 
been updated in more than a year. Currently I have to 
manually check each repository.

Suggested solution:
Add --min-age and --max-age options to filter repositories
```

## Questions?

- Check existing issues and discussions
- Open a new issue to ask for help
- Start a discussion for design questions

## License

By contributing, you agree that your contributions will be licensed under the same MIT license as the project.

Thank you for contributing! 🎉
