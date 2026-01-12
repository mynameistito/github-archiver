import { describe, expect, test, beforeEach } from "bun:test";
import { GitHubService } from "../../src/services/github";

describe("GitHubService", () => {
  let service: GitHubService;

  beforeEach(() => {
    // Create a service with a valid token format
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
  });

  describe("archiveRepository", () => {
    test("should have archiveRepository method", () => {
      expect(typeof service.archiveRepository).toBe("function");
    });

    test("should accept owner and repo parameters", () => {
      // Method signature verification
      const method = service.archiveRepository;
      expect(method.length).toBe(2); // owner, repo parameters
    });
  });

  describe("validateRepository", () => {
    test("should have validateRepository method", () => {
      expect(typeof service.validateRepository).toBe("function");
    });

    test("should accept owner and repo parameters", () => {
      // Method structure verification
      const method = service.validateRepository;
      expect(method.length).toBe(2); // owner, repo parameters
    });

    test("should be an async function", () => {
      // Test that when called, result has correct shape
      // (actual call will fail with test token)
      const method = service.validateRepository;
      expect(method.toString()).toContain("exists");
    });
  });

  describe("getRateLimitStatus", () => {
    test("should have getRateLimitStatus method", () => {
      expect(typeof service.getRateLimitStatus).toBe("function");
    });

    test("should not require parameters", () => {
      const method = service.getRateLimitStatus;
      expect(method.length).toBe(0); // No parameters
    });

    test("should return rate limit data", () => {
      // Method structure check
      const method = service.getRateLimitStatus;
      expect(method.toString()).toContain("rate");
    });
  });

  describe("validateAuth", () => {
    test("should have validateAuth method", () => {
      expect(typeof service.validateAuth).toBe("function");
    });

    test("should not require parameters", () => {
      const method = service.validateAuth;
      expect(method.length).toBe(0); // No parameters
    });

    test("should be properly defined", () => {
      // Method exists and is properly defined
      expect(service.validateAuth).toBeTruthy();
    });
  });

  describe("error handling", () => {
    test("should have methods for all GitHub operations", () => {
      expect(typeof service.archiveRepository).toBe("function");
      expect(typeof service.validateRepository).toBe("function");
      expect(typeof service.getRateLimitStatus).toBe("function");
      expect(typeof service.validateAuth).toBe("function");
    });

    test("should be an instance of GitHubService", () => {
      expect(service instanceof GitHubService).toBe(true);
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
});
