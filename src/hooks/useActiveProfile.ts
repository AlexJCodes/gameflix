import { useOutletContext } from "react-router";
import type { Profile } from "../types/profile";

export function useActiveProfile(): Profile {
  return useOutletContext<Profile>();
}
