import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router";
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
import { demoGames } from "../data/demoGames";
import { useDemoLibrary } from "../hooks/useDemoLibrary";
import { useGames } from "../hooks/useGames";
import { getDemoGameKey } from "../services/demoLibrary";

export function LibraryPage() {
  // Temporary until profile selection is implemented.
  const handle = import.meta.env.VITE_QUESTLOG_HANDLE?.trim() || null;

  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>("all");

  const { games, isLoading, error, retry } = useGames(handle);

  const { addDemoGames, isSeeding, seedError } = useDemoLibrary();

  // Derived data
  const filteredGames =
    selectedFilter === "all" ? games : games.filter((game) => game.status === selectedFilter);

  const selectedLabel =
    libraryFilters.find((filter) => filter.value === selectedFilter)?.label ?? "All";

  const existingKeys = new Set(games.map(getDemoGameKey));

  const missingDemoCount = demoGames.filter(
    (game) => !existingKeys.has(getDemoGameKey(game)),
  ).length;

  async function handleTryDemo() {
    if (!handle || isLoading || error || isSeeding) {
      return;
    }

    try {
      const result = await addDemoGames(handle);

      if (!result) return;

      retry();

      navigate("/library", {
        replace: true,
        state: {
          successMessage: `${result.added} demo games added to your library.`,
        },
      });
    } catch {
      // Keep successfully added games and refresh the list.
      // The hook handles the error message.
      retry();
    }
  }

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

        {/* Library actions */}
        {handle && !isLoading && !error && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {missingDemoCount > 0 && (
              <Button variant="secondary" disabled={isSeeding} onClick={handleTryDemo}>
                {isSeeding ? "Adding demo games…" : `Try Demo · ${missingDemoCount} games`}
              </Button>
            )}

            {games.length > 0 && (
              <Link
                to="/games/new"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                + Add Game
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Demo error feedback */}
      {seedError && (
        <div
          role="alert"
          className="rounded-md border border-danger bg-surface p-4 text-body-sm text-danger"
        >
          {seedError}
        </div>
      )}

      {/* Library content */}
      {content}
    </section>
  );
}
