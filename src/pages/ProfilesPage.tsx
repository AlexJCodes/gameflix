import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gameflixLogo from "../assets/branding/gameflix-logo.svg";
import { DeleteProfileDialog } from "../components/profiles/DeleteProfileDialog";
import { ProfileForm } from "../components/profiles/ProfileForm";
import { ProfilePicker } from "../components/profiles/ProfilePicker";
import type { ProfileAvatarId } from "../data/profileAvatars";
import {
  clearActiveProfile,
  getActiveProfile,
  setActiveDemo,
  setActiveProfile,
} from "../services/activeProfile";
import { prepareDemoLibrary } from "../services/demoSession";
import { initializeProfileLibrary } from "../services/initializeProfileLibrary";
import {
  deleteProfile,
  loadProfiles,
  MAX_PROFILES,
  prepareProfile,
  saveProfile,
  updateProfile,
} from "../services/profileStorage";
import type { Profile } from "../types/profile";

export function ProfilesPage() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);

  const [isManaging, setIsManaging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isStartingDemo, setIsStartingDemo] = useState(false);
  const demoPending = useRef(false);
  const demoRunRef = useRef(0);

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate submissions.
  const savePending = useRef(false);

  // Reuse the same handle if initialization needs a retry.
  const pendingProfile = useRef<Profile | null>(null);

  const activeProfile = getActiveProfile();
  const canAddProfile = profiles.length < MAX_PROFILES;
  const isShowingForm = isCreating || editingProfile !== null;

  useEffect(() => {
    return () => {
      demoRunRef.current += 1;
    };
  }, []);

  function handleSelectProfile(profile: Profile) {
    try {
      setActiveProfile(profile);

      demoRunRef.current += 1;

      navigate("/home");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Could not select your profile.",
      );
    }
  }

  function handleAddProfile() {
    pendingProfile.current = null;
    setIsCreating(true);
    setError(null);
  }

  function handleEditProfile(profile: Profile) {
    setEditingProfile(profile);
    setError(null);
  }

  async function handleSave(name: string, avatar: ProfileAvatarId) {
    if (savePending.current) return;

    savePending.current = true;
    setIsSaving(true);
    setError(null);

    try {
      if (editingProfile) {
        updateProfile(editingProfile.id, { name, avatar });
        setEditingProfile(null);
      } else {
        // Prepare without writing to LocalStorage.
        const draft = pendingProfile.current ?? prepareProfile(name, avatar);

        const profile: Profile = {
          ...draft,
          name: name.trim(),
          avatar,
        };

        pendingProfile.current = profile;

        // Only verified starter games may be removed.
        await initializeProfileLibrary(profile.handle);

        // Save only after successful initialization.
        saveProfile(profile);

        pendingProfile.current = null;
        setIsCreating(false);
      }

      setProfiles(loadProfiles());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not save your profile.");
    } finally {
      savePending.current = false;
      setIsSaving(false);
    }
  }

  function handleCancelForm() {
    if (savePending.current) return;

    pendingProfile.current = null;
    setIsCreating(false);
    setEditingProfile(null);
    setError(null);
  }

  function handleDeleteProfile() {
    if (!profileToDelete) return;

    try {
      const wasActive = getActiveProfile()?.id === profileToDelete.id;

      deleteProfile(profileToDelete.id);

      if (wasActive) {
        clearActiveProfile();
      }

      const remainingProfiles = loadProfiles();

      setProfiles(remainingProfiles);
      setProfileToDelete(null);
      setError(null);

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

  async function handleTryDemo() {
    if (demoPending.current) return;

    const currentRun = ++demoRunRef.current;

    demoPending.current = true;
    setIsStartingDemo(true);
    setError(null);

    try {
      await prepareDemoLibrary();

      // Ignore the result if this demo request was cancelled.
      if (currentRun !== demoRunRef.current) return;

      setActiveDemo();
      navigate("/home");
    } catch (caughtError) {
      if (currentRun !== demoRunRef.current) return;

      console.error("[Gameflix] Demo initialization failed", caughtError);
      setError("Couldn't prepare the demo. Please try again.");
    } finally {
      demoPending.current = false;

      if (currentRun === demoRunRef.current) {
        setIsStartingDemo(false);
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 py-12 text-foreground lg:px-page-desktop lg:py-20">
      <img src={gameflixLogo} alt="Gameflix" className="h-auto w-52 max-w-full" />

      {isShowingForm ? (
        <div className="mt-12 flex w-full justify-center">
          <ProfileForm
            key={editingProfile?.id ?? "new-profile"}
            profile={editingProfile ?? undefined}
            onSave={handleSave}
            onCancel={handleCancelForm}
            isSaving={isSaving}
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
          onTryDemo={handleTryDemo}
          isStartingDemo={isStartingDemo}
        />
      )}

      {error && (
        <p role="alert" className="mt-6 max-w-md text-center font-body text-body-sm text-danger">
          {error}
        </p>
      )}

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
