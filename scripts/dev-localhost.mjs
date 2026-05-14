#!/usr/bin/env bun
/** Starts Next.js on deterministic local HTTPS host via Caddy. */
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  ensureCaddyImport,
  ensureCaddyLoaded,
  writeProjectSnippet,
} from "./dev-localhost-caddy.mjs";
import { getDevLocalhostInfo } from "./dev-localhost-info.mjs";
export function startDevLocalhost(cwd = process.cwd()) {
  const { host, port, url, slug } = getDevLocalhostInfo(cwd);
  const caddyfilePath = path.join(os.homedir(), ".local", "etc", "Caddyfile");
  const snippetsDir = path.join(os.homedir(), ".local", "etc", "caddy", "dev-sites");
  const snippetPath = path.join(snippetsDir, `${slug}.caddy`);
  mkdirSync(path.dirname(caddyfilePath), { recursive: true });
  mkdirSync(snippetsDir, { recursive: true });
  ensureCaddyImport(caddyfilePath, snippetsDir);
  writeProjectSnippet(snippetPath, host, port);
  ensureCaddyLoaded(caddyfilePath);
  console.log(`[dev-localhost] ${url} -> 127.0.0.1:${port}`);
  const child = spawn(
    path.join(cwd, "node_modules", ".bin", "next"),
    ["dev", "--hostname", "127.0.0.1", "--port", String(port)],
    { stdio: "inherit", env: { ...process.env, DEV_HOST: host, DEV_URL: url, PORT: String(port) } },
  );
  child.on("exit", (code, signal) =>
    signal ? process.kill(process.pid, signal) : process.exit(code ?? 0),
  );
  return child;
}
if (import.meta.url === `file://${process.argv[1]}`) startDevLocalhost();
