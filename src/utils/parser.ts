import type { RepositoryIdentifier } from "../types";
import { ArchiveError, ErrorCode } from "../types";
import { getLogger } from "./logger";

const logger = getLogger();
const NAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;

const GITHUB_URL_PATTERNS: RegExp[] = [
  // https://github.com/owner/repo or https://github.com/owner/repo.git
  /^(?:https?:\/\/)?(?:www\.)?github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/)?$/i,
  // git@github.com:owner/repo.git or git@github.com:owner/repo
  /^git@github\.com:([\w.-]+)\/([\w.-]+?)(?:\.git)?$/i,
  // owner/repo (shorthand)
  /^([\w.-]+)\/([\w.-]+)$/,
];

function parseRepositoryUrl(url: string): RepositoryIdentifier {
  const trimmed = url.trim();

  if (!trimmed) {
    throw new ArchiveError(ErrorCode.INVALID_URL, "URL cannot be empty");
  }

  for (const pattern of GITHUB_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const owner = match[1];
      const repo = match[2];

      if (!(owner && repo)) {
        throw new ArchiveError(
          ErrorCode.INVALID_URL,
          `Invalid GitHub URL format: ${url}`
        );
      }

      if (!isValidName(owner)) {
        throw new ArchiveError(
          ErrorCode.INVALID_URL,
          `Invalid owner name: ${owner}. Owner names must contain only alphanumeric characters, hyphens, or periods.`
        );
      }

      if (!isValidName(repo)) {
        throw new ArchiveError(
          ErrorCode.INVALID_URL,
          `Invalid repository name: ${repo}. Repository names must contain only alphanumeric characters, hyphens, underscores, or periods.`
        );
      }

      const normalizedUrl = `https://github.com/${owner}/${repo}`;

      logger.debug("Parsed repository URL", {
        original: trimmed,
        owner,
        repo,
        normalized: normalizedUrl,
      });

      return {
        owner,
        repo,
        url: normalizedUrl,
      };
    }
  }

  throw new ArchiveError(ErrorCode.INVALID_URL, `Invalid GitHub URL: ${url}`);
}

function isValidName(name: string): boolean {
  return NAME_REGEX.test(name);
}

function parseRepositoriesBatch(urls: string[]): {
  valid: RepositoryIdentifier[];
  invalid: Array<{ url: string; error: string; line: number }>;
} {
  const valid: RepositoryIdentifier[] = [];
  const invalid: Array<{ url: string; error: string; line: number }> = [];

  for (const [index, url] of urls.entries()) {
    const lineNumber = index + 1;
    const trimmed = url.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    try {
      const parsed = parseRepositoryUrl(trimmed);
      valid.push(parsed);
      logger.debug(`Line ${lineNumber}: Valid repository`, {
        owner: parsed.owner,
        repo: parsed.repo,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      invalid.push({
        url: trimmed,
        error: errorMessage,
        line: lineNumber,
      });
      logger.warn(`Line ${lineNumber}: Invalid repository`, {
        url: trimmed,
        error: errorMessage,
      });
    }
  }

  logger.info("Batch parsing complete", {
    total: urls.length,
    valid: valid.length,
    invalid: invalid.length,
    skipped: urls.length - valid.length - invalid.length,
  });

  return { valid, invalid };
}

export const URLParser = {
  parseRepositoryUrl,
  parseRepositoriesBatch,
};
