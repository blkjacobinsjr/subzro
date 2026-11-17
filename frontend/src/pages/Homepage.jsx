import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  HeroArtwork,
  HeroHeadline,
  Reveal,
  RevealGroup,
  RevealItem,
  TiltReveal,
} from "../components/homepage/HomeMotion";
import UsageDemo from "../components/homepage/UsageDemo";
import HeroLogosphere from "../components/homepage/HeroLogosphere";
import HomepageBento from "../components/homepage/HomepageBento";
import PublicNav from "../components/PublicNav";
import "./Homepage.css";

const featureSections = [
  {
    title: "Your full picture, one glance",
    description:
      "See your active subscriptions and monthly spend on a single screen. Keep recurring costs easy to find and review.",
    screenshot: "/newproductscreenshots/dashboard.png",
    imageAlt: "Subzro dashboard showing monthly spend and recent subscriptions",
    icon: "/homepage-icons/subzro/subscription-tray.webp",
    mascot: "/mascot-subzro/mascotwave.webp",
    mascotAlt: "Subzro mascot waving",
  },
  {
    title: "See what gets used",
    description:
      "Review your most and least used subscriptions, then decide what still feels worth keeping.",
    screenshot: "/newproductscreenshots/insightsoverview.png",
    imageAlt: "Subzro insights overview with subscription usage information",
    icon: "/homepage-icons/subzro/usage-dial.webp",
    mascot: "/mascot-subzro/mascotwink.webp",
    mascotAlt: "Subzro mascot winking",
  },
  {
    title: "Understand where it goes",
    description:
      "See your highest-spend categories and follow individual subscription costs over time as you update your list.",
    screenshot: "/newproductscreenshots/insightsmix.png",
    imageAlt: "Subzro analytics showing subscription spending by category",
    icon: "/homepage-icons/subzro/spend-steps.webp",
    mascot: "/mascot-subzro/mascotlaugh.webp",
    mascotAlt: "Subzro mascot laughing",
  },
  {
    title: "Keep the list in your hands",
    description:
      "Search and filter your subscriptions. Use each service's score to decide what stays, what needs a review, and what you want to cancel.",
    screenshot: "/newproductscreenshots/addsubscreenshot.png",
    imageAlt: "Subzro subscription management screen",
    icon: "/homepage-icons/subzro/control-switch.webp",
    mascot: "/mascot-subzro/mascotwinksmile.webp",
    mascotAlt: "Subzro mascot smiling",
  },
];

const reasons = [
  {
    title: "One clear list",
    description:
      "Bring streaming services, work tools, and memberships together in one view.",
    icon: "/homepage-icons/subzro/subscription-tray.webp",
  },
  {
    title: "Usage-led reviews",
    description:
      "Check how often you use a service before you decide what to keep or cancel.",
    icon: "/homepage-icons/subzro/usage-dial.webp",
  },
  {
    title: "Start without a bank link",
    description:
      "Add your subscriptions without connecting a bank account.",
    icon: "/homepage-icons/subzro/control-switch.webp",
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

export default function Homepage() {
  return (
    <div className="homepage">
      <PublicNav />

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
                  key={feature.title}
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
                    <RevealItem
                      as="img"
                      className="home-feature__icon"
                      src={feature.icon}
                      alt=""
                      width={256}
                      height={256}
                      loading="lazy"
                      decoding="async"
                    />
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

        <section className="home-section home-reasons home-bento-section">
          <div className="home-container">
            <RevealGroup className="home-section__intro">
              <RevealItem as="h2">Made for the subscriptions you juggle</RevealItem>
              <RevealItem as="p">
                One calm place to look across streaming, work, and the things
                you belong to.
              </RevealItem>
            </RevealGroup>
            <HomepageBento reasons={reasons.slice(1)} />
          </div>
        </section>

        <section className="home-section home-steps">
          <div className="home-container">
            <RevealGroup className="home-section__intro">
              <RevealItem as="h2">How Subzro brings clarity</RevealItem>
            </RevealGroup>
            <RevealGroup as="ol" className="home-steps__list" stagger={0.1}>
              {steps.map((step) => (
                <RevealItem as="li" key={step.step}>
                  <img
                    className="home-steps__icon"
                    src={`/homepage-icons/subzro/step-${step.step}.webp`}
                    alt=""
                    width="256"
                    height="256"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home-visually-hidden">Step {step.step}</span>
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
        <p className="home-container home-footer__credits">
          Backgrounds by{" "}
          <a href="https://www.figma.com/community/file/1626392436817658229/super-visuals-50-stunning-backgrounds-v1">Ahmed Hassan / Super Visuals</a>
          {" · "}<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
        </p>
      </footer>
    </div>
  );
}
