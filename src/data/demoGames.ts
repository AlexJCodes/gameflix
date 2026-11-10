import type { CreateGameInput } from "../types/game";

export type DemoGame = Omit<CreateGameInput, "coverUrl"> & {
  coverFilename?: string;
};

export const demoGames: DemoGame[] = [
  {
    title: "Hollow Knight",
    platform: "PC",
    status: "playing",
    coverFilename: "hollow-knight-cover.webp",
  },
  {
    title: "Hades",
    platform: "Nintendo Switch",
    status: "completed",
    coverFilename: "hades-cover.webp",
  },
  {
    title: "Celeste",
    platform: "PC",
    status: "want",
    coverFilename: "celeste-cover.webp",
  },
  {
    title: "Outer Wilds",
    platform: "PC",
    status: "want",
    coverFilename: "outer-wilds-cover.webp",
  },
  {
    title: "Tunic",
    platform: "PC",
    status: "want",
    coverFilename: "tunic-cover.webp",
  },
  {
    title: "Journey",
    platform: "PlayStation",
    status: "completed",
    coverFilename: "journey-cover.webp",
  },
  {
    title: "Stardew Valley",
    platform: "PC",
    status: "playing",
    coverFilename: "stardew-valley-cover.webp",
  },
  {
    title: "Dead Cells",
    platform: "PC",
    status: "dropped",
  },
  {
    title: "Tibia",
    platform: "PC",
    status: "playing",
    coverFilename: "tibia-cover.webp",
  },
  {
    title: "World of Warcraft (2004)",
    platform: "PC",
    status: "completed",
    coverFilename: "wow-2004-cover.webp",
  },
  {
    title: "World of Warcraft: The Burning Crusade",
    platform: "PC",
    status: "completed",
    coverFilename: "wow-tbc-cover.webp",
  },
  {
    title: "World of Warcraft: Wrath of the Lich King",
    platform: "PC",
    status: "completed",
    coverFilename: "wow-wotlk-cover.webp",
  },
  {
    title: "Final Fantasy X",
    platform: "PlayStation 2",
    status: "completed",
    coverFilename: "ffx-cover.webp",
  },
  {
    title: "Gran Turismo Sport",
    platform: "PlayStation 4",
    status: "completed",
    coverFilename: "gran-turismo-sports-cover.webp",
  },
  {
    title: "Elden Ring",
    platform: "PC",
    status: "playing",
    coverFilename: "elden-ring-cover.webp",
  },
  {
    title: "Ori and the Will of the Wisps",
    platform: "PC",
    status: "want",
    coverFilename: "ori-and-the-will-of-the-wisps-cover.webp",
  },
  {
    title: "The Witcher 3: Wild Hunt",
    platform: "PC",
    status: "completed",
    coverFilename: "the-witcher-3-cover.webp",
  },
  {
    title: "Subnautica",
    platform: "PC",
    status: "want",
    coverFilename: "subnautica-cover.webp",
  },
  {
    title: "Balatro",
    platform: "PC",
    status: "playing",
    coverFilename: "balatro-cover.webp",
  },
  {
    title: "Slay the Spire",
    platform: "PC",
    status: "completed",
    coverFilename: "slay-the-spire-cover.webp",
  },
  {
    title: "It Takes Two",
    platform: "PC",
    status: "completed",
    coverFilename: "it-takes-two-cover.webp",
  },
  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo Switch",
    status: "want",
    coverFilename: "tears-of-the-kingdom-cover.webp",
  },
];
