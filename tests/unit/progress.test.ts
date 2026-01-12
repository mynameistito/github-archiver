import { describe, expect, test } from "bun:test";
import { ProgressDisplay } from "../../src/utils/progress";

describe("ProgressDisplay", () => {
  describe("constructor", () => {
    test("should initialize with current time", () => {
      const display = new ProgressDisplay();
      expect(display).toBeTruthy();
    });
  });

  describe("shouldUpdate", () => {
    test("should return true on first call", () => {
      const display = new ProgressDisplay();
      expect(display.shouldUpdate()).toBe(true);
    });

    test("should return false on immediate second call", () => {
      const display = new ProgressDisplay();
      display.shouldUpdate();
      const shouldUpdate = display.shouldUpdate();
      expect(shouldUpdate).toBe(false);
    });

    test("should return true after interval passes", async () => {
      const display = new ProgressDisplay();
      display.shouldUpdate();

      // Wait for update interval
      await new Promise((resolve) => setTimeout(resolve, 550));

      const shouldUpdate = display.shouldUpdate();
      expect(shouldUpdate).toBe(true);
    });
  });

  describe("getProgressBar", () => {
    test("should create progress bar with completed work", () => {
      const display = new ProgressDisplay();
      const bar = display.getProgressBar({
        completed: 50,
        failed: 0,
        total: 100,
      });

      expect(bar).toContain("[");
      expect(bar).toContain("]");
      expect(bar).toContain("50/100");
      expect(bar).toContain("50%");
    });

    test("should show 0% for zero progress", () => {
      const display = new ProgressDisplay();
      const bar = display.getProgressBar({
        completed: 0,
        failed: 0,
        total: 100,
      });

      expect(bar).toContain("0%");
    });

    test("should show 100% for complete progress", () => {
      const display = new ProgressDisplay();
      const bar = display.getProgressBar({
        completed: 100,
        failed: 0,
        total: 100,
      });

      expect(bar).toContain("100%");
    });

    test("should include current repository if provided", () => {
      const display = new ProgressDisplay();
      const bar = display.getProgressBar({
        completed: 50,
        failed: 0,
        total: 100,
        current: {
          owner: "facebook",
          repo: "react",
        },
      });

      expect(bar).toContain("facebook");
      expect(bar).toContain("react");
    });

    test("should exclude current repository if not provided", () => {
      const display = new ProgressDisplay();
      const bar = display.getProgressBar({
        completed: 50,
        failed: 0,
        total: 100,
      });

      expect(bar).not.toContain("owner");
      expect(bar).not.toContain("repo");
    });
  });

  describe("getSummaryBox", () => {
    test("should create summary box with correct layout", () => {
      const display = new ProgressDisplay();
      const summary = display.getSummaryBox({
        successful: 50,
        failed: 2,
        skipped: 3,
        totalDuration: 120_000,
      });

      expect(summary).toContain("Archive Operation Summary");
      expect(summary).toContain("50");
      expect(summary).toContain("2");
      expect(summary).toContain("3");
    });

    test("should include success count", () => {
      const display = new ProgressDisplay();
      const summary = display.getSummaryBox({
        successful: 42,
        failed: 0,
        skipped: 0,
        totalDuration: 0,
      });

      expect(summary).toContain("✅");
      expect(summary).toContain("42");
    });

    test("should include failed count", () => {
      const display = new ProgressDisplay();
      const summary = display.getSummaryBox({
        successful: 0,
        failed: 5,
        skipped: 0,
        totalDuration: 0,
      });

      expect(summary).toContain("❌");
      expect(summary).toContain("5");
    });

    test("should include skipped count", () => {
      const display = new ProgressDisplay();
      const summary = display.getSummaryBox({
        successful: 0,
        failed: 0,
        skipped: 10,
        totalDuration: 0,
      });

      expect(summary).toContain("⚠️");
      expect(summary).toContain("10");
    });

    test("should include total and duration", () => {
      const display = new ProgressDisplay();
      const summary = display.getSummaryBox({
        successful: 50,
        failed: 2,
        skipped: 3,
        totalDuration: 120_000,
      });

      expect(summary).toContain("Total:");
      expect(summary).toContain("55");
      expect(summary).toContain("Duration:");
      expect(summary).toContain("m");
    });

    test("should format with box drawing characters", () => {
      const display = new ProgressDisplay();
      const summary = display.getSummaryBox({
        successful: 1,
        failed: 0,
        skipped: 0,
        totalDuration: 1000,
      });

      expect(summary).toContain("╔");
      expect(summary).toContain("╗");
      expect(summary).toContain("║");
      expect(summary).toContain("╚");
    });
  });

  describe("getElapsedTime", () => {
    test("should return formatted elapsed time", () => {
      const display = new ProgressDisplay();
      const elapsed = display.getElapsedTime();

      expect(elapsed).toBeTruthy();
      expect(elapsed).toContain("m");
    });

    test("should return a string value", async () => {
      const display = new ProgressDisplay();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const elapsed = display.getElapsedTime();
      expect(typeof elapsed).toBe("string");
      expect(elapsed.length).toBeGreaterThan(0);
    });
  });

  describe("getEstimatedTimeRemaining", () => {
    test("should return null when no progress", () => {
      const display = new ProgressDisplay();
      const estimated = display.getEstimatedTimeRemaining(0, 100);

      expect(estimated).toBeNull();
    });

    test("should estimate remaining time with progress", async () => {
      const display = new ProgressDisplay();

      // Wait a bit to establish a baseline
      await new Promise((resolve) => setTimeout(resolve, 50));

      const estimated = display.getEstimatedTimeRemaining(1, 100);
      expect(estimated).toBeTruthy();
    });

    test("should return null when completed", () => {
      const display = new ProgressDisplay();
      const estimated = display.getEstimatedTimeRemaining(100, 100);

      expect(estimated).toBeNull();
    });

    test("should return positive estimate for incomplete work", async () => {
      const display = new ProgressDisplay();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const estimated = display.getEstimatedTimeRemaining(10, 100);
      expect(estimated).toBeTruthy();
    });
  });
});
