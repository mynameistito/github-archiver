import { promises as fs } from "node:fs";
import winston from "winston";
import { DEFAULT_LOG_LEVEL } from "../constants/defaults";
import { PATHS } from "../constants/paths";
import type { Config } from "../types";

let loggerInstance: winston.Logger;

export async function initializeLogger(logDir: string): Promise<void> {
  try {
    await fs.mkdir(logDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create log directory:", error);
  }
}

export function createLogger(config?: Partial<Config>): winston.Logger {
  const level = config?.logLevel || DEFAULT_LOG_LEVEL;
  const logDir = config?.logDir || PATHS.LOG_DIR;

  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: "github-archiver" },
    transports: [
      new winston.transports.File({
        filename: `${logDir}/errors.log`,
        level: "error",
      }),
      new winston.transports.File({
        filename: `${logDir}/combined.log`,
      }),
    ],
  });
}

export function createConsoleLogger(): winston.Logger {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, ...metadata }) => {
        const meta = Object.keys(metadata).length
          ? JSON.stringify(metadata)
          : "";
        return `${level}: ${message} ${meta}`;
      })
    ),
    transports: [new winston.transports.Console()],
  });
}

export function getLogger(): winston.Logger {
  if (!loggerInstance) {
    loggerInstance = createLogger();
  }
  return loggerInstance;
}

export function setLogger(logger: winston.Logger): void {
  loggerInstance = logger;
}
