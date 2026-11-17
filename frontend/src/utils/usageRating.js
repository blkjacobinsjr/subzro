export function formatUsageRating(score, valid) {
  if (!valid || typeof score !== "number" || !Number.isFinite(score) || score < 1 || score > 5) return null;
  return Number(score.toFixed(1));
}
