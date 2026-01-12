---
"github-archiver": minor
---

Improve dry-run logging with console output and fix summary box alignment

- Add console output to dry-run validation to show progress in real-time (🔍 emoji)
- Fix startTime initialization in Archiver to properly calculate operation duration
- Refactor summary box formatting with dynamic padding that accounts for emoji character widths
- Ensure all numeric values in summary box are properly right-aligned
