import { Command } from "commander";
import { MESSAGES } from "../constants/messages";
import { PATHS } from "../constants/paths";
import { Archiver } from "../services/archiver";
import { AuthManager } from "../services/auth-manager";
import { GitHubService } from "../services/github";
import type {
  ArchiveOptions,
  ArchiveResult,
  CommandOptions,
  RepositoryIdentifier,
} from "../types";
import { InputHandler } from "../utils/input-handler";
import { getLogger } from "../utils/logger";
import { ProgressDisplay } from "../utils/progress";

const logger = getLogger();

export function createArchiveCommand(): Command {
  return new Command("archive")
    .description("Archive GitHub repositories")
    .option("--file <path>", "Read repository URLs from file")
    .option("--stdin", "Read repository URLs from standard input")
    .option("--dry-run", "Validate without archiving", false)
    .option("--concurrency <n>", "Number of parallel operations", "3")
    .option("--timeout <n>", "API timeout in seconds", "300")
    .option("--verbose", "Verbose logging", false)
    .option("--force", "Skip confirmations", false)
    .action(async (options: CommandOptions) => {
      await archiveCommand(options);
    });
}

export async function archiveCommand(options: CommandOptions): Promise<void> {
  try {
    logger.info("Archive command started", { options });

    const { concurrency, timeout } = validateOptions(options);

    const authManager = new AuthManager(PATHS.APP_DIR);
    const inputHandler = new InputHandler();
    const progressDisplay = new ProgressDisplay();

    const githubService = await authenticateUser(authManager);

    const { repositories, parseErrors } = await getRepositories(
      options,
      inputHandler
    );

    if (parseErrors.length > 0) {
      logParseErrors(parseErrors);
    }

    if (repositories.length === 0) {
      console.error(`❌ ${MESSAGES.NO_REPOS_PROVIDED}`);
      process.exit(1);
    }

    showRepositoriesPreview(repositories, options.dryRun);

    await confirmOperation(options, inputHandler);

    const archiveOptions: ArchiveOptions = {
      dryRun: options.dryRun,
      concurrency,
      timeout,
      force: options.force,
      verbose: options.verbose,
    };

    console.log("");
    console.log(`${MESSAGES.ARCHIVING_START} (concurrency: ${concurrency})`);
    console.log("");

    const archiver = new Archiver(githubService, archiveOptions);
    const results = await archiveRepositories(
      archiver,
      repositories,
      archiveOptions,
      progressDisplay
    );

    displayResults(archiver, results, progressDisplay);
  } catch (error) {
    handleArchiveError(error);
  }
}

export function validateOptions(options: CommandOptions): {
  concurrency: number;
  timeout: number;
} {
  const concurrency = Number.parseInt(options.concurrency, 10);
  const timeout = Number.parseInt(options.timeout, 10);

  if (concurrency < 1 || concurrency > 50) {
    console.error("❌ Concurrency must be between 1 and 50");
    process.exit(1);
  }

  if (timeout < 10 || timeout > 3600) {
    console.error("❌ Timeout must be between 10 and 3600 seconds");
    process.exit(1);
  }

  return { concurrency, timeout };
}

export async function authenticateUser(
  authManager: AuthManager
): Promise<GitHubService> {
  console.log("🔐 Checking authentication...");
  const token = await authManager.getToken();

  if (!token) {
    console.error(`❌ ${MESSAGES.NO_TOKEN}`);
    console.error("   Run: github-archiver auth login");
    process.exit(1);
  }

  const githubService = new GitHubService(token);

  try {
    const authenticatedUser = await githubService.validateAuth();
    console.log(`✅ Authenticated as: ${authenticatedUser}`);
    return githubService;
  } catch (error) {
    console.error("❌ Authentication failed");
    logger.error("Auth validation failed:", error);
    process.exit(1);
  }
}

export async function getRepositories(
  options: CommandOptions,
  inputHandler: InputHandler
): Promise<{
  repositories: RepositoryIdentifier[];
  parseErrors: Array<{ url: string; error: string; line: number }>;
}> {
  console.log("");
  console.log("📝 Getting repositories...");

  let repositories: RepositoryIdentifier[] = [];
  let parseErrors: Array<{ url: string; error: string; line: number }> = [];

  if (options.file) {
    logger.info(`Using file input: ${options.file}`);
    const result = await inputHandler.getRepositoriesFromFile(options.file);
    repositories = result.repos;
    parseErrors = result.errors;
  } else if (options.stdin) {
    logger.info("Using stdin input");
    console.log(
      "Enter repository URLs (one per line, press Ctrl+D to finish):"
    );
    const result = await inputHandler.getRepositoriesFromStdin();
    repositories = result.repos;
    parseErrors = result.errors;
  } else {
    logger.info("Using interactive CLI input");
    const result = await inputHandler.getRepositoriesFromInteractive();
    repositories = result.repos;
    parseErrors = result.errors;
  }

  return { repositories, parseErrors };
}

