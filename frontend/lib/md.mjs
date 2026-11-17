export const SITE_URL = "https://subzro.vercel.app";

export const PUBLIC_HTML_ROUTES = [
  "/",
  "/pricing",
  "/privacy",
  "/terms",
  "/impressum",
  "/refund",
];

export const ALIASES = {
  "/privacy-policy": "/privacy",
  "/terms-and-conditions": "/terms",
  "/imprint": "/impressum",
  "/refund-policy": "/refund",
};

const BUSINESS = {
  legalName: "Jerry Schmalz",
  brand: "Subzro",
  street: "Berliner Str 12",
  city: "14169 Berlin",
  country: "Germany",
  email: "jr.a.schmalz@gmail.com",
  phone: "+49 160 97740241",
  website: SITE_URL,
};

function legalMarkdown(page) {
  const lines = [
    `# ${page.title}`,
    "",
    page.subtitle,
    "",
    page.updated,
    "",
  ];
  for (const section of page.sections) {
    lines.push(`## ${section.heading}`, "", section.body, "");
  }
  lines.push(
    `Source: ${page.htmlPath}`,
    `Markdown twin: ${page.mdPath}`,
  );
  return lines.join("\n") + "\n";
}

const imprint = legalMarkdown({
  title: "Imprint",
  subtitle: "Provider information under Section 5 DDG and Section 18 (2) MStV.",
  updated: "Updated February 17, 2026",
  htmlPath: `${SITE_URL}/impressum`,
  mdPath: `${SITE_URL}/impressum.md`,
  sections: [
    {
      heading: "Provider",
      body: `${BUSINESS.legalName} (sole proprietor), ${BUSINESS.brand}\n${BUSINESS.street}\n${BUSINESS.city}\n${BUSINESS.country}`,
    },
    {
      heading: "Contact",
      body: `Email: ${BUSINESS.email}\nPhone: ${BUSINESS.phone}`,
    },
    {
      heading: "Responsible for content",
      body: `Responsible according to Section 18 (2) MStV:\n${BUSINESS.legalName}\nAddress as above.`,
    },
    {
      heading: "Business activity",
      body: "Operation of a subscription management software service and freelance web development.",
    },
    {
      heading: "VAT information",
      body: "VAT ID according to Section 27a UStG: not provided.",
    },
    {
      heading: "Consumer dispute resolution",
      body: "We are not willing and not obliged to participate in dispute resolution proceedings before a consumer arbitration board (Section 36 VSBG).",
    },
    {
      heading: "EU online dispute platform",
      body: "The EU online dispute resolution platform was discontinued on July 20, 2025 under Regulation (EU) 2024/3228.",
    },
  ],
});

const terms = legalMarkdown({
  title: "Terms of Service",
  subtitle: "Contract terms for use of Subzro software services.",
  updated: "Updated February 17, 2026",
  htmlPath: `${SITE_URL}/terms`,
  mdPath: `${SITE_URL}/terms.md`,
  sections: [
    { heading: "Scope and provider", body: `${BUSINESS.brand} is provided by ${BUSINESS.legalName}. These terms apply to all users of ${BUSINESS.website}.` },
    { heading: "Account and contract conclusion", body: "A contract is formed when you complete sign up and, for paid plans, when checkout is completed successfully." },
    { heading: "Prices, billing, and renewal", body: "All prices shown at checkout are binding. Paid subscriptions renew automatically for the selected billing period unless canceled before renewal." },
    { heading: "Cancellation", body: "You can cancel through the billing portal or by email at any time. Access remains active until the end of the paid period unless a statutory withdrawal right applies." },
    { heading: "Consumer withdrawal rights", body: "For consumers, statutory withdrawal rights apply. Details are provided on the refund page, including the model withdrawal form." },
    { heading: "Acceptable use", body: "You must not misuse the service, interfere with security, or use the service for unlawful purposes." },
    { heading: "Availability and changes", body: "We may update features for security, legal compliance, and product improvement. We aim for high availability but do not guarantee uninterrupted operation." },
    { heading: "Liability", body: "Unlimited liability applies for intent, gross negligence, injury to life, body, or health, and mandatory statutory liability. Otherwise liability is limited to foreseeable, typical damage." },
    { heading: "Applicable law", body: "German law applies. Mandatory consumer protection rules of your country of residence remain unaffected." },
  ],
});

