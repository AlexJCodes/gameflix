import { type SubmitEvent, useState } from "react";
import { PROFILE_AVATARS, type ProfileAvatarId } from "../../data/profileAvatars";
import type { Profile } from "../../types/profile";
import { Button } from "../ui/Button";
import { ProfileAvatar } from "./ProfileAvatar";

type ProfileFormProps = {
  profile?: Profile;
  onSave: (name: string, avatar: ProfileAvatarId) => void;
  onCancel: () => void;
};

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? "");
  const [selectedAvatar, setSelectedAvatar] = useState<ProfileAvatarId>(profile?.avatar ?? "rune");
  const [nameError, setNameError] = useState<string | null>(null);

  const isEditing = Boolean(profile);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      setNameError("Enter a name (1–20 characters).");
      return;
    }

    if (trimmedName.length > 20) {
      setNameError("Use 20 characters or fewer.");
      return;
    }

    setNameError(null);
    onSave(trimmedName, selectedAvatar);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-120 flex-col gap-6">
      {/* Form heading */}
      <div>
        <h1 className="font-display text-heading-2 font-bold">
          {isEditing ? "Edit Profile" : "Add Profile"}
        </h1>

        <p className="mt-2 font-body text-body-sm text-muted">
          {isEditing
            ? "Change your name or character. Your game library stays the same."
            : "A name, a character, a collection of your own. Profiles stay on this device. Up to 5 profiles."}
        </p>
      </div>

      {/* Profile name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="profile-name" className="font-body text-body-sm font-semibold">
          Profile name *
        </label>

        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setNameError(null);
          }}
          placeholder="Your player name"
          autoComplete="nickname"
          required
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "profile-name-error" : undefined}
          className="min-h-12 w-full rounded-md border border-divider bg-background-secondary px-3.5 font-body text-body-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        />

        {nameError && (
          <p id="profile-name-error" role="alert" className="font-body text-caption text-danger">
            {nameError}
          </p>
        )}
      </div>

      {/* Avatar selection */}
      <fieldset className="min-w-0">
        <legend className="mb-3 font-body text-body-sm font-semibold">Choose your character</legend>

        <div className="grid grid-cols-4 gap-3">
          {PROFILE_AVATARS.map((avatar) => (
            <label
              key={avatar.id}
              className="flex min-w-0 cursor-pointer flex-col items-center gap-1.5"
            >
              <input
                type="radio"
                name="profile-avatar"
                value={avatar.id}
                checked={selectedAvatar === avatar.id}
                onChange={() => setSelectedAvatar(avatar.id)}
                className="peer sr-only"
              />

              <span className="rounded-[20px] border-2 border-transparent p-0.5 peer-checked:border-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                <ProfileAvatar avatarId={avatar.id} className="size-16" />
              </span>

              <span className="w-full truncate text-center font-body text-[11px] text-muted peer-checked:text-foreground">
                {avatar.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Form actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="flex-1">
          {isEditing ? "Save Changes" : "Save"}
        </Button>

        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
