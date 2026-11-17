import { useEffect, useId, useRef, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import "./PublicNav.css";

const labels = {
  en: { pricing: "Pricing", signIn: "Sign in", getStarted: "Get started", dashboard: "Dashboard", more: "More", close: "Close", openMenu: "Open menu", closeMenu: "Close menu", imprint: "Impressum", privacy: "Privacy", terms: "Terms", refund: "Refunds" },
  de: { pricing: "Preise", signIn: "Anmelden", getStarted: "Starten", dashboard: "Dashboard", more: "Mehr", close: "Schließen", openMenu: "Menü öffnen", closeMenu: "Menü schließen", imprint: "Impressum", privacy: "Datenschutz", terms: "AGB", refund: "Erstattung" },
};

export default function PublicNav({ lang = "en", onLangChange, checkout = false }) {
  const t = labels[lang] ?? labels.en;
  const menuId = useId();
  const location = useLocation();
  const menuLinks = [
    { to: "/pricing", label: t.pricing },
    { to: "/imprint", label: t.imprint },
    { to: "/privacy", label: t.privacy },
    { to: "/terms", label: t.terms },
    { to: "/refund", label: t.refund },
  ];
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

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenuItem(null);
  }, [location.pathname]);

  return (
      <header className="public-header">
        <nav className={`public-nav${checkout ? " public-nav--checkout" : ""}`} aria-label="Main navigation">
          <Link to="/" className="public-brand" aria-label="Subzro home">
            <img src="/subzero_logo_icon.png" alt="" />
            <span>subzro</span>
          </Link>

          {checkout ? <span className="public-nav__plan">Matcha Plan</span> : (
          <div className="public-nav__actions" ref={menuRef}>
            <Link to="/pricing" className="public-nav__link">
              {t.pricing}
            </Link>
            <SignedOut>
              <Link to="/login" className="public-nav__link">
                {t.signIn}
              </Link>
              <Link to="/signup" className="public-nav__button ">
                {t.getStarted}
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="public-nav__button ">
                {t.dashboard}
              </Link>
              <UserButton afterSignOutUrl={window.location.origin} />
            </SignedIn>
            <button
              ref={menuButtonRef}
              type="button"
              className="public-nav__menu-button"
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span>{menuOpen ? t.close : t.more}</span>
              <span className="public-nav__menu-mark" aria-hidden="true" />
            </button>
            <div
              id={menuId}
              className="public-nav__menu"
              hidden={!menuOpen}
            >
              <LayoutGroup id={menuId}>
                <div
                  className="public-nav__menu-list"
                  data-static-highlight={reduceMenuMotion ? "true" : undefined}
                  onMouseLeave={() => setActiveMenuItem(null)}
                >
                  {menuLinks.map((item) => (
                    <motion.div
                      key={item.to}
                      className="public-nav__menu-item"
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
                          className="public-nav__highlight"
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
                        className="public-nav__menu-link"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </LayoutGroup>
              {onLangChange && (
                <div className="public-nav__languages" role="group" aria-label="Language">
                  {[['en', 'EN'], ['de', 'DE']].map(([code, label]) => (
                    <button key={code} type="button" aria-pressed={lang === code} onClick={() => onLangChange(code)}>{label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}
        </nav>
      </header>
  );
}
