import {
  canonicalize,
  getPage,
  listCatalog,
  markdownHeaders,
} from "../lib/md.mjs";

export default function handler(request, response) {
  const url = new URL(request.url, "https://subzro.vercel.app");
  const rawPath = url.searchParams.get("path");
  let pathname = rawPath
    ? `/${String(rawPath).replace(/^\/+/, "")}`
    : url.pathname.replace(/^\/api\/md\/?/, "/");

  if (pathname === "/" || pathname === "/_catalog" || url.pathname.endsWith("/_catalog") || rawPath === "_catalog") {
    if (pathname === "/_catalog" || rawPath === "_catalog" || url.pathname.endsWith("/_catalog")) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.status(200).send(JSON.stringify({ pages: listCatalog() }, null, 2));
      return;
    }
  }

  // /api/md or /api/md/ → homepage
  if (!rawPath && (url.pathname === "/api/md" || url.pathname === "/api/md/")) {
    pathname = "/";
  }

  const path = canonicalize(pathname || "/");
  if (path === "_catalog") {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.status(200).send(JSON.stringify({ pages: listCatalog() }, null, 2));
    return;
  }

  const page = getPage(path);
  if (!page) {
    response.status(404).setHeader("Content-Type", "text/plain; charset=utf-8");
    response.send("Markdown twin not found.\n");
    return;
  }

  const headers = markdownHeaders(page.html);
  for (const [key, value] of Object.entries(headers)) {
    response.setHeader(key, value);
  }
  response.status(200).send(page.body);
}
