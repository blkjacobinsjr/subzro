import eventEmitter from "../utils/EventEmitter";
import useAppHaptics from "../hooks/useAppHaptics";

export default function NotificationsCard({ notification, onNotificationClick }) {
  const haptics = useAppHaptics();
  const subscription = notification?.subscriptionId;
  const subscriptionName = subscription?.name?.trim() || "Subscription";

  return (
    <div className="flex w-full min-w-0 items-stretch rounded-xl border border-slate-200/90 bg-white/80 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100">
      <button
        type="button"
        className="min-w-0 flex-1 rounded-l-xl p-3 text-left transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 dark:hover:bg-slate-700/60"
        title={subscriptionName}
        onClick={() => {
          haptics.confirm();
          onNotificationClick?.();
          eventEmitter.emit("notificationClicked", notification?._id);
        }}
      >
        <span className="block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
          How often do you use...
        </span>
        <span className="mt-0.5 block truncate text-sm font-medium">
          {subscriptionName}
        </span>
      </button>
      <button
        type="button"
        aria-label={`Mark ${subscriptionName} reminder as read`}
        title="Mark as read"
        className="mx-1 my-auto flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        onClick={() => {
          haptics.selection();
          eventEmitter.emit("markNotificationAsRead", notification?._id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5m12.75 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
}
