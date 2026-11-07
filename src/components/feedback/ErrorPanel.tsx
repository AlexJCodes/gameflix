import { Link } from "react-router";
import { Button } from "../ui/Button";

type ErrorPanelProps = {
  title: string;
  description: string;
  onRetry: () => void;
  backTo: string;
  backLabel: string;
};

export function ErrorPanel({ title, description, onRetry, backTo, backLabel }: ErrorPanelProps) {
  return (
    <section className="flex flex-col gap-6">
      <div role="alert" className="rounded-md border border-danger bg-surface p-4">
        <h2 className="font-body text-body-sm font-semibold text-danger">{title}</h2>

        <p className="mt-1.5 font-body text-[13px] text-muted">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRetry} className="w-full sm:w-auto">
          Retry
        </Button>

        <Link
          to={backTo}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-divider bg-surface px-5 font-body text-button font-bold text-foreground hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:w-auto"
        >
          {backLabel}
        </Link>
      </div>
    </section>
  );
}
