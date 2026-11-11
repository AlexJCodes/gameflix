import type { Profile } from "../../types/profile";
import { ProfileAvatar } from "./ProfileAvatar";

type ProfileCardProps = {
  profile: Profile;
  isSelected: boolean;
  isManaging: boolean;
  onSelect: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
};

export function ProfileCard({
  profile,
  isSelected,
  isManaging,
  onSelect,
  onEdit,
  onDelete,
}: ProfileCardProps) {
  if (isManaging) {
    return (
      <div className="flex w-36 flex-col items-center gap-3 lg:w-42">
        <ProfileAvatar avatarId={profile.avatar} className="size-28 lg:size-40" />

        <span className="w-full truncate text-center font-body text-base font-medium lg:text-lg">
          {profile.name}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(profile)}
            aria-label={`Edit ${profile.name}`}
            className="flex size-10 items-center justify-center rounded-md border border-divider bg-surface text-foreground hover:border-brand focus-visible:outline-2 focus-visible:outline-focus"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Edit profile</title>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onDelete(profile)}
            aria-label={`Delete ${profile.name}`}
            className="flex size-10 items-center justify-center rounded-md border border-divider bg-surface text-danger hover:border-danger focus-visible:outline-2 focus-visible:outline-focus"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Delete profile</title>
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 10v6M14 10v6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      aria-label={`Select ${profile.name}`}
      aria-pressed={isSelected}
      className="group flex w-36 flex-col items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus lg:w-42"
    >
      <ProfileAvatar
        avatarId={profile.avatar}
        className={`size-28 ring-2 ring-offset-4 ring-offset-background transition-colors lg:size-40 ${
          isSelected ? "ring-brand" : "ring-transparent group-hover:ring-brand"
        }`}
      />

      <span
        className={`w-full truncate text-center font-body text-base font-medium lg:text-lg ${
          isSelected ? "text-foreground" : "text-muted group-hover:text-foreground"
        }`}
      >
        {profile.name}
      </span>
    </button>
  );
}
