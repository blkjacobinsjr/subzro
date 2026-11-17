"use client";;
import { useId, useRef } from "react";
import { clamp01, useMotionValueApply } from "./gauge-dial";

/* -------------------------------------------------------------------------- */
/*                                  Geometry                                  */
/* -------------------------------------------------------------------------- */

const MIN_SWEEP = 0.01;
const MAX_SWEEP = 359.99;

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
}

/** Centerline arc from `a0` to `a1` (degrees, clockwise). Empty when degenerate. */
export function arcStrokePath(cx, cy, r, a0, a1) {
  const sweep = Math.min(MAX_SWEEP, a1 - a0);
  if (sweep < MIN_SWEEP || r <= 0) {
    return "";
  }
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a0 + sweep);
  const large = sweep > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

/** Filled ring segment between radii `r0` (inner, may be 0) and `r1`. */
export function annularSectorPath(cx, cy, r0, r1, a0, a1) {
  const sweep = Math.min(MAX_SWEEP, a1 - a0);
  if (sweep < MIN_SWEEP) {
    return "";
  }
  const end = a0 + sweep;
  const large = sweep > 180 ? 1 : 0;
  const [ox0, oy0] = polar(cx, cy, r1, a0);
  const [ox1, oy1] = polar(cx, cy, r1, end);
  if (r0 <= 0.5) {
    return `M ${cx} ${cy} L ${ox0} ${oy0} A ${r1} ${r1} 0 ${large} 1 ${ox1} ${oy1} Z`;
  }
  const [ix1, iy1] = polar(cx, cy, r0, end);
  const [ix0, iy0] = polar(cx, cy, r0, a0);
  return `M ${ox0} ${oy0} A ${r1} ${r1} 0 ${large} 1 ${ox1} ${oy1} L ${ix1} ${iy1} A ${r0} ${r0} 0 ${large} 0 ${ix0} ${iy0} Z`;
}

export function zoneColorAt(zones, t) {
  if (!zones) {
    return;
  }
  const pct = t * 100;
  for (let i = zones.length - 1; i >= 0; i--) {
    const z = zones[i];
    if (z && pct >= z.from && pct <= z.to) {
      return z.color;
    }
  }
}

export const ZONE_BAND_WIDTH = 0.014;

