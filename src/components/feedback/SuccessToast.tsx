import { useLocation, useNavigate } from "react-router";

type SuccessState = {
  successMessage?: string;
};

export function SuccessToast() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as SuccessState | null;
  const message = state?.successMessage;

  if (!message) return null;

  function dismiss() {
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: null,
    });
  }

  return (
    <div
      role="status"
      className="fixed right-4 bottom-6 left-4 z-50 mx-auto flex max-w-md items-center gap-4 rounded-lg border border-divider bg-surface p-4 shadow-xl sm:left-auto sm:mx-0"
    >
      <span aria-hidden="true" className="text-success">
        ✓
      </span>

      <p className="flex-1 text-body-sm text-foreground">{message}</p>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="min-h-11 px-2 text-body-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
      >
        ✕
      </button>
    </div>
  );
}
