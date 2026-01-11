import { homedir } from "node:os";
import { join } from "node:path";

const appDir = join(homedir(), ".github-archiver");

export const PATHS = {
  APP_DIR: appDir,
  CONFIG_FILE: join(appDir, "config.json"),
  LOG_DIR: join(appDir, "logs"),
  COMBINED_LOG: join(appDir, "logs", "combined.log"),
  ERROR_LOG: join(appDir, "logs", "errors.log"),
};
