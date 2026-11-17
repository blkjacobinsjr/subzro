"use client";;
import { scaleLinear } from "d3-scale";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { DEFAULT_Y_AXIS_ID } from "./y-axis-scales";

// CSS variable references for theming
export const chartCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label)",
  linePrimary: "var(--chart-line-primary)",
  lineSecondary: "var(--chart-line-secondary)",
  crosshair: "var(--chart-crosshair)",
  grid: "var(--chart-grid)",
  indicatorColor: "var(--chart-indicator-color)",
  indicatorSecondaryColor: "var(--chart-indicator-secondary-color)",
  markerBackground: "var(--chart-marker-background)",
  markerBorder: "var(--chart-marker-border)",
  markerForeground: "var(--chart-marker-foreground)",
  badgeBackground: "var(--chart-marker-badge-background)",
  badgeForeground: "var(--chart-marker-badge-foreground)",
  segmentBackground: "var(--chart-segment-background)",
  segmentLine: "var(--chart-segment-line)",
  brushBorder: "var(--chart-brush-border)",
  tooltipBackground: "var(--chart-tooltip-background)",
};

/** Default scatter series colors from the chart palette (`--chart-1` … `--chart-5`). */
export const defaultScatterColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)"
];

/**
 * Above this many x labels, `ChartTooltip` switches to discrete interaction:
 * the crosshair, tooltip box and dots snap between points instead of
 * springing (springs would lag behind a dense series). The hover highlight
 * band follows the same rule.
 */
export const DISCRETE_INTERACTION_LABEL_THRESHOLD = 60;

/** `useLayoutEffect` in the browser, `useEffect` on the server (no SSR warning). */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const ChartStableContext = createContext(null);
const ChartHoverContext = createContext(null);

const ChartHoverStoreContext = createContext(null);

export function createChartHoverStore() {
  const listeners = new Set();
  let tooltipData = null;
  let selection = null;
  const emit = () => {
    snapshot = { ...snapshot, tooltipData, selection };
    for (const listener of listeners) {
      listener();
    }
  };
  const setTooltipData = (
    action
  ) => {
    const next = typeof action === "function" ? action(tooltipData) : action;
    if (next === tooltipData) {
      return;
    }
    tooltipData = next;
    emit();
  };
  const setSelection = (next) => {
    if (next === selection) {
      return;
    }
    selection = next;
    emit();
  };
  let snapshot = {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection: () => setSelection(null),
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setTooltipData,
    setSelection,
  };
}

const noop = () => undefined;

/** Read-only store over a plain hover value (re-created when it changes). */
function staticChartHoverStore(value) {
  return {
    getSnapshot: () => value,
    subscribe: () => noop,
  };
}

/**
 * Publishes a hover store to `useChartHover()` (whole slice, re-renders on
 * every change) and `useChartHoverSelector()` (re-renders only when the
 * selected value changes). Only this provider re-renders on a hover change;
 * `children` keeps its identity, so the subtree is skipped apart from hover
 * consumers.
 */
export function ChartHoverStoreProvider({
  children,
  store
}) {
  const hover = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
  return (
    <ChartHoverStoreContext.Provider value={store}>
      <ChartHoverContext.Provider value={hover}>
        {children}
      </ChartHoverContext.Provider>
    </ChartHoverStoreContext.Provider>
  );
}

/**
 * Splits the merged `value` into a stable slice and a volatile hover slice,
 * publishing each to its own context. Each slice is memoized on its own
 * field identities, so changing `tooltipData` does not bust the stable
 * slice — consumers of `useChartStable()` skip re-renders on hover.
 */
