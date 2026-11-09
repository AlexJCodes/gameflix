import { useEffect, useRef } from "react";
import { Button } from "../ui/Button";

type DeleteGameDialogProps = {
  gameTitle: string;
  isDeleting: boolean;
  hasError: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteGameDialog({
  gameTitle,
  isDeleting,
  hasError,
  onConfirm,
  onCancel,
}: DeleteGameDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function closeDialog() {
    dialogRef.current?.close();
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-game-title"
      aria-describedby="delete-game-description"
      onCancel={(event) => {
        event.preventDefault();

        if (!isDeleting) closeDialog();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-divider bg-surface p-6 text-foreground shadow-2xl backdrop:bg-background/80"
    >
      <div className="flex flex-col gap-5">
        <h2
          id="delete-game-title"
          className="wrap-break-word font-display text-heading-2 font-bold"
        >
          Delete {gameTitle}?
        </h2>

        <p id="delete-game-description" className="text-body-sm text-muted">
          This removes the game, your rating and personal notes from your library. This can’t be
          undone.
        </p>

        {hasError && (
          <div role="alert" className="rounded-md border border-danger p-4">
            <p className="font-semibold text-danger">Couldn’t delete this game.</p>

            <p className="mt-2 text-body-sm text-muted">Nothing was removed. Please try again.</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            disabled={isDeleting}
            onClick={closeDialog}
            className="min-w-0 flex-1"
          >
            Cancel
          </Button>

          <Button disabled={isDeleting} onClick={onConfirm} className="min-w-0 flex-1">
            {isDeleting ? "Deleting…" : hasError ? "Retry Delete" : "Delete Game"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
