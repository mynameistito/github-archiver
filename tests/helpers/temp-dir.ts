import { promises as fs } from "node:fs";
import { mkdtemp, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Create a temporary directory for testing
 */
export async function createTempDir(): Promise<string> {
  const tempPath = await mkdtemp(join(tmpdir(), "github-archiver-test-"));
  return tempPath;
}

/**
 * Clean up temporary directory
 */
export async function cleanupTempDir(dir: string): Promise<void> {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await cleanupTempDir(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }
    await rmdir(dir);
  } catch (error) {
    // Ignore if directory doesn't exist
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      throw error;
    }
  }
}

/**
 * Write a test file to temp directory
 */
export async function writeTempFile(
  dir: string,
  filename: string,
  content: string
): Promise<string> {
  const filePath = join(dir, filename);
  await fs.writeFile(filePath, content, "utf-8");
  return filePath;
}

/**
 * Read a file from temp directory
 */
export async function readTempFile(
  dir: string,
  filename: string
): Promise<string> {
  const filePath = join(dir, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}

/**
 * Check if a file exists in temp directory
 */
export async function tempFileExists(
  dir: string,
  filename: string
): Promise<boolean> {
  const filePath = join(dir, filename);
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    // File doesn't exist or other stat error
    return false;
  }
}
