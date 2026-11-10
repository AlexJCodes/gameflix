import { Link } from "react-router";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { HomeHero } from "../components/home/HomeHero";
import { useGames } from "../hooks/useGames";

export function HomePage() {
  // Temporary until profile selection is implemented.
  const handle = import.meta.env.VITE_QUESTLOG_HANDLE?.trim() || null;

  const { games, isLoading, error, retry } = useGames(handle);

  if (!handle) {
    return <p className="text-muted">Choose a player to view your home.</p>;
  }

  if (isLoading) {
    return (
      <section aria-busy="true" aria-label="Loading home">
        <p role="status" className="sr-only">
          Loading your home…
        </p>

        <div
          aria-hidden="true"
          className="-mx-page-mobile -mt-8 min-h-144 bg-surface motion-safe:animate-pulse lg:-mx-page-desktop lg:min-h-142"
        />
      </section>
    );
  }

  if (error) {
    return (
      <ErrorPanel
        title="Your home couldn't load."
        description="Check your connection and try again. Your saved games haven't been changed."
        onRetry={retry}
        backTo="/library"
        backLabel="Back to My Library"
      />
    );
  }

  const featuredGame =
    games.find((game) => game.status === "playing") ??
    games.find((game) => game.status === "want") ??
    games[0];

  if (!featuredGame) {
    return (
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
  }

  return (
    <div className="-mx-page-mobile -mt-8 lg:-mx-page-desktop">
      <HomeHero game={featuredGame} />
    </div>
  );
}
