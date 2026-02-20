export interface Config {
  concurrency: number;
  configDir: string;
  logDir: string;
  logLevel: "debug" | "info" | "warn" | "error";
  timeout: number;
  token?: string;
}

export interface StoredCredentials {
  githubUser?: string;
  savedAt: string;
  token: string;
}

export interface CommandOptions {
  concurrency: string;
  dryRun: boolean;
  file?: string;
  force: boolean;
  stdin?: boolean;
  timeout: string;
  verbose: boolean;
}
