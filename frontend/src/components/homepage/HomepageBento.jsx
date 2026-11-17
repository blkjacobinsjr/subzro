import * as Lightbox from "@ramka/react/lightbox";
import {
  BriefcaseIcon,
  PlayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Badge } from "./stageshow/kit/controls/Badge";
import { Card } from "./stageshow/kit/parts/Card";
import { Row } from "./stageshow/kit/parts/Row";
import { Stage } from "./stageshow/kit/stage";
import "./HomepageBento.css";

const screenshots = [
  {
    title: "Dashboard",
    src: "/newproductscreenshots/dashboard.png",
    alt: "Subzro dashboard with a subscription list and monthly overview",
    caption: "The dashboard brings subscriptions and recurring costs into one view.",
  },
  {
    title: "Usage insights",
    src: "/newproductscreenshots/insightsoverview.png",
    alt: "Subzro usage insights overview",
    caption: "Usage insights help you review how often you use a service.",
  },
  {
    title: "Manage subscriptions",
    src: "/newproductscreenshots/addsubscreenshot.png",
    alt: "Subzro screen for managing subscriptions",
    caption: "Manage the subscriptions you choose to track.",
  },
];

const categories = [
  {
    title: "Streaming",
    subtitle: "Entertainment services",
    Icon: PlayIcon,
    tone: "mint",
  },
  {
    title: "Work tools",
    subtitle: "Tools for your work",
    Icon: BriefcaseIcon,
    tone: "lilac",
  },
  {
    title: "Memberships",
    subtitle: "Groups and memberships",
    Icon: UserGroupIcon,
    tone: "peach",
  },
];

function CategoryList() {
  return (
    <Stage
      width={640}
      height={300}
      compact={{ below: 560, width: 360, height: 300 }}
      theme="light"
      palette="accent"
      accent="#7665b2"
      ground={["#f5effd", "#eaf7f1"]}
      className="home-bento__stage"
      tokens={{ "--ss-font": '"Allo Variable Friendly", "Allo", system-ui, sans-serif' }}
    >
      {() => (
        <Card className="home-bento__ui-card" pad="large" gap={12}>
          <div className="home-bento__ui-header">
            <div>
              <span className="home-bento__ui-eyebrow">Your overview</span>
              <div className="home-bento__ui-title">Subscriptions</div>
            </div>
            <Badge tone="accent">Example list</Badge>
          </div>
          <div className="home-bento__ui-list" role="list" aria-label="Subscription categories">
            {categories.map(({ title, subtitle, Icon, tone }) => (
              <Row
                key={title}
                className="home-bento__ui-row"
                role="listitem"
                lead={
                  <span className={`home-bento__ui-icon home-bento__ui-icon--${tone}`}>
                    <Icon aria-hidden="true" />
                  </span>
                }
                title={title}
                subtitle={subtitle}
                pad={12}
              />
            ))}
          </div>
        </Card>
      )}
    </Stage>
  );
}

function ScreenshotGallery() {
  return (
    <Lightbox.Root count={screenshots.length}>
      <article className="home-bento__gallery">
        <div className="home-bento__gallery-heading">
          <div>
            <span className="home-bento__eyebrow">A closer look</span>
            <h3>See Subzro in context</h3>
            <p>Open a screen to view it at full size.</p>
          </div>
          <img
            className="home-bento__mascot"
            src="/mascot-subzro/mascotsitsmilewave.webp"
            alt=""
            width="96"
            height="96"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="home-bento__gallery-grid" aria-label="Product screenshots">
          {screenshots.map((screenshot, index) => (
            <Lightbox.Trigger
              key={screenshot.src}
              index={index}
              className="home-bento__thumb"
              aria-label={`Open ${screenshot.title} screenshot`}
            >
              {({ imageRef }) => (
                <>
                  <img
                    ref={imageRef}
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width="1080"
                    height="1920"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{screenshot.title}</span>
                </>
              )}
            </Lightbox.Trigger>
          ))}
        </div>
      </article>

      <Lightbox.Portal>
        <Lightbox.Backdrop className="home-bento__lightbox-backdrop" />
        <Lightbox.Content
          className="home-bento__lightbox"
          aria-label="Subzro product screenshots"
        >
          <div className="home-bento__lightbox-topbar">
            <Lightbox.Counter className="home-bento__lightbox-counter">
              {({ current, total }) => `Screenshot ${current} of ${total}`}
            </Lightbox.Counter>
            <Lightbox.Close className="home-bento__lightbox-button">
              Close
            </Lightbox.Close>
          </div>

          <Lightbox.Slides
            className="home-bento__lightbox-slides"
            aria-roledescription="carousel"
            aria-label="Product screenshots"
          >
            {screenshots.map((screenshot, index) => (
              <Lightbox.Slide
                key={screenshot.src}
                className="home-bento__lightbox-slide"
              >
                <Lightbox.Item
                  index={index}
                  className="home-bento__lightbox-item"
                  caption={screenshot.caption}
                  aria-roledescription="slide"
                  aria-label={`Screenshot ${index + 1} of ${screenshots.length}`}
                >
                  <Lightbox.Zoom>
                    <Lightbox.Media width={1080} height={1920}>
                      <img
                        src={screenshot.src}
                        alt={screenshot.alt}
                        width="1080"
                        height="1920"
                        loading="eager"
                        decoding="async"
                      />
                    </Lightbox.Media>
                  </Lightbox.Zoom>
                </Lightbox.Item>
              </Lightbox.Slide>
            ))}
          </Lightbox.Slides>

          <div className="home-bento__lightbox-controls">
            <Lightbox.Previous className="home-bento__lightbox-button" aria-label="Previous screenshot">
              Previous
            </Lightbox.Previous>
            <Lightbox.Caption className="home-bento__lightbox-caption" />
            <Lightbox.Next className="home-bento__lightbox-button" aria-label="Next screenshot">
              Next
            </Lightbox.Next>
          </div>
        </Lightbox.Content>
      </Lightbox.Portal>
    </Lightbox.Root>
  );
}

export default function HomepageBento({ reasons }) {
  return (
    <div className="home-bento">
      <article className="home-bento__lead">
        <div className="home-bento__lead-copy">
          <span className="home-bento__eyebrow">One clear list</span>
          <h3>For work tools, streaming, and memberships.</h3>
          <p>
            Bring recurring services together in one view, then review what
            still fits.
          </p>
        </div>
        <CategoryList />
      </article>

      {reasons.map((reason) => (
        <article className="home-bento__reason" key={reason.title}>
          <img
            src={reason.icon}
            alt=""
            width="256"
            height="256"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </div>
        </article>
      ))}

      <ScreenshotGallery />
    </div>
  );
}
