# Homepage motion and demo rehearsal

Scope, identity, and acceptance are defined in [HOMEPAGE_DESIGN.md](../../HOMEPAGE_DESIGN.md). The public homepage keeps the exact headline `Zero in on What Matters`, original desktop and mobile hero artwork, six section mascots, existing navigation/auth routes, the 56/48/40px title and 40/32/28px section heading scale, and 4px-based spacing. The illustrative demo does not submit subscription data.

## Reference to trigger to settled state

| Element | Reference and reused idea | Trigger and motion | Settled state |
| --- | --- | --- | --- |
| Hero words | `lfg-ai/.wt-hero-reveal-fast/src/components/reactbits/BlurText.tsx` and `src/app/HomeClient.tsx`: per-word blur/offset and shared reveal timing | Mount; 60ms word stagger, restrained 6px blur and 12px rise; details follow | Exact heading is sharp, readable, and keeps its accessible full-text label |
| Audience statement | LFG `src/components/ScrollWordReveal.tsx` and `src/lib/scroll-word-reveal.ts`: word progress tied to scroll | Scroll progress reveals each word from 4px blur and 0.15 opacity; each word settles once | Fully sharp by mid-viewport and stays readable when scrolling back |
| Hero artwork | `frontend_webapp/src/components/miscs/Research.tsx`: bounded Framer Motion scroll depth | Page scroll moves the art at most 40px and scales it to 0.96 | Artwork remains in its layout and follows the scroll position |
| Floating logos | Original `InteractiveLogosphere` in commit `7f29f0241f7c1b6b7bef32cb9df66f98afea8188`, `frontend/src/pages/Homepage.jsx` lines 9–119: original 32 domains, deterministic positions, sizes, opacity, blur, and logo.dev source/token | Fine-pointer movement uses a shared spring; bounded per-logo depth and 7–15s float animation run only while the hero is visible and the document is visible | Hover returns to center; offscreen and hidden-tab animation pauses; reduced motion shows static logos behind the hero artwork |
| Feature imagery and CTAs | Tiding `web/landing/assets/base.css` and `index.html`: tactile lift and restrained pointer depth | Fine-pointer hover/focus uses short transforms; pointer/focus exit settles to the resting state | No hover state sticks on touch; reduced motion disables movement |
| 3D feature marks | Existing neutral assets in `lfg-ai/.wt-hero-reveal-fast/public/3d/objects/` | Static icon assets sit within existing feature/reason sections | No WebGL, perpetual background movement, or new dependency |
| Usage demo | Installed Stageshow `hero-demo` reference and vendored kit, with its LICENSE and NOTICE retained; product truth checked against `UsageModal.jsx` and `UsagePage.jsx` as read-only references | Visible Stage starts once: choose Disney Plus → open “How often do you use Disney Plus?” → choose Rarely → Done | Saved Rarely badge remains visible. Pause freezes waits and cursor movement; Replay is the explicit reset. Reduced motion shows a meaningful saved poster. |

The demo uses a local example list and the product URL `subzro.vercel.app/dashboard`. It makes no network data call. The original artwork stays above the logos. Logo images reuse the original public logo.dev token; the image provider can still fail independently of the local page.

## Functional and identity review

Functional checks cover routes, keyboard controls, responsive geometry, reduced motion, the three demo states, pause/resume/replay, offscreen behavior, and the illustrative-data boundary. Identity checks cover the exact hero pair, six mascots, original logo field, gradients, progressive reveals, scroll depth, hover depth, and isometric icons. Passing one review does not establish the other.

## Recorded verification, 9 November 2026

- All nine strict official state gates passed: initial, selected, and saved at 1440px, 390px, and 640px. Each reports complete still coverage, zero findings, and exit 0. Reports are in `.agent-local/homepage/round3/state-*.json`. The selected compact state uses the semantic `usage-selected` mark and 250ms settling time. Earlier failed captures remain saved alongside the corrections.
- Changes address the causes: registered local Poppins faces before measuring; a stable system fallback after 4s or font failure; equal-width desktop choices; full-width compact choices with 12px gaps preserving selected lift; a 358×516 compact app crop with matching gutters; layer retention on the modal; and layout-aware styles/row metrics. The wide composition switches before shrinking below 85% of its design size.
- The demo reuses three existing Poppins core subsets (400,500,600), totaling 23,592 bytes, under the scoped family `Subzro Demo Poppins`. The OFL license ships with them. Global app font styles are not changed. Late font arrival does not replace the chosen fallback or shift the scene.
- Functional runtime checks passed: a 2200ms manual pause preserved remaining time and cursor position; the saved result and explicit Replay work; offscreen playback stops and restarts; fresh compact reduced motion shows the saved poster with zero animations; and delayed font responses leave fallback metrics stable. Receipt: `.agent-local/homepage/round3/stage-runtime-results.json`. The prior mid-cursor pause test remains valid because vendored timing/runtime code is unchanged.
- Continuous official motion recordings now report zero UI/motion findings and print `rehearsal passed`. Their overall result remains **INCONCLUSIVE / exit 2** because the frame sampler observed timing gaps. These runs do not certify complete per-frame coverage or a 60fps target. Native/full-resolution state captures and actual playback checks are separate evidence. Raw motion reports are retained; no scanner code, thresholds, or suppressions were changed.
- Rehearsal uses the actual component with actual homepage/global styles on a component fixture. Development stylesheet provenance lets the unmodified checker distinguish `/kit/` rules. A production bundle combines kit and application CSS and produced false `kit override` attribution. No vendored geometry was changed to silence that attribution.
- The first default development server omitted production-mode configuration and did not mount the app. The corrected fixture preflight verifies the actual Stage, loaded local faces, and stylesheet origins before capture. Earlier failed host runs are retained in the evidence.
- Parent independently inspected the worker's product diff and rendered desktop/compact states. The worker independently reviewed the parent-owned Stage, subscription remove-control, and onboarding offset changes before release. Both reviews found no remaining actionable issue.
- Paying-user and retained-revenue effects remain **NOT VERIFIED**. These UI checks establish no business lift.

The user authorized automatic deployment after the affected checks on 9 November 2026. Product repairs requested later are scoped and verified separately. Only authorized deltas are included in the clean release.
