# Playfair Latin subset

This hand-run generator replaces only the italic 600 Latin face. It leaves the
global Google Fonts import in place for normal weights and non-Latin subsets.
The generator is not part of the frontend build.

From the repository root:

```sh
cd frontend
python3 -m venv .venv-fonts
. .venv-fonts/bin/activate
python -m pip install -r scripts/fonts/requirements.txt
python scripts/fonts/subset_playfair.py
```

The script uses the captured CSS, WOFF2 source, and OFL text in
`scripts/fonts/source/`. It writes `public/fonts/playfair/playfair-italic-600-latin.woff2`,
`src/fonts/playfair.generated.css`, and `scripts/fonts/playfair-report.json`.
It preserves the source font bounds and renames the embedded reserved font names
to `Subzro Serif`. The CSS family alias remains `Playfair Display`.

The default `--hint-profile drop` disables glyph hint instructions during
subsetting. The captured source has zero glyph instruction bytes and no
`fpgm`, `prep`, or `cvt ` table, so this profile produces the same font bytes as
`keep`. It retains `gasp`, which defines rasterization policy. Removing `gasp`
was tested separately: it produced no pixel changes in the current component
fixture but increased the font by 60 bytes, so the generator keeps it.

Regenerate after changing the source font/CSS, Playfair usage, text coverage,
weight, style, or font features. Then run `npm run build` from `frontend` and
repeat the component pixel and font-transfer checks.
