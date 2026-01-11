import { Command } from "commander";
import { createArchiveCommand } from "./commands/archive";
import { createAuthCommand } from "./commands/auth";
import { PATHS } from "./constants/paths";
import { createLogger, initializeLogger, setLogger } from "./utils/logger";

const VERSION = "1.0.6";
const DESCRIPTION = "Archive GitHub repositories via CLI";

async function main() {
  try {
    await initializeLogger(PATHS.LOG_DIR);

    const fileLogger = createLogger();

    setLogger(fileLogger);

    const program = new Command();

    program
      .name("github-archiver")
      .description(DESCRIPTION)
      .version(VERSION, "-v, --version", "Display version");

    program.addCommand(createAuthCommand());
    program.addCommand(createArchiveCommand());

    program.addHelpCommand(true);

    await program.parseAsync(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ Fatal error: ${message}`);
    process.exit(1);
  }
}

main();
