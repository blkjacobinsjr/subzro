import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import "./HeroLogosphere.css";

const LOGO_DOMAINS = [
  "spotify.com", "netflix.com", "amazon.com", "disneyplus.com",
  "youtube.com", "apple.com", "openai.com", "google.com",
  "notion.so", "slack.com", "dropbox.com", "hulu.com",
  "hbo.com", "twitch.tv", "canva.com", "adobe.com",
  "microsoft.com", "github.com", "zoom.us", "replit.com",
  "figma.com", "stripe.com", "shopify.com", "airbnb.com",
  "uber.com", "headspace.com", "duolingo.com", "tinder.com",
  "bumble.com", "hellofresh.com", "audible.com", "masterclass.com",
];

function getLogoStyle(index) {
  let size;
  let blur;
  let opacity;
  let depth;
  let zIndex;

  if (index < 3) {
    size = 120 + index * 30;
    blur = 7 + index * 2;
    opacity = 0.12;
    depth = 2;
    zIndex = 50;
  } else if (index % 8 === 0) {
    size = 64 + (index % 3) * 24;
    blur = 3 + (index % 2) * 2.5;
    opacity = 0.18;
    depth = 1.6;
    zIndex = 40;
  } else if (index % 8 < 4) {
    size = 32 + (index % 4) * 8;
    blur = 0.2;
    opacity = 0.38;
    depth = 0.8;
    zIndex = 30;
  } else {
    size = 18 + (index % 3) * 5;
    blur = 1.8;
    opacity = 0.15;
    depth = 0.4;
    zIndex = 10;
  }

  return {
    size,
    blur,
    opacity,
    depth,
    zIndex,
    top: `${(index * 17) % 85 + 7}%`,
    left: `${(index * 23) % 85 + 7}%`,
    duration: 7 + (index % 5) * 2,
    delay: index * 0.1,
  };
}

function FloatingLogo({ domain, index, pointerX, pointerY }) {
  const config = getLogoStyle(index);
  const x = useTransform(pointerX, (value) => value * config.depth);
  const y = useTransform(pointerY, (value) => value * config.depth);

  return (
    <motion.span
      className="home-hero__logo"
      style={{
        top: config.top,
        left: config.left,
        opacity: config.opacity,
        filter: `blur(${config.blur}px)`,
        zIndex: config.zIndex,
        x,
        y,
        "--home-logo-size": `${config.size}px`,
        "--home-logo-duration": `${config.duration}s`,
        "--home-logo-delay": `${config.delay}s`,
      }}
    >
      <span className="home-hero__logo-float">
        <img
          src={`https://img.logo.dev/${domain}?token=pk_fg7nZQ2oQQK-tZnjxKWfPQ`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
    </motion.span>
  );
}

export default function HeroLogosphere() {
  const fieldRef = useRef(null);
  const boundsRef = useRef(null);
  const finePointerRef = useRef(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { damping: 35, stiffness: 100 });
  const springY = useSpring(pointerY, { damping: 35, stiffness: 100 });
  const rotateX = useTransform(springY, (value) => value * -0.08);
  const rotateY = useTransform(springX, (value) => value * 0.08);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const node = fieldRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const handlePointerEnter = useCallback((event) => {
    finePointerRef.current =
      !reducedMotion &&
      event.pointerType === "mouse" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!finePointerRef.current) return;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  }, [reducedMotion]);

  const handlePointerMove = useCallback((event) => {
    if (!finePointerRef.current || event.pointerType !== "mouse") return;
    const bounds = boundsRef.current;
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(Math.max(-1, Math.min(1, x)) * 12);
    pointerY.set(Math.max(-1, Math.min(1, y)) * 12);
  }, [pointerX, pointerY]);

  const resetPointer = useCallback((event) => {
    if (event.pointerType !== "mouse") return;
    finePointerRef.current = false;
    boundsRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <>
      <motion.div
        ref={fieldRef}
        className="home-hero__logosphere"
        aria-hidden="true"
        data-active={inView && documentVisible && !reducedMotion ? "true" : "false"}
        style={reducedMotion ? undefined : { rotateX, rotateY }}
      >
        {LOGO_DOMAINS.map((domain, index) => (
          <FloatingLogo
            key={domain}
            domain={domain}
            index={index}
            pointerX={springX}
            pointerY={springY}
          />
        ))}
      </motion.div>
      <div
        className="home-hero__logo-pointer-surface"
        aria-hidden="true"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      />
    </>
  );
}
