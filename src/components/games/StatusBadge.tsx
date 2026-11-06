type GameStatusLabel = "Want to Play" | "Playing" | "Completed" | "Dropped";

type StatusBadgeProps = {
  status: GameStatusLabel;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-divider bg-surface-elevated px-2.5 py-1.25 font-body text-caption font-semibold text-foreground">
      {status}
    </span>
  );
}
