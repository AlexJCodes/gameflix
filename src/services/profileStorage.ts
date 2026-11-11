import { PROFILE_AVATARS, type ProfileAvatarId } from "../data/profileAvatars";
import type { Profile } from "../types/profile";

const STORAGE_KEY = "gameflix.profiles.v1";

export const MAX_PROFILES = 5;

function isProfile(value: unknown): value is Profile {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const profile = value as Record<string, unknown>;

  return (
    typeof profile.id === "string" &&
    profile.id.length > 0 &&
    typeof profile.name === "string" &&
    profile.name.trim().length > 0 &&
    typeof profile.handle === "string" &&
    profile.handle.length > 0 &&
    PROFILE_AVATARS.some((avatar) => avatar.id === profile.avatar)
  );
}

export function loadProfiles(): Profile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isProfile).slice(0, MAX_PROFILES);
  } catch {
    return [];
  }
}

export function createProfile(name: string, avatar: ProfileAvatarId): Profile {
  const profiles = loadProfiles();

  if (profiles.length >= MAX_PROFILES) {
    throw new Error("You can have up to 5 profiles.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 1 || trimmedName.length > 20) {
    throw new Error("Profile names must be 1–20 characters.");
  }

  const id = crypto.randomUUID();

  const profile: Profile = {
    id,
    name: trimmedName,
    avatar,
    handle: `gf-${id.replaceAll("-", "")}`,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...profiles, profile]));

  return profile;
}

type ProfileChanges = Pick<Profile, "name" | "avatar">;

export function updateProfile(id: string, changes: ProfileChanges): Profile {
  const profiles = loadProfiles();

  const existingProfile = profiles.find((profile) => profile.id === id);

  if (!existingProfile) {
    throw new Error("Profile not found.");
  }

  const trimmedName = changes.name.trim();

  if (trimmedName.length < 1 || trimmedName.length > 20) {
    throw new Error("Profile names must be 1–20 characters.");
  }

  const updatedProfile: Profile = {
    ...existingProfile,
    name: trimmedName,
    avatar: changes.avatar,
  };

  const updatedProfiles = profiles.map((profile) => (profile.id === id ? updatedProfile : profile));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));

  return updatedProfile;
}

export function deleteProfile(id: string): void {
  const profiles = loadProfiles();

  const remainingProfiles = profiles.filter((profile) => profile.id !== id);

  if (remainingProfiles.length === profiles.length) {
    throw new Error("Profile not found.");
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingProfiles));
}
