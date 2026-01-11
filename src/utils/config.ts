import { promises as fs } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_CONCURRENCY,
  DEFAULT_LOG_LEVEL,
  DEFAULT_TIMEOUT,
} from "../constants/defaults";
import { PATHS } from "../constants/paths";
import type { Config, StoredCredentials } from "../types";
import { createConfigError, createFileError } from "./errors";

export class ConfigManager {
  private readonly configDir: string;
  private readonly configFile: string;

  constructor(configDir: string = PATHS.APP_DIR) {
    this.configDir = configDir;
    this.configFile = join(configDir, "config.json");
  }

  async loadConfig(): Promise<Config> {
    try {
      const token = process.env.GH_TOKEN;
      const fileCredentials = await this.loadFileCredentials();

      return {
        token: token || fileCredentials?.token,
        concurrency: DEFAULT_CONCURRENCY,
        timeout: DEFAULT_TIMEOUT,
        logLevel: DEFAULT_LOG_LEVEL,
        logDir: join(this.configDir, "logs"),
        configDir: this.configDir,
      };
    } catch (error) {
      throw createConfigError(
        `Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async saveConfig(credentials: StoredCredentials): Promise<void> {
    try {
      await this.ensureConfigDir();
      await fs.writeFile(
        this.configFile,
        JSON.stringify(credentials, null, 2),
        "utf-8"
      );
    } catch (error) {
      throw createFileError(
        `Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async ensureConfigDir(): Promise<void> {
    try {
      await fs.mkdir(this.configDir, { recursive: true });
    } catch (error) {
      throw createFileError(
        `Failed to create config directory: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async getStoredCredentials(): Promise<StoredCredentials | null> {
    try {
      const data = await fs.readFile(this.configFile, "utf-8");
      return JSON.parse(data) as StoredCredentials;
    } catch {
      return null;
    }
  }

  async removeStoredCredentials(): Promise<void> {
    try {
      await fs.unlink(this.configFile);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw createFileError(
          `Failed to remove stored credentials: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  private async loadFileCredentials(): Promise<StoredCredentials | null> {
    try {
      const data = await fs.readFile(this.configFile, "utf-8");
      return JSON.parse(data) as StoredCredentials;
    } catch {
      return null;
    }
  }
}
