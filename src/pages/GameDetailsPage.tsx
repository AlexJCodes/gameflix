import { Link, useParams } from "react-router";
import { ApiError } from "../api/ApiError";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { GameDetailsView } from "../components/games/GameDetailsView";
import { useGame } from "../hooks/useGame";

export function GameDetailsPage() {
  const { id } = useParams();
  const handle = import.meta.env.VITE_QUESTLOG_HANDLE?.trim() || null;

  const { game, isLoading, error, retry } = useGame(handle, id);

  if (!handle) {
    return <p className="text-muted">Choose a player to view this game.</p>;
  }

  if (isLoading) {
    return (
      <section aria-busy="true" className="flex flex-col gap-6">
        <Link to="/library" className="w-fit text-foreground">
          ← Back
        </Link>

        <p role="status" className="text-muted">
          Loading your game…
        </p>

        <div aria-hidden="true" className="flex flex-col gap-6 motion-safe:animate-pulse">
          <div className="h-64 rounded-lg bg-surface" />
          <div className="h-5 w-40 rounded-sm bg-surface-elevated" />
          <div className="h-32 rounded-lg bg-surface" />
        </div>
      </section>
    );
  }

  if (error instanceof ApiError && error.status === 404) {
    return (
      <section className="flex flex-col gap-6 py-12">
        <h1 className="font-display text-heading-2 font-bold">This game has left the library.</h1>

        <p className="max-w-md text-muted">
          It may have been deleted. Head back to your collection to choose another adventure.
        </p>

        <Link to="/library" className="w-fit font-semibold text-brand hover:underline">
          Back to Library
        </Link>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-6">
        <Link to="/library" className="w-fit text-foreground">
          ← Back
        </Link>

        <ErrorPanel
          title="This game couldn’t load."
          description="Check your connection and try again. Your saved game is unchanged."
          onRetry={retry}
          backTo="/library"
          backLabel="Back to Library"
        />
      </section>
    );
  }

  if (!game) return null;

  return <GameDetailsView game={game} />;
}
