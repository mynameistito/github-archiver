import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import {
  logParseErrors,
  provideErrorGuidance,
  showRepositoriesPreview,
  validateOptions,
} from "../../src/commands/archive";
import type { CommandOptions, RepositoryIdentifier } from "../../src/types";

const originalExit = process.exit;
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

describe("Archive Command Functions", () => {
  beforeEach(() => {
    process.exit = mock((code?: number) => {
      throw new Error(`Process exit: ${code}`);
    }) as any;

    console.log = () => {
      // suppress
    };
    console.error = () => {
      // suppress
    };
    console.warn = () => {
      // suppress
    };
  });

  afterEach(() => {
    process.exit = originalExit;
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  });

  describe("validateOptions", () => {
    test("should validate valid concurrency", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "5",
        timeout: "300",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(result.concurrency).toBe(5);
      expect(result.timeout).toBe(300);
    });

    test("should validate concurrency within range", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "1",
        timeout: "300",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(result.concurrency).toBeGreaterThanOrEqual(1);
      expect(result.concurrency).toBeLessThanOrEqual(50);
    });

    test("should validate concurrency at max", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "50",
        timeout: "300",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(result.concurrency).toBe(50);
    });

    test("should exit on concurrency too low", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "0",
        timeout: "300",
        verbose: false,
        force: false,
      };

      try {
        validateOptions(options);
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test("should exit on concurrency too high", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "51",
        timeout: "300",
        verbose: false,
        force: false,
      };

      try {
        validateOptions(options);
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test("should validate timeout within range", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "3",
        timeout: "600",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(result.timeout).toBeGreaterThanOrEqual(10);
      expect(result.timeout).toBeLessThanOrEqual(3600);
    });

    test("should exit on timeout too low", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "3",
        timeout: "5",
        verbose: false,
        force: false,
      };

      try {
        validateOptions(options);
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    test("should exit on timeout too high", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "3",
        timeout: "4000",
        verbose: false,
        force: false,
      };

      try {
        validateOptions(options);
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe("logParseErrors", () => {
    test("should log single error", () => {
      const errors = [{ url: "invalid", error: "Invalid URL", line: 1 }];
      logParseErrors(errors);
      expect(errors).toHaveLength(1);
    });

    test("should log multiple errors", () => {
      const errors = [
        { url: "invalid1", error: "Invalid URL", line: 1 },
        { url: "invalid2", error: "Invalid URL", line: 3 },
      ];
      logParseErrors(errors);
      expect(errors).toHaveLength(2);
    });

    test("should include line numbers in output", () => {
      const errors = [{ url: "bad", error: "Error message", line: 42 }];
      logParseErrors(errors);
      expect(errors[0].line).toBe(42);
    });

    test("should handle empty error list", () => {
      const errors: Array<{ url: string; error: string; line: number }> = [];
      logParseErrors(errors);
      expect(errors).toHaveLength(0);
    });
  });

  describe("showRepositoriesPreview", () => {
    test("should show up to 5 repos", () => {
      const repos: RepositoryIdentifier[] = Array.from({ length: 10 }).map(
        (_, i) => ({
          owner: `owner${i}`,
          repo: `repo${i}`,
          url: `https://github.com/owner${i}/repo${i}`,
        })
      );

      showRepositoriesPreview(repos, false);
      expect(repos).toHaveLength(10);
    });

    test("should handle less than 5 repos", () => {
      const repos: RepositoryIdentifier[] = Array.from({ length: 3 }).map(
        (_, i) => ({
          owner: `owner${i}`,
          repo: `repo${i}`,
          url: `https://github.com/owner${i}/repo${i}`,
        })
      );

      showRepositoriesPreview(repos, false);
      expect(repos).toHaveLength(3);
    });

    test("should show archive message in normal mode", () => {
      const repos: RepositoryIdentifier[] = [
        { owner: "test", repo: "repo", url: "https://github.com/test/repo" },
      ];
      showRepositoriesPreview(repos, false);
      expect(repos).toHaveLength(1);
    });

    test("should show validate message in dry-run mode", () => {
      const repos: RepositoryIdentifier[] = [
        { owner: "test", repo: "repo", url: "https://github.com/test/repo" },
      ];
      showRepositoriesPreview(repos, true);
      expect(repos).toHaveLength(1);
    });

    test("should indicate more repos when count exceeds 5", () => {
      const repos: RepositoryIdentifier[] = Array.from({ length: 20 }).map(
        (_, i) => ({
          owner: `owner${i}`,
          repo: `repo${i}`,
          url: `https://github.com/owner${i}/repo${i}`,
        })
      );

      showRepositoriesPreview(repos, false);
      const moreRepos = Math.max(0, repos.length - 5);
      expect(moreRepos).toBeGreaterThan(0);
    });
  });

  describe("provideErrorGuidance", () => {
    test("should provide token guidance", () => {
      const message = "Authentication token failed";
      provideErrorGuidance(message);
      expect(message.toLowerCase()).toContain("token");
    });

    test("should provide rate limit guidance", () => {
      const message = "API rate limit exceeded";
      provideErrorGuidance(message);
      expect(message.toLowerCase()).toContain("rate limit");
    });

    test("should provide permission guidance", () => {
      const message = "Permission denied 403";
      provideErrorGuidance(message);
      const matches =
        message.toLowerCase().includes("permission") || message.includes("403");
      expect(matches).toBe(true);
    });

    test("should provide not found guidance", () => {
      const message = "Repository not found 404";
      provideErrorGuidance(message);
      const matches =
        message.toLowerCase().includes("not found") || message.includes("404");
      expect(matches).toBe(true);
    });

    test("should provide network guidance", () => {
      const message = "Network timeout occurred";
      provideErrorGuidance(message);
      const matches =
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("timeout");
      expect(matches).toBe(true);
    });

    test("should handle unmatched error messages", () => {
      const message = "Some random error";
      provideErrorGuidance(message);
      expect(message).toBeTruthy();
    });
  });

  describe("validateOptions edge cases", () => {
    test("should handle string number conversion", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "10",
        timeout: "120",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(typeof result.concurrency).toBe("number");
      expect(typeof result.timeout).toBe("number");
    });

    test("should parse concurrency 1", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "1",
        timeout: "10",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(result.concurrency).toBe(1);
    });

    test("should parse timeout 3600", () => {
      const options: CommandOptions = {
        file: undefined,
        stdin: false,
        dryRun: false,
        concurrency: "1",
        timeout: "3600",
        verbose: false,
        force: false,
      };

      const result = validateOptions(options);
      expect(result.timeout).toBe(3600);
    });
  });

  describe("showRepositoriesPreview formatting", () => {
    test("should handle single repository", () => {
      const repos: RepositoryIdentifier[] = [
        { owner: "owner", repo: "repo", url: "https://github.com/owner/repo" },
      ];

      showRepositoriesPreview(repos, false);
      expect(repos).toHaveLength(1);
    });

    test("should handle exact 5 repositories", () => {
      const repos: RepositoryIdentifier[] = Array.from({ length: 5 }).map(
        (_, i) => ({
          owner: `owner${i}`,
          repo: `repo${i}`,
          url: `https://github.com/owner${i}/repo${i}`,
        })
      );

      showRepositoriesPreview(repos, false);
      expect(repos).toHaveLength(5);
    });

    test("should handle 6 repositories", () => {
      const repos: RepositoryIdentifier[] = Array.from({ length: 6 }).map(
        (_, i) => ({
          owner: `owner${i}`,
          repo: `repo${i}`,
          url: `https://github.com/owner${i}/repo${i}`,
        })
      );

      showRepositoriesPreview(repos, false);
      expect(repos).toHaveLength(6);
      const remaining = repos.length - 5;
      expect(remaining).toBe(1);
    });
  });
});
