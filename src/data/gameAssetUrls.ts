const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_BASE_URL ||
  "https://raw.githubusercontent.com/AlexJCodes/gameflix/main/public"
).replace(/\/+$/, "");

export function getGameCoverUrl(filename: string): string {
  return `${ASSET_BASE_URL}/images/games/covers/${encodeURIComponent(filename)}`;
}

export const FALLBACK_COVER_URL = `${ASSET_BASE_URL}/images/games/fallback/missing-cover-art.webp`;
