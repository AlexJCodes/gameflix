import type { Profile } from "../../types/profile";
import { Button } from "../ui/Button";
import { ProfileCard } from "./ProfileCard";

type ProfilePickerProps = {
  profiles: Profile[];
  selectedProfileId: string | null;
  isManaging: boolean;
  canAddProfile: boolean;
  onSelect: (profile: Profile) => void;
  onEdit: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  onAdd: () => void;
  onToggleManage: () => void;
  onTryDemo: () => void;
  isStartingDemo: boolean;
};

export function ProfilePicker({
  profiles,
  selectedProfileId,
  isManaging,
  canAddProfile,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
  onToggleManage,
  onTryDemo,
  isStartingDemo,
}: ProfilePickerProps) {
  return (
    <section className="mt-10 flex w-full flex-col items-center lg:mt-16">
      {/* Welcome */}
      <h1 className="text-center font-display text-[32px] font-bold lg:text-[48px]">
        Who's playing?
      </h1>

      <p className="mt-3 text-center font-body text-body-sm text-muted lg:text-lg">
        Choose your player and jump in.
      </p>

      {/* Profile cards */}
      <div className="mt-10 flex w-full max-w-270 flex-wrap justify-center gap-6 lg:mt-16 lg:gap-8">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfileId === profile.id}
            isManaging={isManaging}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {/* Add profile */}
        {!isManaging && canAddProfile && (
          <button
            type="button"
            onClick={onAdd}
            className="group flex w-36 flex-col items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus lg:w-42"
          >
            <span className="flex size-28 items-center justify-center rounded-[20px] border border-divider bg-surface text-5xl text-muted group-hover:border-brand group-hover:text-foreground lg:size-40">
              <span aria-hidden="true">+</span>
            </span>

            <span className="font-body text-base font-medium text-muted group-hover:text-foreground lg:text-lg">
              Add Profile
            </span>
          </button>
        )}
      </div>

      {/* Profile management */}
      {profiles.length > 0 && (
        <div className="mt-10">
          <Button variant="secondary" onClick={onToggleManage}>
            {isManaging ? "Done" : "Manage Profiles"}
          </Button>
        </div>
      )}

      {/* Demo experience */}
      {!isManaging && (
        <div className="mt-14 flex w-full max-w-md flex-col items-center gap-4 border-t border-divider pt-8 text-center">
          <h2 className="font-display text-heading-3 font-bold">Not ready to commit?</h2>

          <p className="font-body text-body-sm text-muted">
            Take Gameflix for a spin. No profile needed.
          </p>

          <Button type="button" onClick={onTryDemo} disabled={isStartingDemo} className="mt-2">
            {isStartingDemo ? "Preparing demo…" : "Try Demo"}
          </Button>

          {isStartingDemo && (
            <p role="status" className="text-caption text-muted">
              Getting your games ready…
            </p>
          )}
        </div>
      )}
    </section>
  );
}
