import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

/**
 * Generates a changeset file for Dependabot PRs
 *
 * Usage: tsx generate-dependabot-changeset.ts <pr-title> [output-dir]
 *
 * Example:
 *   tsx generate-dependabot-changeset.ts "Bump commander from 14.0.0 to 14.1.0"
 */

async function generateChangesetFile(
  prTitle: string,
  outputDir = ".changeset"
): Promise<void> {
  if (!prTitle) {
    throw new Error("PR title is required");
  }

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Check if any changeset already exists in the directory
    const files = await fs.readdir(outputDir);
    const existingChangesets = files.filter(
      (file) => file.endsWith(".md") && file !== "README.md"
    );

    if (existingChangesets.length > 0) {
      console.log(
        `ℹ️  Changeset already exists: ${existingChangesets[0]}. Skipping generation.`
      );
      process.exit(0);
    }

    // Generate unique filename using UUID + timestamp
    const timestamp = Date.now();
    const uuid = randomUUID().split("-")[0]; // Use first part of UUID for brevity
    const filename = `${uuid}-${timestamp}.md`;
    const filepath = path.join(outputDir, filename);

    // Create changeset content in the correct format
    const frontmatter = '---\n"github-archiver": patch\n---\n';
    const changesetContent = `${frontmatter}\n${prTitle}\n`;

    // Write the changeset file
    await fs.writeFile(filepath, changesetContent, "utf8");

    console.log(`✅ Generated changeset: ${filename}`);
    console.log("📝 Content:");
    console.log(changesetContent);

    process.exit(0);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error generating changeset:", errorMessage);
    process.exit(1);
  }
}

// Get PR title from command line argument
const prTitle = process.argv[2];
const outputDir = process.argv[3] || ".changeset";

generateChangesetFile(prTitle, outputDir);
