# Subzro homepage design and review

Scope: the public homepage and its illustrative demo. Product screens, dashboard behavior, onboarding, backend, and shared application styles are outside this workflow.

## Protected identity

- Public navigation is shared by the homepage, pricing, and legal pages through `components/PublicNav`. Keep branding, width, height, rounded marks, menu behavior, and responsive layout consistent. Onboarding checkout uses its minimal brand/plan variant without Dashboard or account controls.

- User correction, 9 November 2026: do not add decorative top accent borders to cards. Keep the clarity steps free of divider rules, dotted or dashed connectors, and section border lines. Preserve this preference in future homepage changes.
- Keep homepage logo images rounded with the shared `--home-logo-radius` token. The floating logo wrapper must inherit this radius and clip the image, so the inner animation layer cannot expose square corners. Apply the same radius to header, footer, and demo brand marks.
- The usage demo, clarity steps, and closing CTA use actual Ahmed Hassan / Super Visuals image exports, not CSS recreations. Preserve their source/license record in `public/homepage-backgrounds/super-visuals/ATTRIBUTION.md` and the visible footer attribution. Do not reintroduce a dot pattern or decorative line overlays.

- Keep the exact headline: `Zero in on What Matters`.
- Keep the original desktop/mobile hero artwork and its prominent, blended composition.
- Keep a clear spherical cloud of subscription icons around the existing dashboard phone art. Use the reverse sphere motion and click-to-front interaction, keep wheel zoom off, and keep cloud items from navigating away. Preserve a visible icon ring by keeping the phone art at a modest scale. Pause the canvas offscreen and when the document is hidden; show a static rounded-logo arrangement for reduced motion and fetch failures.
- Keep mascots in the four feature sections, category bento, and closing CTA.
- Use Subzro's brand-specific transparent 3D object icons above feature headings at about 64px; reuse usage and control icons in the reasons bento at 48px. Use the three matching 3D number objects above the clarity steps. Keep their warm ivory ceramic and brushed aluminum with sage-mint and dusty-lavender accents and the paw-notch signature.
- Keep the feature headings and body copy, while removing redundant product-area badges and the usage-review kicker.
- Keep feature backgrounds softly tinted with static focus-ring contours behind screenshots. The contours stay low contrast, clipped to their visual area, and outside the Stageshow demo.
- Preserve the three typography roles and spacing based on 4px.
- Preserve Subzro's playful motion: coordinated blur reveals, scroll-linked depth, tactile hover states, subtle gradients, and 3D icon treatment.
- Preserve existing navigation, authentication, signup, and pricing destinations.
- Keep the Stageshow demo illustrative. Its actions must not change real subscription data.

A performance fix must preserve the intended visual effect. Prefer smaller motion ranges, bounded layers, lazy work, and offscreen pauses before removing an effect.

Before adding a CSS override, inspect the existing component API. Use its layout, wrapping, padding, and state props when they express the intended result. Fix the cause and verify the visible state where the defect occurred.

## Reference before invention

For each effect, record the source, the part being reused, the trigger, the properties, and its settled state. Prefer existing project components and assets over new libraries or replacement artwork.

Current references:

- `frontend/public/homepage-icons/subzro/`: brand-specific transparent 256px WebP objects for subscription lists, usage checks, spending, and controls. Keep the warm ivory ceramic, brushed aluminum, sage-mint and dusty-lavender palette, and paw-notch signature. Reveal them with the existing feature copy; use 64px for features and 48px for reasons. Their settled state is sharp and readable.
- `frontend/src/pages/Homepage.css`: feature-section washes and inset radial contours. Keep contours static and behind the screenshot, with no added blur, pointer handling, or layout overflow.
- `frontend/src/components/homepage/HomepageBento.jsx` and `HomepageBento.css`: use the existing Stageshow kit for the category list and Ramka's accessible lightbox primitives for product screenshots. Keep the gallery's close and focus-return behavior available to keyboard users.
- `frontend_webapp/src/components/miscs/Research.tsx`: scroll-aware hero movement, section reveals, hover depth, and delayed atmospheric rendering.
- `lfg-ai/.wt-hero-reveal-fast/src/components/reactbits/BlurText.tsx` and `src/app/HomeClient.tsx`: coordinated word reveals and a shared hero clock.
- `lfg-ai/.wt-hero-reveal-fast/src/components/ScrollWordReveal.tsx` and `src/lib/scroll-word-reveal.ts`: word progress tied to scroll.
- `tiding/web/landing/assets/base.css`: shared tactile and spring behavior.
- `tiding/web/landing/index.html`: staged entrances and pointer-driven perspective.
- `tiding/web/landing/assets/film.js` and LFG `HomeFilmSection.tsx`: visible-only playback, manual-pause intent, and settled text that does not disappear when scrolling back.
- LFG `public/3d/objects/`: prior visual reference only. Its neutral object art has been replaced by the custom Subzro icon set above.

