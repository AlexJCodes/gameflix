import type { Profile } from "../types/profile";
import { DEMO_PROFILE_ID, getReadyDemoHandle } from "./demoSession";
import { loadProfiles } from "./profileStorage";

const ACTIVE_PROFILE_KEY = "gameflix.activeProfileId.v1";

export function getActiveProfile(): Profile | null {
  try {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);

    if (!activeId) return null;

    if (activeId === DEMO_PROFILE_ID) {
      const handle = getReadyDemoHandle();

      if (!handle) return null;

      return {
        id: DEMO_PROFILE_ID,
        name: "Demo",
        avatar: "pixel",
        handle,
      };
    }

    return loadProfiles().find((profile) => profile.id === activeId) ?? null;
  } catch {
    return null;
  }
}

export function setActiveProfile(profile: Profile): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
}

export function setActiveDemo(): void {
  if (!getReadyDemoHandle()) {
    throw new Error("Demo library is not ready.");
  }

  localStorage.setItem(ACTIVE_PROFILE_KEY, DEMO_PROFILE_ID);
}

export function clearActiveProfile(): void {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}
