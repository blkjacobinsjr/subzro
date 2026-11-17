import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAGES,
  ALIASES,
  aiTxt,
  llmsFullTxt,
  llmsTxt,
  robotsTxt,
  sitemapXml,
} from "../lib/md.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

writeFileSync(join(root, "llms.txt"), llmsTxt());
writeFileSync(join(root, "llms-full.txt"), llmsFullTxt());
writeFileSync(join(root, "ai.txt"), aiTxt());
writeFileSync(join(root, "robots.txt"), robotsTxt());
writeFileSync(join(root, "sitemap.xml"), sitemapXml());

for (const page of Object.values(PAGES)) {
  const filename = page.md.replace(/^\//, "");
  writeFileSync(join(root, filename), page.body);
}

// Alias .md files so /privacy-policy.md etc. are real public files too
for (const [alias, canonical] of Object.entries(ALIASES)) {
  const page = PAGES[canonical];
  const filename = `${alias.replace(/^\//, "")}.md`;
  writeFileSync(join(root, filename), page.body);
}

console.log("Wrote agent files to public/");
