import type { Profile } from "../types/profile";
import { loadProfiles } from "./profileStorage";

const ACTIVE_PROFILE_KEY = "gameflix.activeProfileId.v1";

export function getActiveProfile(): Profile | null {
  try {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);

    if (!activeId) return null;

    return loadProfiles().find((profile) => profile.id === activeId) ?? null;
  } catch {
    return null;
  }
}

export function setActiveProfile(profile: Profile): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
}

export function clearActiveProfile(): void {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}
