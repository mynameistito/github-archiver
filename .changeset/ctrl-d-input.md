---
"github-archiver": minor
---

Replace 'done' text input with CTRL+D hotkey

- Remove 'done' command requirement for finishing repository input
- Implement native CTRL+D (EOF) signal handling via readline close event
- Add guard flag to prevent double execution
- Update help text to guide users to press CTRL+D instead of typing 'done'
- Maintains cross-platform compatibility (Windows, Mac, Linux)
