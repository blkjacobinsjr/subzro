# Local Poppins subsets

The generator uses the checked-in Google Fonts CSS and WOFF2 files in `source/`.
It does not download files and does not run as part of the frontend build.

From the repository root, install the pinned Python dependency and generate the
safe full-Latin profile:

```sh
cd frontend
python3 -m venv .venv-fonts
. .venv-fonts/bin/activate
python -m pip install -r scripts/fonts/requirements.txt
python scripts/fonts/subset_poppins.py
```

The ASCII profile is experimental: it caused repeatable pixel differences in
accented text and is not enabled on the site. The site keeps the original
Google Poppins faces. Re-enable generated faces only after fresh pixel checks.

The generator rewrites `public/fonts/poppins/`, `src/fonts/poppins.generated.css`,
and `scripts/fonts/poppins-report.json`. The captured Google CSS was requested
with Chrome 156's user agent on 2026-11-08. Source face URLs are retained in
`source/google-css/global.css`; the original source binaries and OFL license are
checked in beside it. Regenerate after changing source fonts/CSS, Poppins usage,
text coverage, weights, styles, or shaping features. Run `npm run build` from
`frontend`, then repeat the homepage and mixed-script pixel comparisons after
every regeneration. The script does not prove visual equivalence.

The HTML preloads the normal 400, 500, and 600 core files only for a direct load of `/`. Weight 700 loads through CSS if needed.
Client-side navigation to `/` still loads the needed font through CSS. A signed-in
redirect from `/` may make those preloads unnecessary; verify that route when
integrating the change.

The root-only preload uses the original Google Poppins URLs in `public/font-preload.js`.
After updating the Google Fonts source or stylesheet, check that all three URLs still
match the stylesheet for supported browsers before updating the preload.
