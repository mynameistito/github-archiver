import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { InputHandler } from "../../src/utils/input-handler";
import {
  createTempDir,
  cleanupTempDir,
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
  });

  describe("getRepositoriesFromStdin", () => {
    test("should return a promise for stdin input", () => {
      const handler = new InputHandler();
      const promise = handler.getRepositoriesFromStdin();

      expect(promise).toBeTruthy();
      expect(typeof promise.then).toBe("function");
    });
  });
});
