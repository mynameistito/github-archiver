import { describe, expect, it } from "vitest";
import { URLParser } from "../../src/utils/parser";

describe("URLParser", () => {
  describe("parseRepositoryUrl", () => {
    it("should parse HTTPS GitHub URLs", () => {
      const result = URLParser.parseRepositoryUrl(
        "https://github.com/owner/repo"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
      expect(result.url).toBe("https://github.com/owner/repo");
    });

    it("should parse HTTPS URLs with .git suffix", () => {
      const result = URLParser.parseRepositoryUrl(
        "https://github.com/owner/repo.git"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    it("should parse SSH URLs", () => {
      const result = URLParser.parseRepositoryUrl(
        "git@github.com:owner/repo.git"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    it("should parse shorthand owner/repo format", () => {
      const result = URLParser.parseRepositoryUrl("owner/repo");
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    it("should parse URLs with special characters in names", () => {
      const result = URLParser.parseRepositoryUrl("my-org/my-repo-123");
      expect(result.owner).toBe("my-org");
      expect(result.repo).toBe("my-repo-123");
    });

    it("should handle case-insensitive domains", () => {
      const result = URLParser.parseRepositoryUrl(
        "HTTPS://GITHUB.COM/owner/repo"
      );
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
    });

    it("should throw error for empty URL", () => {
      expect(() => URLParser.parseRepositoryUrl("")).toThrow();
    });

    it("should throw error for malformed URLs", () => {
      expect(() => URLParser.parseRepositoryUrl("invalid-url")).toThrow();
    });

    it("should throw error for missing repo name", () => {
      expect(() =>
        URLParser.parseRepositoryUrl("https://github.com/owner/")
      ).toThrow();
    });

    it("should normalize URLs to HTTPS format", () => {
      const http = URLParser.parseRepositoryUrl("http://github.com/owner/repo");
      const ssh = URLParser.parseRepositoryUrl("git@github.com:owner/repo.git");
      const short = URLParser.parseRepositoryUrl("owner/repo");

      expect(http.url).toBe("https://github.com/owner/repo");
      expect(ssh.url).toBe("https://github.com/owner/repo");
      expect(short.url).toBe("https://github.com/owner/repo");
    });
  });

  describe("parseRepositoriesBatch", () => {
    it("should parse multiple valid URLs", () => {
      const urls = [
        "https://github.com/owner1/repo1",
        "git@github.com:owner2/repo2.git",
        "owner3/repo3",
      ];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(3);
      expect(result.invalid).toHaveLength(0);
    });

    it("should skip empty lines", () => {
      const urls = ["owner/repo1", "", "owner/repo2", "  "];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    it("should skip comment lines", () => {
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

    it("should handle mixed valid and invalid URLs", () => {
      const urls = ["owner/repo1", "invalid", "owner/repo2", "also-invalid"];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(2);
    });

    it("should include line numbers in errors", () => {
      const urls = ["owner/repo1", "invalid", "owner/repo2"];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.invalid[0].line).toBe(2);
    });

    it("should handle empty batch", () => {
      const result = URLParser.parseRepositoriesBatch([]);

      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    it("should handle batch with only comments and whitespace", () => {
      const urls = ["# Comment", "", "  "];
      const result = URLParser.parseRepositoriesBatch(urls);

      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });
  });
});
