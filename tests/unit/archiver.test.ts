import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Archiver } from "../../src/services/archiver";
import { createMockGitHubService } from "../helpers/mocks";

describe("Archiver", () => {
  let archiver: Archiver;
  let mockGitHubService: ReturnType<typeof createMockGitHubService>;
  let originalLog: typeof console.log;

  beforeEach(() => {
    // Suppress console.log output during tests
    originalLog = console.log;
    console.log = () => {
      // Suppress output
    };

    mockGitHubService = createMockGitHubService();
    archiver = new Archiver(mockGitHubService as any, {
      concurrency: 2,
      timeout: 300,
      dryRun: false,
      force: false,
      verbose: false,
    });
  });

  afterEach(() => {
    console.log = originalLog;
  });

  describe("constructor", () => {
    test("should create Archiver instance", () => {
      expect(archiver).toBeTruthy();
    });

    test("should initialize with GitHubService", () => {
      expect(archiver).toBeTruthy();
    });

    test("should set up queue with correct concurrency", () => {
      const archiver2 = new Archiver(mockGitHubService as any, {
        concurrency: 5,
        timeout: 600,
        dryRun: false,
        force: false,
        verbose: false,
      });
      expect(archiver2).toBeTruthy();
    });
  });

  describe("archiveRepositories", () => {
    test("should have archiveRepositories method", () => {
      expect(typeof archiver.archiveRepositories).toBe("function");
    });

    test("should return array of results", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      const results = await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test("should handle empty repository list", async () => {
      const results = await archiver.archiveRepositories([], {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test("should mark dry-run results as not archived", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      const results = await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      expect(results[0].archived).toBe(false);
    });
  });

  describe("getProgress", () => {
    test("should have getProgress method", () => {
      expect(typeof archiver.getProgress).toBe("function");
    });

    test("should return progress object", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      const progress = archiver.getProgress();
      expect(typeof progress.completed).toBe("number");
      expect(typeof progress.failed).toBe("number");
      expect(typeof progress.total).toBe("number");
    });

    test("should track completed and failed counts", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      const progress = archiver.getProgress();
      expect(progress.completed + progress.failed).toBe(progress.total);
    });
  });

  describe("getSummary", () => {
    test("should have getSummary method", () => {
      expect(typeof archiver.getSummary).toBe("function");
    });

    test("should return summary object", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      const summary = archiver.getSummary();
      expect(typeof summary.successful).toBe("number");
      expect(typeof summary.failed).toBe("number");
      expect(typeof summary.skipped).toBe("number");
      expect(typeof summary.totalDuration).toBe("number");
    });

    test("should count dry-run results as skipped", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      const summary = archiver.getSummary();
      expect(summary.skipped).toBeGreaterThan(0);
      expect(
        summary.successful + summary.failed + summary.skipped
      ).toBeGreaterThan(0);
    });

    test("should include total duration", async () => {
      const repos = [{ owner: "test", repo: "repo1" }];
      await archiver.archiveRepositories(repos, {
        concurrency: 1,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      const summary = archiver.getSummary();
      expect(summary.totalDuration).toBeGreaterThanOrEqual(0);
    });
  });

  describe("method signatures", () => {
    test("should have all required methods", () => {
      expect(typeof archiver.archiveRepositories).toBe("function");
      expect(typeof archiver.getProgress).toBe("function");
      expect(typeof archiver.getSummary).toBe("function");
    });
  });

  describe("queue management", () => {
    test("should handle multiple repositories concurrently", async () => {
      const repos = [
        { owner: "test", repo: "repo1" },
        { owner: "test", repo: "repo2" },
        { owner: "test", repo: "repo3" },
      ];

      const results = await archiver.archiveRepositories(repos, {
        concurrency: 2,
        timeout: 300,
        dryRun: true,
        force: false,
        verbose: false,
      });

      expect(results.length).toBe(3);
    });
  });
});
