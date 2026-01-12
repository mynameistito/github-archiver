import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import {
  createTempDir,
  cleanupTempDir,
  writeTempFile,
} from "../helpers/temp-dir";
import { ConfigManager } from "../../src/utils/config";

describe("ConfigManager", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  });

  describe("ensureConfigDir", () => {
    test("should create config directory", async () => {
      const manager = new ConfigManager(tempDir);
      await manager.ensureConfigDir();

      const stat = await fs.stat(tempDir);
      expect(stat.isDirectory()).toBe(true);
    });

    test("should not error if directory exists", async () => {
      const manager = new ConfigManager(tempDir);
      await manager.ensureConfigDir();
      await manager.ensureConfigDir(); // Should not throw

      expect(true).toBe(true);
    });
  });

  describe("saveConfig", () => {
    test("should save credentials to config file", async () => {
      const manager = new ConfigManager(tempDir);
      const credentials = {
        token: "test-token-123",
        githubUser: "testuser",
        savedAt: new Date().toISOString(),
      };

      await manager.saveConfig(credentials);

      const configFile = join(tempDir, "config.json");
      const content = await fs.readFile(configFile, "utf-8");
      const parsed = JSON.parse(content);

      expect(parsed.token).toBe("test-token-123");
      expect(parsed.githubUser).toBe("testuser");
    });

    test("should create config directory if not exists", async () => {
      const newDir = join(tempDir, "nested", "config");
      const manager = new ConfigManager(newDir);

      const credentials = {
        token: "token",
        githubUser: "user",
        savedAt: new Date().toISOString(),
      };

      await manager.saveConfig(credentials);

      const configFileNew = join(newDir, "config.json");
      const stat = await fs.stat(configFileNew);
      expect(stat.isFile()).toBe(true);
    });

    test("should format JSON with indentation", async () => {
      const manager = new ConfigManager(tempDir);
      const credentials = {
        token: "token",
        githubUser: "user",
        savedAt: "2024-01-01T00:00:00Z",
      };

      await manager.saveConfig(credentials);

      const configFileIndent = join(tempDir, "config.json");
      const content = await fs.readFile(configFileIndent, "utf-8");

      expect(content).toContain("\n");
      expect(content).toContain("  ");
    });
  });

  describe("getStoredCredentials", () => {
    test("should retrieve stored credentials", async () => {
      const manager = new ConfigManager(tempDir);
      const credentials = {
        token: "test-token",
        githubUser: "testuser",
        savedAt: new Date().toISOString(),
      };

      await manager.saveConfig(credentials);
      const retrieved = await manager.getStoredCredentials();

      expect(retrieved).not.toBeNull();
      expect(retrieved?.token).toBe("test-token");
      expect(retrieved?.githubUser).toBe("testuser");
    });

    test("should return null if no credentials file exists", async () => {
      const manager = new ConfigManager(tempDir);
      const retrieved = await manager.getStoredCredentials();

      expect(retrieved).toBeNull();
    });

    test("should handle invalid JSON gracefully", async () => {
      await writeTempFile(tempDir, "config.json", "invalid json {");

      const manager = new ConfigManager(tempDir);
      const retrieved = await manager.getStoredCredentials();

      expect(retrieved).toBeNull();
    });
  });

  describe("removeStoredCredentials", () => {
    test("should remove credentials file", async () => {
      const manager = new ConfigManager(tempDir);
      const credentials = {
        token: "token",
        githubUser: "user",
        savedAt: new Date().toISOString(),
      };

      await manager.saveConfig(credentials);
      const configFileRm = join(tempDir, "config.json");

      const existsBefore = await fs
        .stat(configFileRm)
        .then(() => true)
        .catch(() => false);
      expect(existsBefore).toBe(true);

      await manager.removeStoredCredentials();

      const existsAfter = await fs
        .stat(configFileRm)
        .then(() => true)
        .catch(() => false);
      expect(existsAfter).toBe(false);
    });

    test("should not error if file does not exist", async () => {
      const manager = new ConfigManager(tempDir);
      await manager.removeStoredCredentials(); // Should not throw

      expect(true).toBe(true);
    });
  });

  describe("loadConfig", () => {
    test("should load config with defaults", async () => {
      const manager = new ConfigManager(tempDir);
      const config = await manager.loadConfig();

      expect(config).toBeTruthy();
      expect(config.concurrency).toBe(3);
      expect(config.timeout).toBe(300);
      expect(config.logLevel).toBe("info");
    });

    test("should set correct logDir and configDir", async () => {
      const manager = new ConfigManager(tempDir);
      const config = await manager.loadConfig();

      expect(config.configDir).toBe(tempDir);
      expect(config.logDir).toContain("logs");
    });
  });
});
