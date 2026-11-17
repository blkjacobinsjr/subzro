import { useId } from "react";
import { useReducedMotion } from "motion/react";
import { useDataContext } from "../../contexts/dataContext";
import { filterByCategory } from "../../utils/filterHelper";
import { rankSubscriptionsByMonthlyPrice } from "../../utils/dashboardHeroModel";
import SubscriptionLogo from "../SubscriptionLogos";
import { Bar } from "./bar";
import { BarChart } from "./bar-chart";
import { BarYAxis } from "./bar-y-axis";
import { LinearGradient } from "./gradients";
import { Grid } from "./grid";
import { ChartTooltip } from "./tooltip/chart-tooltip";

const RANK_COLORS = [
  ["#6366f1", "#a855f7"],
  ["#ec4899", "#f43f5e"],
  ["#2dd4bf", "#10b981"],
  ["#60a5fa", "#06b6d4"],
  ["#fbbf24", "#f97316"],
];

function getDisplayName(name = "") {
  return (
    name
      .replace(/^(?:PAYPAL\s*\*?\s*|APPLE\s*\.?\s*COM\/BILL\s*|GOOGLE\s*\*?\s*)/i, "")
      .trim() || name
  );
}

function RankedBarTooltip({ point }) {
  if (!point) return null;

  return (
    <div
      className="rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-lg"
      role="tooltip"
    >
      <div className="flex items-center gap-2 font-semibold">
        <span className="flex h-5 w-5 items-center justify-center overflow-hidden rounded bg-white">
          <SubscriptionLogo subscriptionName={point.subscriptionName} />
        </span>
        <span>#{point.rank} {point.name}</span>
      </div>
      <div className="mt-1">€{point.amount?.toFixed(2)} / month</div>
    </div>
  );
}

export default function CategoryPieChart({ categoryId }) {
  const { subscriptions } = useDataContext();
  const prefersReducedMotion = useReducedMotion() === true;
  const instanceId = useId().replace(/:/g, "");
  const filteredSubscriptions = filterByCategory(subscriptions, categoryId) || [];
  const sortedData = rankSubscriptionsByMonthlyPrice(filteredSubscriptions, 10)
    .map((subscription, index) => ({
      rank: index + 1,
      subscriptionName: subscription.name,
      name: getDisplayName(subscription.name),
      categoryKey: `#${index + 1} ${getDisplayName(subscription.name)}`,
      amount: Number(subscription.value) || 0,
    }));

  if (!sortedData.length) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-black/40 dark:text-white/40">
        No subscriptions found
      </div>
    );
  }

  const seriesKeys = sortedData.map((_, index) => `rank-${index + 1}`);
  const chartData = sortedData.map((item, rowIndex) => ({
    ...item,
    ...Object.fromEntries(
      seriesKeys.map((key, seriesIndex) => [
        key,
        seriesIndex === rowIndex ? item.amount : 0,
      ]),
    ),
  }));
  const gradientIds = RANK_COLORS.map((_, index) =>
    `subscription-rank-${instanceId}-${index}`,
  );
  const summary = sortedData
    .map((item) => `${item.rank}. ${item.name}, €${item.amount.toFixed(2)} per month`)
    .join("; ");

  return (
    <div
      className="relative h-full min-h-0 w-full min-w-0"
      role="group"
      aria-label={`Top subscriptions by monthly cost. ${summary}`}
    >
      <BarChart
        data={chartData}
        xDataKey="categoryKey"
        orientation="horizontal"
        stacked
        aspectRatio="auto"
        animationDuration={prefersReducedMotion ? 0 : 900}
        margin={{ top: 8, right: 84, bottom: 8, left: 100 }}
        className="h-full w-full min-w-0"
      >
        {RANK_COLORS.map(([from, to], index) => (
          <LinearGradient
            key={gradientIds[index]}
            id={gradientIds[index]}
            from={from}
            to={to}
            vertical={false}
          />
        ))}
        <Grid vertical />
        {seriesKeys.map((dataKey, index) => (
          <Bar
            key={dataKey}
            dataKey={dataKey}
            fill={`url(#${gradientIds[index % RANK_COLORS.length]})`}
            animate={!prefersReducedMotion}
          />
        ))}
        <BarYAxis showAllLabels maxLabels={10} />
        <ChartTooltip
          showDatePill={false}
          content={({ point }) => <RankedBarTooltip point={point} />}
        />
      </BarChart>
      <div
        aria-label="Monthly costs"
        className="pointer-events-none absolute bottom-2 right-0 top-2 z-10 flex w-[72px] flex-col"
      >
        <span className="absolute -top-4 right-0 text-[8px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
          Monthly
        </span>
        {sortedData.map((item) => (
          <span
            key={`${item.rank}-${item.subscriptionName}`}
            className="flex flex-1 items-center justify-end whitespace-nowrap text-[10px] font-medium tabular-nums text-black/70 dark:text-white/70"
          >
            €{item.amount.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}
