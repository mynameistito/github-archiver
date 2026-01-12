import { describe, expect, test } from "bun:test";
import { Formatting } from "../../src/utils/formatting";

describe("Formatting", () => {
  describe("formatDuration", () => {
    test("should format milliseconds", () => {
      expect(Formatting.formatDuration(500)).toBe("500ms");
    });

    test("should format seconds", () => {
      expect(Formatting.formatDuration(1500)).toBe("1.5s");
      expect(Formatting.formatDuration(5000)).toBe("5.0s");
    });

    test("should format minutes and seconds", () => {
      expect(Formatting.formatDuration(65_000)).toContain("m");
      expect(Formatting.formatDuration(120_000)).toBe("2m 0s");
    });

    test("should handle zero", () => {
      expect(Formatting.formatDuration(0)).toBe("0ms");
    });
  });

  describe("formatBytes", () => {
    test("should format bytes", () => {
      expect(Formatting.formatBytes(512)).toContain("B");
    });

    test("should format kilobytes", () => {
      expect(Formatting.formatBytes(5120)).toContain("KB");
    });

    test("should handle zero bytes", () => {
      expect(Formatting.formatBytes(0)).toBe("0 B");
    });
  });

  describe("formatPercent", () => {
    test("should format percentages", () => {
      expect(Formatting.formatPercent(1, 2)).toBe("50.0%");
      expect(Formatting.formatPercent(3, 4)).toBe("75.0%");
    });

    test("should handle zero total", () => {
      expect(Formatting.formatPercent(0, 0)).toBe("0%");
    });

    test("should handle full percentage", () => {
      expect(Formatting.formatPercent(100, 100)).toBe("100.0%");
    });
  });

  describe("createProgressBar", () => {
    test("should create a progress bar", () => {
      const bar = Formatting.createProgressBar(50, 100, 10);
      expect(bar).toContain("[");
      expect(bar).toContain("]");
      expect(bar).toContain("%");
    });

    test("should show 0% for zero progress", () => {
      const bar = Formatting.createProgressBar(0, 100);
      expect(bar).toContain("0%");
    });

    test("should show 100% for complete progress", () => {
      const bar = Formatting.createProgressBar(100, 100);
      expect(bar).toContain("100%");
    });

    test("should handle zero total", () => {
      const bar = Formatting.createProgressBar(0, 0);
      expect(bar).toBe("[ ]");
    });
  });

  describe("truncate", () => {
    test("should not truncate short strings", () => {
      expect(Formatting.truncate("hello", 10)).toBe("hello");
    });

    test("should truncate long strings", () => {
      const result = Formatting.truncate("hello world", 8);
      expect(result.length).toBeLessThanOrEqual(8);
      expect(result).toContain("...");
    });

    test("should handle exact length", () => {
      expect(Formatting.truncate("hello", 5)).toBe("hello");
    });
  });

  describe("centerText", () => {
    test("should center text with padding", () => {
      const result = Formatting.centerText("hello", 15);
      expect(result).toContain("hello");
      expect(result.length).toBeGreaterThanOrEqual(5);
    });

    test("should not add padding for small width", () => {
      const result = Formatting.centerText("hello", 3);
      expect(result).toBe("hello");
    });

    test("should handle zero width", () => {
      const result = Formatting.centerText("hello", 0);
      expect(result).toBe("hello");
    });

    test("should handle equal width and text length", () => {
      const result = Formatting.centerText("hello", 5);
      expect(result).toBe("hello");
    });
  });
});
