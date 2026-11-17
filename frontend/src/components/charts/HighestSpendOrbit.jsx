import { useEffect, useMemo, useRef, useState } from "react";
import SubscriptionLogo from "../SubscriptionLogos";
import "./HighestSpendOrbit.css";

const MAX_ORBIT_ITEMS = 10;
const OUTER_RING_COUNT = 5;
const OUTER_DURATION = 72;
const INNER_DURATION = 56;

const COLORS = [
  "from-orange-400 to-amber-500",
  "from-rose-400 to-red-500",
  "from-indigo-400 to-purple-500",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
];

function getDisplayName(subscription, index) {
  return subscription?.name?.trim() || `Subscription ${index + 1}`;
}

function getOrbitValue(subscription) {
  if (!subscription) return 0;

  if (subscription.value !== undefined && subscription.value !== null) {
    const value = Number(subscription.value);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  if (subscription.monthlyPrice !== undefined && subscription.monthlyPrice !== null) {
    const monthlyPrice = Number(subscription.monthlyPrice);
    if (Number.isFinite(monthlyPrice)) return Math.max(0, monthlyPrice);
  }

  const price = Number(subscription.price ?? 0);
  if (!Number.isFinite(price)) return 0;
  return Math.max(0, subscription.interval === "year" ? price / 12 : price);
}

function formatMonthlyCost(value) {
  return `€${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function useVisibleMotion(rootRef) {
  const [motionActive, setMotionActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isIntersecting = false;

    const updateMotion = () => {
      setMotionActive(
        isIntersecting && !reducedMotion.matches && !document.hidden,
      );
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      updateMotion();
    });
    observer.observe(root);

    const handlePreferenceChange = () => updateMotion();
    const handleVisibilityChange = () => updateMotion();
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", handlePreferenceChange);
    } else {
      reducedMotion.addListener(handlePreferenceChange);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      if (reducedMotion.removeEventListener) {
        reducedMotion.removeEventListener("change", handlePreferenceChange);
      } else {
        reducedMotion.removeListener(handlePreferenceChange);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [rootRef]);

  return motionActive;
}

export default function HighestSpendOrbit({ data = [], variant = "full" }) {
  const isPreview = variant === "preview";
  const rootRef = useRef(null);
  const motionActive = useVisibleMotion(rootRef);
  const displayData = useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .map((subscription, index) => ({
          subscription,
          index,
          value: getOrbitValue(subscription),
        }))
        .sort((a, b) => b.value - a.value || a.index - b.index)
        .slice(0, MAX_ORBIT_ITEMS),
    [data],
  );

  if (displayData.length === 0) {
    if (isPreview) return null;
    return (
      <div className="highest-spend-orbit-empty">
        No subscriptions to compare yet.
      </div>
    );
  }

  const leaderCost = displayData[0].value;
  const leaderCents = Math.round(leaderCost * 100);
  const leaders = displayData.filter(
    (item) => Math.round(item.value * 100) === leaderCents,
  );
  const leaderNames = leaders
    .slice(0, 3)
    .map(({ subscription }, index) => getDisplayName(subscription, index));
  const extraLeaderCount = leaders.length - leaderNames.length;
  const leaderDescription =
    leaderCost <= 0
      ? "No monthly cost recorded yet"
      : leaders.length > 1
        ? `Tied highest: ${leaderNames.join(", ")}${extraLeaderCount > 0 ? ` +${extraLeaderCount}` : ""}`
        : `Highest: ${leaderNames[0]}`;

  return (
    <div
      ref={rootRef}
      className={`highest-spend-orbit${isPreview ? " highest-spend-orbit--preview" : ""}`}
      role={isPreview ? "img" : "group"}
      aria-label={isPreview ? "Subzro subscription orbit illustration" : "Highest subscription costs per month"}
    >
      <div className="highest-spend-orbit__canvas" aria-hidden="true">
        <div
          className="highest-spend-orbit__path highest-spend-orbit__path--outer"
        />
        {displayData.length > OUTER_RING_COUNT && (
          <div
            className="highest-spend-orbit__path highest-spend-orbit__path--inner"
          />
        )}

        <div className="highest-spend-orbit__mascot">
          <img
            src="/mascot-subzro/mascotwave.webp"
            alt=""
            className="h-full w-full rounded-full object-cover p-0.5"
          />
        </div>

        {displayData.map(({ subscription, value }, index) => {
          const ringIndex = index < OUTER_RING_COUNT ? 0 : 1;
          const groupStart = ringIndex === 0 ? 0 : OUTER_RING_COUNT;
          const ringCount = Math.min(
            OUTER_RING_COUNT,
            displayData.length - groupStart,
          );
          const groupIndex = index - groupStart;
          const phase =
            (360 / ringCount) * groupIndex + (ringIndex === 1 ? 36 : 0);
          const duration = ringIndex === 0 ? OUTER_DURATION : INNER_DURATION;
          const delay = `-${(phase / 360) * duration}s`;
          const name = getDisplayName(subscription, index);
          const isLeader = Math.round(value * 100) === leaderCents;
          const ringClass =
            ringIndex === 0
              ? "highest-spend-orbit__trajectory--outer"
              : "highest-spend-orbit__trajectory--inner";
          const nodeClass =
            ringIndex === 0
              ? isLeader
                ? "highest-spend-orbit__counter-rotation--leader"
                : "highest-spend-orbit__counter-rotation--outer"
              : "highest-spend-orbit__counter-rotation--inner";

          return (
            <div
              key={subscription?._id || `${name}-${index}`}
              className={`highest-spend-orbit__trajectory ${ringClass}`}
              style={{
                animationDuration: `${duration}s`,
                animationDelay: delay,
                animationPlayState: motionActive ? "running" : "paused",
              }}
            >
              <div className="highest-spend-orbit__node-anchor">
                <div
                  className={`highest-spend-orbit__counter-rotation ${nodeClass} ${COLORS[index % COLORS.length]}`}
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: delay,
                    animationPlayState: motionActive ? "running" : "paused",
                  }}
                  title={`${name}: ${formatMonthlyCost(value)} / month`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-1 text-black">
                    <SubscriptionLogo subscriptionName={name} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isPreview && (
        <>
          <p className="highest-spend-orbit__leader">
            <span>{leaderDescription}</span>
            <strong>{formatMonthlyCost(Math.max(0, leaderCost))} / month</strong>
          </p>

          <ol className="highest-spend-orbit__legend" aria-label="Monthly costs">
            {displayData.slice(0, 5).map(({ subscription, value }, index) => {
              const name = getDisplayName(subscription, index);
              return (
                <li key={subscription?._id || `${name}-legend-${index}`}>
                  <span className="highest-spend-orbit__legend-rank">
                    {index + 1}
                  </span>
                  <span className="highest-spend-orbit__legend-name" title={name}>
                    {name}
                  </span>
                  <span className="highest-spend-orbit__legend-cost">
                    {formatMonthlyCost(value)}
                  </span>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
