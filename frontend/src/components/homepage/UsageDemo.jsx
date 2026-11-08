import { useCallback, useEffect, useMemo, useState } from "react";
import { Stage } from "./stageshow/kit/stage";
import { Window, Text } from "./stageshow/kit/window";
import { Card } from "./stageshow/kit/parts/Card";
import { Row } from "./stageshow/kit/parts/Row";
import { Badge } from "./stageshow/kit/controls/Badge";
import { Button } from "./stageshow/kit/controls/Button";
import { useReducedMotion } from "./stageshow/kit/reduced-motion";
import "./UsageDemo.css";

const INITIAL = { modalOpen: false, selectedUsage: null, saved: false };
const POSTER = { modalOpen: false, selectedUsage: 2, saved: true };
const USAGE_CHOICES = [
  { label: "Often", tone: "mint" },
  { label: "Sometimes", tone: "lavender" },
  { label: "Rarely", tone: "coral" },
];
const WIDE_ROW_STYLE = {
  "--ss-row-title": "14px",
  "--ss-row-subtitle": "12px",
  "--ss-row-line": "18px",
  "--ss-row-line-2": "16px",
};
const COMPACT_ROW_STYLE = {
  "--ss-row-title": "13px",
  "--ss-row-subtitle": "11px",
  "--ss-row-line": "18px",
  "--ss-row-line-2": "16px",
};
const FONT_SAMPLE = "Subzro Subscriptions Example list Your subscriptions Choose one to review its usage Disney Plus Streaming Netflix Cloud storage Spotify Music Gym membership Wellness News app Reading Joy Check How often do you use Rarely Done";

function usageStory(finishStory) {
  return async (act) => {
    await act.wait(850);
    act.mark("start");
    await act.wait(1750);

    act.mark("choose-subscription");
    await act.click("subscription-disney");
    await act.set({ modalOpen: true });
    await act.wait(2100);

    act.mark("choose-rarely");
    await act.click("usage-rarely");
    await act.set({ selectedUsage: 2 });
    await act.wait(1200);

    act.mark("save-usage");
    await act.click({ at: "usage-done", x: 0.9, y: 0.5 });
    await act.set({ modalOpen: false, saved: true });
    act.mark("saved");
    await act.wait(3100);
    finishStory();
  };
}

function SubscriptionApp({ state, compact }) {
  const rowStyle = compact ? COMPACT_ROW_STYLE : WIDE_ROW_STYLE;

  return (
    <div
      className={`usage-demo__app${compact ? " usage-demo__app--compact ss-recede" : ""}`}
      data-receded={compact && state.modalOpen ? "true" : undefined}
    >
      <header className="usage-demo__app-header">
        <div className="usage-demo__brand">
          <img src="/subzero_logo_icon.png" alt="" />
          <span>Subzro</span>
        </div>
        <span className="usage-demo__page-title">Subscriptions</span>
        <Badge tone="neutral" className="usage-demo__example-badge">
          Example list
        </Badge>
      </header>

      <div className="usage-demo__content">
        <div className="usage-demo__list-heading">
          <Text className="usage-demo__list-title">Your subscriptions</Text>
          <span>Choose one to review its usage</span>
        </div>

        <Card className="usage-demo__subscription-list" pad="small" gap={4}>
          <Row
            data-target="subscription-disney"
            data-cursor="hand"
            className="usage-demo__subscription-row"
            style={rowStyle}
            pad={8}
            selected={state.saved}
            title="Disney Plus"
            subtitle="Streaming"
            meta={
              <Badge
                tone="accent"
                data-saved={state.saved || undefined}
                className="usage-demo__result-badge"
              >
                Rarely
              </Badge>
            }
          />
          <Row className="usage-demo__subscription-row" style={rowStyle} pad={8} title="Netflix" subtitle="Streaming" />
          <Row className="usage-demo__subscription-row" style={rowStyle} pad={8} title="Cloud storage" subtitle="Work tools" />
          <Row className="usage-demo__subscription-row" style={rowStyle} pad={8} title="Spotify" subtitle="Music" />
          <Row className="usage-demo__subscription-row" style={rowStyle} pad={8} title="Gym membership" subtitle="Wellness" />
          <Row className="usage-demo__subscription-row" style={rowStyle} pad={8} title="News app" subtitle="Reading" />
        </Card>
      </div>
    </div>
  );
}

