import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPage,
  listCatalog,
  markdownHeaders,
  prefersMarkdown,
} from "../lib/md.mjs";

const root = join(fileURLToPath(new URL("..", import.meta.url)), "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

function send(response, status, headers, body) {
  response.writeHead(status, headers);
  response.end(body);
}

function serveFile(response, relative, extra = {}) {
  const full = join(root, normalize(relative).replace(/^(\.\.[/\\])+/, ""));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) {
    return false;
  }
  const ext = extname(full).toLowerCase();
  const body = readFileSync(full);
  send(response, 200, { "Content-Type": types[ext] || "application/octet-stream", ...extra }, body);
  return true;
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/api/md/_catalog" || pathname === "/api/md/_catalog/") {
    send(
      response,
      200,
      { "Content-Type": "application/json; charset=utf-8" },
      JSON.stringify({ pages: listCatalog() }, null, 2),
    );
    return;
  }

  if (pathname === "/api/md" || pathname === "/api/md/" || pathname.startsWith("/api/md/")) {
    const rest = pathname.replace(/^\/api\/md\/?/, "/");
    const page = getPage(rest === "/" ? "/" : rest);
    if (!page) {
      send(response, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Markdown twin not found.\n");
      return;
    }
    send(response, 200, markdownHeaders(page.html), page.body);
    return;
  }

  if (prefersMarkdown(request.headers.accept)) {
    const page = getPage(pathname);
    if (page) {
      send(response, 200, markdownHeaders(page.html), page.body);
      return;
    }
  }

  if (pathname.endsWith(".md")) {
    const page = getPage(pathname);
    if (page && serveFile(response, pathname.replace(/^\//, ""), markdownHeaders(page.html))) return;
  }

  if (pathname === "/") {
    if (serveFile(response, "index.html")) return;
  } else if (serveFile(response, pathname.replace(/^\//, ""))) {
    return;
  } else if (!extname(pathname)) {
    if (serveFile(response, "index.html")) return;
  }

  send(response, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Not found\n");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`preview-agent listening on http://127.0.0.1:${port}`);
});