const privacy = legalMarkdown({
  title: "Privacy Policy",
  subtitle: "Information under Articles 13 and 14 GDPR.",
  updated: "Updated February 17, 2026",
  htmlPath: `${SITE_URL}/privacy`,
  mdPath: `${SITE_URL}/privacy.md`,
  sections: [
    { heading: "Controller", body: `${BUSINESS.legalName}\n${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.country}\nEmail: ${BUSINESS.email}` },
    { heading: "Data categories", body: "Account and contact data, authentication data, subscription records entered by users, usage logs, billing data, and support communication." },
    { heading: "Purposes and legal basis", body: "Contract performance (Art. 6(1)(b) GDPR), legal obligations (Art. 6(1)(c) GDPR), legitimate interests such as service security and abuse prevention (Art. 6(1)(f) GDPR), and consent where required (Art. 6(1)(a) GDPR)." },
    { heading: "Recipients", body: "Data is processed by hosting, database, authentication, email, analytics, and payment providers strictly as required to operate the service under data processing agreements where applicable." },
    { heading: "International transfers", body: "If data is transferred to countries outside the EEA, appropriate safeguards such as Standard Contractual Clauses are used." },
    { heading: "Storage periods", body: "Data is stored only as long as needed for contract fulfillment and statutory retention obligations. Then data is deleted or anonymized." },
    { heading: "Your rights", body: "You can request access, rectification, erasure, restriction, data portability, and object to processing. You can revoke consent at any time with future effect." },
    { heading: "Supervisory authority", body: "You have the right to lodge a complaint with a data protection authority, including the authority responsible for Berlin." },
  ],
});

const refund = legalMarkdown({
  title: "Refund and Withdrawal Policy",
  subtitle: "Consumer withdrawal rights, cancellations, and refunds.",
  updated: "Updated February 17, 2026",
  htmlPath: `${SITE_URL}/refund`,
  mdPath: `${SITE_URL}/refund.md`,
  sections: [
    { heading: "Statutory withdrawal right for consumers", body: "Consumers have a right of withdrawal within 14 days from contract conclusion. To exercise withdrawal, send a clear statement by email to the contact listed on this page." },
    { heading: "Expiry of withdrawal right", body: "For digital services, the withdrawal right may expire when service performance starts after your explicit consent and your acknowledgment that you lose the withdrawal right once performance begins (Section 356 BGB)." },
    { heading: "Cancellation of subscriptions", body: "Subscriptions can be canceled any time before the next renewal. Cancellation stops future renewals and remains active until the end of the current paid period." },
    { heading: "Refund handling", body: "If a valid withdrawal is declared in time, payments are refunded via the original payment method within 14 days. Outside statutory rights, refunds are granted only where legally required or as a voluntary goodwill decision." },
    { heading: "Model withdrawal form", body: `To: ${BUSINESS.email}\nI/We hereby withdraw from the contract concluded by me/us for the provision of the following service:\nOrdered on:\nName of consumer(s):\nAddress of consumer(s):\nDate:\nSignature (only if submitted on paper):` },
  ],
});

