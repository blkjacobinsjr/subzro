import { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HeroArtwork,
  HeroHeadline,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollWordsReveal,
  TiltReveal,
} from "../components/homepage/HomeMotion";
import UsageDemo from "../components/homepage/UsageDemo";
import HeroLogosphere from "../components/homepage/HeroLogosphere";
import "./Homepage.css";

const featureSections = [
  {
    badge: "Dashboard",
    title: "Your full picture, one glance",
    description:
      "See your active subscriptions and monthly spend on a single screen. Keep recurring costs easy to find and review.",
    screenshot: "/newproductscreenshots/dashboard.png",
    imageAlt: "Subzro dashboard showing monthly spend and recent subscriptions",
    icon: "/homepage-icons/map.webp",
    mascot: "/mascot-subzro/mascotwave.webp",
    mascotAlt: "Subzro mascot waving",
  },
  {
    badge: "Insights",
    title: "See what gets used",
    description:
      "Review your most and least used subscriptions, then decide what still feels worth keeping.",
    screenshot: "/newproductscreenshots/insightsoverview.png",
    imageAlt: "Subzro insights overview with subscription usage information",
    icon: "/homepage-icons/magnifier.webp",
    mascot: "/mascot-subzro/mascotwink.webp",
    mascotAlt: "Subzro mascot winking",
  },
  {
    badge: "Analytics",
    title: "Understand where it goes",
    description:
      "See your highest-spend categories and follow individual subscription costs over time as you update your list.",
    screenshot: "/newproductscreenshots/insightsmix.png",
    imageAlt: "Subzro analytics showing subscription spending by category",
    icon: "/homepage-icons/magnifier.webp",
    mascot: "/mascot-subzro/mascotlaugh.webp",
    mascotAlt: "Subzro mascot laughing",
  },
  {
    badge: "Manage",
    title: "Keep the list in your hands",
    description:
      "Search and filter your subscriptions. Use each service's score to decide what stays, what needs a review, and what you want to cancel.",
    screenshot: "/newproductscreenshots/addsubscreenshot.png",
    imageAlt: "Subzro subscription management screen",
    icon: "/homepage-icons/puzzle.webp",
    mascot: "/mascot-subzro/mascotwinksmile.webp",
    mascotAlt: "Subzro mascot smiling",
  },
];

const reasons = [
  {
    title: "One clear list",
    description:
      "Bring streaming services, work tools, and memberships together in one view.",
      icon: "/homepage-icons/puzzle.webp",
  },
  {
    title: "Usage-led reviews",
    description:
      "Check how often you use a service before you decide what to keep or cancel.",
      icon: "/homepage-icons/magnifier.webp",
  },
  {
    title: "Start without a bank link",
    description:
      "Add your subscriptions without connecting a bank account.",
      icon: ShieldCheckIcon,
  },
];

const steps = [
  {
    step: "1",
    title: "Add subscriptions",
    description:
      "Enter the recurring services you want to keep track of. No bank login is needed.",
  },
  {
    step: "2",
    title: "See the full picture",
    description:
      "Review your subscription list, monthly costs, and usage insights together.",
  },
  {
    step: "3",
    title: "Choose what stays",
    description:
      "Keep, cancel, or revisit subscriptions based on what works for you.",
  },
];

