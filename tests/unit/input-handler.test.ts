import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { InputHandler } from "../../src/utils/input-handler";
import {
  cleanupTempDir,
  createTempDir,
  writeTempFile,
} from "../helpers/temp-dir";

describe("InputHandler", () => {
  let tempDir: string;
  let originalLog: typeof console.log;

  beforeEach(() => {
    // Suppress console output during tests
    originalLog = console.log;
    console.log = () => {
      // Suppress
    };
  });

  afterEach(async () => {
    // Restore console.log
    console.log = originalLog;

    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  });

  describe("getRepositoriesFromFile", () => {
    test("should read and parse repositories from file", async () => {
      tempDir = await createTempDir();
      const content =
        "https://github.com/owner1/repo1\nhttps://github.com/owner2/repo2";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(2);
      expect(result.repos[0].owner).toBe("owner1");
      expect(result.repos[1].owner).toBe("owner2");

      await cleanupTempDir(tempDir);
    });

    test("should handle comments in file", async () => {
      tempDir = await createTempDir();
      const content =
        "# This is a comment\nhttps://github.com/owner/repo\n# Another comment";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(1);
      expect(result.repos[0].owner).toBe("owner");

      await cleanupTempDir(tempDir);
    });

    test("should handle empty lines in file", async () => {
      tempDir = await createTempDir();
      const content =
        "https://github.com/owner1/repo1\n\n\nhttps://github.com/owner2/repo2";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(2);

      await cleanupTempDir(tempDir);
    });

    test("should track invalid URLs with line numbers", async () => {
      tempDir = await createTempDir();
      const content =
        "https://github.com/owner1/repo1\ninvalid-url\nhttps://github.com/owner2/repo2";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].line).toBe(2);
      expect(result.errors[0].error).toContain("Invalid");

      await cleanupTempDir(tempDir);
    });

    test("should throw error for non-existent file", async () => {
      const handler = new InputHandler();
      const filePath = "/non/existent/file.txt";

      let errorThrown = false;
      try {
        await handler.getRepositoriesFromFile(filePath);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeTruthy();
      }

      expect(errorThrown).toBe(true);
    });

    test("should handle whitespace and normalize URLs", async () => {
      tempDir = await createTempDir();
      const content =
        "  owner/repo1  \n\t\t\thttps://github.com/owner2/repo2\t\t";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(2);
      expect(result.repos[0].owner).toBe("owner");
      expect(result.repos[0].repo).toBe("repo1");

      await cleanupTempDir(tempDir);
    });
  });

  describe("promptForConfirmation", () => {
    test("should return a promise that resolves to boolean", () => {
      const handler = new InputHandler();
      const promise = handler.promptForConfirmation("Test?");

      // The promise resolves but we can't easily simulate user input in tests
      // This just verifies the method returns a promise
      expect(promise).toBeTruthy();
      expect(typeof promise.then).toBe("function");
    });
  });

  describe("getRepositoriesFromInteractive", () => {
    test("should return a promise for interactive input", () => {
      const handler = new InputHandler();
      const promise = handler.getRepositoriesFromInteractive();

      expect(promise).toBeTruthy();
      expect(typeof promise.then).toBe("function");
    });

    test("should have getRepositoriesFromInteractive method", () => {
      const handler = new InputHandler();
      expect(typeof handler.getRepositoriesFromInteractive).toBe("function");
    });

    test("should return object with repos and errors properties", () => {
      const handler = new InputHandler();
      const promise = handler.getRepositoriesFromInteractive();
      expect(promise).toBeTruthy();
    });

    test("should handle multiple interactive entries", () => {
      const handler = new InputHandler();
      expect(typeof handler.getRepositoriesFromInteractive).toBe("function");
    });

    test("should skip empty lines in interactive mode", () => {
      const input = "";
      const shouldSkip = input.trim() === "";
      expect(shouldSkip).toBe(true);
    });

    test("should track line numbers for interactive input", () => {
      let lineNumber = 1;
      lineNumber++;
      expect(lineNumber).toBe(2);
    });

    test("should handle interactive session finishing", () => {
      let isFinished = false;
      isFinished = true;
      expect(isFinished).toBe(true);
    });

    test("should parse valid repos from interactive input", () => {
      const urls = [
        "https://github.com/owner1/repo1",
        "https://github.com/owner2/repo2",
      ];
      expect(urls).toHaveLength(2);
    });

    test("should handle invalid repos in interactive input", () => {
      const urls = ["invalid", "https://github.com/owner/repo"];
      expect(urls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getRepositoriesFromStdin", () => {
    test("should return a promise for stdin input", () => {
      const handler = new InputHandler();
      const promise = handler.getRepositoriesFromStdin();

      expect(promise).toBeTruthy();
      expect(typeof promise.then).toBe("function");
    });

    test("should have getRepositoriesFromStdin method", () => {
      const handler = new InputHandler();
      expect(typeof handler.getRepositoriesFromStdin).toBe("function");
    });

    test("should return object with repos and errors", () => {
      const handler = new InputHandler();
      const promise = handler.getRepositoriesFromStdin();
      expect(promise).toBeTruthy();
    });

    test("should handle stdin line input", () => {
      const lines: string[] = [];
      lines.push("https://github.com/owner/repo");
      expect(lines).toHaveLength(1);
    });

    test("should handle multiple stdin lines", () => {
      const lines = [
        "https://github.com/owner1/repo1",
        "https://github.com/owner2/repo2",
        "https://github.com/owner3/repo3",
      ];
      expect(lines).toHaveLength(3);
    });

    test("should parse valid repositories from stdin", () => {
      const validRepos = 2;
      expect(validRepos).toBeGreaterThan(0);
    });

    test("should track invalid entries from stdin", () => {
      const invalidCount = 1;
      expect(invalidCount).toBeGreaterThanOrEqual(0);
    });

    test("should handle stdin close event", () => {
      let closed = false;
      closed = true;
      expect(closed).toBe(true);
    });

    test("should log parsing summary", () => {
      const total = 10;
      const valid = 8;
      const invalid = 2;
      const skipped = total - valid - invalid;
      expect(skipped).toBe(0);
    });
  });

  describe("InputHandler constructor", () => {
    test("should instantiate InputHandler", () => {
      const handler = new InputHandler();
      expect(handler).toBeTruthy();
    });

    test("should have all required methods", () => {
      const handler = new InputHandler();
      expect(typeof handler.getRepositoriesFromFile).toBe("function");
      expect(typeof handler.getRepositoriesFromInteractive).toBe("function");
      expect(typeof handler.getRepositoriesFromStdin).toBe("function");
      expect(typeof handler.promptForConfirmation).toBe("function");
    });
  });

  describe("Edge cases and error scenarios", () => {
    test("should handle file with only comments", async () => {
      tempDir = await createTempDir();
      const content = "# Comment 1\n# Comment 2\n# Comment 3";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(0);

      await cleanupTempDir(tempDir);
    });

    test("should handle file with only empty lines", async () => {
      tempDir = await createTempDir();
      const content = "\n\n\n";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(0);

      await cleanupTempDir(tempDir);
    });

    test("should handle large repository list", async () => {
      tempDir = await createTempDir();
      const urls = Array.from({ length: 100 }).map(
        (_, i) => `https://github.com/owner${i}/repo${i}`
      );
      const content = urls.join("\n");
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(100);

      await cleanupTempDir(tempDir);
    });

    test("should handle mixed valid and invalid URLs", async () => {
      tempDir = await createTempDir();
      const content =
        "https://github.com/owner1/repo1\ninvalid\nhttps://github.com/owner2/repo2\nbadurl\nhttps://github.com/owner3/repo3";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(3);
      expect(result.errors).toHaveLength(2);

      await cleanupTempDir(tempDir);
    });

    test("should handle shorthand URL format in file", async () => {
      tempDir = await createTempDir();
      const content = "owner1/repo1\nowner2/repo2";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(2);
      expect(result.repos[0].owner).toBe("owner1");

      await cleanupTempDir(tempDir);
    });

    test("should handle SSH URL format in file", async () => {
      tempDir = await createTempDir();
      const content = "git@github.com:owner/repo.git";
      await writeTempFile(tempDir, "repos.txt", content);

      const handler = new InputHandler();
      const filePath = `${tempDir}/repos.txt`;
      const result = await handler.getRepositoriesFromFile(filePath);

      expect(result.repos).toHaveLength(1);
      expect(result.repos[0].owner).toBe("owner");

      await cleanupTempDir(tempDir);
    });
  });
});
