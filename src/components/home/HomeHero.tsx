import { Link } from "react-router";
import { getGameHeroUrl } from "../../data/gameArtwork";
import type { Game, GameStatus } from "../../types/game";
import { GameCover } from "../games/GameCover";
import { StatusBadge } from "../games/StatusBadge";

type HomeHeroProps = {
  game: Game;
};

const statusLabels: Record<GameStatus, "Want to Play" | "Playing" | "Completed" | "Dropped"> = {
  want: "Want to Play",
  playing: "Playing",
  completed: "Completed",
  dropped: "Dropped",
};

export function HomeHero({ game }: HomeHeroProps) {
  const hasRating =
    typeof game.rating === "number" &&
    Number.isInteger(game.rating) &&
    game.rating >= 1 &&
    game.rating <= 5;

  const heroUrl = getGameHeroUrl(game.title);

  return (
    <section
      aria-label={`Featured game: ${game.title}`}
      className="relative isolate flex flex-col overflow-hidden bg-background lg:min-h-142 lg:justify-end lg:px-page-desktop lg:pt-24 lg:pb-12"
    >
      {/* Hero artwork */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface lg:absolute lg:inset-0 lg:aspect-auto">
        <GameCover
          src={heroUrl}
          alt=""
          fallbackSrc="/images/games/fallback/missing-hero-art.webp"
          className="absolute inset-0"
        />

        {/* Mobile: subtle bottom gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent lg:hidden" />

        {/* Desktop: existing cinematic gradients */}
        <div className="pointer-events-none absolute inset-0 hidden bg-linear-to-b from-background/5 via-background/40 to-background lg:block" />

        <div className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-background/80 via-background/20 to-transparent lg:block" />
      </div>

      {/* Featured game information */}
      <div className="relative z-20 flex w-full max-w-150 flex-col items-start gap-4 px-page-mobile pt-6 pb-10 lg:px-0 lg:pt-0 lg:pb-0">
        <p className="font-body text-caption font-bold text-brand">
          YOUR COLLECTION, IN THE SPOTLIGHT
        </p>

        <p className="font-body text-lg font-medium text-foreground lg:text-[22px]">
          Picked for tonight.
        </p>

        <h1 className="max-w-full wrap-break-word font-display text-[44px] leading-[1.05] font-bold tracking-tight lg:text-[76px]">
          {game.title}
        </h1>

        {/* Status, platform and rating */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={statusLabels[game.status]} />

          <span className="font-body text-body-sm text-muted">{game.platform}</span>

          {hasRating && game.rating != null && (
            <span className="font-body text-body-sm text-warning">
              <span className="sr-only">Rating: {game.rating} out of 5</span>

              <span aria-hidden="true">
                {"★".repeat(game.rating)}
                {"☆".repeat(5 - game.rating)}
              </span>
            </span>
          )}
        </div>

        {/* Personal notes */}
        {game.notes?.trim() && (
          <p className="line-clamp-2 max-w-md font-body text-body-sm text-muted">{game.notes}</p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/games/${game.id}`}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand px-5 font-body text-button font-bold text-background transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            View Game
          </Link>

          <Link
            to={`/games/${game.id}/edit`}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-divider bg-surface px-5 font-body text-button font-bold text-foreground transition-colors hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Edit Game
          </Link>
        </div>
      </div>
    </section>
  );
}
