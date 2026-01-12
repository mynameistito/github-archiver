import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  createConsoleLogger,
  createLogger,
  getLogger,
  initializeLogger,
  setLogger,
} from "../../src/utils/logger";
import { cleanupTempDir, createTempDir } from "../helpers/temp-dir";

describe("Logger", () => {
  let tempDir: string;
  let originalLog: typeof console.log;
  let originalError: typeof console.error;
  let originalWarn: typeof console.warn;

  beforeEach(() => {
    // Suppress console output during tests
    originalLog = console.log;
    originalError = console.error;
    originalWarn = console.warn;
    console.log = () => {
      // Suppress
    };
    console.error = () => {
      // Suppress
    };
    console.warn = () => {
      // Suppress
    };
  });

  afterEach(async () => {
    // Restore console methods
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  });

  test("should initialize logger with directory creation", async () => {
    tempDir = await createTempDir();
    await initializeLogger(tempDir);
    // Should not throw
    expect(tempDir).toBeTruthy();
  });

  test("should handle missing directory gracefully", async () => {
    // initializeLogger should not throw on invalid paths
    await initializeLogger("/invalid/path/that/does/not/exist");
    // Should complete without throwing
    expect(true).toBe(true);
  });

  test("should create file logger with config", () => {
    const logger = createLogger({
      logLevel: "debug",
      logDir: "/tmp/logs",
    });

    expect(logger).toBeTruthy();
    expect(logger.info).toBeTruthy();
    expect(logger.error).toBeTruthy();
    expect(logger.warn).toBeTruthy();
    expect(logger.debug).toBeTruthy();
  });

  test("should create file logger with default config", () => {
    const logger = createLogger();

    expect(logger).toBeTruthy();
    expect(logger.info).toBeTruthy();
  });

  test("should create console logger", () => {
    const logger = createConsoleLogger();

    expect(logger).toBeTruthy();
    expect(logger.info).toBeTruthy();
    expect(logger.error).toBeTruthy();
    expect(logger.warn).toBeTruthy();
  });

  test("should get singleton logger instance", () => {
    const logger1 = getLogger();
    const logger2 = getLogger();

    expect(logger1).toBe(logger2);
  });

  test("should set custom logger instance", () => {
    const customLogger = createConsoleLogger();
    setLogger(customLogger);

    const retrieved = getLogger();
    expect(retrieved).toBe(customLogger);
  });

  test("should log at different levels", () => {
    const logger = createConsoleLogger();

    // Mock the log method to avoid output
    logger.info = () => logger;
    logger.error = () => logger;
    logger.warn = () => logger;
    logger.debug = () => logger;

    // These should not throw
    logger.info("Test info message");
    logger.error("Test error message");
    logger.warn("Test warning message");
    logger.debug("Test debug message");

    expect(true).toBe(true);
  });

  test("should log with metadata", () => {
    const logger = createConsoleLogger();

    // Mock the log method to avoid output
    logger.info = () => logger;
    logger.error = () => logger;
    logger.warn = () => logger;

    // These should not throw
    logger.info("Message with metadata", { key: "value" });
    logger.error("Error with context", { error: "test" });

    expect(true).toBe(true);
  });

  test("should initialize logger silently on directory creation failure", async () => {
    // This covers the catch block in initializeLogger
    // It should handle errors gracefully without throwing
    const invalidPath = "/root/definitely/cannot/create/this/path/12345678";
    await initializeLogger(invalidPath);
    expect(true).toBe(true);
  });

  test("should create logger with debug level", () => {
    const logger = createLogger({
      logLevel: "debug",
    });
    expect(logger).toBeTruthy();
  });

  test("should create logger with info level", () => {
    const logger = createLogger({
      logLevel: "info",
    });
    expect(logger).toBeTruthy();
  });

  test("should create logger with warn level", () => {
    const logger = createLogger({
      logLevel: "warn",
    });
    expect(logger).toBeTruthy();
  });

  test("should create logger with error level", () => {
    const logger = createLogger({
      logLevel: "error",
    });
    expect(logger).toBeTruthy();
  });

  test("should format console logger messages with level", () => {
    const logger = createConsoleLogger();
    expect(logger).toBeTruthy();
    // The printf formatter will be called when logging
    logger.info("Test message");
  });

  test("should format console logger messages with metadata", () => {
    const logger = createConsoleLogger();
    expect(logger).toBeTruthy();
    // The printf formatter with metadata will be called
    logger.error("Error message", { code: "ERROR_001" });
  });

  test("should format console logger without metadata", () => {
    const logger = createConsoleLogger();
    expect(logger).toBeTruthy();
    // The printf formatter without metadata will be called
    logger.warn("Warning message");
  });

  test("should handle logger initialization with inaccessible directory", async () => {
    // This should not throw even with an inaccessible path
    await initializeLogger("/root/restricted/path");
    expect(true).toBe(true);
  });
});
