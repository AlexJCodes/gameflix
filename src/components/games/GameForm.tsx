import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { ApiError } from "../../api/ApiError";
import { FALLBACK_COVER_URL } from "../../data/gameArtwork";
import type { CreateGameInput, Game, GameStatus } from "../../types/game";
import { Button } from "../ui/Button";

type GameFormProps = {
  initialGame?: Game;
  preset?: Pick<CreateGameInput, "title" | "platform" | "coverUrl">;
  onSave: (game: CreateGameInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  error: Error | null;
};

type FieldErrors = {
  title?: string;
  platform?: string;
  coverUrl?: string;
  notes?: string;
};

const titleLimit = 100;
const platformLimit = 40;
const notesLimit = 1000;

const statusOptions: { value: GameStatus; label: string }[] = [
  { value: "want", label: "Want to Play" },
  { value: "playing", label: "Playing" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

const stars = [1, 2, 3, 4, 5];

const inputClasses =
  "min-h-12 w-full rounded-md border border-divider bg-background-secondary px-3.5 py-3 font-body text-body-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function GameForm({
  initialGame,
  preset,
  onSave,
  onCancel,
  isSaving,
  error,
}: GameFormProps) {
  const [title, setTitle] = useState(initialGame?.title ?? preset?.title ?? "");

  const [platform, setPlatform] = useState(initialGame?.platform ?? preset?.platform ?? "");

  const [status, setStatus] = useState<GameStatus>(initialGame?.status ?? "want");

  const [coverUrl, setCoverUrl] = useState(
    initialGame?.coverUrl === FALLBACK_COVER_URL
      ? ""
      : (initialGame?.coverUrl ?? preset?.coverUrl ?? ""),
  );

  const [rating, setRating] = useState<number | null>(initialGame?.rating ?? null);

  const [notes, setNotes] = useState(initialGame?.notes ?? "");

  const [errors, setErrors] = useState<FieldErrors>({});

  const titleRef = useRef<HTMLInputElement>(null);
  const platformRef = useRef<HTMLInputElement>(null);
  const coverUrlRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (preset) titleRef.current?.focus();
  }, [preset]);

  function validate({ title, platform, coverUrl, notes }: CreateGameInput): boolean {
    const nextErrors: FieldErrors = {};

    if (!title) {
      nextErrors.title = "Enter a game title.";
    } else if (title.length > titleLimit) {
      nextErrors.title = `Use ${titleLimit} characters or fewer for the title.`;
    }

    if (!platform) {
      nextErrors.platform = "Enter a platform.";
    } else if (platform.length > platformLimit) {
      nextErrors.platform = `Use ${platformLimit} characters or fewer for the platform.`;
    }

    if (coverUrl && (!/^https:\/\//i.test(coverUrl) || !URL.canParse(coverUrl))) {
      nextErrors.coverUrl = "Use a valid https:// image URL or leave blank.";
    }

    if (notes && notes.length > notesLimit) {
      nextErrors.notes = "Use 1,000 characters or fewer for notes.";
    }

    setErrors(nextErrors);

    if (nextErrors.title) titleRef.current?.focus();
    else if (nextErrors.platform) platformRef.current?.focus();
    else if (nextErrors.coverUrl) coverUrlRef.current?.focus();
    else if (nextErrors.notes) notesRef.current?.focus();

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    const trimmedCoverUrl = coverUrl.trim();
    const trimmedNotes = notes.trim();
    const game: CreateGameInput = {
      title: title.trim(),
      platform: platform.trim(),
      status,
    };

    const savedCoverUrl = initialGame?.coverUrl?.trim() || "";
    if (trimmedCoverUrl && trimmedCoverUrl !== savedCoverUrl) {
      game.coverUrl = trimmedCoverUrl;
    }

    if (initialGame || rating !== null) game.rating = rating;
    if (initialGame || trimmedNotes) game.notes = trimmedNotes;

    if (!validate(game)) return;

    if (!trimmedCoverUrl && savedCoverUrl && savedCoverUrl !== FALLBACK_COVER_URL) {
      game.coverUrl = FALLBACK_COVER_URL;
    }

    await onSave(game);
  }

  const isEditing = Boolean(initialGame);
  const isValidationError =
    error instanceof ApiError && error.kind === "http" && error.status === 400;

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-heading-2 font-bold lg:text-heading-1">
          {isEditing ? "Edit Game" : "Add Game"}
        </h1>

        <p className="text-body-sm text-muted">
          {isEditing ? "A new chapter for your collection." : "Make room for your next adventure."}
        </p>

        <p className="text-caption text-muted">* Required fields</p>
      </header>

      {error && (
        <div role="alert" className="rounded-md border border-danger bg-surface p-4">
          <p className="font-semibold text-danger">We couldn’t save your game.</p>
          <p className="mt-2 text-body-sm text-muted">
            {isValidationError
              ? "Your changes are still here. Review the title, platform, rating, notes and any new cover URL, then try again."
              : error instanceof ApiError && error.kind === "network"
                ? "Your changes are still here. Check your connection and try again."
                : "Your changes are still here. Try saving again."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="game-title" className="text-body-sm font-semibold">
          Title *
        </label>

        <input
          ref={titleRef}
          id="game-title"
          type="text"
          required
          disabled={isSaving}
          value={title}
          placeholder="e.g. Hollow Knight"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "game-title-error" : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors((previous) => ({ ...previous, title: undefined }));
          }}
          className={`${inputClasses} ${errors.title ? "border-danger" : ""}`}
        />

        {errors.title && (
          <p id="game-title-error" className="text-caption text-danger">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="game-platform" className="text-body-sm font-semibold">
          Platform *
        </label>

        <input
          ref={platformRef}
          id="game-platform"
          type="text"
          required
          disabled={isSaving}
          value={platform}
          placeholder="e.g. PC, Nintendo Switch"
          aria-invalid={Boolean(errors.platform)}
          aria-describedby={errors.platform ? "game-platform-error" : undefined}
          onChange={(event) => {
            setPlatform(event.target.value);
            setErrors((previous) => ({
              ...previous,
              platform: undefined,
            }));
          }}
          className={`${inputClasses} ${errors.platform ? "border-danger" : ""}`}
        />

        {errors.platform && (
          <p id="game-platform-error" className="text-caption text-danger">
            {errors.platform}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-semibold">Status *</legend>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="game-status"
                value={option.value}
                checked={status === option.value}
                disabled={isSaving}
                onChange={() => setStatus(option.value)}
              />

              <span className="inline-flex min-h-11 items-center rounded-md border border-divider bg-surface px-3 text-caption text-muted peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="game-cover-url" className="text-body-sm font-semibold">
          Cover image URL · Optional
        </label>

        <input
          ref={coverUrlRef}
          id="game-cover-url"
          type="text"
          inputMode="url"
          disabled={isSaving}
          value={coverUrl}
          placeholder="https://…"
          aria-invalid={Boolean(errors.coverUrl)}
          aria-describedby={errors.coverUrl ? "game-cover-error" : undefined}
          onChange={(event) => {
            setCoverUrl(event.target.value);
            setErrors((previous) => ({
              ...previous,
              coverUrl: undefined,
            }));
          }}
          className={`${inputClasses} ${errors.coverUrl ? "border-danger" : ""}`}
        />

        {errors.coverUrl && (
          <p id="game-cover-error" className="text-caption text-danger">
            {errors.coverUrl}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-body-sm font-semibold">Rating · Optional</legend>

        <div className="flex flex-wrap items-center gap-2">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSaving}
              aria-label={`Rate ${star} out of 5`}
              aria-pressed={rating === star}
              onClick={() => setRating(star)}
              className={`flex size-11 items-center justify-center rounded-md border border-divider bg-surface text-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                rating !== null && star <= rating ? "text-warning" : "text-muted"
              }`}
            >
              <span aria-hidden="true">★</span>
            </button>
          ))}

          <button
            type="button"
            disabled={isSaving || rating === null}
            onClick={() => setRating(null)}
            className="min-h-11 px-2 text-caption text-muted enabled:hover:text-foreground"
          >
            Clear
          </button>
        </div>

        <p className="text-caption text-muted" aria-live="polite">
          {rating === null
            ? "Not rated · Choose 1–5, or leave unset"
            : `${rating} of 5 · Your rating`}
        </p>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="game-notes" className="text-body-sm font-semibold">
          Personal notes · Optional
        </label>

        <textarea
          ref={notesRef}
          id="game-notes"
          rows={4}
          disabled={isSaving}
          value={notes}
          placeholder="A reminder for your future self…"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "game-notes-error" : undefined}
          onChange={(event) => {
            setNotes(event.target.value);
            setErrors((previous) => ({ ...previous, notes: undefined }));
          }}
          className={`${inputClasses} min-h-28 resize-y ${errors.notes ? "border-danger" : ""}`}
        />

        {errors.notes && (
          <p id="game-notes-error" className="text-caption text-danger">
            {errors.notes}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSaving} className="min-w-0 flex-1">
          {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Save Game"}
        </Button>

        <Button variant="secondary" disabled={isSaving} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
