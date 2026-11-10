import type { Profile } from "../../types/profile";
import { ProfileAvatar } from "./ProfileAvatar";

type ProfileCardProps = {
  profile: Profile;
  onSelect: (profile: Profile) => void;
};

export function ProfileCard({ profile, onSelect }: ProfileCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(profile)}
      aria-label={`Play as ${profile.name}`}
      className="group flex w-36 flex-col items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus lg:w-42"
    >
      <ProfileAvatar
        avatarId={profile.avatar}
        className="size-28 ring-2 ring-transparent group-hover:ring-brand group-focus-visible:ring-brand lg:size-40"
      />

      <span className="w-full truncate text-center font-body text-base font-medium text-muted group-hover:text-foreground group-focus-visible:text-foreground lg:text-lg">
        {profile.name}
      </span>
    </button>
  );
}
