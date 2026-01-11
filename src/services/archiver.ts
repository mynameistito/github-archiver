import PQueue from "p-queue";
import type {
  ArchiveOptions,
  ArchiveResult,
  RepositoryIdentifier,
} from "../types";
import { ErrorCode } from "../types";
import { isArchiveError } from "../utils/errors";
import { getLogger } from "../utils/logger";
import type { GitHubService } from "./github";

const logger = getLogger();

export class Archiver {
  private readonly queue: PQueue;
  private results: ArchiveResult[] = [];
  private readonly gitHubService: GitHubService;
  private completed = 0;
  private failed = 0;
  private readonly startTime = 0;

  constructor(gitHubService: GitHubService, options: ArchiveOptions) {
    this.gitHubService = gitHubService;
    this.queue = new PQueue({
      concurrency: options.concurrency,
      timeout: options.timeout * 1000,
      interval: 1000,
      intervalCap: options.concurrency,
    });

    logger.info("Archiver initialized", {
      concurrency: options.concurrency,
      timeout: options.timeout,
      dryRun: options.dryRun,
    });
  }

  async archiveRepositories(
    repos: RepositoryIdentifier[],
    options: ArchiveOptions
  ): Promise<ArchiveResult[]> {
    this.results = [];
    this.completed = 0;
    this.failed = 0;

    logger.info(`Starting to archive ${repos.length} repositories`, {
      dryRun: options.dryRun,
    });

    const tasks = repos.map((repo) =>
      this.queue.add(() => this.archiveRepository(repo, options))
    );

    await Promise.all(tasks);

    return this.results;
  }

  private async archiveRepository(
    repo: RepositoryIdentifier,
    options: ArchiveOptions
  ): Promise<void> {
    const startTime = Date.now();

    try {
      if (options.dryRun) {
        logger.info(`[DRY-RUN] Would archive ${repo.owner}/${repo.repo}`);
        const result: ArchiveResult = {
          owner: repo.owner,
          repo: repo.repo,
          success: true,
          archived: false,
          duration: Date.now() - startTime,
          message: "[DRY-RUN] Validation successful",
        };
        this.results.push(result);
        this.completed++;
        return;
      }

      const validation = await this.gitHubService.validateRepository(
        repo.owner,
        repo.repo
      );

      if (!validation.exists) {
        logger.warn(`Repository not found: ${repo.owner}/${repo.repo}`);
        const result: ArchiveResult = {
          owner: repo.owner,
          repo: repo.repo,
          success: false,
          archived: false,
          error: "Repository not found",
          duration: Date.now() - startTime,
          message: "Repository does not exist on GitHub",
        };
        this.results.push(result);
        this.failed++;
        return;
      }

      if (validation.isArchived) {
        logger.info(`Repository already archived: ${repo.owner}/${repo.repo}`);
        const result: ArchiveResult = {
          owner: repo.owner,
          repo: repo.repo,
          success: true,
          archived: false,
          duration: Date.now() - startTime,
          message: "Repository is already archived",
        };
        this.results.push(result);
        this.completed++;
        return;
      }

      console.log(`📦 Archiving ${repo.owner}/${repo.repo}...`);
      await this.gitHubService.archiveRepository(repo.owner, repo.repo);

      const result: ArchiveResult = {
        owner: repo.owner,
        repo: repo.repo,
        success: true,
        archived: true,
        duration: Date.now() - startTime,
        message: "Repository archived successfully",
      };
      this.results.push(result);
      this.completed++;
      logger.info(`✓ Archived ${repo.owner}/${repo.repo}`, {
        duration: result.duration,
      });
    } catch (error) {
      if (isArchiveError(error) && error.code === ErrorCode.ALREADY_ARCHIVED) {
        logger.info(`Repository already archived: ${repo.owner}/${repo.repo}`);
        const result: ArchiveResult = {
          owner: repo.owner,
          repo: repo.repo,
          success: true,
          archived: false,
          duration: Date.now() - startTime,
          message: "Repository is already archived",
        };
        this.results.push(result);
        this.completed++;
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        `✗ Failed to archive ${repo.owner}/${repo.repo}: ${errorMessage}`
      );

      const result: ArchiveResult = {
        owner: repo.owner,
        repo: repo.repo,
        success: false,
        archived: false,
        error: errorMessage,
        duration: Date.now() - startTime,
        message: `Error: ${errorMessage}`,
      };
      this.results.push(result);
      this.failed++;
    }
  }

  getProgress(): { completed: number; failed: number; total: number } {
    return {
      completed: this.completed,
      failed: this.failed,
      total: this.results.length,
    };
  }

  getSummary(): {
    successful: number;
    failed: number;
    skipped: number;
    totalDuration: number;
  } {
    const successful = this.results.filter(
      (r) => r.success && r.archived
    ).length;
    const failed = this.results.filter((r) => !r.success).length;
    const skipped = this.results.filter((r) => r.success && !r.archived).length;
    const totalDuration = Date.now() - this.startTime;

    return { successful, failed, skipped, totalDuration };
  }
}
