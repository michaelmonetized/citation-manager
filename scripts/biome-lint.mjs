#!/usr/bin/env bun
/** Biome lint wrapper that maps ESLint-style --fix to Biome --write. */
export function buildBiomeArgs(args) {
  const biomeArgs = ["check", "."];
  for (const arg of args) {
    biomeArgs.push(arg === "--fix" ? "--write" : arg);
  }
  return biomeArgs;
}
export async function runBiomeLint(args, spawnCommand = Bun.spawn) {
  const proc = spawnCommand(["biome", ...buildBiomeArgs(args)], { stderr: "inherit", stdout: "inherit" });
  return proc.exited;
}
if (import.meta.url === `file://${process.argv[1]}`) process.exit(await runBiomeLint(process.argv.slice(2)));
