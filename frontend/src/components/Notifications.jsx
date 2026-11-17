import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Popover, Portal, Transition } from "@headlessui/react";
import NotificationsCard from "./NotificationsCard";
import { useDataContext } from "../contexts/dataContext";
import useAppHaptics from "../hooks/useAppHaptics";
import "./Notifications.css";

const STOP_PING_AFTER_SECONDS = 16;
const VIEWPORT_GUTTER = 12;
const PANEL_GAP = 8;

function getPanelPosition(button, panel) {
  const triggerRect = button.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;
  const panelWidth = panel.offsetWidth;
  const left = Math.max(
    VIEWPORT_GUTTER,
    Math.min(
      triggerRect.right - panelWidth,
      viewportWidth - panelWidth - VIEWPORT_GUTTER,
    ),
  );

  const availableBelow = Math.max(
    0,
    viewportHeight - triggerRect.bottom - PANEL_GAP - VIEWPORT_GUTTER,
  );
  const availableAbove = Math.max(
    0,
    triggerRect.top - PANEL_GAP - VIEWPORT_GUTTER,
  );
  const naturalHeight = panel.scrollHeight;
  const showBelow =
    availableBelow >= naturalHeight || availableBelow >= availableAbove;
  const maxHeight = Math.max(0, showBelow ? availableBelow : availableAbove);
  const top = showBelow
    ? Math.min(
        triggerRect.bottom + PANEL_GAP,
        viewportHeight - VIEWPORT_GUTTER - maxHeight,
      )
    : Math.max(
        VIEWPORT_GUTTER,
        triggerRect.top - PANEL_GAP - Math.min(naturalHeight, maxHeight),
      );
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const horizontalOrigin =
    triggerCenter - left < panelWidth * 0.35
      ? "left"
      : triggerCenter - left > panelWidth * 0.65
        ? "right"
        : "center";
  const origin = `${showBelow ? "top" : "bottom"}-${horizontalOrigin}`;

  return { left, top, maxHeight, origin };
}

function NotificationsContent({ open, close }) {
  const haptics = useAppHaptics();
  const { notifications } = useDataContext();
  const buttonRef = useRef(null);
  const [panelElement, setPanelElement] = useState(null);
  const [animatePing, setAnimatePing] = useState(true);
  const [panelPosition, setPanelPosition] = useState(null);

  useEffect(() => {
    setAnimatePing(true);
    const timeout = setTimeout(
      () => setAnimatePing(false),
      STOP_PING_AFTER_SECONDS * 1000,
    );
    return () => clearTimeout(timeout);
  }, [notifications]);

  useLayoutEffect(() => {
    if (!open || !panelElement) return undefined;

    let animationFrame = null;
    const updatePosition = () => {
      animationFrame = null;
      if (!buttonRef.current) return;
      const nextPosition = getPanelPosition(buttonRef.current, panelElement);
      setPanelPosition((currentPosition) => {
        if (
          currentPosition &&
          currentPosition.left === nextPosition.left &&
          currentPosition.top === nextPosition.top &&
          currentPosition.maxHeight === nextPosition.maxHeight &&
          currentPosition.origin === nextPosition.origin
        ) {
          return currentPosition;
        }
        return nextPosition;
      });
    };
    const schedulePositionUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updatePosition);
      }
    };
    const handleScroll = (event) => {
      if (event.target instanceof Node && panelElement.contains(event.target)) return;
      schedulePositionUpdate();
    };

    updatePosition();
    window.addEventListener("resize", schedulePositionUpdate);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("resize", schedulePositionUpdate);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, notifications, panelElement]);

  return (
    <>
            <Popover.Button
              ref={buttonRef}
              onClick={haptics.tap}
              aria-label={`Notifications${notifications?.length ? `, ${notifications.length} unread` : ""}`}
              className="relative rounded-full border border-black/25 bg-white/25 p-1 hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>

              {notifications?.length > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold leading-none text-white">
                  {notifications.length > 99 ? "99+" : notifications.length}
                  {animatePing && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-sky-500 opacity-70" />
                  )}
                </span>
              )}
            </Popover.Button>

            <Portal>
              <Transition
                as={Fragment}
                show={open}
                enter="notification-dropdown-open"
                enterFrom="notification-dropdown-pre"
                enterTo="notification-dropdown-active"
                leave="notification-dropdown-close"
                leaveFrom="notification-dropdown-active"
                leaveTo="notification-dropdown-closed"
              >
                <Popover.Panel
                  ref={setPanelElement}
                  static
                  data-origin={panelPosition?.origin || "top-right"}
                  className="notification-dropdown-panel fixed z-[1000] w-[min(24rem,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_20px_48px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:bg-slate-900/95"
                  style={{
                    left: panelPosition?.left ?? 12,
                    top: panelPosition?.top ?? 12,
                    maxHeight: panelPosition?.maxHeight ?? "calc(100vh - 24px)",
                    visibility: panelPosition ? "visible" : "hidden",
                  }}
                >
                  <div className="sticky top-0 z-10 mb-2 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-2 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
                    <span>Notifications</span>
                    <span className="font-normal text-slate-400">
                      {notifications?.length || 0} to review
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {notifications?.map((notification) => (
                      <NotificationsCard
                        key={notification._id}
                        notification={notification}
                        onNotificationClick={close}
                      />
                    ))}
                    {!notifications?.length && (
                      <div className="p-3 text-center text-sm text-slate-500">
                        You currently have no notifications.
                      </div>
                    )}
                  </div>
                </Popover.Panel>
              </Transition>
            </Portal>
    </>
  );
}

export default function Notifications() {
  return (
    <Popover className="relative">
      {({ open, close }) => <NotificationsContent open={open} close={close} />}
    </Popover>
  );
}
