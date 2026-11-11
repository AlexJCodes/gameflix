import { useState } from "react";
import { useNavigate } from "react-router";
import gameflixLogo from "../assets/branding/gameflix-logo.svg";
import { DeleteProfileDialog } from "../components/profiles/DeleteProfileDialog";
import { ProfileForm } from "../components/profiles/ProfileForm";
import { ProfilePicker } from "../components/profiles/ProfilePicker";
import type { ProfileAvatarId } from "../data/profileAvatars";
import { clearActiveProfile, getActiveProfile, setActiveProfile } from "../services/activeProfile";
import {
  createProfile,
  deleteProfile,
  loadProfiles,
  MAX_PROFILES,
  updateProfile,
} from "../services/profileStorage";
import type { Profile } from "../types/profile";

export function ProfilesPage() {
  const navigate = useNavigate();

  // Local profiles
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);

  // UI state
  const [isManaging, setIsManaging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived values
  const activeProfile = getActiveProfile();
  const canAddProfile = profiles.length < MAX_PROFILES;
  const isShowingForm = isCreating || editingProfile !== null;

  // Select profile
  function handleSelectProfile(profile: Profile) {
    try {
      setActiveProfile(profile);
      navigate("/home");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Could not select your profile.",
      );
    }
  }

  // Open create form
  function handleAddProfile() {
    setIsCreating(true);
    setError(null);
  }

  // Open edit form
  function handleEditProfile(profile: Profile) {
    setEditingProfile(profile);
    setError(null);
  }

  // Save new or updated profile
  function handleSave(name: string, avatar: ProfileAvatarId) {
    try {
      if (editingProfile) {
        updateProfile(editingProfile.id, {
          name,
          avatar,
        });

        setEditingProfile(null);
      } else {
        createProfile(name, avatar);
        setIsCreating(false);
      }

      setProfiles(loadProfiles());
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save your profile.");
    }
  }

  // Cancel create or edit
  function handleCancelForm() {
    setIsCreating(false);
    setEditingProfile(null);
    setError(null);
  }

  // Delete selected profile
  function handleDeleteProfile() {
    if (!profileToDelete) return;

    try {
      const wasActive = getActiveProfile()?.id === profileToDelete.id;

      deleteProfile(profileToDelete.id);

      // Clear active selection if its profile was deleted.
      if (wasActive) {
        clearActiveProfile();
      }

      const remainingProfiles = loadProfiles();

      setProfiles(remainingProfiles);
      setProfileToDelete(null);
      setError(null);

      // Avoid getting stuck in Manage mode.
      if (remainingProfiles.length === 0) {
        setIsManaging(false);
      }
    } catch (caughtError) {
      setProfileToDelete(null);

      setError(
        caughtError instanceof Error ? caughtError.message : "Could not delete the profile.",
      );
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 py-12 text-foreground lg:px-page-desktop lg:py-20">
      {/* Branding */}
      <img src={gameflixLogo} alt="Gameflix" className="h-auto w-52 max-w-full" />

      {/* Create / Edit */}
      {isShowingForm ? (
        <div className="mt-12 flex w-full justify-center">
          <ProfileForm
            key={editingProfile?.id ?? "new-profile"}
            profile={editingProfile ?? undefined}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <ProfilePicker
          profiles={profiles}
          selectedProfileId={activeProfile?.id ?? null}
          isManaging={isManaging}
          canAddProfile={canAddProfile}
          onSelect={handleSelectProfile}
          onEdit={handleEditProfile}
          onDelete={(profile) => {
            setProfileToDelete(profile);
            setError(null);
          }}
          onAdd={handleAddProfile}
          onToggleManage={() => {
            setIsManaging((current) => !current);
            setError(null);
          }}
        />
      )}

      {/* Error feedback */}
      {error && (
        <p role="alert" className="mt-6 max-w-md text-center font-body text-body-sm text-danger">
          {error}
        </p>
      )}

      {/* Delete confirmation */}
      {profileToDelete && (
        <DeleteProfileDialog
          profile={profileToDelete}
          onConfirm={handleDeleteProfile}
          onCancel={() => setProfileToDelete(null)}
        />
      )}
    </main>
  );
}
