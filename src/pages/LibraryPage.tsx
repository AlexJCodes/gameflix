import type { ReactNode } from "react";
import { Link } from "react-router";
import { CollectionLoadingState } from "../components/feedback/CollectionLoadingState";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { useGames } from "../hooks/useGames";

export function LibraryPage() {
  // Temporary until profile selection is implemented.
  const handle = import.meta.env.VITE_QUESTLOG_HANDLE?.trim() || null;

  const { games, isLoading, error, retry } = useGames(handle);

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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <li key={game.id}>
            <Link
              to={`/games/${game.id}`}
              className="block rounded-lg border border-divider bg-surface p-4 hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <h2 className="font-display text-heading-3 font-bold">{game.title}</h2>

              <p className="mt-2 font-body text-body-sm text-muted">
                {game.platform} · {game.status}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-heading-1 font-bold">My Library</h1>

        <p className="mt-2 font-body text-muted">Your backlog, your rules.</p>
      </div>

      {content}
    </section>
  );
}
