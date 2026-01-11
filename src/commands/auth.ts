import { createInterface } from "node:readline";
import { Command } from "commander";
import { MESSAGES } from "../constants/messages";
import { PATHS } from "../constants/paths";
import { AuthManager } from "../services/auth-manager";
import { getLogger } from "../utils/logger";

const authManager = new AuthManager(PATHS.APP_DIR);

function createLoginCommand(): Command {
  return new Command("login")
    .description("Set up GitHub authentication with a Personal Access Token")
    .action(async () => {
      try {
        await authManager.ensureConfigDir();

        const token = await promptForToken();

        if (!token) {
          console.error("No token provided. Aborting.");
          process.exit(1);
        }

        console.log("Validating token...");
        await authManager.saveToken(token);

        const credentials = await authManager.getStoredCredentials();
        console.log(`✓ ${MESSAGES.AUTH_SUCCESS}`);
        console.log(`  User: ${credentials?.githubUser}`);

        getLogger().info("Token saved successfully", {
          user: credentials?.githubUser,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`✗ Error: ${message}`);
        getLogger().error("Failed to save token", { error: message });
        process.exit(1);
      }
    });
}

function createLogoutCommand(): Command {
  return new Command("logout")
    .description("Remove stored GitHub authentication token")
    .action(async () => {
      try {
        const credentials = await authManager.getStoredCredentials();

        if (!credentials) {
          console.log("No stored credentials found.");
          return;
        }

        const confirmed = await confirmAction(MESSAGES.CONFIRM_LOGOUT);

        if (!confirmed) {
          console.log("Cancelled.");
          return;
        }

        await authManager.removeToken();
        console.log(`✓ ${MESSAGES.TOKEN_REMOVED}`);
        getLogger().info("Token removed");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`✗ Error: ${message}`);
        getLogger().error("Failed to remove token", { error: message });
        process.exit(1);
      }
    });
}

function createStatusCommand(): Command {
  return new Command("status")
    .description("Check authentication status")
    .action(async () => {
      try {
        const token = await authManager.getToken();

        if (!token) {
          console.log("✗ Not authenticated");
          console.log(
            '  Run "github-archiver auth login" to set up authentication'
          );
          return;
        }

        console.log("✓ Authenticated");

        const validation = await authManager.validateToken(token);

        if (validation.valid) {
          console.log(`  User: ${validation.user}`);
          const credentials = await authManager.getStoredCredentials();
          if (credentials) {
            console.log(
              `  Saved at: ${new Date(credentials.savedAt).toLocaleString()}`
            );
          }
          getLogger().info("Authentication status check passed");
        } else {
          console.log("✗ Token is invalid or expired");
          getLogger().warn("Token validation failed");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`✗ Error: ${message}`);
        getLogger().error("Failed to check auth status", { error: message });
        process.exit(1);
      }
    });
}

function createValidateCommand(): Command {
  return new Command("validate")
    .description("Validate stored authentication token")
    .action(async () => {
      try {
        const token = await authManager.getToken();

        if (!token) {
          console.log("✗ No token found");
          process.exit(1);
        }

        console.log("Validating token...");
        const validation = await authManager.validateToken(token);

        if (validation.valid) {
          console.log(`✓ Token is valid (user: ${validation.user})`);
          getLogger().info("Token validation successful", {
            user: validation.user,
          });
        } else {
          console.log("✗ Token is invalid or expired");
          getLogger().warn("Token validation failed");
          process.exit(1);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`✗ Error: ${message}`);
        getLogger().error("Token validation error", { error: message });
        process.exit(1);
      }
    });
}

function promptForToken(): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(MESSAGES.ENTER_TOKEN, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function confirmAction(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${message} [y/N]: `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

export function createAuthCommand(): Command {
  return new Command("auth")
    .description("Manage GitHub authentication")
    .addCommand(createLoginCommand())
    .addCommand(createLogoutCommand())
    .addCommand(createStatusCommand())
    .addCommand(createValidateCommand());
}
