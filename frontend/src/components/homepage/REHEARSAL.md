# Homepage visual pass, 2026-11-09

The bento composition follows stageshow's staggered-bento recipe: one lead UI, two supporting object cards and a screenshot gallery. It reuses the existing Stage, Card, Row and Badge parts with their props and type tokens. The palette stays lavender, mint and ivory. Existing Figma background assets and the no-decorative-lines rule remain in place.

The product demo reuses its existing usage-check story and measured cursor targets. Desktop hosts at least 1040px wide use Monkr's MacBook Air M2 frame; narrower hosts keep the readable compact design. The compact check-in uses a 16px bottom gutter.

Verified: bento still gates at 1440px and 390px both exit 0 with complete still coverage and no findings. Gallery opening, selection, Next, Escape and focus return passed at desktop and mobile widths. Hover lifts the lead UI and enlarges screenshot previews; reduced-motion CSS removes those transforms. All 22 mascot frames have prepared transparency; final optimized alpha masks are exact, with no browser removal filters. The main logo already had transparency.

The demo's full-story contact sheets have zero framing findings after fixing a double corner and the compact dialog gutter. The 12 captured desktop story states were visually reviewed through the saved result. Full per-frame motion telemetry is NOT VERIFIED: real-speed, slowed and geometry-only recordings remained inconclusive due to sampling gaps. The final geometry-only trace recorded 852 frames over 14.18s, with four gaps exceeding 27ms and no geometry findings. Do not describe that as complete frame coverage. Native Safari and an authenticated production dashboard were not exercised.

Local evidence: .agent-local/usage-glass/ contains bento-stage-{390,1440}-pass.json, ramka-*.json, hover and responsive captures, and demo story reports. .agent-local/mascot-transparency/ contains original backups, the preparation script, contact sheets and compression/mask measurements. Asset prompts and source licensing are retained beside the homepage icons and Monkr frame.
