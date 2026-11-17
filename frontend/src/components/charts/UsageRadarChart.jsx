import { useDataContext } from "../../contexts/dataContext";
import { RadarArea } from "./radar-area";
import { RadarAxis } from "./radar-axis";
import { RadarChart } from "./radar-chart";
import { RadarGrid } from "./radar-grid";
import { RadarLabels } from "./radar-labels";

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

export default function UsageRadarChart({ compact = false }) {
  const { usedCategories } = useDataContext();
  const categories = usedCategories || [];

  if (!categories.length) {
    return (
      <div className="flex h-full min-h-[80px] items-center justify-center text-xs text-black/50 dark:text-white/50">
        Insufficient data
      </div>
    );
  }

  const metrics = categories.map((category, index) => ({
    key: `category-${index}`,
    label: category.name,
  }));
  const costs = categories.map((category) => asNumber(category.totalCost));
  const maxCost = Math.max(...costs, 1);
  const valuesFor = (values) =>
    Object.fromEntries(metrics.map((metric, index) => [metric.key, values[index]]));
  const data = [
    {
      label: "Total cost",
      color: "#ec4899",
      values: valuesFor(costs.map((cost) => (cost / maxCost) * 100)),
    },
    {
      label: "Usage score",
      color: "#6366f1",
      values: valuesFor(categories.map((category) => (asNumber(category.categoryScore) / 5) * 100)),
    },
  ];
  const summary = categories
    .map((category) => `${category.name}: €${asNumber(category.totalCost).toFixed(2)} monthly, score ${asNumber(category.categoryScore).toFixed(1)} of 5`)
    .join("; ");

  const chartClassName = compact
    ? "mx-auto h-full w-full max-w-[280px]"
    : "mx-auto h-[calc(100%-22px)] w-full max-w-[280px]";

  return (
    <div
      className="flex h-full min-h-[80px] w-full min-w-0 flex-col"
      role="group"
      aria-label={`Category cost and usage radar chart. Cost is scaled to the highest category; usage scores are out of 5. ${summary}`}
    >
      <RadarChart
        data={data}
        metrics={metrics}
        margin={compact ? 8 : 40}
        className={chartClassName}
      >
        <RadarGrid showLabels={false} />
        <RadarAxis />
        <RadarLabels offset={compact ? 4 : 14} fontSize={compact ? 6 : 10} />
        {data.map((series, index) => (
          <RadarArea key={series.label} index={index} />
        ))}
      </RadarChart>
      {!compact && (
        <div className="flex h-[22px] shrink-0 items-center justify-center gap-4 text-[10px] text-black/60 dark:text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500" aria-hidden="true" />
            Cost (% of highest)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true" />
            Usage score (/ 5)
          </span>
        </div>
      )}
    </div>
  );
}
