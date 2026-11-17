import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALIASES, PAGES, prefersMarkdown } from "../lib/md.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.jsx"), "utf8");

const privatePrefixes = ["/dashboard", "/login", "/signup", "/onboarding"];
const paths = [...app.matchAll(/path="([^"]+)"/g)].map((match) => match[1]);

const publicPaths = paths.filter((path) => {
  if (path === "*") return false;
  return !privatePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}:`));
});

const missing = [];
for (const path of publicPaths) {
  const staticPath = path.includes(":") ? null : path;
  if (!staticPath) continue;
  const canonical = ALIASES[staticPath] || staticPath;
  if (!PAGES[canonical]) missing.push(path);
}

if (missing.length) {
  console.error("Public routes missing a markdown renderer:", missing.join(", "));
  process.exit(1);
}

const cases = [
  [undefined, false],
  ["", false],
  ["*/*", false],
  ["text/html", false],
  ["text/html,application/xhtml+xml", false],
  ["text/markdown", true],
  ["text/markdown, text/html", false],
  ["text/markdown;q=0.9, text/html;q=0.8", true],
  ["text/html;q=0.9, text/markdown;q=0.1", false],
  ["text/plain, text/markdown;q=0.8", true],
];

for (const [header, expected] of cases) {
  const actual = prefersMarkdown(header);
  if (actual !== expected) {
    console.error(`prefersMarkdown(${JSON.stringify(header)}) was ${actual}, expected ${expected}`);
    process.exit(1);
  }
}

console.log(`ok: ${publicPaths.length} public routes have markdown twins; Accept negotiation checks passed`);
