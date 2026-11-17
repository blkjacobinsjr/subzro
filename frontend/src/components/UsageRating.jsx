import "./UsageRating.css";
import { formatUsageRating } from "../utils/usageRating";

export default function UsageRating({ score, valid }) {
  const rating = formatUsageRating(score, valid);
  if (rating === null) return null;

  return (
    <span className="usage-rating" role="img" aria-label={`Average usage: ${rating} out of 5`}>
      <span className="usage-rating__label" aria-hidden="true">Usage</span>
      <span className="usage-rating__value" aria-hidden="true"><span className="usage-rating__number">{rating}</span><span className="usage-rating__scale">/5</span></span>
    </span>
  );
}
