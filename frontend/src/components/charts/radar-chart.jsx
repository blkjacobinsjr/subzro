"use client";;
import { scaleLinear } from "d3-scale";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { ParentSize } from "./chart-parent-size";
import { defaultRadarColors, RadarProvider } from "./radar-context";

function RadarChartInner({
  width,
  height,
  data,
  metrics,
  levels,
  margin,
  animate,
  enterDurationMs,
  staggerScale,
  enterTransition,
  motionReplayKey,
  children,
  hoveredIndexProp,
  onHoverChange
}) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState(null);

  // Use controlled or uncontrolled hover state
  const isControlled = hoveredIndexProp !== undefined;
  const hoveredIndex = isControlled ? hoveredIndexProp : internalHoveredIndex;
  const setHoveredIndex = useCallback(
    (index) => {
      if (isControlled) {
        onHoverChange?.(index);
      } else {
        setInternalHoveredIndex(index);
      }
    },
    [isControlled, onHoverChange]
  );

  // Use the smaller dimension
  const size = Math.min(width, height);
  const radius = (size - margin * 2) / 2;

  // Scale for converting values (0-100) to radius
  const yScale = useCallback(
    (value) => {
      const scale = scaleLinear().domain([0, 100]).range([0, radius]);
      return scale(value) ?? 0;
    },
    [radius]
  );

  // Get angle for a metric index (rotated so first metric is at top)
  const getAngle = useCallback(
    (metricIndex) => {
      const step = (Math.PI * 2) / metrics.length;
      const angleOffset = -Math.PI / 2; // Rotate so first axis is at top
      return metricIndex * step + angleOffset;
    },
    [metrics.length]
  );

  // Get x,y position for a metric at a given value
  const getPointPosition = useCallback(
    (metricIndex, value) => {
      const angle = getAngle(metricIndex);
      const r = yScale(value);
      return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
      };
    },
    [getAngle, yScale]
  );

  // Get color for a data index
  const getColor = useCallback(
    (index) => {
      const item = data[index];
      if (item?.color) {
        return item.color;
      }
      return defaultRadarColors[index % defaultRadarColors.length];
    },
    [data]
  );

  // Early return if dimensions not ready
  if (size < 10) {
    return null;
  }

  const contextValue = {
    data,
    metrics,
    size,
    radius,
    levels,
    hoveredIndex,
    setHoveredIndex,
    animate,
    enterDurationMs,
    staggerScale,
    enterTransition,
    motionReplayKey,
    getColor,
    getAngle,
    getPointPosition,
    yScale,
  };

  return (
    <RadarProvider value={contextValue}>
      <svg
        aria-hidden="true"
        height={size}
        style={{ overflow: "visible" }}
        width={size}
      >
        {/* Same transform string visx Group emitted (note the space). */}
        <g transform={`translate(${size / 2}, ${size / 2})`}>{children}</g>
      </svg>
    </RadarProvider>
  );
}

export function RadarChart({
  data,
  metrics,
  size: fixedSize,
  levels = 5,
  margin = 60,
  animate = true,
  enterDurationMs = 1100,
  staggerScale = 1,
  enterTransition,
  motionReplayKey = "",
  className = "",
  hoveredIndex,
  onHoverChange,
  children
}) {
  const shouldAnimate = animate && useReducedMotion() !== true;

  // If fixed size is provided, use it directly
  if (fixedSize) {
    return (
      <LazyMotion features={domAnimation}>
        <div
          className={cn("relative flex items-center justify-center", className)}
          style={{ width: fixedSize, height: fixedSize }}
        >
          <RadarChartInner
            animate={shouldAnimate}
            data={data}
            enterDurationMs={enterDurationMs}
            enterTransition={enterTransition}
            height={fixedSize}
            hoveredIndexProp={hoveredIndex}
            levels={levels}
            margin={margin}
            metrics={metrics}
            motionReplayKey={motionReplayKey}
            onHoverChange={onHoverChange}
            staggerScale={staggerScale}
            width={fixedSize}
          >
            {children}
          </RadarChartInner>
        </div>
      </LazyMotion>
    );
  }

  // Otherwise use ParentSize for responsive sizing
  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("relative aspect-square w-full", className)}>
        <ParentSize debounceTime={10}>
          {({ width, height }) => (
            <RadarChartInner
              animate={shouldAnimate}
              data={data}
              enterDurationMs={enterDurationMs}
              enterTransition={enterTransition}
              height={height}
              hoveredIndexProp={hoveredIndex}
              levels={levels}
              margin={margin}
              metrics={metrics}
              motionReplayKey={motionReplayKey}
              onHoverChange={onHoverChange}
              staggerScale={staggerScale}
              width={width}
            >
              {children}
            </RadarChartInner>
          )}
        </ParentSize>
      </div>
    </LazyMotion>
  );
}

export default RadarChart;
