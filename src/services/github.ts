import { Octokit } from "octokit";
import { MAX_RETRIES, RETRY_DELAY_MS } from "../constants/defaults";
import type { RateLimitInfo } from "../types";
import {
  createAlreadyArchivedError,
  createNetworkError,
  createPermissionError,
  createRateLimitError,
  createRepoNotFoundError,
} from "../utils/errors";
import { getLogger } from "../utils/logger";

const logger = getLogger();

interface OctokitError {
  status: number;
  response?: {
    data?: {
      message: string;
    };
  };
  message: string;
}

export class GitHubService {
  private readonly octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async archiveRepository(owner: string, repo: string): Promise<void> {
    const startTime = Date.now();
    logger.debug(`Attempting to archive ${owner}/${repo}`);

    await this.retryWithBackoff(async () => {
      try {
        await this.octokit.rest.repos.update({
          owner,
          repo,
          archived: true,
        });
        const duration = Date.now() - startTime;
        logger.info(`Successfully archived ${owner}/${repo} in ${duration}ms`);
      } catch (error) {
        this.handleArchiveError(error, owner, repo);
      }
    });
  }

  private handleArchiveError(
    error: unknown,
    owner: string,
    repo: string
  ): never {
    const err = this.parseOctokitError(error);
    logger.error(`Failed to archive ${owner}/${repo}: ${err.message}`, {
      status: err.status,
      code: err.code,
    });

    if (err.status === 404) {
      throw createRepoNotFoundError(owner, repo);
    }

    if (err.status === 403 || err.message.includes("permission")) {
      throw createPermissionError(owner, repo);
    }

    if (err.status === 422 && err.message.includes("archived")) {
      throw createAlreadyArchivedError(owner, repo);
    }

    if (err.message.includes("API rate limit")) {
      throw createRateLimitError();
    }

    if (
      err.message.includes("ECONNREFUSED") ||
      err.message.includes("ETIMEDOUT") ||
      err.message.includes("EHOSTUNREACH") ||
      err.message.includes("socket hang up")
    ) {
      throw createNetworkError(err.message);
    }

    throw error;
  }

  private parseOctokitError(error: unknown): {
    message: string;
    status: number;
    code: string | undefined;
  } {
    const message = error instanceof Error ? error.message : String(error);
    const err = error as unknown as OctokitError;
    return {
      message,
      status: err?.status || 0,
      code: err?.response?.data?.message,
    };
  }

  async validateRepository(
    owner: string,
    repo: string
  ): Promise<{ exists: boolean; isArchived: boolean }> {
    try {
      logger.debug(`Validating repository ${owner}/${repo}`);
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      const result = {
        exists: true,
        isArchived: data.archived,
      };
      logger.debug(`Repository ${owner}/${repo} validated`, result);
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        logger.debug(`Repository ${owner}/${repo} does not exist`);
        return {
          exists: false,
          isArchived: false,
        };
      }

      logger.error(`Error validating ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async getRateLimitStatus(): Promise<RateLimitInfo> {
    try {
      logger.debug("Fetching rate limit status");
      const { data } = await this.octokit.rest.rateLimit.get();

      const info: RateLimitInfo = {
        remaining: data.rate.remaining,
        reset: new Date(data.rate.reset * 1000),
        limit: data.rate.limit,
      };

      logger.debug("Rate limit status retrieved", {
        remaining: info.remaining,
        limit: info.limit,
        resetAt: info.reset.toISOString(),
      });

      return info;
    } catch (error) {
      logger.error("Failed to fetch rate limit status:", error);
      throw error;
    }
  }

  async validateAuth(): Promise<string> {
    try {
      logger.debug("Validating authentication");
      const { data } = await this.octokit.rest.users.getAuthenticated();
      logger.info(`Authenticated as user: ${data.login}`);
      return data.login;
    } catch (error) {
      logger.error("Authentication validation failed:", error);
      throw createNetworkError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = MAX_RETRIES
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        const message = lastError.message.toLowerCase();
        const isRetryable =
          message.includes("rate limit") ||
          message.includes("timeout") ||
          message.includes("econnrefused") ||
          message.includes("etimedout") ||
          message.includes("ehostunreach") ||
          message.includes("socket hang up");

        if (!isRetryable || attempt === maxRetries - 1) {
          throw error;
        }

        const delay = RETRY_DELAY_MS * 2 ** attempt;
        logger.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
          {
            error: message,
          }
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error("Unknown error during retry");
  }
}
