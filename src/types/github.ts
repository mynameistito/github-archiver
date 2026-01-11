export interface RepositoryIdentifier {
  owner: string;
  repo: string;
  url: string;
}

export interface ArchiveResult {
  owner: string;
  repo: string;
  success: boolean;
  archived: boolean;
  error?: Error | string;
  duration: number;
  message: string;
}

export interface ArchiveOptions {
  dryRun: boolean;
  concurrency: number;
  timeout: number;
  force: boolean;
  verbose: boolean;
}

export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}

export interface GitHubError extends Error {
  status: number;
  code: string;
}
