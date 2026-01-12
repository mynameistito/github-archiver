import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { createArchiveCommand } from "../../src/commands/archive";
import { createTempDir, cleanupTempDir } from "../helpers/temp-dir";

describe("Archive Command", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  });

  describe("createArchiveCommand", () => {
    test("should create archive command", () => {
      const command = createArchiveCommand();
      expect(command).toBeTruthy();
    });

    test("should have correct command name", () => {
      const command = createArchiveCommand();
      expect(command.name()).toBe("archive");
    });

    test("should have description", () => {
      const command = createArchiveCommand();
      const description = command.description();
      expect(description).toBeTruthy();
      expect(description).toContain("Archive");
    });
  });

  describe("command options", () => {
    test("should have options configured", () => {
      const command = createArchiveCommand();
      expect(command.options.length).toBeGreaterThan(0);
    });

    test("should have at least 5 options", () => {
      const command = createArchiveCommand();
      expect(command.options.length).toBeGreaterThanOrEqual(5);
    });

    test("should have options with descriptions", () => {
      const command = createArchiveCommand();
      for (const option of command.options) {
        const description = option.description;
        expect(typeof description).toBe("string");
        expect(description.length).toBeGreaterThan(0);
      }
    });

    test("options should include file, stdin, dry-run, concurrency, timeout", () => {
      const command = createArchiveCommand();
      const optionStrings = command.options.map((o) => o.flags);
      const allOptionsText = optionStrings.join(" ");

      expect(allOptionsText).toContain("file");
      expect(allOptionsText).toContain("stdin");
      expect(allOptionsText).toContain("dry-run");
      expect(allOptionsText).toContain("concurrency");
      expect(allOptionsText).toContain("timeout");
    });
  });

  describe("command validation", () => {
    test("should be executable", () => {
      const command = createArchiveCommand();
      expect(typeof command).toBe("object");
      expect(command).toBeTruthy();
    });

    test("should have proper structure", () => {
      const command = createArchiveCommand();
      expect(typeof command.name).toBe("function");
      expect(typeof command.description).toBe("function");
      expect(typeof command.option).toBe("function");
      expect(typeof command.action).toBe("function");
    });

    test("should have list of options as array", () => {
      const command = createArchiveCommand();
      expect(Array.isArray(command.options)).toBe(true);
    });

    test("each option should have flags and description", () => {
      const command = createArchiveCommand();
      for (const option of command.options) {
        expect(typeof option.flags).toBe("string");
        expect(typeof option.description).toBe("string");
      }
    });
  });

  describe("command defaults", () => {
    test("should have concurrency option", () => {
      const command = createArchiveCommand();
      const optionString = command.options.map((o) => o.flags).join(" ");
      expect(optionString).toContain("concurrency");
    });

    test("should have timeout option", () => {
      const command = createArchiveCommand();
      const optionString = command.options.map((o) => o.flags).join(" ");
      expect(optionString).toContain("timeout");
    });

    test("should have verbose and force options", () => {
      const command = createArchiveCommand();
      const optionString = command.options.map((o) => o.flags).join(" ");
      expect(optionString).toContain("verbose");
      expect(optionString).toContain("force");
    });
  });
});
