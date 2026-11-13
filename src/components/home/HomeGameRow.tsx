import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Game } from "../../types/game";
import { HomeGameCard } from "./HomeGameCard";

type HomeGameRowProps = {
  id: string;
  title: string;
  games: Game[];
};

export function HomeGameRow({ id, title, games }: HomeGameRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollState, setScrollState] = useState({
    canScrollBack: false,
    canScrollForward: false,
  });

  // Keep navigation buttons in sync with scroll position.

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const list = container.querySelector("ul");

    const updateScrollState = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;

      const canScrollBack = container.scrollLeft > 2;
      const canScrollForward = container.scrollLeft < maxScroll - 2;

      setScrollState((previous) => {
        if (
          previous.canScrollBack === canScrollBack &&
          previous.canScrollForward === canScrollForward
        ) {
          return previous;
        }

        return { canScrollBack, canScrollForward };
      });
    };

    updateScrollState();

    container.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollState);

    resizeObserver.observe(container);

    if (list) {
      resizeObserver.observe(list);
    }

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollCards = (direction: -1 | 1) => {
    const container = scrollRef.current;
    const list = container?.querySelector("ul");
    const firstCard = list?.querySelector("li");

    if (!container || !list || !firstCard) return;

    const styles = window.getComputedStyle(list);

    const gap = Number.parseFloat(styles.columnGap) || 0;
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const visibleWidth = container.clientWidth - paddingLeft - paddingRight;

    const cardsPerPage = Math.max(1, Math.floor((visibleWidth + gap) / (cardWidth + gap)));

    container.scrollBy({
      left: direction * cardsPerPage * (cardWidth + gap),
      behavior: "auto",
    });
  };

  if (games.length === 0) return null;

  const headingId = `${id}-heading`;

  const hasOverflow = scrollState.canScrollBack || scrollState.canScrollForward;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      {/* Row heading and navigation */}
      <div className="flex items-center justify-between gap-4 px-page-mobile lg:px-page-desktop">
        <div className="flex min-w-0 items-baseline gap-2">
          <h2
            id={headingId}
            className="font-display text-heading-3 font-bold text-foreground lg:text-2xl"
          >
            {title}
          </h2>

          <span className="text-caption text-muted">{games.length}</span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            to="/library"
            className="hidden text-caption text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus lg:inline-flex"
          >
            View in My Library →
          </Link>

          {/* Carousel controls */}
          {hasOverflow && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Scroll ${title} backward`}
                onClick={() => scrollCards(-1)}
                disabled={!scrollState.canScrollBack}
                className="flex size-10 items-center justify-center rounded-md border border-divider bg-surface text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Previous games</title>
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                aria-label={`Scroll ${title} forward`}
                onClick={() => scrollCards(1)}
                disabled={!scrollState.canScrollForward}
                className="flex size-10 items-center justify-center rounded-md border border-divider bg-surface text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Next games</title>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable game collection */}
      <div
        ref={scrollRef}
        className="overflow-x-auto overscroll-x-contain scroll-px-page-mobile snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden motion-safe:scroll-smooth lg:scroll-px-page-desktop"
      >
        <ul className="flex w-max gap-4 px-page-mobile pt-2 pb-4 lg:gap-6 lg:px-page-desktop">
          {games.map((game) => (
            <li key={game.id} className="w-42 shrink-0 snap-start sm:w-48 lg:w-56">
              <HomeGameCard game={game} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
