const HERO_DIRECTORY = "/images/games/heroes";

export { FALLBACK_COVER_URL } from "./gameAssetUrls";

const heroFilesByTitle: Record<string, string> = {
  balatro: "balatro-hero.webp",
  celeste: "celeste-hero.webp",
  "elden ring": "elden-ring-hero.webp",
  "final fantasy x": "ffx-hero.webp",
  ffx: "ffx-hero.webp",
  "gran turismo": "gran-turismo-sports-hero.webp",
  "gran turismo sport": "gran-turismo-sports-hero.webp",
  hades: "hades-hero.webp",
  "hollow knight": "hollow-knight-hero.webp",
  "it takes two": "it-takes-two-hero.webp",
  journey: "journey-hero.webp",
  "ori and the will of the wisps": "ori-and-the-will-of-the-wisps-hero.webp",
  "outer wilds": "outer-wilds-hero.webp",
  "slay the spire": "slay-the-spire-hero.webp",
  "stardew valley": "stardew-valley-hero.webp",
  subnautica: "subnautica-hero.webp",
  "the witcher 3": "the-witcher-3-hero.webp",
  "the witcher 3: wild hunt": "the-witcher-3-hero.webp",
  tibia: "tibia-hero.webp",
  tunic: "tunic-hero.webp",
  "world of warcraft": "wow-2004-hero.webp",
  "world of warcraft (2004)": "wow-2004-hero.webp",
  "world of warcraft: the burning crusade": "wow-tbc-hero.webp",
  "the burning crusade": "wow-tbc-hero.webp",
  "world of warcraft: wrath of the lich king": "wow-wotlk-hero.webp",
  "wrath of the lich king": "wow-wotlk-hero.webp",
  "tears of the kingdom": "tears-of-the-kingdom-hero.webp",
  "the legend of zelda: tears of the kingdom": "tears-of-the-kingdom-hero.webp",
};

export function getGameHeroUrl(title: string): string | null {
  const filename = heroFilesByTitle[title.trim().toLowerCase()];

  return filename ? `${HERO_DIRECTORY}/${filename}` : null;
}
