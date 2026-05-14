#!/usr/bin/env bun
/** Deterministic localhost metadata for project dev servers. */
import path from "node:path";
export function repoSlugFromCwd(cwd = process.cwd()) {
  return path
    .basename(cwd)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export function portForSlug(slug) {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return 3300 + (hash % 5000);
}
export function getDevLocalhostInfo(cwd = process.cwd()) {
  const slug = repoSlugFromCwd(cwd);
  const host = `${slug}.localhost`;
  const port = portForSlug(slug);
  return { slug, host, port, url: `https://${host}` };
}
if (import.meta.url === `file://${process.argv[1]}`)
  console.log(JSON.stringify(getDevLocalhostInfo(), null, 2));
