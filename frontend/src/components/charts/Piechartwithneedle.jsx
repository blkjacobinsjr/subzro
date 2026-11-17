import { useEffect, useRef, useState } from "react";
import { Gauge } from "./gauge";

export default function PieChartWithNeedle({
  maxFirstSegment = 219,
  needleValue = 0,
  compact = false,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const spend = Math.max(0, Number(needleValue) || 0);
  const referenceSpend = Math.max(1, Number(maxFirstSegment) || 219);
  const totalRange = referenceSpend + 2 * Math.floor(referenceSpend / 2);
  const percent = Math.min(100, (spend / totalRange) * 100);

  const amberThreshold = referenceSpend * 1.5;
  const wrapperMinimum = compact ? "min-h-[80px]" : "min-h-[120px]";

  return (
    <div
      className={`flex h-full ${wrapperMinimum} w-full min-w-0 flex-col`}
      role="img"
      aria-label={`Monthly spending: €${spend.toFixed(2)}. Reference spending: €${referenceSpend.toFixed(2)}. Amber threshold: €${amberThreshold.toFixed(2)}. Red above €${amberThreshold.toFixed(2)}.`}
    >
      <div ref={containerRef} className="min-h-0 w-full flex-1">
        {size.width > 0 && size.height > 0 && (
          <Gauge
            width={size.width}
            height={size.height}
            value={percent}
            startAngle={180}
            endAngle={360}
            totalNotches={40}
            spacing={18}
            notchCornerRadius={2}
            needle={{ variant: "triangle", color: "#475569", length: 0.9, pivot: true }}
            zones={[
              { from: 0, to: 50, color: "#10b981" },
              { from: 50, to: 75, color: "#f59e0b" },
              { from: 75, to: 100, color: "#ef4444" },
            ]}
            zoneDisplay="both"
            activeFill="#10b981"
            inactiveFill="rgba(71, 85, 105, 0.15)"
          />
        )}
      </div>
      <div className="flex shrink-0 flex-col items-center text-center leading-tight">
        <span className={`font-semibold tabular-nums text-black/80 dark:text-white/80 ${compact ? "text-[9px]" : "text-xs"}`}>
          €{spend.toFixed(2)} / month
        </span>
        <span className={`text-black/50 dark:text-white/50 ${compact ? "text-[7px]" : "text-[10px]"}`}>
          Reference €{referenceSpend.toFixed(2)} / month
        </span>
      </div>
    </div>
  );
}