export function ChartProvider({
  children,
  value
}) {
  const stable = useMemo(() => ({
    data: value.data,
    renderData: value.renderData,
    xScale: value.xScale,
    yScale: value.yScale,
    yScales: value.yScales,
    width: value.width,
    height: value.height,
    innerWidth: value.innerWidth,
    innerHeight: value.innerHeight,
    margin: value.margin,
    columnWidth: value.columnWidth,
    containerRef: value.containerRef,
    lines: value.lines,
    bands: value.bands,
    referenceAreas: value.referenceAreas,
    chartPhase: value.chartPhase,
    chartStatus: value.chartStatus,
    loadingLabel: value.loadingLabel,
    yDomainTweenDuration: value.yDomainTweenDuration,
    yDomainSkeletonByAxis: value.yDomainSkeletonByAxis,
    yDomainTargetByAxis: value.yDomainTargetByAxis,
    isLoaded: value.isLoaded,
    animationDuration: value.animationDuration,
    animationEasing: value.animationEasing,
    enterTransition: value.enterTransition,
    revealEpoch: value.revealEpoch,
    notifyLoadingPulseComplete: value.notifyLoadingPulseComplete,
    xAccessor: value.xAccessor,
    dateLabels: value.dateLabels,
    xDomain: value.xDomain,
    xDomainSlotCount: value.xDomainSlotCount,
    barScale: value.barScale,
    bandWidth: value.bandWidth,
    barXAccessor: value.barXAccessor,
    orientation: value.orientation,
    stacked: value.stacked,
    stackOffsets: value.stackOffsets,
    composedBarDataKeys: value.composedBarDataKeys,
    composedBarSize: value.composedBarSize,
    composedMaxBarSize: value.composedMaxBarSize,
    composedBarGap: value.composedBarGap,
    composedStacked: value.composedStacked,
    composedStackOffsets: value.composedStackOffsets,
    composedStackGap: value.composedStackGap,
    nearestPointHover: value.nearestPointHover,
  }), [
    value.data,
    value.renderData,
    value.xScale,
    value.yScale,
    value.yScales,
    value.width,
    value.height,
    value.innerWidth,
    value.innerHeight,
    value.margin,
    value.columnWidth,
    value.containerRef,
    value.lines,
    value.bands,
    value.referenceAreas,
    value.chartPhase,
    value.chartStatus,
    value.loadingLabel,
    value.yDomainTweenDuration,
    value.yDomainSkeletonByAxis,
    value.yDomainTargetByAxis,
    value.isLoaded,
    value.animationDuration,
    value.animationEasing,
    value.enterTransition,
    value.revealEpoch,
    value.notifyLoadingPulseComplete,
    value.xAccessor,
    value.dateLabels,
    value.xDomain,
    value.xDomainSlotCount,
    value.barScale,
    value.bandWidth,
    value.barXAccessor,
    value.orientation,
    value.stacked,
    value.stackOffsets,
    value.composedBarDataKeys,
    value.composedBarSize,
    value.composedMaxBarSize,
    value.composedBarGap,
    value.composedStacked,
    value.composedStackOffsets,
    value.composedStackGap,
    value.nearestPointHover,
  ]);

  const hover = useMemo(() => ({
    tooltipData: value.tooltipData,
    setTooltipData: value.setTooltipData,
    selection: value.selection,
    clearSelection: value.clearSelection,
    hoveredBarIndex: value.hoveredBarIndex,
    setHoveredBarIndex: value.setHoveredBarIndex,
    hoveredCandleIndex: value.hoveredCandleIndex,
    setHoveredCandleIndex: value.setHoveredCandleIndex,
  }), [
    value.tooltipData,
    value.setTooltipData,
    value.selection,
    value.clearSelection,
    value.hoveredBarIndex,
    value.setHoveredBarIndex,
    value.hoveredCandleIndex,
    value.setHoveredCandleIndex,
  ]);

  const hoverStore = useMemo(() => staticChartHoverStore(hover), [hover]);

  return (
    <ChartStableContext.Provider value={stable}>
      <ChartHoverStoreContext.Provider value={hoverStore}>
        <ChartHoverContext.Provider value={hover}>
          {children}
        </ChartHoverContext.Provider>
      </ChartHoverStoreContext.Provider>
    </ChartStableContext.Provider>
  );
}

/** Stable-slice context, for chart shells that build the slice themselves. */
export const ChartStableContextProvider = ChartStableContext.Provider;

/**
 * Stable slice — data, scales, dimensions, animation state, layout config.
 * Subscribers skip re-renders on hover (the hover slice lives in a separate
 * context). Prefer this in cold consumers like axes, grid, pattern fills.
 */
export function useChartStable() {
  const context = useContext(ChartStableContext);
  if (!context) {
    throw new Error(
      "useChartStable must be used within a ChartProvider. " +
        "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
    );
  }
  return context;
}

/**
 * Resolves a chart container element to use as a `createPortal` target.
 *
 * The element is kept in state: it is seeded once from the ref (already
 * attached when the chart renders after its container measured), then
 * re-captured after mount. Returns `null` during SSR and when the ref is not
 * attached on the first render.
 *
 * - Layout effect: when the container is a sibling or ancestor already
 *   attached, the synchronous re-render puts portalled axes and tooltips in
 *   the same painted frame as the plot.
 * - Passive effect: React attaches refs child-first in the layout phase, so a
 *   portal rendered *inside* its container (heatmap, choropleth tooltips) sees
 *   `null` above. By the passive phase every ref is attached; this picks it up.
 */
