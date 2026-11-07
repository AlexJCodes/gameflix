import { useRef, useState } from "react";
import { createGame, deleteGame, updateGame } from "../api/gamesApi";
import type { CreateGameInput, UpdateGameInput } from "../types/game";

export function useSaveGame(handle: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pending = useRef(false);

  async function execute<T>(action: () => Promise<T>): Promise<T> {
    if (pending.current) {
      throw new Error("A game operation is already in progress.");
    }

    pending.current = true;
    setIsSaving(true);
    setError(null);

    try {
      return await action();
    } catch (cause) {
      const requestError =
        cause instanceof Error ? cause : new Error("Unknown game operation error", { cause });

      console.error("[Gameflix] Game operation failed:", requestError);
      setError(requestError);
      throw requestError;
    } finally {
      pending.current = false;
      setIsSaving(false);
    }
  }

  return {
    create: (game: CreateGameInput) => execute(() => createGame(handle, game)),

    update: (id: string, changes: UpdateGameInput) =>
      execute(() => updateGame(handle, id, changes)),

    remove: (id: string) => execute(() => deleteGame(handle, id)),

    isSaving,
    error,
  };
}
