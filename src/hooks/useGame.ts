import { useEffect, useReducer, useState } from "react";
import { getGame } from "../api/gamesApi";
import type { Game } from "../types/game";

type GameState = {
  requestKey: string | null;
  game: Game | null;
  isLoading: boolean;
  error: Error | null;
};

export function useGame(handle: string | null, id: string | undefined) {
  const [retryCount, retry] = useReducer((count: number) => count + 1, 0);

  const requestKey = handle && id ? JSON.stringify([handle, id, retryCount]) : null;

  const [state, setState] = useState<GameState>({
    requestKey: null,
    game: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!handle || !id || !requestKey) return;

    const controller = new AbortController();

    setState({
      requestKey,
      game: null,
      isLoading: true,
      error: null,
    });

    getGame(handle, id, controller.signal)
      .then((game) => {
        if (controller.signal.aborted) return;

        setState({
          requestKey,
          game,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        console.error("[Gameflix] Failed to load game", {
          handle,
          id,
          error,
        });

        setState({
          requestKey,
          game: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      });

    return () => controller.abort();
  }, [handle, id, requestKey]);

  const current =
    state.requestKey === requestKey
      ? state
      : {
          game: null,
          isLoading: Boolean(requestKey),
          error: null,
        };

  return {
    game: current.game,
    isLoading: current.isLoading,
    error: current.error,
    retry,
  };
}
