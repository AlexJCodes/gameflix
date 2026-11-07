export type GameStatus = "want-to-play" | "playing" | "completed" | "dropped";

export type Game = {
  id: string;
  title: string;
  platform: string;
  status: GameStatus;
  rating?: number | null;
  coverUrl?: string | null;
  notes?: string | null;
};

export type CreateGameInput = Pick<Game, "title" | "platform" | "status"> &
  Partial<Pick<Game, "rating" | "coverUrl" | "notes">>;

export type UpdateGameInput = Partial<CreateGameInput>;
