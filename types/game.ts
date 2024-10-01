export interface Game {
  id?: string;
  game_id?: number | string;
  name: string;
  alternative_names?: string[];
  slug: string;
  description: string;
  description_raw?: string;
  released: string;
  background_image: string;
  platforms: string[];
  genres: string[];
  rating: number;
  developers?: Developer[];
  metacritic_url?: string;
  reddit_url?: string;
  website?: string;
  stores?: Store[];
  tags?: Tag[];
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string;
  games_count: number;
  image_background: string;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

// Xbox One, Xbox Series S/X, Xbox360, PlayStation 4, PlayStation 5, Nintendo Switch, PC, IOS, Android
export enum Platform {
  PC = "PC",
  PlayStation5 = "PlayStation 5",
  XboxOne = "Xbox One",
  PlayStation4 = "PlayStation 4",
  XboxSeriesSX = "Xbox Series S/X",
  NintendoSwitch = "Nintendo Switch",
  iOS = "iOS",
  Android = "Android",
  Nintendo3DS = "Nintendo 3DS",
  NintendoDS = "Nintendo DS",
  NintendoDSi = "Nintendo DSi",
  macOS = "macOS",
  Linux = "Linux",
  Xbox360 = "Xbox 360",
  Xbox = "Xbox",
  PlayStation3 = "PlayStation 3",
  PlayStation2 = "PlayStation 2",
  PlayStation = "PlayStation",
  PSVita = "PS Vita",
  PSP = "PSP",
  WiiU = "Wii U",
  Wii = "Wii",
  GameCube = "GameCube",
  Nintendo64 = "Nintendo 64",
  GameBoyAdvance = "Game Boy Advance",
  GameBoyColor = "Game Boy Color",
  GameBoy = "Game Boy",
  SNES = "SNES",
  NES = "NES",
  ClassicMacintosh = "Classic Macintosh",
  AppleII = "Apple II",
  CommodoreAmiga = "Commodore / Amiga",
  Atari7800 = "Atari 7800",
  Atari5200 = "Atari 5200",
  Atari2600 = "Atari 2600",
  AtariFlashback = "Atari Flashback",
  Atari8bit = "Atari 8-bit",
  AtariST = "Atari ST",
  AtariLynx = "Atari Lynx",
  AtariXEGS = "Atari XEGS",
  Genesis = "Genesis",
  SEGASaturn = "SEGA Saturn",
  SEGACD = "SEGA CD",
  SEGA32X = "SEGA 32X",
  SEGAMasterSystem = "SEGA Master System",
  Dreamcast = "Dreamcast",
  THREEDO = "3DO",
  Jaguar = "Jaguar",
  GameGear = "Game Gear",
  NeoGeo = "Neo Geo",
}

export enum Genre {
  Action = "Action",
  Indie = "Indie",
  Adventure = "Adventure",
  RPG = "RPG",
  Strategy = "Strategy",
  Shooter = "Shooter",
  Casual = "Casual",
  Simulation = "Simulation",
  Puzzle = "Puzzle",
  Arcade = "Arcade",
  Platformer = "Platformer",
  Racing = "Racing",
  MassivelyMultiplayer = "Massively Multiplayer",
  Sports = "Sports",
  Fighting = "Fighting",
  Family = "Family",
  BoardGames = "Board Games",
  Educational = "Educational",
  Card = "Card",
}

export const platforms = Object.values(Platform);
export const genres = Object.values(Genre);
