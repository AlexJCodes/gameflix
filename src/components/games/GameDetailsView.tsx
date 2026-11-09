import { Link } from "react-router";
import type { Game, GameStatus } from "../../types/game";
import { Button } from "../ui/Button";
import { GameCover } from "./GameCover";
import { StatusBadge } from "./StatusBadge";

const statusLabels: Record<GameStatus, "Want to Play" | "Playing" | "Completed" | "Dropped"> = {
  want: "Want to Play",
  playing: "Playing",
  completed: "Completed",
  dropped: "Dropped",
};

type GameDetailsViewProps = {
  game: Game;
  onDelete: () => void;
};

export function GameDetailsView({ game, onDelete }: GameDetailsViewProps) {
  const validRating =
    typeof game.rating === "number" &&
    Number.isInteger(game.rating) &&
    game.rating >= 1 &&
    game.rating <= 5;

  return (
    <article className="-mx-page-mobile -mt-8 lg:-mx-page-desktop">
      {/* Hero */}
      <div className="relative flex h-80 items-end px-6 pb-6 lg:h-90 lg:px-page-desktop lg:pb-12">
        <GameCover src={game.coverUrl} alt="" className="absolute inset-0" />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/25 via-transparent to-background" />

        <Link
          to="/library"
          className="absolute top-6 left-6 z-10 inline-flex min-h-12 items-center rounded-md bg-background px-4 font-body text-button font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:left-16"
        >
          ← Back
        </Link>

        <h1 className="relative z-10 max-w-4xl wrap-break-word font-display text-heading-1 font-bold lg:text-display">
          {game.title}
        </h1>
      </div>

      {/* Saved game information */}
      <div className="grid gap-12 px-6 pb-12 lg:grid-cols-[minmax(0,760px)_248px] lg:px-page-desktop">
        <div className="flex min-w-0 flex-col gap-6">
          <dl className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <dt className="text-caption text-muted">PLATFORM</dt>
              <dd className="text-lg">{game.platform}</dd>
            </div>

            <div className="flex flex-col gap-2">
              <dt className="text-caption text-muted">STATUS</dt>
              <dd>
                <StatusBadge status={statusLabels[game.status]} />
              </dd>
            </div>
          </dl>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <h2 className="text-caption text-muted">YOUR RATING</h2>

            {validRating && game.rating != null ? (
              <p>
                <span className="sr-only">Your rating: {game.rating} out of 5</span>

                <span aria-hidden="true">
                  <span className="text-2xl text-warning">{"★".repeat(game.rating)}</span>
                  <span className="text-2xl text-divider">{"★".repeat(5 - game.rating)}</span>
                  <span className="ml-2 text-body-sm text-muted">{game.rating} / 5</span>
                </span>
              </p>
            ) : (
              <p className="text-body-sm text-muted">Not rated</p>
            )}
          </div>

          {/* Personal notes */}
          <section className="rounded-xl bg-surface p-6">
            <h2 className="font-body text-lg font-semibold">Personal notes</h2>

            <p className="mt-3 whitespace-pre-wrap wrap-break-word">
              {game.notes?.trim() || "No personal notes yet."}
            </p>

            <p className="mt-3 text-caption text-muted">A note from you, for you.</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/games/${game.id}/edit`}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-md border border-brand bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:flex-none"
            >
              Edit Game
            </Link>

            <Button variant="danger" onClick={onDelete} className="min-w-0 flex-1 sm:flex-none">
              Delete Game
            </Button>
          </div>
        </div>

        {/* Desktop cover */}
        <figure className="hidden w-62 lg:block">
          <GameCover
            src={game.coverUrl}
            alt={`Cover of ${game.title}`}
            className="aspect-3/4 rounded-[10px]"
          />

          <figcaption className="mt-3 text-caption text-muted">
            Cover from your saved game
          </figcaption>
        </figure>
      </div>
    </article>
  );
}
