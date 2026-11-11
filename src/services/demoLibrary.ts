import { createGame, getGames } from "../api/gamesApi";
import { demoGames } from "../data/demoGames";
import { getGameCoverUrl } from "../data/gameAssetUrls";
import type { CreateGameInput, Game } from "../types/game";

// Temporary public image hosting for the school project.
// Replace with the deployed Gameflix asset URL later.

export function getDemoGameKey(game: Pick<Game, "title" | "platform">): string {
  const title = game.title.trim().toLowerCase();
  const platform = game.platform.trim().toLowerCase();

  return `${title}::${platform}`;
}

export async function seedDemoLibrary(handle: string) {
  const existingGames = await getGames(handle);

  const existingKeys = new Set(existingGames.map(getDemoGameKey));

  let added = 0;
  let skipped = 0;

  for (const { coverFilename, ...game } of demoGames) {
    const key = getDemoGameKey(game);

    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    const input: CreateGameInput = {
      ...game,
      ...(coverFilename
        ? {
            coverUrl: getGameCoverUrl(coverFilename),
          }
        : {}),
    };

    await createGame(handle, input);

    existingKeys.add(key);
    added++;
  }

  return { added, skipped };
}
