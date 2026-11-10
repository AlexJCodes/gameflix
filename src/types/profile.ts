import type { ProfileAvatarId } from "../data/profileAvatars";

export type Profile = {
  id: string;
  name: string;
  avatar: ProfileAvatarId;
  handle: string;
};
