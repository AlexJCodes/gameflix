import { useEffect, useRef } from "react";
import type { Profile } from "../../types/profile";
import { Button } from "../ui/Button";

type DeleteProfileDialogProps = {
  profile: Profile;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteProfileDialog({ profile, onConfirm, onCancel }: DeleteProfileDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-profile-title"
      aria-describedby="delete-profile-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-divider bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/80"
    >
      <h2 id="delete-profile-title" className="font-display text-heading-2 font-bold">
        Delete {profile.name}?
      </h2>

      <p
        id="delete-profile-description"
        className="mt-4 font-body text-body-sm leading-relaxed text-muted"
      >
        This removes the profile from this device. Your games will remain on the server, but you may
        lose access to them without this profile. This action cannot be undone here.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Delete Profile
        </Button>
      </div>
    </dialog>
  );
}
