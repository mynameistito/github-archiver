import { describe, expect, test } from "bun:test";
import { ArchiveError, ErrorCode } from "../../src/types";
import {
  createAlreadyArchivedError,
  createAuthError,
  createConfigError,
  createEditorError,
  createFileError,
  createInvalidUrlError,
  createNetworkError,
  createPermissionError,
  createRateLimitError,
  createRepoNotFoundError,
  getErrorMessage,
  isArchiveError,
} from "../../src/utils/errors";

describe("Error utilities", () => {
  describe("isArchiveError", () => {
    test("should identify ArchiveError instances", () => {
      const error = new ArchiveError(ErrorCode.INVALID_AUTH, "Test error");
      expect(isArchiveError(error)).toBe(true);
    });

    test("should reject regular errors", () => {
      const error = new Error("Regular error");
      expect(isArchiveError(error)).toBe(false);
    });

    test("should reject non-error values", () => {
      expect(isArchiveError("string")).toBe(false);
      expect(isArchiveError(null)).toBe(false);
      expect(isArchiveError(undefined)).toBe(false);
    });
  });

  describe("getErrorMessage", () => {
    test("should extract message from ArchiveError", () => {
      const error = createAuthError("Auth failed");
      const message = getErrorMessage(error);
      expect(message).toContain("Auth failed");
    });

    test("should extract message from regular Error", () => {
      const error = new Error("Regular error message");
      const message = getErrorMessage(error);
      expect(message).toBe("Regular error message");
    });

    test("should convert non-error to string", () => {
      const message = getErrorMessage("String error");
      expect(message).toBe("String error");
    });

    test("should handle number values", () => {
      const message = getErrorMessage(42);
      expect(message).toBe("42");
    });
  });

  describe("createAuthError", () => {
    test("should create auth error with message", () => {
      const error = createAuthError("Invalid token");
      expect(isArchiveError(error)).toBe(true);
      expect(error.message).toContain("Invalid token");
      expect(error.code).toBe(ErrorCode.INVALID_AUTH);
    });

    test("should create auth error with status code", () => {
      const error = createAuthError("Unauthorized", 401);
      expect(error.statusCode).toBe(401);
    });

    test("should mark auth error as retryable", () => {
      const error = createAuthError("Token expired");
      expect(error.retryable).toBe(true);
    });
  });

  describe("createRepoNotFoundError", () => {
    test("should create repo not found error", () => {
      const error = createRepoNotFoundError("owner", "repo");
      expect(error.message).toContain("owner");
      expect(error.message).toContain("repo");
      expect(error.code).toBe(ErrorCode.REPO_NOT_FOUND);
    });

    test("should set correct status code", () => {
      const error = createRepoNotFoundError("owner", "repo");
      expect(error.statusCode).toBe(404);
    });

    test("should not be retryable", () => {
      const error = createRepoNotFoundError("owner", "repo");
      expect(error.retryable).toBe(false);
    });
  });

  describe("createAlreadyArchivedError", () => {
    test("should create already archived error", () => {
      const error = createAlreadyArchivedError("owner", "repo");
      expect(error.message).toContain("already archived");
      expect(error.code).toBe(ErrorCode.ALREADY_ARCHIVED);
    });

    test("should set status code to 422", () => {
      const error = createAlreadyArchivedError("owner", "repo");
      expect(error.statusCode).toBe(422);
    });
  });

  describe("createPermissionError", () => {
    test("should create permission error", () => {
      const error = createPermissionError("owner", "repo");
      expect(error.message).toContain("Permission denied");
      expect(error.code).toBe(ErrorCode.PERMISSION_DENIED);
    });

    test("should set status code to 403", () => {
      const error = createPermissionError("owner", "repo");
      expect(error.statusCode).toBe(403);
    });

    test("should explain permission requirements", () => {
      const error = createPermissionError("owner", "repo");
      expect(error.message).toContain("owner");
      expect(error.message).toContain("push access");
    });
  });

  describe("createRateLimitError", () => {
    test("should create rate limit error", () => {
      const error = createRateLimitError();
      expect(error.code).toBe(ErrorCode.RATE_LIMITED);
    });

    test("should mark as retryable", () => {
      const error = createRateLimitError();
      expect(error.retryable).toBe(true);
    });

    test("should have status code 429", () => {
      const error = createRateLimitError();
      expect(error.statusCode).toBe(429);
    });
  });

  describe("createNetworkError", () => {
    test("should create network error with custom message", () => {
      const error = createNetworkError("Connection timeout");
      expect(error.message).toContain("Connection timeout");
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    });

    test("should create network error with default message", () => {
      const error = createNetworkError();
      expect(error.message).toBeTruthy();
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    });

    test("should be retryable", () => {
      const error = createNetworkError();
      expect(error.retryable).toBe(true);
    });
  });

  describe("createInvalidUrlError", () => {
    test("should create invalid URL error", () => {
      const error = createInvalidUrlError("not-a-url");
      expect(error.message).toContain("not-a-url");
      expect(error.code).toBe(ErrorCode.INVALID_URL);
    });

    test("should not have status code", () => {
      const error = createInvalidUrlError("bad-url");
      expect(error.statusCode).toBeUndefined();
    });
  });

  describe("createConfigError", () => {
    test("should create config error", () => {
      const error = createConfigError("Invalid configuration");
      expect(error.message).toContain("Invalid configuration");
      expect(error.code).toBe(ErrorCode.CONFIG_ERROR);
    });
  });

  describe("createFileError", () => {
    test("should create file error", () => {
      const error = createFileError("File not found");
      expect(error.message).toContain("File not found");
      expect(error.code).toBe(ErrorCode.FILE_ERROR);
    });
  });

  describe("createEditorError", () => {
    test("should create editor error", () => {
      const error = createEditorError("Editor failed to open");
      expect(error.message).toContain("Editor failed to open");
      expect(error.code).toBe(ErrorCode.EDITOR_ERROR);
    });
  });
});
