import { Link } from "react-router";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { HomeGameRow } from "../components/home/HomeGameRow";
import { HomeHero } from "../components/home/HomeHero";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { useGames } from "../hooks/useGames";

export function HomePage() {
  const { handle } = useActiveProfile();

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

  // Derive collections from the saved games.
  const homeRows = [
    {
      id: "continue-playing",
      title: "Continue Playing",
      games: games.filter((game) => game.status === "playing"),
    },
    {
      id: "up-next",
      title: "Up Next",
      games: games.filter((game) => game.status === "want"),
    },
    {
      id: "completed-adventures",
      title: "Completed Adventures",
      games: games.filter((game) => game.status === "completed"),
    },
    {
      id: "maybe-later",
      title: "Maybe Later",
      games: games.filter((game) => game.status === "dropped"),
    },
    {
      id: "top-rated",
      title: "Top Rated by You",
      games: games
        .filter(
          (game) =>
            typeof game.rating === "number" &&
            Number.isInteger(game.rating) &&
            game.rating >= 4 &&
            game.rating <= 5,
        )
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    },
  ];

  return (
    <div className="-mx-page-mobile -mt-8 lg:-mx-page-desktop">
      <HomeHero game={featuredGame} />

      <div className="flex flex-col gap-12 pt-6 pb-12">
        {homeRows.map((row) => (
          <HomeGameRow key={row.id} id={row.id} title={row.title} games={row.games} />
        ))}

        <p className="px-page-mobile font-body text-caption text-muted lg:px-page-desktop">
          {games.length} saved games. Entirely your story.
        </p>
      </div>
    </div>
  );
}
