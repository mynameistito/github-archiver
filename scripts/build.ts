import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "dist/index.js",
  external: ["octokit", "commander", "p-queue", "winston", "open"],
  sourcemap: true,
  minify: true,
});

console.log("✓ Build complete: dist/index.js");
