import { Link, useNavigate } from "react-router";
import { GameForm } from "../components/games/GameForm";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { useSaveGame } from "../hooks/useSaveGame";
import type { CreateGameInput } from "../types/game";

export function AddGamePage() {
  const navigate = useNavigate();
  const { handle } = useActiveProfile();

  const { create, isSaving, error } = useSaveGame(handle ?? "");

  async function handleSave(game: CreateGameInput) {
    try {
      const createdGame = await create(game);

      navigate(`/games/${createdGame.id}`, {
        state: { successMessage: "Game added to your library." },
      });
    } catch {
      // useSaveGame stores and logs the error.
      // Stay on the form so the entered values are preserved.
    }
  }

  if (!handle) {
    return <p className="text-muted">Choose a player before adding a game.</p>;
  }

  return (
    <section className="mx-auto flex max-w-content flex-col gap-6">
      <Link to="/library" className="w-fit text-body-sm text-muted hover:text-foreground">
        ← Back
      </Link>

      <div className="flex flex-col gap-16 lg:flex-row">
        <div className="w-full lg:max-w-150">
          <GameForm
            onSave={handleSave}
            onCancel={() => navigate("/library")}
            isSaving={isSaving}
            error={error}
          />
        </div>

        <aside className="hidden max-w-sm flex-col gap-4 pt-12 lg:flex">
          <h2 className="font-display text-heading-3 font-bold">
            Every great backlog starts with one game.
          </h2>

          <p className="text-body-sm text-muted">
            You provide the title, platform and cover URL. Your notes and rating make it yours.
          </p>
        </aside>
      </div>
    </section>
  );
}
