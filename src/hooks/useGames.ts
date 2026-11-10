import { useEffect, useReducer, useState } from "react";
import { getGames } from "../api/gamesApi";
import type { Game } from "../types/game";

type GamesState = {
  handle: string | null;
  games: Game[];
  isLoading: boolean;
  error: Error | null;
};

export function useGames(handle: string | null) {
  const [retryCount, retry] = useReducer((count: number) => count + 1, 0);

  const [state, setState] = useState<GamesState>({
    handle,
    games: [],
    isLoading: Boolean(handle),
    error: null,
  });

  useEffect(() => {
    if (!handle) {
      setState({ handle: null, games: [], isLoading: false, error: null });
      return;
    }

    const controller = new AbortController();

    setState({ handle, games: [], isLoading: true, error: null });

    getGames(handle, { signal: controller.signal })
      .then((games) => {
        if (!controller.signal.aborted) {
          setState({ handle, games, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        console.error("[Gameflix] Failed to load games", {
          handle,
          retryCount,
          error,
        });

        setState({
          handle,
          games: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      });

    return () => controller.abort();
  }, [handle, retryCount]);

  const current =
    state.handle === handle ? state : { games: [], isLoading: Boolean(handle), error: null };

  return {
    games: current.games,
    isLoading: current.isLoading,
    error: current.error,
    retry,
  };
}