function UsageScene({ paused, onComplete }) {
  const story = useMemo(() => usageStory(onComplete), [onComplete]);

  return (
    <Stage
      width={960}
      height={620}
      compact={{ below: 600, width: 358, height: 640 }}
      initial={INITIAL}
      poster={POSTER}
      script={story}
      paused={paused}
      play="once"
      cursor={{
        at: {
          wide: { x: 908, y: 480 },
          compact: { x: 336, y: 610 },
        },
        idle: false,
      }}
      fidelity="realistic"
      accent="#7658a8"
      tokens={{
        "--ss-font": '"Poppins", sans-serif',
        "--ss-text": "#292630",
        "--ss-muted": "#716c7b",
        "--ss-surface": "#ffffff",
        "--ss-well": "#eee9f6",
        "--ss-line": "rgb(41 38 48 / 12%)",
        "--ss-line-faint": "rgb(41 38 48 / 8%)",
        "--ss-accent": "#7658a8",
        "--ss-accent-soft": "#eee8f8",
        "--ss-radius-md": "12px",
        "--ss-radius-lg": "18px",
      }}
      className="usage-demo"
    >
      {(state, _rect, layout) => (
        <>
          {layout === "compact" ? (
            <SubscriptionApp state={state} compact />
          ) : (
            <Window
              url="subzro.vercel.app/dashboard"
              className="usage-demo__window"
              receded={state.modalOpen}
            >
              <SubscriptionApp state={state} compact={false} />
            </Window>
          )}

          <div
            className="usage-demo__scrim"
            data-open={state.modalOpen || undefined}
            aria-hidden="true"
          >
            <Card className="usage-demo__checkin" pad="large" gap={20} lift>
              <div className="usage-demo__checkin-heading">
                <div>
                  <span className="usage-demo__eyebrow">Joy Check</span>
                  <Text wrap className="usage-demo__question">
                    How often do you use Disney Plus?
                  </Text>
                </div>
                <img
                  src="/mascot-subzro/mascotsitsmilewave.webp"
                  alt=""
                />
              </div>

              <div className="usage-demo__choices" role="group" aria-label="Usage frequency">
                {USAGE_CHOICES.map((choice, index) => (
                  <Button
                    key={choice.label}
                    data-target={`usage-${choice.label.toLowerCase()}`}
                    data-cursor="hand"
                    data-tone={choice.tone}
                    data-selected={state.selectedUsage === index || undefined}
                    className="usage-demo__choice"
                    size="large"
                  >
                    {choice.label}
                  </Button>
                ))}
              </div>

              <Button
                data-target="usage-done"
                data-cursor="hand"
                className="usage-demo__done"
                variant="primary"
                size="large"
              >
                Done
              </Button>
            </Card>
          </div>
        </>
      )}
    </Stage>
  );
}

export default function UsageDemo() {
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    const prepareFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load('400 14px "Poppins"', FONT_SAMPLE),
          document.fonts.load('500 14px "Poppins"', FONT_SAMPLE),
          document.fonts.load('600 20px "Poppins"', FONT_SAMPLE),
        ]);
        await document.fonts.ready;
      } catch {
        // Continue with the system fallback if the local font files fail.
      }
      if (active) setFontsReady(true);
    };
    void prepareFonts();
    return () => {
      active = false;
    };
  }, []);

  const finishStory = useCallback(() => {
    setComplete(true);
  }, []);

  const togglePause = () => {
    setPaused((value) => !value);
  };

  const replay = () => {
    setPaused(false);
    setComplete(false);
    setRun((value) => value + 1);
  };

  const handleComplete = useCallback(() => finishStory(), [finishStory]);

  return (
    <div className="usage-demo-shell">
      <div className="usage-demo-shell__caption">
        <span>Illustrative scene</span>
        <span aria-live="polite">
          {reducedMotion || !fontsReady
            ? "Saved usage: Rarely"
            : complete
              ? "Usage saved: Rarely"
              : paused
                ? "Scene paused"
                : "Usage review in progress"}
        </span>
      </div>

      <div className="usage-demo-shell__stage" aria-hidden="true">
        {fontsReady ? (
          <UsageScene
            key={run}
            paused={paused}
            onComplete={handleComplete}
          />
        ) : (
          <div className="usage-demo__font-poster">
            <div className="usage-demo__font-poster-card">
              <div className="usage-demo__font-poster-brand">
                <img src="/subzero_logo_icon.png" alt="" />
                <span>Subzro</span>
              </div>
              <div className="usage-demo__font-poster-result">
                <div>
                  <strong>Disney Plus</strong>
                  <span>Streaming</span>
                </div>
                <span>Rarely</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="usage-demo-shell__description">
        A person opens a usage check-in, chooses Rarely, and saves that choice
        to their subscription list.
      </p>

      <div className="usage-demo-shell__controls" aria-label="Demo controls">
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={paused}
          disabled={complete || reducedMotion}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button type="button" onClick={replay}>
          Replay
        </button>
      </div>
    </div>
  );
}
