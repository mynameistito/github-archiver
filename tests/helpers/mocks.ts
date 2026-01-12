import { mock } from "bun:test";
import type { Octokit } from "octokit";
import type { GitHubService } from "../../src/services/github";
import type { AuthManager } from "../../src/services/auth-manager";
import type { Archiver } from "../../src/services/archiver";
import type {
  ArchiveError,
  RepositoryIdentifier,
  ArchiveResult,
} from "../../src/types";

/**
 * Mock factory for Octokit
 */
export function createMockOctokit(overrides?: Partial<Octokit>): Octokit {
  return {
    rest: {
      repos: {
        update: mock().mockResolvedValue({}),
        get: mock().mockResolvedValue({
          data: {
            archived: false,
          },
        }),
      },
      users: {
        getAuthenticated: mock().mockResolvedValue({
          data: {
            login: "testuser",
          },
        }),
      },
      rateLimit: {
        get: mock().mockResolvedValue({
          data: {
            rate: {
              limit: 5000,
              remaining: 4999,
              reset: Math.floor(Date.now() / 1000) + 3600,
            },
          },
        }),
      },
    },
    ...overrides,
  } as unknown as Octokit;
}

/**
 * Mock factory for GitHubService
 */
export function createMockGitHubService(
  overrides?: Partial<GitHubService>
): GitHubService {
  return {
    archiveRepository: mock().mockResolvedValue(undefined),
    validateRepository: mock().mockResolvedValue({
      exists: true,
      isArchived: false,
    }),
    getRateLimitStatus: mock().mockResolvedValue({
      limit: 5000,
      remaining: 4999,
      reset: new Date(),
    }),
    validateAuth: mock().mockResolvedValue("testuser"),
    ...overrides,
  } as unknown as GitHubService;
}

/**
 * Mock factory for AuthManager
 */
export function createMockAuthManager(
  overrides?: Partial<AuthManager>
): AuthManager {
  return {
    saveToken: mock().mockResolvedValue(undefined),
    getToken: mock().mockResolvedValue("test-token-123"),
    removeToken: mock().mockResolvedValue(undefined),
    validateToken: mock().mockResolvedValue({
      valid: true,
      user: "testuser",
    }),
    getStoredCredentials: mock().mockResolvedValue({
      token: "test-token-123",
      githubUser: "testuser",
      savedAt: new Date().toISOString(),
    }),
    ensureConfigDir: mock().mockResolvedValue(undefined),
    loadConfig: mock().mockResolvedValue({
      token: "test-token-123",
      concurrency: 3,
      timeout: 300,
      logLevel: "info",
      logDir: "/tmp/logs",
      configDir: "/tmp/config",
    }),
    ...overrides,
  } as unknown as AuthManager;
}

/**
 * Mock factory for Archiver
 */
export function createMockArchiver(overrides?: Partial<Archiver>): Archiver {
  return {
    archiveRepositories: mock().mockResolvedValue([
      {
        owner: "test",
        repo: "repo1",
        success: true,
        archived: true,
        duration: 100,
        message: "Success",
      },
    ]),
    getProgress: mock().mockReturnValue({
      completed: 1,
      failed: 0,
      total: 1,
    }),
    getSummary: mock().mockReturnValue({
      successful: 1,
      failed: 0,
      skipped: 0,
      totalDuration: 100,
    }),
    ...overrides,
  } as unknown as Archiver;
}

/**
 * Create test repository identifiers
 */
export function createTestRepository(
  owner = "testowner",
  repo = "testrepo"
): RepositoryIdentifier {
  return { owner, repo };
}

/**
 * Create test archive results
 */
export function createTestArchiveResult(
  overrides?: Partial<ArchiveResult>
): ArchiveResult {
  return {
    owner: "testowner",
    repo: "testrepo",
    success: true,
    archived: true,
    duration: 100,
    message: "Test result",
    ...overrides,
  };
}

/**
 * Create test archive error
 */
export function createTestArchiveError(
  overrides?: Partial<ArchiveError>
): ArchiveError {
  const error = new Error("Test error");
  return {
    ...error,
    code: "INVALID_URL",
    statusCode: undefined,
    retryable: false,
    ...overrides,
  } as unknown as ArchiveError;
}
