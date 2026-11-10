import { Link } from "react-router";
import type { Game } from "../../types/game";
import { HomeGameCard } from "./HomeGameCard";

type HomeGameRowProps = {
  id: string;
  title: string;
  games: Game[];
};

export function HomeGameRow({ id, title, games }: HomeGameRowProps) {
  if (games.length === 0) return null;

  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      {/* Row heading */}
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

        <Link
          to="/library"
          className="hidden shrink-0 text-caption text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus lg:inline-flex"
        >
          View in My Library →
        </Link>
      </div>

      {/* Horizontal scrolling collection */}
      <div className="overflow-x-auto overscroll-x-contain">
        <ul className="flex w-max snap-x snap-mandatory gap-4 px-page-mobile pb-2 lg:gap-6 lg:px-page-desktop">
          {games.map((game) => (
            <li key={game.id} className="w-39 shrink-0 snap-start lg:w-49">
              <HomeGameCard game={game} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
