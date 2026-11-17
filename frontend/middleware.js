import {
  canonicalize,
  getPage,
  prefersMarkdown,
} from "./lib/md.mjs";

export const config = {
  matcher: [
    "/",
    "/pricing",
    "/privacy",
    "/privacy-policy",
    "/terms",
    "/terms-and-conditions",
    "/impressum",
    "/imprint",
    "/refund",
    "/refund-policy",
  ],
};

export default function middleware(request) {
  if (!prefersMarkdown(request.headers.get("accept"))) {
    return;
  }

  const url = new URL(request.url);
  const page = getPage(canonicalize(url.pathname));
  if (!page) return;

  url.pathname = page.md;
  return new Response(null, {
    headers: {
      "x-middleware-rewrite": url.toString(),
    },
  });
}
