"use client";;
import { useSpring, useTransform, useVelocity } from "motion/react";
import { useLayoutEffect, useRef } from "react";

const DEFAULTS = {
  scale: 0.06,
  stretch: 0.08,
  maxVelocity: 1600,
};

/**
 * Settles the swell: fast enough to track a flick, damped so it eases back to
 * rest instead of wobbling when the pointer stops.
 */
const SWELL_SPRING = { stiffness: 420, damping: 32, mass: 0.6 };

export function resolveDatePillVelocity(value) {
  if (!value) {
    return null;
  }
  return value === true ? DEFAULTS : { ...DEFAULTS, ...value };
}

/** `0…1` swell for a speed: ease-out so small moves already register. */
export function velocitySwell(velocity, maxVelocity) {
  if (maxVelocity <= 0) {
    return 0;
  }
  const t = Math.min(Math.abs(velocity) / maxVelocity, 1);
  return t * (2 - t);
}

/**
 * Glass-menu style swell: as `x` moves, the element grows slightly and
 * stretches along the motion, then springs back to `1` at rest. Pure motion
 * values — pointer moves never re-render React. Returns `scale: 1` values when
 * `config` is `null` (off or reduced motion).
 */
export function useVelocityStretch(x, config) {
  // Transforms read the latest config from a ref, so a new config object
  // (or toggling off) applies without rebuilding the motion values.
  const configRef = useRef(config);
  useLayoutEffect(() => {
    configRef.current = config;
  });
  const velocity = useVelocity(x);
  const swell = useTransform(velocity, (v) => {
    const c = configRef.current;
    return c ? velocitySwell(v, c.maxVelocity) : 0;
  });
  const smooth = useSpring(swell, SWELL_SPRING);
  const scaleX = useTransform(smooth, (a) => {
    const c = configRef.current;
    return c ? 1 + a * (c.scale + c.stretch) : 1;
  });
  const scaleY = useTransform(smooth, (a) => {
    const c = configRef.current;
    return c ? 1 + a * c.scale : 1;
  });
  return { scaleX, scaleY };
}
