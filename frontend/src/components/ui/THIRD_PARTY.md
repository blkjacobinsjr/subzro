# Shared action controls

AppButton adapts BoardUI's public native-button composition to React 18 and the existing Tailwind 3 project. Source: https://www.boardui.com/r/button.json (retrieved 2026-11-09); Free source is MIT licensed; the original license is retained in licenses/boardui.txt. Usage terms: https://www.boardui.com/license. The original registry response is retained locally in .agent-local/vendor-ui/board-button.json. The adapter uses forwardRef, existing tailwind-merge, and scoped CSS in place of React 19 ref props and Tailwind 4 theme utilities. No new dependency is required.

The scoped rim, contact shadow, clear secondary surface and dark-mode material follow DeepLethe's Solid Glass control/inked-pane recipes. Source: https://github.com/deeplethe/solid-glass/blob/main/src/solid-glass.css. MIT license retained in licenses/solid-glass.txt. This is a small material adaptation, not the full shadcn/Base UI theme or a global token/font migration.

LoadingButton now uses AppButton in compatibility mode: existing caller classes keep their layout, colors and typography; loading/disabled behavior, mascot, labels and native event handlers remain. Its default type stays submit to match the previous native button behavior. New AppButton calls default to type=button. Destructive caller colors are preserved. Do not replace links with action buttons.
