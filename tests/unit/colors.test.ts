import { describe, expect, test } from "bun:test";
import { Colors } from "../../src/utils/colors";

describe("Colors", () => {
  describe("color functions", () => {
    test("should apply success color", () => {
      const result = Colors.success("Success!");
      expect(result).toContain("Success!");
      expect(result.length).toBeGreaterThan("Success!".length);
    });

    test("should apply error color", () => {
      const result = Colors.error("Error!");
      expect(result).toContain("Error!");
      expect(result.length).toBeGreaterThan("Error!".length);
    });

    test("should apply warning color", () => {
      const result = Colors.warning("Warning!");
      expect(result).toContain("Warning!");
      expect(result.length).toBeGreaterThan("Warning!".length);
    });

    test("should apply info color", () => {
      const result = Colors.info("Info!");
      expect(result).toContain("Info!");
      expect(result.length).toBeGreaterThan("Info!".length);
    });

    test("should apply dim color", () => {
      const result = Colors.dim("Dimmed");
      expect(result).toContain("Dimmed");
      expect(result.length).toBeGreaterThan("Dimmed".length);
    });

    test("should apply bold color", () => {
      const result = Colors.bold("Bold");
      expect(result).toContain("Bold");
      expect(result.length).toBeGreaterThan("Bold".length);
    });

    test("should apply successBold color", () => {
      const result = Colors.successBold("Success!");
      expect(result).toContain("Success!");
      expect(result.length).toBeGreaterThan("Success!".length);
    });

    test("should apply errorBold color", () => {
      const result = Colors.errorBold("Error!");
      expect(result).toContain("Error!");
      expect(result.length).toBeGreaterThan("Error!".length);
    });

    test("should apply warningBold color", () => {
      const result = Colors.warningBold("Warning!");
      expect(result).toContain("Warning!");
      expect(result.length).toBeGreaterThan("Warning!".length);
    });
  });

  describe("table", () => {
    test("should format table rows", () => {
      const rows = ["Row 1", "Row 2", "Row 3"];
      const result = Colors.table(rows);

      expect(result).toContain("Row 1");
      expect(result).toContain("Row 2");
      expect(result).toContain("Row 3");
    });

    test("should add table borders", () => {
      const rows = ["Test"];
      const result = Colors.table(rows);

      expect(result).toContain("│");
    });

    test("should handle empty rows", () => {
      const result = Colors.table([]);
      expect(result).toBe("");
    });

    test("should handle single row", () => {
      const result = Colors.table(["Single"]);
      expect(result).toContain("Single");
      expect(result).toContain("│");
    });
  });

  describe("formatStatus", () => {
    test("should format success status with icon", () => {
      const result = Colors.formatStatus("success");
      expect(result).toContain("✅");
      expect(result.length).toBeGreaterThan(2);
    });

    test("should format error status with icon", () => {
      const result = Colors.formatStatus("error");
      expect(result).toContain("❌");
      expect(result.length).toBeGreaterThan(2);
    });

    test("should format warning status with icon", () => {
      const result = Colors.formatStatus("warning");
      expect(result).toContain("⚠️");
      expect(result.length).toBeGreaterThan(2);
    });

    test("should format info status with icon", () => {
      const result = Colors.formatStatus("info");
      expect(result).toContain("ℹ️");
      expect(result.length).toBeGreaterThan(2);
    });

    test("should apply appropriate colors to icons", () => {
      const success = Colors.formatStatus("success");
      const error = Colors.formatStatus("error");
      const warning = Colors.formatStatus("warning");
      const info = Colors.formatStatus("info");

      expect(success).not.toBe(error);
      expect(error).not.toBe(warning);
      expect(warning).not.toBe(info);
    });
  });
});
