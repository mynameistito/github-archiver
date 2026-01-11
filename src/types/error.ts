export const ErrorCode = {
  INVALID_AUTH: "INVALID_AUTH",
  REPO_NOT_FOUND: "REPO_NOT_FOUND",
  ALREADY_ARCHIVED: "ALREADY_ARCHIVED",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  RATE_LIMITED: "RATE_LIMITED",
  NETWORK_ERROR: "NETWORK_ERROR",
  INVALID_URL: "INVALID_URL",
  PARSE_ERROR: "PARSE_ERROR",
  EDITOR_ERROR: "EDITOR_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
  FILE_ERROR: "FILE_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class ArchiveError extends Error {
  code: ErrorCode;
  statusCode?: number;
  retryable: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode?: number,
    retryable = false
  ) {
    super(message);
    this.name = "ArchiveError";
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    Object.setPrototypeOf(this, ArchiveError.prototype);
  }
}
