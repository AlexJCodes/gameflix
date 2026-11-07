import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center gap-5 px-6 py-12 text-center">
      <span aria-hidden="true" className="font-display text-5xl text-brand">
        +
      </span>

      <h2 className="max-w-md font-display text-2xl font-bold">{title}</h2>

      <p className="max-w-md font-body text-body-sm text-muted">{description}</p>

      {action}
    </section>
  );
}
