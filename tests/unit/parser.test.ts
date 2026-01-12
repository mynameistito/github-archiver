import { describe, expect, test } from "bun:test";
import { URLParser } from "../../src/utils/parser";

describe("URLParser", () => {
  describe("parseRepositoryUrl", () => {
    test("should parse HTTPS GitHub URLs", () => {
      const result = URLParser.parseRepositoryUrl(
        "https://github.com/owner/repo"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
      expect(result.url).toBe("https://github.com/owner/repo");
    });

    test("should parse HTTPS URLs with .git suffix", () => {
      const result = URLParser.parseRepositoryUrl(
        "https://github.com/owner/repo.git"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    test("should parse SSH URLs", () => {
      const result = URLParser.parseRepositoryUrl(
        "git@github.com:owner/repo.git"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    test("should parse shorthand owner/repo format", () => {
      const result = URLParser.parseRepositoryUrl("owner/repo");
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    test("should parse URLs with special characters in names", () => {
      const result = URLParser.parseRepositoryUrl("my-org/my-repo-123");
      expect(result.owner).toBe("my-org");
      expect(result.repo).toBe("my-repo-123");
    });

    test("should handle case-insensitive domains", () => {
      const result = URLParser.parseRepositoryUrl(
        "HTTPS://GITHUB.COM/owner/repo"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    test("should throw error for empty URL", () => {
      expect(() => URLParser.parseRepositoryUrl("")).toThrow();
    });

    test("should throw error for malformed URLs", () => {
      expect(() => URLParser.parseRepositoryUrl("invalid-url")).toThrow();
    });

    test("should throw error for missing repo name", () => {
      expect(() =>
        URLParser.parseRepositoryUrl("https://github.com/owner/")
      ).toThrow();
    });

    test("should normalize URLs to HTTPS format", () => {
      const http = URLParser.parseRepositoryUrl("http://github.com/owner/repo");
      const ssh = URLParser.parseRepositoryUrl("git@github.com:owner/repo.git");
      const short = URLParser.parseRepositoryUrl("owner/repo");

      expect(http.url).toBe("https://github.com/owner/repo");
      expect(ssh.url).toBe("https://github.com/owner/repo");
      expect(short.url).toBe("https://github.com/owner/repo");
    });

    test("should throw error for invalid owner name", () => {
      expect(() => URLParser.parseRepositoryUrl("-invalid/repo")).toThrow();
      expect(() => URLParser.parseRepositoryUrl("@owner/repo")).toThrow();
    });

    test("should throw error for invalid repo name", () => {
      expect(() => URLParser.parseRepositoryUrl("owner/-invalid")).toThrow();
      expect(() => URLParser.parseRepositoryUrl("owner/repo!")).toThrow();
    });

    test("should handle whitespace in URL", () => {
      const result = URLParser.parseRepositoryUrl("  owner/repo  ");
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    test("should parse URLs with www subdomain", () => {
      const result = URLParser.parseRepositoryUrl(
        "https://www.github.com/owner/repo"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    test("should parse URLs with trailing slash", () => {
      const result = URLParser.parseRepositoryUrl(
        "https://github.com/owner/repo/"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });
  });

  describe("parseRepositoriesBatch", () => {
    test("should parse multiple valid URLs", () => {
      const urls = [
        "https://github.com/owner1/repo1",
        "git@github.com:owner2/repo2.git",
        "owner3/repo3",
      ];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(3);
      expect(result.invalid).toHaveLength(0);
    });

    test("should skip empty lines", () => {
      const urls = ["owner/repo1", "", "owner/repo2", "  "];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    test("should skip comment lines", () => {
      const urls = [
        "# This is a comment",
        "owner/repo1",
        "# Another comment",
        "owner/repo2",
      ];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    test("should handle mixed valid and invalid URLs", () => {
      const urls = ["owner/repo1", "invalid", "owner/repo2", "also-invalid"];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(2);
    });

    test("should include line numbers in errors", () => {
      const urls = ["owner/repo1", "invalid", "owner/repo2"];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.invalid[0].line).toBe(2);
    });

    test("should handle empty batch", () => {
      const result = URLParser.parseRepositoriesBatch([]);

      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    test("should handle batch with only comments and whitespace", () => {
      const urls = ["# Comment", "", "  "];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    test("should capture error messages for invalid entries", () => {
      const urls = ["invalid-url-without-slash"];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0].error).toBeTruthy();
      expect(result.invalid[0].url).toBe("invalid-url-without-slash");
    });

    test("should provide line numbers for all invalid entries", () => {
      const urls = [
        "https://github.com/owner/repo",
        "bad1",
        "bad2",
        "https://github.com/owner2/repo2",
        "bad3",
      ];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.invalid).toHaveLength(3);
      expect(result.invalid[0].line).toBe(2);
      expect(result.invalid[1].line).toBe(3);
      expect(result.invalid[2].line).toBe(5);
    });

    test("should log debug messages for valid repositories", () => {
      const urls = ["owner/repo"];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(1);
      expect(result.valid[0].owner).toBe("owner");
    });

    test("should handle URL with underscores", () => {
      const result = URLParser.parseRepositoryUrl("owner_name/repo_name");
      expect(result.owner).toBe("owner_name");
      expect(result.repo).toBe("repo_name");
    });

    test("should handle URL with dots", () => {
      const result = URLParser.parseRepositoryUrl("owner.name/repo.name");
      expect(result.owner).toBe("owner.name");
      expect(result.repo).toBe("repo.name");
    });

    test("should reject owner starting with hyphen", () => {
      expect(() => URLParser.parseRepositoryUrl("-owner/repo")).toThrow();
    });

    test("should reject owner ending with hyphen", () => {
      expect(() => URLParser.parseRepositoryUrl("owner-/repo")).toThrow();
    });

    test("should reject repo starting with hyphen", () => {
      expect(() => URLParser.parseRepositoryUrl("owner/-repo")).toThrow();
    });

    test("should reject repo ending with hyphen", () => {
      expect(() => URLParser.parseRepositoryUrl("owner/repo-")).toThrow();
    });

    test("should provide batch summary in results", () => {
      const urls = ["owner1/repo1", "invalid", "owner2/repo2", "# comment", ""];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(1);
    });
  });

  describe("URL validation edge cases", () => {
    test("should handle single character owner and repo", () => {
      const result = URLParser.parseRepositoryUrl("a/b");
      expect(result.owner).toBe("a");
      expect(result.repo).toBe("b");
    });

    test("should handle numeric owner and repo", () => {
      const result = URLParser.parseRepositoryUrl("123/456");
      expect(result.owner).toBe("123");
      expect(result.repo).toBe("456");
    });

    test("should accept owner with double hyphen", () => {
      const result = URLParser.parseRepositoryUrl("own--er/repo");
      expect(result.owner).toBe("own--er");
    });

    test("should accept owner with single hyphen in middle", () => {
      const result = URLParser.parseRepositoryUrl("own-er/repo");
      expect(result.owner).toBe("own-er");
    });

    test("should accept repo with underscores and dots", () => {
      const result = URLParser.parseRepositoryUrl("owner/repo_with.dots");
      expect(result.repo).toBe("repo_with.dots");
    });

    test("should throw when both owner and repo are missing", () => {
      expect(() => URLParser.parseRepositoryUrl("///")).toThrow();
    });

    test("should throw when repo is missing after slash", () => {
      expect(() => URLParser.parseRepositoryUrl("owner/")).toThrow();
    });

    test("should validate owner name format", () => {
      expect(() => URLParser.parseRepositoryUrl("@invalid/repo")).toThrow();
    });

    test("should validate repo name format", () => {
      expect(() => URLParser.parseRepositoryUrl("owner/!invalid")).toThrow();
    });
  });
});