export function useChartPortalContainer(containerRef) {
  // Seed from the ref when it is already attached (charts render after their
  // container measured, so it usually is) — saves a mount re-render of every
  // portalled axis / tooltip. The effects below stay as the fallback.
  const [container, setContainer] = useState(() => containerRef?.current ?? null);
  useIsomorphicLayoutEffect(() => {
    setContainer(containerRef?.current ?? null);
  }, [containerRef]);
  useEffect(() => {
    const element = containerRef?.current ?? null;
    setContainer((previous) => (previous === element ? previous : element));
  }, [containerRef]);
  return container;
}

/**
 * Same margin object while its four numbers are unchanged, so an inline
 * `margin={{…}}` (or the default merge) doesn't defeat memoised chart cores.
 */
export function useStableMargin(margin) {
  const { top, right, bottom, left } = margin;
  return useMemo(
    () => ({ top, right, bottom, left }),
    [top, right, bottom, left]
  );
}

/** Y-scale for a series axis (`yAxisId` on Line / Area / YAxis). */
export function useYScale(yAxisId) {
  const { yScales, yScale } = useChartStable();
  const id =
    yAxisId == null || yAxisId === "" ? DEFAULT_Y_AXIS_ID : String(yAxisId);
  return yScales[id] ?? yScale;
}

/**
 * Y-scale at the end of the y-domain tween (the target domain), for series
 * that animate toward their final pixels rather than the mid-tween scale.
 * Falls back to {@link useYScale} when no target domain is published.
 */
export function useSettledYScale(yAxisId) {
  const { yDomainTargetByAxis, innerHeight } = useChartStable();
  const liveScale = useYScale(yAxisId);
  const id =
    yAxisId == null || yAxisId === "" ? DEFAULT_Y_AXIS_ID : String(yAxisId);
  const domain =
    yDomainTargetByAxis?.[id] ?? yDomainTargetByAxis?.[DEFAULT_Y_AXIS_ID];
  const min = domain?.[0];
  const max = domain?.[1];
  const settled = useMemo(
    () =>
      min == null || max == null
        ? null
        : scaleLinear().domain([min, max]).range([innerHeight, 0]),
    [min, max, innerHeight]
  );
  return settled ?? liveScale;
}

/**
 * Hover slice — tooltipData, selection, hovered bar / candle indices.
 * Subscribers re-render on every mouse move. Use only when the component
 * actually reads hover state.
 */
export function useChartHover() {
  const context = useContext(ChartHoverContext);
  if (!context) {
    throw new Error(
      "useChartHover must be used within a ChartProvider. " +
        "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
    );
  }
  return context;
}

/**
 * One derived value from the hover slice; re-renders only when it changes
 * (by `Object.is`). Return a primitive or a reference taken from the hover
 * state (e.g. `s.tooltipData`), not a fresh object or array. Prefer this over
 * `useChartHover()` for components that only care about part of hover, such
 * as "is the chart hovered" or "which index".
 */
export function useChartHoverSelector(selector) {
  const store = useContext(ChartHoverStoreContext);
  if (!store) {
    throw new Error(
      "useChartHoverSelector must be used within a ChartProvider. " +
        "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
    );
  }
  const getSelected = () => selector(store.getSnapshot());
  return useSyncExternalStore(store.subscribe, getSelected, getSelected);
}

/**
 * The hover store itself, for components that drive motion values straight
 * from hover changes without re-rendering. `null` outside a chart.
 */
export function useChartHoverStore() {
  return useContext(ChartHoverStoreContext);
}

export function selectTooltipData(hover) {
  return hover.tooltipData;
}

/** Whether the chart is hovered or a drag-selection is active. */
export function selectIsChartHovering(hover) {
  return hover.tooltipData !== null || hover.selection?.active === true;
}

/**
 * Merged stable + hover context. Convenient for components that need both,
 * but re-renders on every hover (because hover changes). Prefer
 * `useChartStable()` or `useChartHover()` for hot consumers that only need
 * one slice.
 */
export function useChart() {
  const stable = useChartStable();
  const hover = useChartHover();
  // Identity changes on every hover (hover is the volatile slice) — that's
  // fine for consumers using this merged hook; they explicitly opted in to
  // re-rendering on hover.
  return { ...stable, ...hover };
}

export default ChartStableContext;
