import type { Game, GameStatus } from "../../types/game";

export type LibraryFilter = "all" | GameStatus;

export const libraryFilters: {
  value: LibraryFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "want", label: "Want to Play" },
  { value: "playing", label: "Playing" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

type LibraryFiltersProps = {
  games: Game[];
  selectedFilter: LibraryFilter;
  onFilterChange: (filter: LibraryFilter) => void;
};

export function LibraryFilters({ games, selectedFilter, onFilterChange }: LibraryFiltersProps) {
  return (
    <fieldset>
      <legend className="sr-only">Filter games by status</legend>

      <div className="flex flex-wrap gap-2">
        {libraryFilters.map((filter) => {
          const count =
            filter.value === "all"
              ? games.length
              : games.filter((game) => game.status === filter.value).length;

          const isSelected = selectedFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onFilterChange(filter.value)}
              className={[
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 font-body text-caption font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:px-4.5 lg:text-body-sm",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-divider bg-surface text-muted hover:border-muted hover:text-foreground",
              ].join(" ")}
            >
              <span>{filter.label}</span>
              <span className="tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
