import type { CreateGameInput, Game, GameStatus, UpdateGameInput } from "../types/game";
import { ApiError, isAbortError } from "./ApiError";

const API_BASE_URL = "https://questlog-api.vercel.app/api";

type GetGamesOptions = {
  status?: GameStatus;
  signal?: AbortSignal;
};

function gamesPath(handle: string): string {
  return `/${encodeURIComponent(handle)}/games`;
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const { id, title, platform, status, rating, coverUrl, notes } = value as Record<string, unknown>;
  return (
    typeof id === "string" &&
    typeof title === "string" &&
    typeof platform === "string" &&
    (status === "want" || status === "playing" || status === "completed" || status === "dropped") &&
    (rating == null || (typeof rating === "number" && Number.isFinite(rating))) &&
    (coverUrl == null || typeof coverUrl === "string") &&
    (notes == null || typeof notes === "string")
  );
}

function isGameCollection(value: unknown): value is Game[] {
  return Array.isArray(value) && value.every(isGame);
}

async function request(path: string, fetchOptions: RequestInit = {}): Promise<Response> {
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

  return response;
}

async function requestJson<T>(
  path: string,
  isValid: (value: unknown) => value is T,
  options: RequestInit = {},
): Promise<T> {
  const response = await request(path, options);
  const method = (options.method ?? "GET").toUpperCase();
  if (response.status === 204) {
    throw new ApiError({
      kind: "invalid-response",
      method,
      path,
      status: response.status,
    });
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (cause) {
    if (isAbortError(cause) || options.signal?.aborted) {
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

  if (!isValid(data)) {
    throw new ApiError({ kind: "invalid-response", method, path, status: response.status });
  }

  return data;
}

// GET - Collection
export function getGames(
  handle: string,
  { status, signal }: GetGamesOptions = {},
): Promise<Game[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return requestJson(`${gamesPath(handle)}${query}`, isGameCollection, { signal });
}

// GET - Single game
export function getGame(handle: string, id: string, signal?: AbortSignal): Promise<Game> {
  return requestJson(`${gamesPath(handle)}/${encodeURIComponent(id)}`, isGame, { signal });
}

// POST - Create game
export function createGame(handle: string, game: CreateGameInput): Promise<Game> {
  return requestJson(gamesPath(handle), isGame, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });
}

// PATCH - Update game
export function updateGame(handle: string, id: string, changes: UpdateGameInput): Promise<Game> {
  return requestJson(`${gamesPath(handle)}/${encodeURIComponent(id)}`, isGame, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
}

// DELETE - Remove game
export async function deleteGame(handle: string, id: string): Promise<void> {
  await request(`${gamesPath(handle)}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
