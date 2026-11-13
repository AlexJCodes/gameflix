import { Link, useNavigate, useParams } from "react-router";
import { ApiError } from "../api/ApiError";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { GameForm } from "../components/games/GameForm";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { useGame } from "../hooks/useGame";
import { useGameMutationView } from "../hooks/useGameMutationView";
import { useSaveGame } from "../hooks/useSaveGame";
import type { CreateGameInput } from "../types/game";

export function EditGamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { id: profileId, handle } = useActiveProfile();
  const captureView = useGameMutationView(profileId, handle, id);

  const { game, isLoading, error: loadError, retry } = useGame(handle, id);

  const { update, isSaving, error: saveError } = useSaveGame(handle ?? "");

  async function handleSave(changes: CreateGameInput) {
    if (!game) return;

    const isCurrentView = captureView();

    try {
      await update(game.id, changes);

      if (!isCurrentView()) return;

      navigate(`/games/${game.id}`, {
        state: { successMessage: "Changes saved." },
      });
    } catch {
      // Keep the form mounted and preserve entered values.
      // useSaveGame handles the error state.
    }
  }

  if (!handle) {
    return <p className="text-muted">Choose a player before editing a game.</p>;
  }

  if (isLoading) {
    return (
      <p role="status" className="text-muted">
        Loading your game…
      </p>
    );
  }

  if (loadError instanceof ApiError && loadError.status === 404) {
    return (
      <section className="flex flex-col gap-6 py-12">
        <h1 className="font-display text-heading-2 font-bold">This game has left the library.</h1>

        <p className="text-muted">It may have been deleted.</p>

        <Link to="/library" className="text-brand">
          Back to Library
        </Link>
      </section>
    );
  }

  if (loadError) {
    return (
      <ErrorPanel
        title="This game couldn’t load."
        description="Check your connection and try again. Your saved game is unchanged."
        onRetry={retry}
        backTo="/library"
        backLabel="Back to Library"
      />
    );
  }

  if (!game) return null;

  return (
    <section className="mx-auto flex max-w-content flex-col gap-6">
      <Link
        to={`/games/${game.id}`}
        className="w-fit text-body-sm text-muted hover:text-foreground"
      >
        ← Back
      </Link>

      <div className="w-full lg:max-w-150">
        <GameForm
          key={game.id}
          initialGame={game}
          onSave={handleSave}
          onCancel={() => navigate(`/games/${game.id}`)}
          isSaving={isSaving}
          error={saveError}
        />
      </div>
    </section>
  );
}
