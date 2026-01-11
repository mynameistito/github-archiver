export const MESSAGES = {
  AUTH_SUCCESS: "Successfully authenticated with GitHub",
  ARCHIVE_SUCCESS: "Repository archived successfully",
  TOKEN_SAVED: "GitHub token saved successfully",
  TOKEN_REMOVED: "GitHub token removed",
  INVALID_TOKEN: "Invalid or expired GitHub token",
  REPO_NOT_FOUND: "Repository not found",
  ALREADY_ARCHIVED: "Repository is already archived",
  PERMISSION_DENIED: "You do not have permission to archive this repository",
  RATE_LIMITED: "GitHub API rate limit exceeded. Please try again later",
  NETWORK_ERROR: "Network error. Please check your connection",
  INVALID_URL: "Invalid GitHub repository URL",
  NO_TOKEN:
    'No GitHub token found. Please run "github-archiver auth login" first',
  OPENING_EDITOR: "Opening text editor for repository URLs...",
  NO_REPOS_PROVIDED: "No repositories provided",
  ARCHIVING_START: "Starting to archive repositories...",
  ARCHIVING_COMPLETE: "Archiving complete",
  DRY_RUN_MODE: "Running in dry-run mode (no repositories will be archived)",
  CONFIRM_ARCHIVE: "Are you sure you want to archive these repositories?",
  ENTER_TOKEN:
    "Enter your GitHub Personal Access Token (will not be displayed):",
  CONFIRM_LOGOUT: "Are you sure you want to remove the stored token?",
};