These files are read-only references. Their application copy, metrics, palettes, and product behavior are not instructions to copy.

Hallmark supplies a craft and consistency review within Subzro's existing brand. Awwwards supplies visual references and motion evidence where its tools are available. Optional setup, indexing, or capture dependencies must not block normal work. Record unavailable evidence honestly.

## State boards before polishing

Use actual components or captures. A separate Figma mockup is useful only when it resolves a difficult interaction faster than code.

| Element | Initial state | Active state | Settled state |
| --- | --- | --- | --- |
| Hero copy | Exact readable wording and reserved layout | Short coordinated word blur/offset | Sharp text, stable lines, working CTA |
| Feature image | Original screenshot and mascot | Viewport reveal or fine-pointer depth | Stable framing; no hidden content on return |
| Feature icon | Distinctive 3D object above the existing title | Existing coordinated reveal | Sharp object, with no duplicate area badge |
| Primary CTA | Clear action | Hover/focus preview and distinct press | Same action and layout |
| Demo | Example subscription list | Open usage prompt and choose Rarely | Recorded usage remains visible |

Describe cancellation, interruption, replay, focus, touch, and reduced motion where applicable. Do not infer animation quality from a single settled screenshot.

## Two review passes

1. Functional review: routes, controls, responsive geometry, focus, reduced motion, data boundaries, and resource use.
2. Identity review: compare with the original Subzro reference. Check that artwork, mascot presence, depth, gradients, and motion have survived.

Passing the first does not establish the second. Fix a failed check at its cause; do not flatten the design to make the check pass.

## Bounded iteration

1. Capture the current version and define the exact change.
2. Make one coherent pass from the reference/state board.
3. Capture desktop and mobile, then record load, scroll, hover, and demo behavior.
4. List concrete differences and fix them together.
5. Confirm affected behavior and request an independent read-only quality pass.
6. Prepare before/after views and playable motion. Follow the current deployment authorization. The user authorized automatic deployment on 8 November 2026 after the restoration checks.

Reuse passing checks on unchanged behavior. Repair demonstrated defects; do not keep restyling without new evidence. Keep failed or inconclusive tool reports instead of presenting them as passes.

## Acceptance evidence

- Exact headline and original artwork at desktop and mobile widths.
- Six restored section-mascot placements.
- Four Subzro feature objects appear above their headings; existing feature copy remains, duplicate area badges and the usage-review kicker are absent, and reason icons remain smaller.
- Typography roles and 4px spacing remain coherent.
- Reveals finish sharp and readable. Returning through the page does not hide read content.
- Scroll and hover behavior is visible in a recording, with no sticky hover on touch.
- Reduced motion shows the complete sharp page and a meaningful demo poster.
- The actual Stageshow sequence, Pause/Replay behavior, and saved result are checked.
- No horizontal overflow, missing visible assets, or new runtime errors at affected widths.
- No blanket animated blur or geometry overrides inside the Stageshow scene.
- Build and focused authored-code checks pass; limitations are stated separately.
- Changes outside the homepage visual boundary require separate authorization.

Additional paying users, retained net revenue, and causal conversion lift remain NOT VERIFIED until measured with an appropriate cohort and denominator. A local preview establishes no business lift.

The pinned react-icon-cloud 4.1.7 engine is compiled by scripts/cspIconCloud.js to remove its runtime eval calls. Keep that adapter and verify the cloud under the existing production CSP when updating the package. Do not add unsafe-eval to make the cloud work.