export function logParseErrors(
  parseErrors: Array<{ url: string; error: string; line: number }>
): void {
  console.warn(`⚠️  Found ${parseErrors.length} invalid repositories:`);
  for (const err of parseErrors) {
    console.warn(`   Line ${err.line}: ${err.error}`);
  }
  console.warn("");
}

export function showRepositoriesPreview(
  repositories: RepositoryIdentifier[],
  dryRun: boolean
): void {
  console.log(
    `📋 Will ${dryRun ? "validate" : "archive"} ${repositories.length} repositories:`
  );
  for (let index = 0; index < Math.min(repositories.length, 5); index++) {
    const repo = repositories[index];
    if (repo) {
      console.log(`   ${index + 1}. ${repo.owner}/${repo.repo}`);
    }
  }
  if (repositories.length > 5) {
    console.log(`   ... and ${repositories.length - 5} more`);
  }
}

export async function confirmOperation(
  options: CommandOptions,
  inputHandler: InputHandler
): Promise<void> {
  console.log("");
  if (!(options.force || options.dryRun)) {
    const confirmed = await inputHandler.promptForConfirmation(
      "Are you sure you want to archive these repositories?"
    );

    if (!confirmed) {
      console.log("❌ Cancelled");
      process.exit(1);
    }
  } else if (options.dryRun) {
    console.log(`ℹ️  ${MESSAGES.DRY_RUN_MODE}`);
  }
}

export async function archiveRepositories(
  archiver: Archiver,
  repositories: RepositoryIdentifier[],
  options: ArchiveOptions,
  progressDisplay: ProgressDisplay
): Promise<ArchiveResult[]> {
  const results = await archiver.archiveRepositories(repositories, options);

  const summary = archiver.getSummary();
  const progress = {
    completed: summary.successful + summary.failed + summary.skipped,
    failed: summary.failed,
    total: repositories.length,
  };

  if (progressDisplay.shouldUpdate()) {
    console.log(`\r${progressDisplay.getProgressBar(progress)}`);
  }

  return results;
}

export function displayResults(
  archiver: Archiver,
  results: ArchiveResult[],
  progressDisplay: ProgressDisplay
): void {
  console.log("");
  console.log("");

  const summary = archiver.getSummary();
  console.log(progressDisplay.getSummaryBox(summary));

  if (summary.failed > 0) {
    console.log("");
    console.log("❌ Failed repositories:");
    for (const r of results) {
      if (!r.success) {
        console.log(`   ${r.owner}/${r.repo}: ${r.message}`);
      }
    }
  }

  if (summary.skipped > 0) {
    console.log("");
    console.log("⚠️  Skipped repositories:");
    for (const r of results) {
      if (r.success && !r.archived) {
        console.log(`   ${r.owner}/${r.repo}: ${r.message}`);
      }
    }
  }

  if (summary.failed > 0) {
    logger.warn(`Archive command completed with ${summary.failed} failures`);
    process.exit(1);
  } else {
    console.log("");
    console.log("✅ All repositories processed successfully!");
    logger.info("Archive command completed successfully");
    process.exit(0);
  }
}

export function handleArchiveError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`❌ Error: ${message}`);
  logger.error("Archive command failed:", error);

  provideErrorGuidance(message);

  process.exit(1);
}

export function provideErrorGuidance(message: string): void {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("token") ||
    lowerMessage.includes("authentication")
  ) {
    console.log("");
    console.log("💡 Troubleshooting:");
    console.log(
      "   1. Make sure you have a valid GitHub Personal Access Token"
    );
    console.log('   2. The token needs "repo" scope to archive repositories');
    console.log("   3. Run: github-archiver auth login");
    return;
  }

  if (lowerMessage.includes("rate limit")) {
    console.log("");
    console.log("💡 Troubleshooting:");
    console.log("   1. GitHub API rate limit has been exceeded");
    console.log("   2. Wait a few minutes and try again");
    console.log("   3. Use lower concurrency: --concurrency 1");
    return;
  }

  if (lowerMessage.includes("permission") || lowerMessage.includes("403")) {
    console.log("");
    console.log("💡 Troubleshooting:");
    console.log("   1. You must be the repository owner or have push access");
    console.log("   2. Check that your GitHub token has correct permissions");
    console.log("   3. Verify you have push access to the repositories");
    return;
  }

  if (lowerMessage.includes("not found") || lowerMessage.includes("404")) {
    console.log("");
    console.log("💡 Troubleshooting:");
    console.log("   1. Make sure the repository URL is correct");
    console.log("   2. The repository may have been deleted");
    console.log("   3. Check your GitHub access to the repository");
    return;
  }

  if (lowerMessage.includes("network") || lowerMessage.includes("timeout")) {
    console.log("");
    console.log("💡 Troubleshooting:");
    console.log("   1. Check your internet connection");
    console.log("   2. GitHub API may be temporarily unavailable");
    console.log("   3. Try again in a moment");
    console.log("   4. Increase timeout: --timeout 600");
  }
}