export function GaugeZoneBands({
  cx,
  cy,
  radius,
  size,
  startAngle,
  endAngle,
  zones,
  opacity = 0.9
}) {
  const sweep = endAngle - startAngle;
  return (
    <g>
      {zones.map((z) => (
        <path
          d={arcStrokePath(
            cx,
            cy,
            radius,
            startAngle + clamp01(z.from / 100) * sweep,
            startAngle + clamp01(z.to / 100) * sweep
          )}
          fill="none"
          key={`${z.from}-${z.to}-${z.color}`}
          stroke={z.color}
          strokeOpacity={opacity}
          strokeWidth={size * ZONE_BAND_WIDTH}
        />
      ))}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Solid arc                                 */
/* -------------------------------------------------------------------------- */

export function GaugeSolidArc({
  cx,
  cy,
  radius,
  thickness,
  startAngle,
  endAngle,
  progress,
  trackColor,
  trackOpacity,
  fill,
  fillOpacity,
  zones,
  glowFilterId
}) {
  const sweep = endAngle - startAngle;
  const fillRef = useRef(null);
  const zoneRefs = useRef([]);

  const fillD = (p) =>
    arcStrokePath(cx, cy, radius, startAngle, startAngle + p * sweep);
  const zoneD = (z, p) => {
    const from = clamp01(z.from / 100);
    const to = Math.min(clamp01(z.to / 100), p);
    return to > from
      ? arcStrokePath(
          cx,
          cy,
          radius,
          startAngle + from * sweep,
          startAngle + to * sweep
        )
      : "";
  };

  useMotionValueApply(progress, (p) => {
    fillRef.current?.setAttribute("d", fillD(p));
    zones?.forEach((z, i) => {
      zoneRefs.current[i]?.setAttribute("d", zoneD(z, p));
    });
  });

  const p0 = progress.get();
  return (
    <g>
      <path
        d={arcStrokePath(cx, cy, radius, startAngle, endAngle)}
        fill="none"
        stroke={trackColor}
        strokeLinecap="round"
        strokeOpacity={trackOpacity}
        strokeWidth={thickness}
      />
      <g filter={glowFilterId ? `url(#${glowFilterId})` : undefined}>
        <path
          d={fillD(p0)}
          fill="none"
          ref={fillRef}
          stroke={fill}
          strokeLinecap="round"
          strokeOpacity={fillOpacity}
          strokeWidth={thickness}
        />
        {zones?.map((z, i) => (
          <path
            d={zoneD(z, p0)}
            fill="none"
            key={`${z.from}-${z.to}-${z.color}`}
            ref={(el) => {
              zoneRefs.current[i] = el;
            }}
            stroke={z.color}
            strokeOpacity={fillOpacity}
            strokeWidth={thickness}
          />
        ))}
      </g>
    </g>
  );
}

export function resolveSectorOptions(sector) {
  if (!sector) {
    return null;
  }
  return sector === true ? {} : sector;
}

/** SVG sector for `radial` and `none` gradients (patterns welcome). */
export function GaugeSector({
  cx,
  cy,
  radius,
  startAngle,
  endAngle,
  progress,
  options
}) {
  const {
    gradient = "conic",
    color = "var(--chart-1)",
    opacity = 0.85,
    innerRadius = 0,
  } = options;
  const gradientId = `gauge-sector-${useId().replace(/:/g, "")}`;
  const ref = useRef(null);
  const r0 = radius * clamp01(innerRadius);
  const sweep = endAngle - startAngle;
  const d = (p) =>
    annularSectorPath(cx, cy, r0, radius, startAngle, startAngle + p * sweep);

  useMotionValueApply(progress, (p) => {
    ref.current?.setAttribute("d", d(p));
  });

  const isRadial = gradient === "radial";
  return (
    <g>
      {isRadial ? (
        <defs>
          <radialGradient
            cx={cx}
            cy={cy}
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            r={radius}
          >
            <stop offset="0%" stopColor={color} stopOpacity={0} />
            <stop
              offset={`${Math.round((r0 / radius) * 100)}%`}
              stopColor={color}
              stopOpacity={0.04}
            />
            <stop offset="100%" stopColor={color} stopOpacity={opacity} />
          </radialGradient>
        </defs>
      ) : null}
      <path
        d={d(progress.get())}
        fill={isRadial ? `url(#${gradientId})` : color}
        fillOpacity={isRadial ? 1 : opacity}
        ref={ref}
      />
    </g>
  );
}

/**
 * Conic sector — SVG has no conic gradient, so this is an HTML layer behind
 * the SVG with a CSS `conic-gradient`, clipped to the sector path each frame.
 */
export function GaugeConicSector({
  cx,
  cy,
  radius,
  startAngle,
  endAngle,
  progress,
  options
}) {
  const { color = "var(--chart-1)", opacity = 0.85, innerRadius = 0 } = options;
  const ref = useRef(null);
  const r0 = radius * clamp01(innerRadius);
  const sweep = endAngle - startAngle;

  // CSS conic 0deg points up; SVG 0deg points right.
  const style = (p) => {
    const deg = p * sweep;
    const path = annularSectorPath(
      cx,
      cy,
      r0,
      radius,
      startAngle,
      startAngle + deg
    );
    return {
      background: `conic-gradient(from ${startAngle + 90}deg at ${cx}px ${cy}px, transparent 0deg, ${color} ${Math.max(deg, 0.01)}deg, transparent ${Math.max(deg, 0.01)}deg)`,
      clipPath: path ? `path("${path}")` : "inset(50%)",
    };
  };

  useMotionValueApply(progress, (p) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const next = style(p);
    el.style.background = next.background;
    el.style.clipPath = next.clipPath;
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      ref={ref}
      style={{ ...style(progress.get()), opacity }}
    />
  );
}

export function resolveProgressRingOptions(ring) {
  if (!ring) {
    return null;
  }
  return ring === true ? {} : ring;
}

export function progressRingExtent(
  options,
  size
) {
  return size * ((options.gap ?? 0.022) + (options.width ?? 0.01));
}

export function GaugeProgressRing({
  cx,
  cy,
  radius,
  size,
  startAngle,
  endAngle,
  progress,
  options,
  glowFilterId
}) {
  const {
    color = "var(--chart-1)",
    trackColor = "var(--muted-foreground)",
    trackOpacity = 0.35,
    width = 0.01,
  } = options;
  const activeRef = useRef(null);
  const restRef = useRef(null);
  const sweep = endAngle - startAngle;
  const at = (p) => startAngle + p * sweep;

  useMotionValueApply(progress, (p) => {
    activeRef.current?.setAttribute(
      "d",
      arcStrokePath(cx, cy, radius, startAngle, at(p))
    );
    restRef.current?.setAttribute(
      "d",
      arcStrokePath(cx, cy, radius, at(p), endAngle)
    );
  });

  const p0 = progress.get();
  const strokeWidth = Math.max(1, size * width);
  return (
    <g>
      <path
        d={arcStrokePath(cx, cy, radius, at(p0), endAngle)}
        fill="none"
        ref={restRef}
        stroke={trackColor}
        strokeOpacity={trackOpacity}
        strokeWidth={strokeWidth}
      />
      <path
        d={arcStrokePath(cx, cy, radius, startAngle, at(p0))}
        fill="none"
        filter={glowFilterId ? `url(#${glowFilterId})` : undefined}
        ref={activeRef}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </g>
  );
}

export function resolveDotsOptions(dots) {
  if (!dots) {
    return null;
  }
  return dots === true ? {} : dots;
}

export function GaugeDots({
  cx,
  cy,
  outerRadius,
  size,
  startAngle,
  endAngle,
  progress,
  options
}) {
  const {
    rings = 5,
    spacing = 0.03,
    radius = 1.6,
    color = "var(--chart-1)",
    dimOpacity = 0.12,
    litOpacity = 0.9,
    fadeInward = true,
  } = options;
  const step = Math.max(4, size * spacing);
  const sweep = endAngle - startAngle;
  const sweepRad = (sweep * Math.PI) / 180;
  const ringCount = Math.max(1, Math.round(rings));

  const dots = [];
  for (let k = 0; k < ringCount; k++) {
    const r = outerRadius - k * step;
    if (r <= step) {
      break;
    }
    const count = Math.max(2, Math.round((sweepRad * r) / step));
    const weight = fadeInward ? 1 - (k / ringCount) * 0.6 : 1;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const [x, y] = polar(cx, cy, r, startAngle + t * sweep);
      dots.push({ x, y, t, weight });
    }
  }

  const refs = useRef([]);
  const opacityAt = (p, t, weight) => {
    const lit = clamp01((p - t) * 60 + 1);
    return (dimOpacity + (litOpacity - dimOpacity) * lit) * weight;
  };

  useMotionValueApply(progress, (p) => {
    dots.forEach((dot, i) => {
      refs.current[i]?.setAttribute(
        "fill-opacity",
        String(opacityAt(p, dot.t, dot.weight))
      );
    });
  });

  const p0 = progress.get();
  return (
    <g>
      {dots.map((dot, i) => (
        <circle
          cx={dot.x}
          cy={dot.y}
          fill={color}
          fillOpacity={opacityAt(p0, dot.t, dot.weight)}
          key={i}
          r={radius}
          ref={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
    </g>
  );
}

export function resolveCenterDiscOptions(disc) {
  if (!disc) {
    return null;
  }
  return disc === true ? {} : disc;
}

export function GaugeCenterDisc({
  cx,
  cy,
  size,
  options
}) {
  const {
    radius = 0.19,
    fill = "var(--background)",
    stroke = "var(--foreground)",
    strokeOpacity = 0.75,
    strokeWidth = 3,
  } = options;
  return (
    <circle
      cx={cx}
      cy={cy}
      fill={fill}
      r={size * radius}
      stroke={stroke}
      strokeOpacity={strokeOpacity}
      strokeWidth={strokeWidth}
    />
  );
}

export function resolveGlowOptions(glow) {
  if (!glow) {
    return null;
  }
  return glow === true ? {} : glow;
}

export function GaugeGlowFilter({
  id,
  options
}) {
  const { blur = 6, intensity = 0.8 } = options;
  return (
    <filter height="200%" id={id} width="200%" x="-50%" y="-50%">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={blur} />
      <feComponentTransfer in="blur" result="glow">
        <feFuncA slope={intensity} type="linear" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}
