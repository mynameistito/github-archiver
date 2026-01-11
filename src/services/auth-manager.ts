import { Octokit } from "octokit";
import { PATHS } from "../constants/paths";
import type { Config, StoredCredentials } from "../types";
import { ConfigManager } from "../utils/config";
import { createAuthError } from "../utils/errors";

export class AuthManager {
  private readonly configManager: ConfigManager;

  constructor(configDir: string = PATHS.APP_DIR) {
    this.configManager = new ConfigManager(configDir);
  }

  async saveToken(token: string): Promise<void> {
    if (!token || typeof token !== "string") {
      throw createAuthError("Invalid token format");
    }

    const octokit = new Octokit({ auth: token });

    try {
      const { data } = await octokit.rest.users.getAuthenticated();

      const credentials: StoredCredentials = {
        token,
        savedAt: new Date().toISOString(),
        githubUser: data.login,
      };

      await this.configManager.saveConfig(credentials);
    } catch (error) {
      throw createAuthError(
        `Failed to validate token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getToken(): Promise<string | undefined> {
    if (process.env.GH_TOKEN) {
      return process.env.GH_TOKEN;
    }

    const credentials = await this.configManager.getStoredCredentials();
    return credentials?.token;
  }

  async removeToken(): Promise<void> {
    await this.configManager.removeStoredCredentials();
  }

  async validateToken(
    token: string
  ): Promise<{ valid: boolean; user?: string }> {
    try {
      const octokit = new Octokit({ auth: token });
      const { data } = await octokit.rest.users.getAuthenticated();
      return {
        valid: true,
        user: data.login,
      };
    } catch (_error) {
      return {
        valid: false,
      };
    }
  }

  getStoredCredentials(): Promise<StoredCredentials | null> {
    return this.configManager.getStoredCredentials();
  }

  ensureConfigDir(): Promise<void> {
    return this.configManager.ensureConfigDir();
  }

  loadConfig(): Promise<Config> {
    return this.configManager.loadConfig();
  }
}
