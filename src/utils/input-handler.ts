import { promises as fs } from "node:fs";
import { createInterface } from "node:readline";
import type { RepositoryIdentifier } from "../types";
import { getLogger } from "./logger";
import { URLParser } from "./parser";

const logger = getLogger();

export class InputHandler {
  getRepositoriesFromInteractive(): Promise<{
    repos: RepositoryIdentifier[];
    errors: Array<{ url: string; error: string; line: number }>;
  }> {
    logger.info("Starting interactive CLI input for repositories");

    return new Promise((resolve) => {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      console.log("");
      console.log("📝 Enter repository URLs one at a time:");
      console.log(
        "   (Press CTRL+D to finish, or leave empty and press Enter to skip)"
      );
      console.log("");

      const urls: string[] = [];
      let lineNumber = 1;
      let isFinished = false;

      const promptNext = () => {
        rl.question(`[${lineNumber}] > `, (input) => {
          const trimmedInput = input.trim();

          if (trimmedInput === "") {
            lineNumber++;
            promptNext();
            return;
          }

          urls.push(trimmedInput);
          lineNumber++;
          promptNext();
        });
      };

      const finishInput = () => {
        if (isFinished) {
          return;
        }
        isFinished = true;
        rl.close();
        const result = URLParser.parseRepositoriesBatch(urls);

        if (result.invalid.length > 0) {
          logger.warn(`Found ${result.invalid.length} invalid repositories`, {
            errors: result.invalid,
          });
        }

        logger.info(`Parsed ${result.valid.length} valid repositories`);
        resolve({
          repos: result.valid,
          errors: result.invalid,
        });
      };

      rl.on("close", () => {
        finishInput();
      });

      promptNext();
    });
  }

  async getRepositoriesFromFile(filePath: string): Promise<{
    repos: RepositoryIdentifier[];
    errors: Array<{ url: string; error: string; line: number }>;
  }> {
    logger.info(`Reading repositories from file: ${filePath}`);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      const lines = content.split("\n");

      const result = URLParser.parseRepositoriesBatch(lines);

      if (result.invalid.length > 0) {
        logger.warn(`Found ${result.invalid.length} invalid entries in file`, {
          errors: result.invalid,
        });
      }

      logger.info(`Parsed ${result.valid.length} valid repositories from file`);
      return {
        repos: result.valid,
        errors: result.invalid,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to read file ${filePath}: ${message}`);
      throw new Error(`Failed to read file: ${message}`);
    }
  }

  getRepositoriesFromStdin(): Promise<{
    repos: RepositoryIdentifier[];
    errors: Array<{ url: string; error: string; line: number }>;
  }> {
    logger.info("Reading repositories from stdin");

    return new Promise((resolve) => {
      const lines: string[] = [];
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        const result = URLParser.parseRepositoriesBatch(lines);

        if (result.invalid.length > 0) {
          logger.warn(
            `Found ${result.invalid.length} invalid entries from stdin`,
            {
              errors: result.invalid,
            }
          );
        }

        logger.info(
          `Parsed ${result.valid.length} valid repositories from stdin`
        );
        resolve({
          repos: result.valid,
          errors: result.invalid,
        });
      });
    });
  }

  promptForConfirmation(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(`${message} [y/N]: `, (answer) => {
        rl.close();
        const confirmed = answer.toLowerCase() === "y";
        logger.info(`User confirmation: ${confirmed}`);
        resolve(confirmed);
      });
    });
  }
}
