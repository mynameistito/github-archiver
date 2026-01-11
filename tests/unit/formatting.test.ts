import { describe, expect, it } from "vitest";
import { Formatting } from "../../src/utils/formatting";

describe("Formatting", () => {
  describe("formatDuration", () => {
    it("should format milliseconds", () => {
      expect(Formatting.formatDuration(500)).toBe("500ms");
    });

    it("should format seconds", () => {
      expect(Formatting.formatDuration(1500)).toBe("1.5s");
      expect(Formatting.formatDuration(5000)).toBe("5.0s");
    });

    it("should format minutes and seconds", () => {
      expect(Formatting.formatDuration(65_000)).toContain("m");
      expect(Formatting.formatDuration(120_000)).toBe("2m 0s");
    });

    it("should handle zero", () => {
      expect(Formatting.formatDuration(0)).toBe("0ms");
    });
  });

  describe("formatBytes", () => {
    it("should format bytes", () => {
      expect(Formatting.formatBytes(512)).toContain("B");
    });

    it("should format kilobytes", () => {
      expect(Formatting.formatBytes(5120)).toContain("KB");
    });

    it("should handle zero bytes", () => {
      expect(Formatting.formatBytes(0)).toBe("0 B");
    });
  });

  describe("formatPercent", () => {
    it("should format percentages", () => {
      expect(Formatting.formatPercent(1, 2)).toBe("50.0%");
      expect(Formatting.formatPercent(3, 4)).toBe("75.0%");
    });

    it("should handle zero total", () => {
      expect(Formatting.formatPercent(0, 0)).toBe("0%");
    });

    it("should handle full percentage", () => {
      expect(Formatting.formatPercent(100, 100)).toBe("100.0%");
    });
  });

  describe("createProgressBar", () => {
    it("should create a progress bar", () => {
      const bar = Formatting.createProgressBar(50, 100, 10);
      expect(bar).toContain("[");
      expect(bar).toContain("]");
      expect(bar).toContain("%");
    });

    it("should show 0% for zero progress", () => {
      const bar = Formatting.createProgressBar(0, 100);
      expect(bar).toContain("0%");
    });

    it("should show 100% for complete progress", () => {
      const bar = Formatting.createProgressBar(100, 100);
      expect(bar).toContain("100%");
    });

    it("should handle zero total", () => {
      const bar = Formatting.createProgressBar(0, 0);
      expect(bar).toBe("[ ]");
    });
  });

  describe("truncate", () => {
    it("should not truncate short strings", () => {
      expect(Formatting.truncate("hello", 10)).toBe("hello");
    });

    it("should truncate long strings", () => {
      const result = Formatting.truncate("hello world", 8);
      expect(result.length).toBeLessThanOrEqual(8);
      expect(result).toContain("...");
    });

    it("should handle exact length", () => {
      expect(Formatting.truncate("hello", 5)).toBe("hello");
    });
  });
});