const menuLinks = [
  { to: "/pricing", label: "Pricing" },
  { to: "/imprint", label: "Impressum" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/refund", label: "Refunds" },
];

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const reduceMenuMotion = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setActiveMenuItem(null);
      menuButtonRef.current?.focus();
    };
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setActiveMenuItem(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveMenuItem(null);
  };

  return (
    <div className="homepage">
      <header className="home-header">
        <nav className="home-nav" aria-label="Main navigation">
          <Link to="/" className="home-brand" aria-label="Subzro home">
            <img src="/subzero_logo_icon.png" alt="" />
            <span>subzro</span>
          </Link>

          <div className="home-nav__actions" ref={menuRef}>
            <Link to="/pricing" className="home-nav__link">
              Pricing
            </Link>
            <SignedOut>
              <Link to="/login" className="home-nav__link">
                Sign in
              </Link>
              <Link to="/signup" className="home-button home-button--small">
                Get started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="home-button home-button--small">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl={window.location.origin} />
            </SignedIn>
            <button
              ref={menuButtonRef}
              type="button"
              className="home-nav__menu-button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="home-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span>{menuOpen ? "Close" : "More"}</span>
              <span className="home-nav__menu-mark" aria-hidden="true" />
            </button>
            <div
              id="home-menu"
              className="home-nav__menu"
              hidden={!menuOpen}
            >
              <LayoutGroup id="home-menu-links">
                <div
                  className="home-nav__menu-list"
                  data-static-highlight={reduceMenuMotion ? "true" : undefined}
                  onMouseLeave={() => setActiveMenuItem(null)}
                >
                  {menuLinks.map((item) => (
                    <motion.div
                      key={item.to}
                      className="home-nav__menu-item"
                      data-active={activeMenuItem === item.to || undefined}
                      onHoverStart={() => setActiveMenuItem(item.to)}
                      onPointerLeave={(event) => {
                        if (
                          !event.currentTarget.parentElement?.contains(
                            event.relatedTarget,
                          )
                        ) {
                          setActiveMenuItem(null);
                        }
                      }}
                      onFocusCapture={() => setActiveMenuItem(item.to)}
                      onBlur={(event) => {
                        if (!menuRef.current?.contains(event.relatedTarget)) {
                          setActiveMenuItem(null);
                        }
                      }}
                    >
                      {activeMenuItem === item.to && !reduceMenuMotion && (
                        <motion.span
                          className="home-nav__highlight"
                          layoutId="home-menu-highlight"
                          transition={{
                            type: "spring",
                            stiffness: 480,
                            damping: 38,
                            mass: 0.7,
                          }}
                          aria-hidden="true"
                        />
                      )}
                      <Link
                        to={item.to}
                        className="home-nav__menu-link"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </LayoutGroup>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-container home-hero__grid">
            <div className="home-hero__copy">
              <HeroHeadline text="Zero in on What Matters" />
              <RevealGroup
                className="home-hero__copy-details"
                delay={0.2}
                stagger={0.1}
              >
                <RevealItem as="p" className="home-lead">
                  Your personal finance pet for subscriptions. Bring recurring
                  costs and little usage check-ins together, then decide what
                  still earns a spot in your list.
                </RevealItem>
                <RevealItem as="div" className="home-hero__actions">
                  <SignedOut>
                    <Link to="/signup" className="home-button">
                      Get started
                    </Link>
                    <Link
                      to="/login"
                      className="home-button home-button--quiet"
                    >
                      Sign in
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/dashboard" className="home-button">
                      Go to dashboard
                    </Link>
                  </SignedIn>
                </RevealItem>
                <RevealItem as="p" className="home-hero__note">
                  No bank connection needed to get started.
                </RevealItem>
              </RevealGroup>
            </div>

            <Reveal className="home-hero__visual" delay={0.24} amount={0.08}>
              <HeroArtwork className="home-hero__visual-depth">
                <HeroLogosphere />
                <picture>
                  <source
                    media="(max-width: 680px)"
                    srcSet="/newproductscreenshots/3Ddashboardlandscape.png"
                  />
                  <img
                    src="/newproductscreenshots/3Ddashboardlandscapesuper.png"
                    alt="Subzro dashboard on a phone, surrounded by glossy 3D shapes"
                    decoding="async"
                  />
                </picture>
              </HeroArtwork>
            </Reveal>
          </div>
        </section>

        <section className="home-summary" aria-label="Subzro at a glance">
          <RevealGroup className="home-container home-summary__grid" delay={0.06}>
            <RevealItem as="div">
              <h2>One place</h2>
              <p>See your recurring subscriptions together.</p>
            </RevealItem>
            <RevealItem as="div">
              <h2>Clear costs</h2>
              <p>Keep monthly spend easy to review.</p>
            </RevealItem>
            <RevealItem as="div">
              <h2>Your call</h2>
              <p>Choose what to keep, review, or cancel.</p>
            </RevealItem>
          </RevealGroup>
        </section>

        <section className="home-section home-features">
          <div className="home-container">
            <RevealGroup className="home-section__intro">
              <RevealItem as="h2">What you can do with Subzro</RevealItem>
              <RevealItem as="p">
                See recurring costs, understand your usage, and make decisions
                with the full picture in view.
              </RevealItem>
            </RevealGroup>

            <div className="home-features__list">
              {featureSections.map((feature, index) => (
                <article
                  key={feature.badge}
                  className={"home-feature" + (index % 2 ? " home-feature--reverse" : "")}
                >
                  <TiltReveal className="home-feature__visual">
                    <img
                      src={feature.screenshot}
                      alt={feature.imageAlt}
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      className="home-feature__mascot"
                      src={feature.mascot}
                      alt={feature.mascotAlt}
                      loading="lazy"
                      decoding="async"
                    />
                  </TiltReveal>
                  <RevealGroup
                    className="home-feature__copy"
                    delay={0.08}
                    stagger={0.08}
                    amount={0.16}
                  >
                    <RevealItem as="p" className="home-label home-feature__label">
                      <img src={feature.icon} alt="" loading="lazy" />
                      {feature.badge}
                    </RevealItem>
                    <RevealItem as="h3">{feature.title}</RevealItem>
                    <RevealItem as="p">{feature.description}</RevealItem>
                  </RevealGroup>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-review">
          <div className="home-container">
            <RevealGroup className="home-review__intro">
              <RevealItem as="p" className="home-label">
                Usage review
              </RevealItem>
              <RevealItem as="h2">A quiet check-in on what you use.</RevealItem>
              <RevealItem as="p">
                Subzro can ask how often you use a subscription, so you can
                review it before deciding what to keep or cancel.
              </RevealItem>
            </RevealGroup>
            <Reveal className="home-review__demo" amount={0.08}>
              <UsageDemo />
            </Reveal>
          </div>
        </section>

        <section className="home-section home-reasons">
          <div className="home-container">
            <RevealGroup className="home-section__intro">
              <RevealItem as="h2">Made for the subscriptions you juggle</RevealItem>
              <RevealItem as="p">
                One calm place to look across streaming, work, and the things
                you belong to.
              </RevealItem>
            </RevealGroup>
            <div className="home-reasons__list">
              {reasons.map((reason) => {
                const ReasonIcon = reason.icon;
                return (
                  <RevealGroup
                    as="article"
                    key={reason.title}
                    className="home-reason"
                    stagger={0.08}
                    whileHover={{ y: -2 }}
                  >
                    <RevealItem as="div" className="home-reason__heading">
                      {typeof ReasonIcon === "string" ? (
                        <img src={ReasonIcon} alt="" loading="lazy" />
                      ) : (
                        <ReasonIcon
                          className="home-reason__shield"
                          aria-hidden="true"
                          focusable="false"
                        />
                      )}
                      <h3>{reason.title}</h3>
                    </RevealItem>
                    <RevealItem as="p">{reason.description}</RevealItem>
                  </RevealGroup>
                );
              })}
            </div>
          </div>
        </section>

        <section className="home-audience">
          <RevealGroup
            className="home-container home-audience__inner"
            stagger={0.1}
          >
            <div className="home-audience__copy">
              <ScrollWordsReveal
                text="For work tools, streaming, and memberships."
                className="home-audience__heading"
              />
              <RevealGroup className="home-audience__text" delay={0.1} stagger={0.09}>
                <RevealItem as="p">
                Whether it is a few entertainment apps, tools for your work, or
                memberships across your household, Subzro gives you one place
                to see the recurring costs and review what still fits.
                </RevealItem>
                <RevealItem as="p">
                  Your money, your rules. Start with the subscriptions you choose.
                </RevealItem>
              </RevealGroup>
            </div>
            <RevealItem
              as="img"
              className="home-audience__mascot"
              alt=""
              src="/mascot-subzro/mascotsitsmilewave.webp"
              loading="lazy"
              decoding="async"
            />
          </RevealGroup>
        </section>

        <section className="home-section home-steps">
          <div className="home-container">
            <RevealGroup className="home-section__intro">
              <RevealItem as="h2">How Subzro brings clarity</RevealItem>
            </RevealGroup>
            <RevealGroup as="ol" className="home-steps__list" stagger={0.1}>
              {steps.map((step) => (
                <RevealItem as="li" key={step.step}>
                  <span className="home-steps__number">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section className="home-final">
          <RevealGroup
            className="home-container home-final__inner"
            stagger={0.08}
          >
            <RevealItem as="h2">A clearer view starts with your list.</RevealItem>
            <RevealItem as="p">
              Add subscriptions, review usage, and decide what is worth keeping.
            </RevealItem>
            <RevealItem as="div" className="home-final__actions">
              <SignedOut>
                <Link to="/signup" className="home-button">
                  Create your list
                </Link>
                <Link
                  to="/pricing"
                  className="home-button home-button--quiet"
                >
                  View pricing
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard" className="home-button">
                  Go to dashboard
                </Link>
                <Link
                  to="/pricing"
                  className="home-button home-button--quiet"
                >
                  View pricing
                </Link>
              </SignedIn>
            </RevealItem>
            <RevealItem
              as="img"
              className="home-final__mascot"
              alt=""
              src="/mascot-subzro/mascotwinksmile.webp"
              loading="lazy"
              decoding="async"
            />
          </RevealGroup>
        </section>
      </main>

      <footer className="home-footer">
        <RevealGroup
          className="home-container home-footer__inner"
          stagger={0.1}
        >
          <RevealItem as="div" className="home-footer__brand-wrap">
            <Link to="/" className="home-footer__brand">
              <img src="/subzero_logo_icon.png" alt="" />
              <span>© {new Date().getFullYear()} Subzro</span>
            </Link>
          </RevealItem>
          <RevealItem as="nav" aria-label="Footer navigation">
            <Link to="/pricing">Pricing</Link>
            <Link to="/imprint">Impressum</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/refund">Refunds</Link>
          </RevealItem>
        </RevealGroup>
      </footer>
    </div>
  );
}
