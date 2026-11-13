import { useEffect, useRef, useState } from "react";
import { type DemoGame, demoGames } from "../../data/demoGames";
import { getGameCoverUrl } from "../../data/gameAssetUrls";
import { GameCover } from "./GameCover";

type GamePresetPickerProps = {
  onSelect: (game: DemoGame) => void;
  onClose: () => void;
};

export function GamePresetPicker({ onSelect, onClose }: GamePresetPickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    searchRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function dismissPicker() {
    dialogRef.current?.close();
    onClose();
  }

  const filteredGames = demoGames.filter((game) =>
    `${game.title} ${game.platform}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="quick-add-title"
      aria-describedby="quick-add-description"
      onCancel={(event) => {
        event.preventDefault();
        dismissPicker();
      }}
      className="fixed inset-0 m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-xl border border-divider bg-surface p-5 text-foreground shadow-2xl backdrop:bg-black/80 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="quick-add-title" className="font-display text-heading-2 font-bold">
            Quick Add
          </h2>

          <p id="quick-add-description" className="mt-2 font-body text-body-sm text-muted">
            Pick a game. We'll fill in the basics.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close Quick Add"
          onClick={dismissPicker}
          className="flex size-10 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-elevated hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      {/* Search */}
      <div className="mt-6">
        <label
          htmlFor="quick-add-search"
          className="mb-2 block font-body text-body-sm font-semibold"
        >
          Search games
        </label>

        <input
          ref={searchRef}
          id="quick-add-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or platform..."
          className="min-h-12 w-full rounded-md border border-divider bg-background-secondary px-4 font-body text-body-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        />
      </div>

      <p className="mt-4 font-body text-caption text-muted">{filteredGames.length} games</p>

      {/* Game results */}
      {filteredGames.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredGames.map((game) => (
            <li key={`${game.title}-${game.platform}`}>
              <button
                type="button"
                onClick={() => {
                  dialogRef.current?.close();
                  onSelect(game);
                }}
                className="flex min-h-24 w-full items-center gap-3 rounded-md border border-divider bg-background-secondary p-3 text-left transition-colors hover:border-brand hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <GameCover
                  src={game.coverFilename ? getGameCoverUrl(game.coverFilename) : undefined}
                  alt=""
                  className="aspect-3/4 w-16 shrink-0 rounded-md"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-body text-body-sm font-semibold text-foreground">
                    {game.title}
                  </p>

                  <p className="mt-1 font-body text-caption text-muted">{game.platform}</p>
                </div>

                <span aria-hidden="true" className="shrink-0 text-xl text-muted">
                  +
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-12 text-center font-body text-body-sm text-muted">
          No games found. Try another search.
        </p>
      )}
    </dialog>
  );
}
