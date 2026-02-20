export interface RepositoryIdentifier {
  owner: string;
  repo: string;
  url: string;
}

export interface ArchiveResult {
  archived: boolean;
  duration: number;
  error?: Error | string;
  message: string;
  owner: string;
  repo: string;
  success: boolean;
}

export interface ArchiveOptions {
  concurrency: number;
  dryRun: boolean;
  force: boolean;
  timeout: number;
  verbose: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

export interface GitHubError extends Error {
  code: string;
  status: number;
}
