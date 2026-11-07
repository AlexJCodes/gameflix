import type { CreateGameInput, Game, GameStatus, UpdateGameInput } from "../types/game";
import { ApiError, isAbortError } from "./ApiError";

const API_BASE_URL = "https://questlog-api.vercel.app/api";

type ApiRequestOptions = RequestInit & {
  responseType?: "json" | "none";
};

type GetGamesOptions = {
  status?: GameStatus;
  signal?: AbortSignal;
};

function gamesPath(handle: string): string {
  return `/${encodeURIComponent(handle)}/games`;
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { responseType = "json", ...fetchOptions } = options;

  const method = (fetchOptions.method ?? "GET").toUpperCase();

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
  } catch (cause) {
    // Cancellation is intentional, not a request failure.
    if (isAbortError(cause) || fetchOptions.signal?.aborted) {
      throw cause;
    }

    throw new ApiError({
      kind: "network",
      method,
      path,
      cause,
    });
  }

  if (!response.ok) {
    throw new ApiError({
      kind: "http",
      method,
      path,
      status: response.status,
    });
  }

  // DELETE does not require a JSON response body.
  if (responseType === "none") {
    return undefined as T;
  }

  if (response.status === 204) {
    throw new ApiError({
      kind: "invalid-response",
      method,
      path,
      status: response.status,
    });
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    if (isAbortError(cause) || fetchOptions.signal?.aborted) {
      throw cause;
    }

    throw new ApiError({
      kind: "invalid-response",
      method,
      path,
      status: response.status,
      cause,
    });
  }
}

// GET - Collection
export function getGames(
  handle: string,
  { status, signal }: GetGamesOptions = {},
): Promise<Game[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return request<Game[]>(`${gamesPath(handle)}${query}`, { signal });
}

// GET - Single game
export function getGame(handle: string, id: string, signal?: AbortSignal): Promise<Game> {
  return request<Game>(`${gamesPath(handle)}/${encodeURIComponent(id)}`, { signal });
}

// POST - Create game
export function createGame(handle: string, game: CreateGameInput): Promise<Game> {
  return request<Game>(gamesPath(handle), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });
}

// PATCH - Update game
export function updateGame(handle: string, id: string, changes: UpdateGameInput): Promise<Game> {
  return request<Game>(`${gamesPath(handle)}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
}

// DELETE - Remove game
export function deleteGame(handle: string, id: string): Promise<void> {
  return request<void>(`${gamesPath(handle)}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    responseType: "none",
  });
}
