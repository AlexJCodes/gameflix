import { type ReactNode, useState } from "react";
import { Link } from "react-router";
import { CollectionLoadingState } from "../components/feedback/CollectionLoadingState";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { GameCard } from "../components/games/GameCard";
import { Button } from "../components/ui/Button";
import { useGames } from "../hooks/useGames";
import type { GameStatus } from "../types/game";

type LibraryFilter = "all" | GameStatus;

const filters: { value: LibraryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "want", label: "Want to Play" },
  { value: "playing", label: "Playing" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

export function LibraryPage() {
  // Temporary until profile selection is implemented.
  const handle = import.meta.env.VITE_QUESTLOG_HANDLE?.trim() || null;

  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>("all");

  const { games, isLoading, error, retry } = useGames(handle);

  const filteredGames =
    selectedFilter === "all" ? games : games.filter((game) => game.status === selectedFilter);

  const selectedLabel = filters.find((filter) => filter.value === selectedFilter)?.label ?? "All";

  let content: ReactNode;

  if (!handle) {
    content = <p className="text-muted">Choose a player to view your library.</p>;
  } else if (isLoading) {
    content = <CollectionLoadingState />;
  } else if (error) {
    content = (
      <ErrorPanel
        title="Your library couldn’t load."
        description="Check your connection and try again. Your saved games haven’t been changed."
        onRetry={retry}
        backTo="/home"
        backLabel="Back to Home"
      />
    );
  } else if (games.length === 0) {
    content = (
      <EmptyState
        title="Your library is looking a little empty."
        description="Every adventure starts somewhere. Add your first game."
        action={
          <Link
            to="/games/new"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Add Game
          </Link>
        }
      />
    );
  } else {
    content = (
      <>
        <fieldset>
          <legend className="sr-only">Filter games by status</legend>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const count =
                filter.value === "all"
                  ? games.length
                  : games.filter((game) => game.status === filter.value).length;

              const isSelected = selectedFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={[
                    "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 font-body text-caption font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:px-4.5 lg:text-body-sm",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-divider bg-surface text-muted hover:border-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <span>{filter.label}</span>
                  <span className="tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {filteredGames.length === 0 ? (
          <EmptyState
            title="No games in this chapter."
            description={`Nothing marked ${selectedLabel} yet. Try another status.`}
            action={<Button onClick={() => setSelectedFilter("all")}>Clear filter</Button>}
          />
        ) : (
          <>
            <p className="text-body-sm text-muted">
              {selectedFilter === "all"
                ? `${games.length} games in your collection`
                : `${filteredGames.length} of ${games.length} games in your collection`}
            </p>

            <ul className="grid grid-cols-2 items-start gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 xl:grid-cols-5">
              {filteredGames.map((game) => (
                <li key={game.id} className="min-w-0">
                  <GameCard game={game} />
                </li>
              ))}
            </ul>
          </>
        )}
      </>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold lg:text-heading-1">My Library</h1>

          <p className="mt-2 font-body text-body-sm text-muted">Your backlog, your rules.</p>
        </div>

        {handle && games.length > 0 && (
          <Link
            to="/games/new"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            + Add Game
          </Link>
        )}
      </div>

      {content}
    </section>
  );
}
