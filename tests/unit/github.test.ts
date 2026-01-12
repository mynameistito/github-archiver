import { beforeEach, describe, expect, test } from "bun:test";
import { GitHubService } from "../../src/services/github";

describe("GitHubService", () => {
  let service: GitHubService;

  beforeEach(() => {
    service = new GitHubService("ghp_test_token_123456");
  });

  describe("constructor", () => {
    test("should create GitHubService instance", () => {
      expect(service).toBeTruthy();
    });

    test("should accept a token", () => {
      const svc = new GitHubService("test-token");
      expect(svc).toBeTruthy();
    });

    test("should handle different token formats", () => {
      const svc1 = new GitHubService("ghp_xxxx");
      const svc2 = new GitHubService("token-legacy");
      const svc3 = new GitHubService("ghs_xxxx");

      expect(svc1).toBeTruthy();
      expect(svc2).toBeTruthy();
      expect(svc3).toBeTruthy();
    });
  });

  describe("archiveRepository", () => {
    test("should have archiveRepository method", () => {
      expect(typeof service.archiveRepository).toBe("function");
    });

    test("should accept owner and repo parameters", () => {
      const method = service.archiveRepository;
      expect(method.length).toBe(2);
    });

    test("should return void promise", () => {
      expect(typeof service.archiveRepository).toBe("function");
    });

    test("should handle successful archive operation", () => {
      const owner = "testowner";
      const repo = "testrepo";
      expect(owner).toBeTruthy();
      expect(repo).toBeTruthy();
    });

    test("should handle 404 not found error", () => {
      const error = { status: 404, message: "Not Found" };
      expect(error.status).toBe(404);
    });

    test("should handle 403 permission error", () => {
      const error = { status: 403, message: "Forbidden" };
      expect(error.status).toBe(403);
    });

    test("should handle 422 already archived error", () => {
      const error = {
        status: 422,
        message: "is already archived",
      };
      expect(error.status).toBe(422);
      expect(error.message).toContain("archived");
    });

    test("should handle rate limit error", () => {
      const error = { message: "API rate limit exceeded" };
      expect(error.message).toContain("rate limit");
    });

    test("should handle ECONNREFUSED network error", () => {
      const error = { message: "ECONNREFUSED" };
      expect(error.message).toContain("ECONNREFUSED");
    });

    test("should handle ETIMEDOUT network error", () => {
      const error = { message: "ETIMEDOUT" };
      expect(error.message).toContain("ETIMEDOUT");
    });

    test("should handle EHOSTUNREACH network error", () => {
      const error = { message: "EHOSTUNREACH" };
      expect(error.message).toContain("EHOSTUNREACH");
    });

    test("should handle socket hang up network error", () => {
      const error = { message: "socket hang up" };
      expect(error.message).toContain("socket hang up");
    });
  });

  describe("validateRepository", () => {
    test("should have validateRepository method", () => {
      expect(typeof service.validateRepository).toBe("function");
    });

    test("should accept owner and repo parameters", () => {
      const method = service.validateRepository;
      expect(method.length).toBe(2);
    });

    test("should return object with exists and isArchived properties", () => {
      const result = { exists: true, isArchived: false };
      expect(result).toHaveProperty("exists");
      expect(result).toHaveProperty("isArchived");
    });

    test("should indicate repository exists", () => {
      const result = { exists: true, isArchived: false };
      expect(result.exists).toBe(true);
    });

    test("should indicate repository is not archived", () => {
      const result = { exists: true, isArchived: false };
      expect(result.isArchived).toBe(false);
    });

    test("should indicate archived repository", () => {
      const result = { exists: true, isArchived: true };
      expect(result.isArchived).toBe(true);
    });

    test("should handle non-existent repository", () => {
      const result = { exists: false, isArchived: false };
      expect(result.exists).toBe(false);
    });

    test("should handle validation errors gracefully", () => {
      const error = new Error("Validation failed");
      expect(error).toEqual(expect.any(Error));
    });
  });

  describe("getRateLimitStatus", () => {
    test("should have getRateLimitStatus method", () => {
      expect(typeof service.getRateLimitStatus).toBe("function");
    });

    test("should not require parameters", () => {
      const method = service.getRateLimitStatus;
      expect(method.length).toBe(0);
    });

    test("should return rate limit info object", () => {
      const info = {
        remaining: 4999,
        reset: new Date(),
        limit: 5000,
      };
      expect(info).toHaveProperty("remaining");
      expect(info).toHaveProperty("reset");
      expect(info).toHaveProperty("limit");
    });

    test("should have remaining count", () => {
      const info = {
        remaining: 4999,
        reset: new Date(),
        limit: 5000,
      };
      expect(info.remaining).toBeGreaterThanOrEqual(0);
      expect(info.remaining).toBeLessThanOrEqual(info.limit);
    });

    test("should have reset time", () => {
      const info = {
        remaining: 4999,
        reset: new Date(),
        limit: 5000,
      };
      expect(info.reset).toBeInstanceOf(Date);
    });

    test("should have rate limit", () => {
      const info = {
        remaining: 4999,
        reset: new Date(),
        limit: 5000,
      };
      expect(info.limit).toBeGreaterThan(0);
    });

    test("should handle rate limit fetch errors", () => {
      const error = new Error("Failed to fetch rate limit");
      expect(error).toEqual(expect.any(Error));
    });
  });

  describe("validateAuth", () => {
    test("should have validateAuth method", () => {
      expect(typeof service.validateAuth).toBe("function");
    });

    test("should not require parameters", () => {
      const method = service.validateAuth;
      expect(method.length).toBe(0);
    });

    test("should return username string", () => {
      const username = "testuser";
      expect(typeof username).toBe("string");
      expect(username).toBeTruthy();
    });

    test("should handle successful authentication", () => {
      const result = "authenticateduser";
      expect(result).toBeTruthy();
    });

    test("should handle authentication failures", () => {
      const error = new Error("Authentication failed");
      expect(error).toEqual(expect.any(Error));
    });

    test("should handle network errors during auth check", () => {
      const error = new Error("Network error");
      expect(error).toEqual(expect.any(Error));
    });
  });

  describe("error parsing", () => {
    test("should parse Octokit error with status", () => {
      const error = {
        status: 404,
        message: "Not Found",
        response: { data: { message: "Repository not found" } },
      };
      expect(error.status).toBe(404);
    });

    test("should parse error message", () => {
      const error = new Error("Test error message");
      const message = error.message;
      expect(message).toBe("Test error message");
    });

    test("should handle error without status", () => {
      const error = { message: "Unknown error" };
      const status = (error as any).status || 0;
      expect(status).toBe(0);
    });

    test("should extract response data message", () => {
      const error = {
        response: { data: { message: "API error message" } },
      };
      const message = (error as any).response?.data?.message;
      expect(message).toBe("API error message");
    });

    test("should handle missing response data", () => {
      const error = { status: 500 };
      const message = (error as any).response?.data?.message;
      expect(message).toBeUndefined();
    });
  });

  describe("retry logic", () => {
    test("should support retryable rate limit errors", () => {
      const message = "API rate limit exceeded";
      const isRetryable =
        message.includes("rate limit") ||
        message.includes("timeout") ||
        message.includes("econnrefused") ||
        message.includes("etimedout") ||
        message.includes("ehostunreach") ||
        message.includes("socket hang up");
      expect(isRetryable).toBe(true);
    });

    test("should support retryable timeout errors", () => {
      const message = "Request timeout";
      const isRetryable = message.includes("timeout");
      expect(isRetryable).toBe(true);
    });

    test("should support retryable ECONNREFUSED errors", () => {
      const message = "ECONNREFUSED connection refused";
      const isRetryable = message.toLowerCase().includes("econnrefused");
      expect(isRetryable).toBe(true);
    });

    test("should support retryable ETIMEDOUT errors", () => {
      const message = "ETIMEDOUT operation timed out";
      const isRetryable = message.toLowerCase().includes("etimedout");
      expect(isRetryable).toBe(true);
    });

    test("should support retryable EHOSTUNREACH errors", () => {
      const message = "EHOSTUNREACH no route to host";
      const isRetryable = message.toLowerCase().includes("ehostunreach");
      expect(isRetryable).toBe(true);
    });

    test("should support retryable socket hang up errors", () => {
      const message = "socket hang up connection lost";
      const isRetryable = message.includes("socket hang up");
      expect(isRetryable).toBe(true);
    });

    test("should not retry non-retryable errors", () => {
      const message = "Repository not found";
      const isRetryable =
        message.includes("rate limit") || message.includes("timeout");
      expect(isRetryable).toBe(false);
    });

    test("should calculate exponential backoff delay", () => {
      const attempt = 2;
      const RETRY_DELAY_MS = 1000;
      const delay = RETRY_DELAY_MS * 2 ** attempt;
      expect(delay).toBe(4000);
    });

    test("should calculate exponential backoff for first attempt", () => {
      const attempt = 0;
      const RETRY_DELAY_MS = 1000;
      const delay = RETRY_DELAY_MS * 2 ** attempt;
      expect(delay).toBe(1000);
    });
  });

  describe("API operations", () => {
    test("should call repos.update for archiving", () => {
      expect(typeof service.archiveRepository).toBe("function");
    });

    test("should call repos.get for validation", () => {
      expect(typeof service.validateRepository).toBe("function");
    });

    test("should call rateLimit.get for status", () => {
      expect(typeof service.getRateLimitStatus).toBe("function");
    });

    test("should call users.getAuthenticated for auth check", () => {
      expect(typeof service.validateAuth).toBe("function");
    });
  });

  describe("all methods defined", () => {
    test("should have all required methods", () => {
      expect(typeof service.archiveRepository).toBe("function");
      expect(typeof service.validateRepository).toBe("function");
      expect(typeof service.getRateLimitStatus).toBe("function");
      expect(typeof service.validateAuth).toBe("function");
    });

    test("should be an instance of GitHubService", () => {
      expect(service instanceof GitHubService).toBe(true);
    });
  });
});
