"use client";;
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

function defaultDedupeKey(tooltip) {
  if (
    typeof tooltip === "object" &&
    tooltip !== null &&
    "index" in tooltip &&
    typeof (tooltip).index === "number"
  ) {
    const { index, x, activeDataKey } = tooltip;
    // Nearest-point hover: several series can share a row — key on the series too.
    const suffix = activeDataKey === undefined ? "" : `:${activeDataKey}`;
    if (typeof x === "number") {
      return `${index}:${Math.round(x)}${suffix}`;
    }
    return `${index}${suffix}`;
  }
  return JSON.stringify(tooltip);
}

/**
 * rAF-coalesced tooltip updates. Keeps the tooltip in React state, or in the
 * caller's store when `setExternal` is given (then `tooltipData` stays `null`
 * here — read it from the store).
 */
export function useScheduledTooltip(setExternal) {
  const [tooltipData, setLocalTooltipData] = useState(null);
  const setTooltipData = setExternal ?? setLocalTooltipData;
  const lastKeyRef = useRef(null);
  const pendingRef = useRef(null);
  const rafRef = useRef(null);
  const pendingKeyRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const commitTooltip = useCallback(
    (tooltip, dedupeKey) => {
      if (dedupeKey === lastKeyRef.current) {
        return;
      }
      lastKeyRef.current = dedupeKey;
      setTooltipData(tooltip);
    },
    [setTooltipData]
  );

  const scheduleTooltip = useCallback(
    (tooltip, dedupeKey) => {
      const key = dedupeKey ?? defaultDedupeKey(tooltip);
      pendingRef.current = tooltip;
      pendingKeyRef.current = key;
      if (key === lastKeyRef.current) {
        return;
      }
      if (rafRef.current !== null) {
        return;
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const next = pendingRef.current;
        const nextKey = pendingKeyRef.current;
        if (next && nextKey) {
          // Commit inside this frame: a plain setState from rAF is
          // default-priority and would render after the frame paints,
          // showing the tooltip one frame late.
          flushSync(() => commitTooltip(next, nextKey));
        }
      });
    },
    [commitTooltip]
  );

  const clearTooltip = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    pendingKeyRef.current = null;
    lastKeyRef.current = null;
    setTooltipData(null);
  }, [setTooltipData]);

  const resetTooltipDedupe = useCallback(() => {
    lastKeyRef.current = null;
  }, []);

  return {
    tooltipData,
    setTooltipData,
    scheduleTooltip,
    clearTooltip,
    resetTooltipDedupe,
  };
}
