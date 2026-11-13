import { Link } from "react-router";
import type { Game } from "../../types/game";
import { GameCover } from "../games/GameCover";

type HomeGameCardProps = {
  game: Game;
};

export function HomeGameCard({ game }: HomeGameCardProps) {
  const hasRating =
    typeof game.rating === "number" &&
    Number.isInteger(game.rating) &&
    game.rating >= 1 &&
    game.rating <= 5;

  return (
    <Link
      to={`/games/${game.id}`}
      className="group block min-w-0 rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    >
      <GameCover
        src={game.coverUrl}
        alt=""
        className="aspect-3/4 w-full rounded-[10px] group-hover:ring-2 group-hover:ring-brand"
      />

      <div className="mt-2 flex flex-col gap-2">
        <h3
          title={game.title}
          className="truncate font-body text-[13px] font-semibold text-foreground lg:text-[15px]"
        >
          {game.title}
        </h3>

        <div className="flex min-w-0 items-start justify-between gap-2 text-caption">
          <span className="min-w-0 wrap-break-word text-muted">{game.platform}</span>

          {hasRating && (
            <span className="shrink-0 text-warning">
              <span className="sr-only">Rating: {game.rating} out of 5</span>

              <span aria-hidden="true">★ {game.rating}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
