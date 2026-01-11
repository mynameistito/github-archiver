import { MESSAGES } from "../constants/messages";
import { ArchiveError, ErrorCode } from "../types";

export function isArchiveError(error: unknown): error is ArchiveError {
  return error instanceof ArchiveError;
}

export function getErrorMessage(error: unknown): string {
  if (isArchiveError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function createAuthError(
  message: string,
  statusCode?: number
): ArchiveError {
  return new ArchiveError(ErrorCode.INVALID_AUTH, message, statusCode, true);
}

export function createRepoNotFoundError(
  owner: string,
  repo: string
): ArchiveError {
  return new ArchiveError(
    ErrorCode.REPO_NOT_FOUND,
    `Repository ${owner}/${repo} not found`,
    404,
    false
  );
}

export function createAlreadyArchivedError(
  owner: string,
  repo: string
): ArchiveError {
  return new ArchiveError(
    ErrorCode.ALREADY_ARCHIVED,
    `Repository ${owner}/${repo} is already archived`,
    422,
    false
  );
}

export function createPermissionError(
  owner: string,
  repo: string
): ArchiveError {
  return new ArchiveError(
    ErrorCode.PERMISSION_DENIED,
    `Permission denied for ${owner}/${repo}. You must be the repository owner or have push access.`,
    403,
    false
  );
}

export function createRateLimitError(): ArchiveError {
  return new ArchiveError(
    ErrorCode.RATE_LIMITED,
    MESSAGES.RATE_LIMITED,
    429,
    true
  );
}

export function createNetworkError(message?: string): ArchiveError {
  return new ArchiveError(
    ErrorCode.NETWORK_ERROR,
    message || MESSAGES.NETWORK_ERROR,
    undefined,
    true
  );
}

export function createInvalidUrlError(url: string): ArchiveError {
  return new ArchiveError(ErrorCode.INVALID_URL, `Invalid GitHub URL: ${url}`);
}

export function createConfigError(message: string): ArchiveError {
  return new ArchiveError(ErrorCode.CONFIG_ERROR, message);
}

export function createFileError(message: string): ArchiveError {
  return new ArchiveError(ErrorCode.FILE_ERROR, message);
}

export function createEditorError(message: string): ArchiveError {
  return new ArchiveError(ErrorCode.EDITOR_ERROR, message);
}
