import { describe, expect, test } from "bun:test";
import { createAuthCommand } from "../../src/commands/auth";

describe("Auth Command", () => {
  describe("createAuthCommand", () => {
    test("should create auth command", () => {
      const command = createAuthCommand();
      expect(command).toBeTruthy();
    });

    test("should have correct command name", () => {
      const command = createAuthCommand();
      expect(command.name()).toBe("auth");
    });

    test("should have description", () => {
      const command = createAuthCommand();
      const description = command.description();
      expect(description).toBeTruthy();
      expect(description.toLowerCase()).toContain("authentication");
    });

    test("should have subcommands", () => {
      const command = createAuthCommand();
      const subcommands = command.commands;
      expect(subcommands.length).toBe(4);
    });
  });

  describe("auth subcommands", () => {
    test("should have login subcommand", () => {
      const command = createAuthCommand();
      const subcommands = command.commands;
      const names = subcommands.map((c) => c.name());
      expect(names).toContain("login");
    });

    test("should have logout subcommand", () => {
      const command = createAuthCommand();
      const subcommands = command.commands;
      const names = subcommands.map((c) => c.name());
      expect(names).toContain("logout");
    });

    test("should have status subcommand", () => {
      const command = createAuthCommand();
      const subcommands = command.commands;
      const names = subcommands.map((c) => c.name());
      expect(names).toContain("status");
    });

    test("should have validate subcommand", () => {
      const command = createAuthCommand();
      const subcommands = command.commands;
      const names = subcommands.map((c) => c.name());
      expect(names).toContain("validate");
    });
  });

  describe("login subcommand", () => {
    test("should have login command with description", () => {
      const command = createAuthCommand();
      const loginCmd = command.commands.find((c) => c.name() === "login");
      expect(loginCmd).toBeTruthy();
      const desc = loginCmd?.description() || "";
      expect(desc.toLowerCase()).toContain("authentication");
    });
  });

  describe("logout subcommand", () => {
    test("should have logout command with description", () => {
      const command = createAuthCommand();
      const logoutCmd = command.commands.find((c) => c.name() === "logout");
      expect(logoutCmd).toBeTruthy();
      const desc = logoutCmd?.description() || "";
      expect(desc.toLowerCase()).toContain("remove");
    });
  });

  describe("status subcommand", () => {
    test("should have status command with description", () => {
      const command = createAuthCommand();
      const statusCmd = command.commands.find((c) => c.name() === "status");
      expect(statusCmd).toBeTruthy();
      const desc = statusCmd?.description() || "";
      expect(desc.toLowerCase()).toContain("status");
    });
  });

  describe("validate subcommand", () => {
    test("should have validate command with description", () => {
      const command = createAuthCommand();
      const validateCmd = command.commands.find((c) => c.name() === "validate");
      expect(validateCmd).toBeTruthy();
      const desc = validateCmd?.description() || "";
      expect(desc.toLowerCase()).toContain("validate");
    });
  });

  describe("command structure", () => {
    test("should be a valid Command instance", () => {
      const command = createAuthCommand();
      expect(typeof command.addCommand).toBe("function");
    });

    test("should have 4 subcommands total", () => {
      const command = createAuthCommand();
      expect(command.commands.length).toBe(4);
    });

    test("all subcommands should have names", () => {
      const command = createAuthCommand();
      for (const subcommand of command.commands) {
        expect(subcommand.name()).toBeTruthy();
      }
    });

    test("all subcommands should have descriptions", () => {
      const command = createAuthCommand();
      for (const subcommand of command.commands) {
        expect(subcommand.description()).toBeTruthy();
      }
    });
  });
});
