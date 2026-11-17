import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Cloud,
  fetchSimpleIcons,
  renderSimpleIcon,
} from "react-icon-cloud";
import "./HeroLogosphere.css";

const LOGO_BRANDS = [
  { slug: "spotify", mark: "S" },
  { slug: "netflix", mark: "N" },
  { slug: "amazon", mark: "a" },
  { slug: "youtube", mark: "Y" },
  { slug: "apple", mark: "A" },
  { slug: "openai", mark: "AI" },
  { slug: "google", mark: "G" },
  { slug: "notion", mark: "N" },
  { slug: "slack", mark: "S" },
  { slug: "dropbox", mark: "D" },
  { slug: "twitch", mark: "T" },
  { slug: "canva", mark: "C" },
  { slug: "github", mark: "GH" },
  { slug: "figma", mark: "F" },
  { slug: "stripe", mark: "S" },
  { slug: "shopify", mark: "Sh" },
  { slug: "airbnb", mark: "B" },
  { slug: "uber", mark: "U" },
];

const LOGO_SLUGS = LOGO_BRANDS.map(({ slug }) => slug);

const CLOUD_OPTIONS = {
  shape: "sphere",
  reverse: true,
  depth: 1,
  wheelZoom: false,
  initial: [0.1, -0.1],
  imageScale: 2,
  activeCursor: "default",
  maxSpeed: 0.04,
  minSpeed: 0.02,
  clickToFront: 500,
  dragControl: true,
  imageMode: "image",
  imageRadius: "24%",
  imagePadding: 8,
  minBrightness: 0.32,
  maxBrightness: 0.95,
  outlineMethod: "none",
};

function getStaticPosition(index, count) {
  const y = 1 - ((index + 0.5) / count) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const frontDepth = Math.max(0, z);

  return {
    left: `${50 + x * 43}%`,
    top: `${50 + y * 43}%`,
    opacity: 0.36 + frontDepth * 0.58,
    transform: `translate(-50%, -50%) scale(${0.76 + frontDepth * 0.26})`,
  };
}

function StaticLogo({ icon, brand, index, count }) {
  const style = getStaticPosition(index, count);

  return (
    <span className="home-hero__logo-static" style={style}>
      {icon?.path ? (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d={icon.path} fill={`#${icon.hex.replace(/^#/, "")}`} />
        </svg>
      ) : (
        <span className="home-hero__logo-mark">{brand.mark}</span>
      )}
    </span>
  );
}

export default function HeroLogosphere() {
  const reducedMotion = useReducedMotion();
  const [icons, setIcons] = useState([]);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    let isCurrent = true;

    fetchSimpleIcons({ slugs: LOGO_SLUGS })
      .then(({ simpleIcons }) => {
        if (isCurrent) {
          setIcons(Object.values(simpleIcons).filter((icon) => icon.path));
        }
      })
      .catch(() => {
        if (isCurrent) setIcons([]);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const iconTags = useMemo(
    () =>
      icons.map((icon) =>
        renderSimpleIcon({
          icon,
          size: 42,
          bgHex: "#f1edf7",
          fallbackHex: "#6957a6",
          minContrastRatio: 1.4,
          aProps: {
            href: undefined,
            target: undefined,
            rel: undefined,
            "aria-hidden": true,
            tabIndex: -1,
            onClick: (event) => event.preventDefault(),
            style: { cursor: "grab" },
          },
          imgProps: { draggable: false },
        }),
      ),
    [icons],
  );
  const canAnimate = !reducedMotion && documentVisible && iconTags.length > 0;
  const staticIcons = useMemo(
    () =>
      LOGO_BRANDS.map((brand, index) => ({
        brand,
        icon: icons.find((candidate) => candidate.slug === brand.slug),
        index,
      })),
    [icons],
  );

  return (
    <div className="home-hero__logosphere" aria-hidden="true">
      {canAnimate ? (
        <Cloud
          id="homepage-logo-sphere"
          options={CLOUD_OPTIONS}
          containerProps={{
            className: "home-hero__cloud",
            "aria-hidden": true,
          }}
          canvasProps={{
            className: "home-hero__cloud-canvas",
            "aria-hidden": true,
          }}
        >
          {iconTags}
        </Cloud>
      ) : (
        <div className="home-hero__logo-static-field">
          {staticIcons.map(({ brand, icon, index }) => (
            <StaticLogo
              key={brand.slug}
              brand={brand}
              icon={icon}
              index={index}
              count={staticIcons.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
