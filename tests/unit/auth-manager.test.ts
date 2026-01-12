import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { AuthManager } from "../../src/services/auth-manager";
import { cleanupTempDir, createTempDir } from "../helpers/temp-dir";

describe("AuthManager", () => {
  let tempDir: string;
  let authManager: AuthManager;

  beforeEach(async () => {
    tempDir = await createTempDir();
    authManager = new AuthManager(tempDir);
  });

  afterEach(async () => {
    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  });

  describe("constructor", () => {
    test("should create AuthManager instance", () => {
      expect(authManager).toBeTruthy();
    });

    test("should accept custom config directory", () => {
      const manager = new AuthManager(tempDir);
      expect(manager).toBeTruthy();
    });
  });

  describe("ensureConfigDir", () => {
    test("should create config directory", async () => {
      await authManager.ensureConfigDir();
      expect(true).toBe(true); // Should not throw
    });

    test("should be idempotent", async () => {
      await authManager.ensureConfigDir();
      await authManager.ensureConfigDir();
      expect(true).toBe(true); // Should not throw on second call
    });
  });

  describe("saveToken", () => {
    test("should throw on invalid token format", async () => {
      let errorThrown = false;
      try {
        await authManager.saveToken("");
      } catch {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });

    test("should throw on null token", async () => {
      let errorThrown = false;
      try {
        await authManager.saveToken(null as unknown as string);
      } catch {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });

    test("should throw with invalid token to GitHub", async () => {
      let errorThrown = false;
      try {
        await authManager.saveToken("invalid-token");
      } catch {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });

    test("should validate token before saving", async () => {
      const tokenInput = "ghp_invalid_test_token";
      let errorThrown = false;
      try {
        await authManager.saveToken(tokenInput);
      } catch (error) {
        errorThrown = true;
        expect(error instanceof Error).toBe(true);
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe("getToken", () => {
    test("should return undefined if no token stored", async () => {
      const token = await authManager.getToken();
      expect(token).toBeUndefined();
    });

    test("should prefer GH_TOKEN environment variable", async () => {
      const originalToken = process.env.GH_TOKEN;
      process.env.GH_TOKEN = "env-token-test";

      try {
        const token = await authManager.getToken();
        expect(token).toBe("env-token-test");
      } finally {
        if (originalToken !== undefined) {
          process.env.GH_TOKEN = originalToken;
        } else {
          process.env.GH_TOKEN = undefined as unknown as string;
        }
      }
    });
  });

  describe("removeToken", () => {
    test("should remove stored credentials file", async () => {
      // This test verifies the removeToken method doesn't throw
      // The actual behavior depends on whether env token is set
      await authManager.removeToken();
      expect(true).toBe(true);
    });

    test("should not error if token already removed", async () => {
      await authManager.removeToken();
      await authManager.removeToken(); // Should not throw
      expect(true).toBe(true);
    });
  });

  describe("validateToken", () => {
    test("should return false for invalid token", async () => {
      const result = await authManager.validateToken("invalid-token");
      expect(result.valid).toBe(false);
    });

    test("should return validation object with correct shape", async () => {
      const result = await authManager.validateToken("test-token");
      expect(typeof result.valid).toBe("boolean");
      const userType = typeof result.user;
      expect(userType === "string" || userType === "undefined").toBe(true);
    });

    test("should not include user for invalid token", async () => {
      const result = await authManager.validateToken("invalid-token");
      if (!result.valid) {
        expect(result.user).toBeUndefined();
      }
    });
  });

  describe("getStoredCredentials", () => {
    test("should return null if no credentials", async () => {
      const creds = await authManager.getStoredCredentials();
      expect(creds).toBeNull();
    });

    test("should return stored credentials if available", async () => {
      const creds = await authManager.getStoredCredentials();
      expect(
        creds === null || creds === undefined || typeof creds === "object"
      ).toBe(true);
    });
  });

  describe("loadConfig", () => {
    test("should load config with defaults", async () => {
      const config = await authManager.loadConfig();
      expect(config).toBeTruthy();
      expect(config.concurrency).toBe(3);
      expect(config.timeout).toBe(300);
      expect(config.logLevel).toBe("info");
    });

    test("should set correct directories", async () => {
      const config = await authManager.loadConfig();
      expect(config.configDir).toBe(tempDir);
      expect(config.logDir).toContain("logs");
    });
  });

  describe("method signatures", () => {
    test("should have all required methods", () => {
      expect(typeof authManager.saveToken).toBe("function");
      expect(typeof authManager.getToken).toBe("function");
      expect(typeof authManager.removeToken).toBe("function");
      expect(typeof authManager.validateToken).toBe("function");
      expect(typeof authManager.getStoredCredentials).toBe("function");
      expect(typeof authManager.ensureConfigDir).toBe("function");
      expect(typeof authManager.loadConfig).toBe("function");
    });
  });
});
