import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { GameForm } from "../components/games/GameForm";
import { GamePresetPicker } from "../components/games/GamePresetPicker";
import { Button } from "../components/ui/Button";
import type { DemoGame } from "../data/demoGames";
import { getGameCoverUrl } from "../data/gameAssetUrls";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { useSaveGame } from "../hooks/useSaveGame";
import type { CreateGameInput } from "../types/game";

type GamePreset = Pick<CreateGameInput, "title" | "platform" | "coverUrl">;

export function AddGamePage() {
  const navigate = useNavigate();
  const { handle } = useActiveProfile();

  const { create, isSaving, error } = useSaveGame(handle ?? "");

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<GamePreset | null>(null);

  const [formVersion, setFormVersion] = useState(0);

  function handleSelectPreset(game: DemoGame) {
    const preset: GamePreset = {
      title: game.title,
      platform: game.platform,
      ...(game.coverFilename ? { coverUrl: getGameCoverUrl(game.coverFilename) } : {}),
    };

    setSelectedPreset(preset);
    setFormVersion((version) => version + 1);
    setIsPickerOpen(false);
  }

  async function handleSave(game: CreateGameInput) {
    try {
      const createdGame = await create(game);

      navigate(`/games/${createdGame.id}`, {
        state: {
          successMessage: "Game added to your library.",
        },
      });
    } catch {
      // Keep form values if saving fails.
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
          {/* Quick Add */}
          <div className="mb-8 flex flex-col gap-4 rounded-lg border border-divider bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-heading-3 font-bold">Quick Add</h2>

              <p className="mt-1 font-body text-body-sm text-muted">
                Skip the typing. Pick a game.
              </p>
            </div>

            <Button
              variant="secondary"
              disabled={isSaving}
              onClick={() => setIsPickerOpen(true)}
              className="shrink-0"
            >
              Browse Games
            </Button>
          </div>

          {/* Game form */}
          <GameForm
            key={formVersion}
            preset={selectedPreset ?? undefined}
            onSave={handleSave}
            onCancel={() => navigate("/library")}
            isSaving={isSaving}
            error={error}
          />
        </div>

        {/* Supporting copy */}
        <aside className="hidden max-w-sm flex-col gap-4 pt-12 lg:flex">
          <h2 className="font-display text-heading-3 font-bold">
            Every great backlog starts with one game.
          </h2>

          <p className="text-body-sm text-muted">
            Pick a game from Quick Add or enter your own. Add your status, rating and personal notes
            to make it yours.
          </p>
        </aside>
      </div>

      {/* Game picker */}
      {isPickerOpen && (
        <GamePresetPicker onSelect={handleSelectPreset} onClose={() => setIsPickerOpen(false)} />
      )}
    </section>
  );
}
