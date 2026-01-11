export interface Config {
  token?: string;
  concurrency: number;
  timeout: number;
  logLevel: "debug" | "info" | "warn" | "error";
  logDir: string;
  configDir: string;
}

export interface StoredCredentials {
  token: string;
  savedAt: string;
  githubUser?: string;
}

export interface CommandOptions {
  file?: string;
  stdin?: boolean;
  dryRun: boolean;
  concurrency: string;
  timeout: string;
  verbose: boolean;
  force: boolean;
}
