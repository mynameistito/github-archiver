# Quick Start Guide

Get up and running with GitHub Archiver in 5 minutes.

## Step 1: Install

### Global Installation

```bash
# Using npm
npm install -g github-archiver

# Or using Bun (faster)
bun install -g github-archiver
```

### For Development

```bash
git clone https://github.com/mynameistito/github-archiver.git
cd github-archiver

# Using Bun (recommended)
bun install
bun run build
bun run dev -- <command>

# Or using npm
npm install
npm run build
npm run dev -- <command>
```

**Note:** This project is optimized for [Bun](https://bun.sh/). If you don't have Bun, install it from https://bun.sh

## Step 2: Get a GitHub Token

1. Go to https://github.com/settings/tokens/new
2. Create a new token with `repo` scope
3. Copy the token (you'll need it in the next step)

## Step 3: Authenticate

```bash
github-archiver auth login
```

Paste your token when prompted. It's saved securely in `~/.github-archiver/config.json`.

## Step 4: Archive Repositories

### Option A: Interactive (Recommended)

```bash
github-archiver archive
```

Your default text editor opens. Enter repository URLs (one per line), save, and exit.

Supported formats:
```
https://github.com/facebook/react
torvalds/linux
git@github.com:owner/repo.git
```

### Option B: From File

Create a file `repos.txt`:
```
facebook/react
torvalds/linux
google/go
```

Run:
```bash
github-archiver archive --file repos.txt
```

### Option C: From Stdin

```bash
cat repos.txt | github-archiver archive --stdin
```

## Step 5: Confirm and Watch

You'll see a preview of repositories to archive. Confirm with `y` and watch the progress:

```
[============================ ] 5/5 (100%) - microsoft/vscode

╔════════════════════════════════════╗
║       Archive Operation Summary    ║
╠════════════════════════════════════╣
║ ✅ Successful:  5                  ║
║ ⚠️  Skipped:     0                  ║
║ ❌ Failed:      0                  ║
╠════════════════════════════════════╣
║ Total:         5                   ║
║ Duration:      1m 23s              ║
╚════════════════════════════════════╝

✅ All repositories processed successfully!
```

## Common Tasks

### Check Your Authentication

```bash
github-archiver auth status
```

### Dry Run (Don't Actually Archive)

```bash
github-archiver archive --file repos.txt --dry-run
```

### Speed Up Processing (More Parallel Jobs)

```bash
github-archiver archive --file repos.txt --concurrency 10
```

### Skip Confirmation Prompt

```bash
github-archiver archive --file repos.txt --force
```

### Verbose Output

```bash
github-archiver archive --file repos.txt --verbose
```

### Logout

```bash
github-archiver auth logout
```

## Troubleshooting

### "No GitHub token found"
```bash
github-archiver auth login
```

### "Permission denied"
- Make sure you're the repository owner
- Check your token has `repo` scope at https://github.com/settings/tokens

### "Repository not found"
- Verify the repository URL is correct
- Check you have access to the repository

### "Rate limit exceeded"
- Wait a few minutes (GitHub rate limit resets hourly)
- Use lower concurrency: `--concurrency 1`

### Need help?
- See detailed documentation in README.md
- Check the troubleshooting section
- Open an issue at https://github.com/mynameistito/github-archiver/issues

## What's Next?

- Read the full README.md for all options
- Check CONTRIBUTING.md to help improve the project
- Review CHANGELOG.md to see what's new
- Explore the source code in the `src/` directory

## Examples

### Archive all repos in a file
```bash
github-archiver archive --file my-repos.txt --force
```

### Validate first without archiving
```bash
github-archiver archive --file my-repos.txt --dry-run
```

### Fast mode (10 parallel jobs)
```bash
github-archiver archive --file my-repos.txt --concurrency 10 --force
```

### From echo command
```bash
echo -e "facebook/react\ntorvalds/linux\nmicrosoft/vscode" | github-archiver archive --stdin --force
```

## File Format Example

`repos.txt`:
```
# Archive these repositories
https://github.com/facebook/react
https://github.com/torvalds/linux.git

# You can also use shorthand
google/go
microsoft/vscode

# SSH format works too
git@github.com:owner/private-repo.git

# Empty lines and comments are ignored
# The following has invalid format and will be skipped
this-is-invalid-!!!
```

## Notes

- Archived repositories are read-only
- Collaborators can still see archived repos (they just can't push)
- You can unarchive repositories anytime in GitHub
- The CLI doesn't delete repositories, only archives them
- Logs are saved to `~/.github-archiver/logs/`

## Tips

1. **Start small**: Test with 2-3 repositories first
2. **Use dry-run**: Always validate with `--dry-run` if you're unsure
3. **Save your list**: Keep your repos.txt file for reference
4. **Check permissions**: Verify you have push access before running
5. **Monitor progress**: Watch the progress bar and ETA

---

Happy archiving! 🎉