const indexMd = `# Subzro

Zero in on What Matters.

Your personal finance pet for subscriptions. Bring recurring costs and little usage check-ins together, then decide what still earns a spot in your list.

No bank connection needed to get started.

- [Get started](${SITE_URL}/signup)
- [Sign in](${SITE_URL}/login)
- [Pricing](${SITE_URL}/pricing)

## At a glance

- One place: See your recurring subscriptions together.
- Clear costs: Keep monthly spend easy to review.
- Your call: Choose what to keep, review, or cancel.

## What you can do with Subzro

See recurring costs, understand your usage, and make decisions with the full picture in view.

### Your full picture, one glance

See your active subscriptions and monthly spend on a single screen. Keep recurring costs easy to find and review.

### See what gets used

Review your most and least used subscriptions, then decide what still feels worth keeping.

### Understand where it goes

See your highest-spend categories and follow individual subscription costs over time as you update your list.

### Keep the list in your hands

Search and filter your subscriptions. Use each service's score to decide what stays, what needs a review, and what you want to cancel.

## A quiet check-in on what you use

Subzro can ask how often you use a subscription, so you can review it before deciding what to keep or cancel. The homepage includes an interactive usage demo of that check-in.

## Made for the subscriptions you juggle

One calm place to look across streaming, work, and the things you belong to.

- One clear list: Bring streaming services, work tools, and memberships together in one view.
- Usage-led reviews: Check how often you use a service before you decide what to keep or cancel.
- Start without a bank link: Add your subscriptions without connecting a bank account.

## How Subzro brings clarity

1. Add subscriptions. Enter the recurring services you want to keep track of. No bank login is needed.
2. See the full picture. Review your subscription list, monthly costs, and usage insights together.
3. Choose what stays. Keep, cancel, or revisit subscriptions based on what works for you.

## A clearer view starts with your list

Add subscriptions, review usage, and decide what is worth keeping.

- [Create your list](${SITE_URL}/signup)
- [View pricing](${SITE_URL}/pricing)

## Legal

- [Imprint](${SITE_URL}/impressum.md)
- [Terms of Service](${SITE_URL}/terms.md)
- [Privacy Policy](${SITE_URL}/privacy.md)
- [Refund and Withdrawal Policy](${SITE_URL}/refund.md)

HTML: ${SITE_URL}/
Markdown: ${SITE_URL}/index.md
`;

const pricingMd = `# Pricing

Start your clean slate. Gain $500+ back.

The public pricing page is a checkout screen, not a plan table. Figures below are the numbers written on that page. The paid plan price is shown in the Paddle checkout after you tap Continue, not as static text on the page. All prices shown at checkout are binding.

## Monthly spend comparison shown on the page

|  | Monthly spends |
| --- | ---: |
| Before Subzro | $239.00 |
| After Subzro | $32.00 |

The "Before" side shows uneven weekly bars (W1–W4). The "After" side shows four even green bars.

## What the page says

- Total clarity. Find sneaky charges before they hit your bank.
- Own your money. Only pay for the exact subscriptions you truly need.
- Cancel painlessly. We make ditching awful subscription services effortless.

The page also shows a "4.8 Stars" line. Continue opens the Paddle checkout for the monthly paid plan.

## Legal

- [Imprint](${SITE_URL}/impressum.md)
- [Terms](${SITE_URL}/terms.md)
- [Privacy](${SITE_URL}/privacy.md)
- [Refunds](${SITE_URL}/refund.md)

HTML: ${SITE_URL}/pricing
Markdown: ${SITE_URL}/pricing.md
`;

export const PAGES = {
  "/": { title: "Subzro", html: "/", md: "/index.md", body: indexMd },
  "/pricing": { title: "Pricing", html: "/pricing", md: "/pricing.md", body: pricingMd },
  "/privacy": { title: "Privacy Policy", html: "/privacy", md: "/privacy.md", body: privacy },
  "/terms": { title: "Terms of Service", html: "/terms", md: "/terms.md", body: terms },
  "/impressum": { title: "Imprint", html: "/impressum", md: "/impressum.md", body: imprint },
  "/refund": { title: "Refund and Withdrawal Policy", html: "/refund", md: "/refund.md", body: refund },
};

export function canonicalize(pathname) {
  if (!pathname) return "/";
  let path = pathname.split("?")[0].split("#")[0];
  if (path.length > 1) path = path.replace(/\/+$/, "");
  if (path.endsWith(".md")) {
    if (path === "/index.md") return "/";
    path = path.slice(0, -3);
  }
  if (path.startsWith("/api/md/")) {
    const rest = path.slice("/api/md/".length);
    if (!rest || rest === "_catalog") return rest === "_catalog" ? "_catalog" : "/";
    path = rest.startsWith("/") ? rest : `/${rest}`;
    if (path === "/index") path = "/";
  }
  return ALIASES[path] || path;
}

