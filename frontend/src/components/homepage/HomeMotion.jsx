import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "./HomeMotion.css";

const EASE_OUT = [0.16, 1, 0.3, 1];
const HIDDEN = { opacity: 0, filter: "blur(6px)", y: 12 };
const SHARP = {
  opacity: 1,
  filter: "blur(0px)",
  y: 0,
  transition: { duration: 0.7, ease: EASE_OUT },
  transitionEnd: { filter: "none" },
};
const ITEM_VARIANTS = { hidden: HIDDEN, visible: SHARP };

function useRevealState(ref, amount, delay, stagger = 0) {
  const inView = useInView(ref, {
    once: true,
    amount,
    margin: "0px 0px -5% 0px",
  });
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const groupVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: { delayChildren: delay, staggerChildren: stagger },
      },
    }),
    [delay, stagger],
  );

  useEffect(() => {
    if (reducedMotion) controls.set("visible");
    else if (inView) controls.start("visible");
  }, [controls, inView, reducedMotion]);

  return { controls, groupVariants, reducedMotion };
}

export function Reveal({
  as = "div",
  className = "",
  children,
  amount = 0.14,
  delay = 0,
}) {
  const ref = useRef(null);
  const { controls, reducedMotion } = useRevealState(ref, amount, 0);
  const variants = useMemo(
    () => ({
      hidden: HIDDEN,
      visible: {
        ...SHARP,
        transition: { ...SHARP.transition, delay },
      },
    }),
    [delay],
  );
  const Tag = motion[as];

  return (
    <Tag
      ref={ref}
      className={`home-motion-reveal ${className}`.trim()}
      initial={reducedMotion ? false : "hidden"}
      animate={controls}
      variants={variants}
      onFocusCapture={() => controls.set("visible")}
    >
      {children}
    </Tag>
  );
}

export function RevealGroup({
  as = "div",
  className = "",
  children,
  amount = 0.14,
  delay = 0,
  stagger = 0.08,
  whileHover,
}) {
  const ref = useRef(null);
  const { controls, groupVariants, reducedMotion } = useRevealState(
    ref,
    amount,
    delay,
    stagger,
  );
  const Tag = motion[as];

  return (
    <Tag
      ref={ref}
      className={`home-motion-reveal ${className}`.trim()}
      initial={reducedMotion ? false : "hidden"}
      animate={controls}
      variants={groupVariants}
      whileHover={reducedMotion ? undefined : whileHover}
      onFocusCapture={() => controls.set("visible")}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ as = "div", className = "", children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag
      {...props}
      className={`home-motion-item ${className}`.trim()}
      variants={ITEM_VARIANTS}
    >
      {children}
    </Tag>
  );
}

export function HeroHeadline({ text, className = "" }) {
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);
  const variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: { delayChildren: 0.04, staggerChildren: 0.06 },
      },
    }),
    [],
  );
  const wordVariants = useMemo(
    () => ({
      hidden: { opacity: 0, filter: "blur(6px)", y: 12 },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: { duration: 0.7, ease: EASE_OUT },
        transitionEnd: { filter: "none" },
      },
    }),
    [],
  );

  return (
    <motion.h1
      className={`home-motion-headline ${className}`.trim()}
      aria-label={text}
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      variants={variants}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <motion.span
            className="home-motion-word"
            variants={wordVariants}
            aria-hidden="true"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export function ScrollWordsReveal({ text, className = "" }) {
  const ref = useRef(null);
  const words = useMemo(() => text.split(" "), [text]);
  const [settledThrough, setSettledThrough] = useState(-1);
  const settledRef = useRef(-1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "start 42%"],
  });
  const reducedMotion = useReducedMotion();

  const latchSettledWords = useCallback(
    (progress) => {
      let last = -1;
      const spread = 0.8;
      words.forEach((_, index) => {
        const start = (index / words.length) * spread;
        if (progress >= Math.min(1, start + 0.2)) last = index;
      });
      if (last > settledRef.current) {
        settledRef.current = last;
        setSettledThrough(last);
      }
    },
    [words],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!reducedMotion) latchSettledWords(progress);
  });

  useEffect(() => {
    if (reducedMotion) {
      settledRef.current = words.length - 1;
      setSettledThrough(words.length - 1);
    }
    else latchSettledWords(scrollYProgress.get());
  }, [latchSettledWords, reducedMotion, scrollYProgress, words.length]);

  return (
    <motion.h2
      ref={ref}
      className={`home-motion-scroll-heading ${className}`.trim()}
      aria-label={text}
    >
      {words.map((word, index) => {
        const start = (index / words.length) * 0.8;
        const end = Math.min(1, start + 0.2);
        return (
          <span key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            {index <= settledThrough || reducedMotion ? (
              <span className="home-motion-scroll-word" aria-hidden="true">
                {word}
              </span>
            ) : (
              <ScrollWord
                word={word}
                progress={scrollYProgress}
                start={start}
                end={end}
              />
            )}
          </span>
        );
      })}
    </motion.h2>
  );
}

function ScrollWord({ word, progress, start, end }) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const blur = useTransform(progress, [start, end], [4, 0]);
  const y = useTransform(progress, [start, end], [4, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.span
      className="home-motion-scroll-word"
      aria-hidden="true"
      style={{ opacity, filter, y }}
    >
      {word}
    </motion.span>
  );
}

export function HeroArtwork({ className = "", children }) {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const y = useTransform(scrollY, [0, 420], [0, 40]);
  const scale = useTransform(scrollY, [0, 900], [1, 0.96]);

  return (
    <motion.div
      className={`home-motion-artwork ${className}`.trim()}
      style={reducedMotion ? undefined : { y, scale }}
    >
      {children}
    </motion.div>
  );
}

export function TiltReveal({ className = "", children, delay = 0.08 }) {
  const ref = useRef(null);
  const { controls, reducedMotion } = useRevealState(ref, 0.12, 0);
  const variants = useMemo(
    () => ({
      hidden: HIDDEN,
      visible: {
        ...SHARP,
        transition: { ...SHARP.transition, delay },
      },
    }),
    [delay],
  );
  const stableBounds = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shiftX = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 210, damping: 24, mass: 0.7 });
  const springY = useSpring(rotateY, { stiffness: 210, damping: 24, mass: 0.7 });
  const springShift = useSpring(shiftX, {
    stiffness: 210,
    damping: 24,
    mass: 0.7,
  });

  const onPointerMove = useCallback(
    (event) => {
      if (
        reducedMotion ||
        event.pointerType !== "mouse" ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }
      const bounds = stableBounds.current ?? event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      rotateX.set((0.5 - y) * 6);
      rotateY.set((x - 0.5) * 8);
      shiftX.set((x - 0.5) * 12);
    },
    [reducedMotion, rotateX, rotateY, shiftX],
  );

  const resetTilt = useCallback(() => {
    stableBounds.current = null;
    rotateX.set(0);
    rotateY.set(0);
    shiftX.set(0);
  }, [rotateX, rotateY, shiftX]);

  return (
    <motion.div
      ref={ref}
      className={`home-motion-reveal home-motion-tilt ${className}`.trim()}
      initial={reducedMotion ? false : "hidden"}
      animate={controls}
      variants={variants}
      onFocusCapture={() => controls.set("visible")}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          stableBounds.current = event.currentTarget.getBoundingClientRect();
        }
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      style={
        reducedMotion
          ? undefined
          : {
              transformPerspective: 900,
              rotateX: springX,
              rotateY: springY,
              x: springShift,
            }
      }
    >
      {children}
    </motion.div>
  );
}
