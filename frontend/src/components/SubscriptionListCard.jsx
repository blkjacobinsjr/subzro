import { useRef, useState, useCallback, useMemo } from "react";
import CategoryIcon from "./CategoryIcon";
import SubscriptionLogo from "./SubscriptionLogos";
import eventEmitter from "../utils/EventEmitter";
import useAppHaptics from "../hooks/useAppHaptics";
import UsageRating from "./UsageRating";
import { formatUsageRating } from "../utils/usageRating";

const SWIPE_THRESHOLD = 100;
const MAX_SWIPE_DISTANCE = 150;

export default function SubscriptionListCard({
  subscription,
  clickHandler,
  showCategory = true,
  className = "",
  style,
  enableDelete = true,
}) {
  const haptics = useAppHaptics();
  const usageRating = formatUsageRating(subscription?.score, subscription?.validScore);
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(null);
  const thresholdCrossed = useRef(false);

  const displayName = useMemo(() => {
    const cleanName = subscription?.name
      ?.replace(/^(?:PAYPAL\s*\*?\s*|APPLE\s*\.?\s*COM\/BILL\s*|GOOGLE\s*\*?\s*)/i, "")
      .replace(/[^\p{L}\s]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleanName || subscription?.name;
  }, [subscription?.name]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    haptics.warning();
    eventEmitter.emit("deleteSubscription", subscription);
  }, [haptics, subscription]);

  const handleKeyDown = useCallback((e) => {
    if (!enableDelete) return;
    // Delete on Backspace or Delete key when focused
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      haptics.warning();
      eventEmitter.emit("deleteSubscription", subscription);
    }
  }, [enableDelete, haptics, subscription]);

  const handleCardClick = useCallback(() => {
    haptics.tap();
    clickHandler?.();
  }, [clickHandler, haptics]);

  function handleTouchStart(e) {
    if (!enableDelete) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    thresholdCrossed.current = false;
    setIsSwiping(true);
  }

  function handleTouchMove(e) {
    if (!enableDelete || !isSwiping) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Determine if this is a horizontal or vertical swipe on first significant movement
    if (isHorizontalSwipe.current === null && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // Only handle horizontal swipes (left only)
    if (isHorizontalSwipe.current && deltaX < 0) {
      setSwipeX(Math.max(deltaX, -MAX_SWIPE_DISTANCE)); // Limit swipe distance
      if (deltaX < -SWIPE_THRESHOLD) {
        if (!thresholdCrossed.current) {
          thresholdCrossed.current = true;
          haptics.dragThreshold();
        }
      } else {
        thresholdCrossed.current = false;
      }
    }
  }

  function handleTouchEnd() {
    if (!enableDelete) return;
    setIsSwiping(false);

    if (swipeX < -SWIPE_THRESHOLD) {
      // Swipe past threshold - delete
      setSwipeX(-MAX_SWIPE_DISTANCE); // Animate to full reveal
      haptics.dragCommit();
      setTimeout(() => {
        eventEmitter.emit("deleteSubscription", subscription);
        setSwipeX(0);
      }, 150);
    } else {
      // Spring back
      if (Math.abs(swipeX) > 16) {
        haptics.dragSnapBack();
      }
      setSwipeX(0);
    }
    isHorizontalSwipe.current = null;
    thresholdCrossed.current = false;
  }

  // Memoize style object to prevent re-renders
  const cardStyle = useMemo(() => ({
    ...style,
    transform: `translateX(${swipeX}px)`,
    transition: isSwiping ? "none" : "transform 0.2s ease-out",
  }), [style, swipeX, isSwiping]);

  return (
    <div
      className={`group interactive-hover-bg relative grid w-full min-w-0 cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/30 bg-white/40 p-3 backdrop-blur-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 [--hover-bg:rgba(255,255,255,0.6)] dark:border-white/10 dark:bg-white/10 dark:[--hover-bg:rgba(255,255,255,0.15)] ${enableDelete ? "pr-14" : ""} ${className}`}
      key={subscription?._id}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="button"
      aria-label={`${displayName}, €${subscription?.price} per ${subscription?.interval}${usageRating === null ? "" : `, average usage ${usageRating} out of 5`}`}
      style={cardStyle}
    >
      {/* Subtle X button - top right, appears on hover/focus */}
      {enableDelete && (
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${displayName}`}
          className="btn-press pointer-events-none absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-black/50 opacity-0 transition-[opacity,transform] duration-150 hover:text-red-600 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 dark:text-white/50 dark:hover:text-red-400"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-3 w-3"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          </span>
        </button>
      )}
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/20 dark:bg-white/90">
        <SubscriptionLogo subscriptionName={displayName || subscription?.name} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-col">
          <div className="truncate text-sm font-medium leading-none text-black/90 dark:text-white">
            {displayName}
          </div>
          {showCategory && (
            <div className="flex min-w-0 items-center justify-start gap-2 pt-1 text-xs text-black/50 dark:text-white/50">
              <CategoryIcon icon={subscription?.category?.icon} iconSize={4} />
              <div className="truncate">
                {subscription?.category?.name || "Uncategorized"}
              </div>
            </div>
          )}
          <UsageRating score={subscription?.score} valid={subscription?.validScore} />
        </div>
      </div>
      <div className="text-right">
        <div className="relative whitespace-nowrap">
          <p className="font-medium text-black/90 dark:text-white">€{subscription.price}</p>
          <p className="text-[10px] text-black/40 dark:text-white/40">
            {subscription.interval === "month"
              ? `${Math.round(subscription.price / 5)} ☕/mo`
              : `${Math.round(subscription.price / 5)} ☕/yr`}
          </p>
        </div>
      </div>
    </div>
  );
}
