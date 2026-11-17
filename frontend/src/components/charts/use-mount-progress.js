"use client";

import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { DEFAULT_CHART_ENTER_TRANSITION } from "./animation";

/** Drives 0→1 enter progress using the studio motion transition (spring or tween). */
export function useMountProgress(
  enterTransition,
  delaySeconds,
  replayKey,
  enabled = true
) {
  const prefersReducedMotion = useReducedMotion() === true;
  const shouldAnimate = enabled && !prefersReducedMotion;
  const progress = useMotionValue(shouldAnimate ? 0 : 1);
  const transitionRef = useRef(enterTransition);
  // Latest transition without restarting the enter tween on every new object
  // identity. Declared before the tween effect so it runs first.
  useEffect(() => {
    transitionRef.current = enterTransition;
  });

  // replayKey intentionally retriggers enter when motion settings change
  // biome-ignore lint/correctness/useExhaustiveDependencies: replayKey
  useEffect(() => {
    if (!shouldAnimate) {
      progress.set(1);
      return undefined;
    }

    progress.set(0);
    const controls = animate(progress, 1, {
      ...(transitionRef.current ?? DEFAULT_CHART_ENTER_TRANSITION),
      delay: delaySeconds,
    });
    return () => controls.stop();
  }, [delaySeconds, replayKey, progress, shouldAnimate]);

  return progress;
}
