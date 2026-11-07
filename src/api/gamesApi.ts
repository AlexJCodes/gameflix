import type { CreateGameInput, Game, GameStatus, UpdateGameInput } from "../types/game";

const API_BASE_URL = "https://questlog-api.vercel.app/api";

// Build the endpoint for a specific profile.
function gamesPath(handle: string): string {
  return `/${encodeURIComponent(handle)}/games`;
}

// Shared HTTP request handler.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// GET - Fetch all games, optionally filtered by status.
export function getGames(handle: string, status?: GameStatus): Promise<Game[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return request<Game[]>(`${gamesPath(handle)}${query}`);
}

// GET - Fetch a single game by ID.
export function getGame(handle: string, id: string): Promise<Game> {
  return request<Game>(`${gamesPath(handle)}/${encodeURIComponent(id)}`);
}

// POST - Create a new game.
export function createGame(handle: string, game: CreateGameInput): Promise<Game> {
  return request<Game>(gamesPath(handle), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });
}

// PATCH - Update selected game fields.
export function updateGame(handle: string, id: string, changes: UpdateGameInput): Promise<Game> {
  return request<Game>(`${gamesPath(handle)}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
}

// DELETE - Remove a game.
export function deleteGame(handle: string, id: string): Promise<void> {
  return request<void>(`${gamesPath(handle)}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