export function getPage(pathname) {
  const path = canonicalize(pathname);
  if (path === "_catalog") return null;
  return PAGES[path] || null;
}

export function listCatalog() {
  return Object.values(PAGES).map((page) => ({
    title: page.title,
    html: `${SITE_URL}${page.html}`,
    markdown: `${SITE_URL}${page.md}`,
  }));
}

export function markdownHeaders(canonicalHtmlPath) {
  const canonical = `${SITE_URL}${canonicalHtmlPath === "/" ? "/" : canonicalHtmlPath}`;
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Robots-Tag": "noindex",
    Link: `<${canonical}>; rel="canonical"`,
    "Cache-Control": "public, max-age=0, must-revalidate",
  };
}

export function prefersMarkdown(acceptHeader) {
  if (!acceptHeader) return false;
  let markdownQ = -1;
  let htmlQ = -1;
  let starQ = -1;
  for (const part of acceptHeader.split(",")) {
    const chunks = part.trim().split(";");
    const type = (chunks[0] || "").trim().toLowerCase();
    const qPart = chunks.slice(1).find((item) => item.trim().startsWith("q="));
    const q = qPart ? Number.parseFloat(qPart.trim().slice(2)) : 1;
    if (Number.isNaN(q)) continue;
    if (type === "text/markdown" || type === "text/x-markdown") {
      markdownQ = Math.max(markdownQ, q);
    } else if (type === "text/html") {
      htmlQ = Math.max(htmlQ, q);
    } else if (type === "*/*") {
      starQ = Math.max(starQ, q);
    }
  }
  if (markdownQ < 0) return false;
  const htmlRank = htmlQ >= 0 ? htmlQ : starQ >= 0 ? starQ : 0;
  return markdownQ > htmlRank;
}

export function llmsTxt() {
  const items = listCatalog()
    .map((page) => `- [${page.title}](${page.markdown}): HTML at ${page.html}`)
    .join("\n");
  return `# Subzro

> Zero in on what matters. Subscription intelligence without a bank link.

Add recurring charges (PDF, CSV, Excel, or manual entry; no bank connection), see monthly spend, rate usage (Often / Sometimes / Rarely), and decide what to keep or cancel.

Site: ${SITE_URL}

## Public pages

${items}

## Notes

- Use the .md URLs for a cheap, noindex markdown twin of each public HTML page.
- You can also send Accept: text/markdown to the HTML routes, or GET /api/md/<path>.
- /dashboard, /login, /signup, and /onboarding are private or account flows and have no markdown twins.
- Catalog: ${SITE_URL}/api/md/_catalog
- Full dump: ${SITE_URL}/llms-full.txt
- Usage: ${SITE_URL}/ai.txt
`;
}

export function llmsFullTxt() {
  return Object.values(PAGES)
    .map((page) => `${page.body.trim()}\n`)
    .join("\n---\n\n");
}

export function aiTxt() {
  return `# Subzro — notes for AI systems

Subzro is a subscription intelligence app at ${SITE_URL}, provided by ${BUSINESS.legalName}.

You may read, quote, and cite the public pages and their markdown twins. Prefer the markdown URLs listed in /llms.txt when you need the same facts with less markup.

Do not invent plan prices. The public /pricing page does not print a paid-plan price in static text; the checkout price is shown in Paddle after Continue. Figures that are written on /pricing (the $239.00 / $32.00 monthly-spend comparison, "Gain $500+ back", and "4.8 Stars") may be quoted as they appear on that page.

Do not scrape or describe /dashboard, /login, /signup, or /onboarding as public docs. Those routes are account flows.

Contact: ${BUSINESS.email}
`;
}

export function robotsTxt() {
  return `# Subzro robots
# Search and AI-search crawlers are welcome on public pages.
# Training-only crawlers (GPTBot, CCBot, Bytespider) are not blocked;
# there is no separate product decision yet to restrict training use.

User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export function sitemapXml() {
  const urls = PUBLIC_HTML_ROUTES.map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
