import { deleteGame, getGames } from "../api/gamesApi";
import type { Game } from "../types/game";

type StarterGame = Required<
  Pick<Game, "title" | "platform" | "status" | "rating" | "coverUrl" | "notes">
>;

// Known starter games returned by the school's Questlog API.
// Keep these values exact so we never delete an unknown game.
const starterGames: StarterGame[] = [
  {
    title: "Hollow Knight",
    platform: "Switch",
    status: "playing",
    rating: 5,
    coverUrl: "https://placehold.co/300x400/1e1b4b/c7d2fe?text=Hollow%20Knight",
    notes: "Stuck on the Mantis Lords",
  },
  {
    title: "Stardew Valley",
    platform: "PC",
    status: "completed",
    rating: 5,
    coverUrl: "https://placehold.co/300x400/14532d/bbf7d0?text=Stardew%20Valley",
    notes: "Year 3, the farm is finally done",
  },
  {
    title: "Celeste",
    platform: "PC",
    status: "completed",
    rating: 4,
    coverUrl: "https://placehold.co/300x400/831843/fbcfe8?text=Celeste",
    notes: "",
  },
  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Switch",
    status: "want",
    rating: null,
    coverUrl: "https://placehold.co/300x400/064e3b/a7f3d0?text=Tears%20of%20the%20Kingdom",
    notes: "Waiting for the summer holiday",
  },
  {
    title: "Elden Ring",
    platform: "PlayStation 5",
    status: "dropped",
    rating: 3,
    coverUrl: "https://placehold.co/300x400/422006/fde68a?text=Elden%20Ring",
    notes: "Too hard for me right now",
  },
];

function isStarterGame(game: Game): boolean {
  return starterGames.some(
    (starter) =>
      game.title === starter.title &&
      game.platform === starter.platform &&
      game.status === starter.status &&
      (game.rating ?? null) === starter.rating &&
      game.coverUrl === starter.coverUrl &&
      (game.notes ?? "") === starter.notes,
  );
}

export async function initializeProfileLibrary(handle: string): Promise<void> {
  // Only accept our generated profile handle format.
  if (!/^gf-[a-f0-9]{32}$/.test(handle)) {
    throw new Error("Invalid Gameflix profile handle.");
  }

  const games = await getGames(handle);

  // The API may already return an empty collection.
  if (games.length === 0) return;

  // Never delete unknown games or duplicate starter entries.
  const containsUnknownGames = games.some((game) => !game.id || !isStarterGame(game));

  const hasDuplicateTitles = new Set(games.map((game) => game.title)).size !== games.length;

  if (games.length > starterGames.length || containsUnknownGames || hasDuplicateTitles) {
    throw new Error("This library contains unexpected games. Nothing was deleted.");
  }

  // Remove only verified starter games.
  for (const game of games) {
    await deleteGame(handle, game.id);
  }

  // Confirm that initialization succeeded.
  const remainingGames = await getGames(handle);

  if (remainingGames.length > 0) {
    throw new Error("The library could not be initialized completely.");
  }
}
