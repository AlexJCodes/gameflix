import type { ReactNode } from "react";
import { Link } from "react-router";
import { CollectionLoadingState } from "../components/feedback/CollectionLoadingState";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { GameCard } from "../components/games/GameCard";
import {
  type LibraryFilter,
  LibraryFilters,
  libraryFilters,
} from "../components/games/LibraryFilters";
import { Button } from "../components/ui/Button";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { useGames } from "../hooks/useGames";
import { useLocalStorage } from "../hooks/useLocalStorage";

function isLibraryFilter(value: unknown): value is LibraryFilter {
  return libraryFilters.some((filter) => filter.value === value);
}

export function LibraryPage() {
  const { id, handle } = useActiveProfile();

  const [selectedFilter, setSelectedFilter] = useLocalStorage<LibraryFilter>(
    `gameflix.libraryFilter.${id}.v1`,
    "all",
    isLibraryFilter,
  );

  const { games, isLoading, error, retry } = useGames(handle);

  // Derived data
  const filteredGames =
    selectedFilter === "all" ? games : games.filter((game) => game.status === selectedFilter);

  const selectedLabel =
    libraryFilters.find((filter) => filter.value === selectedFilter)?.label ?? "All";

  let content: ReactNode;

  if (isLoading) {
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
        <LibraryFilters
          games={games}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

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
      {/* Page header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[32px] font-bold lg:text-heading-1">My Library</h1>

          <p className="mt-2 font-body text-body-sm text-muted">Your backlog, your rules.</p>
        </div>

        {!isLoading && !error && games.length > 0 && (
          <Link
            to="/games/new"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            + Add Game
          </Link>
        )}
      </div>

      {/* Library content */}
      {content}
    </section>
  );
}
