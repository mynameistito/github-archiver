import { build } from "esbuild";

// Build with esbuild for optimal compatibility and size
// Bun's build tool is also capable, but esbuild is mature and widely tested
await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: "dist/index.js",
  external: ["octokit", "commander", "p-queue", "winston", "open"],
  sourcemap: true,
  minify: true,
  logLevel: "info",
});

console.log("✓ Build complete: dist/index.js");
