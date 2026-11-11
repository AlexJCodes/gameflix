import { PROFILE_AVATARS, type ProfileAvatarId } from "../../data/profileAvatars";

type ProfileAvatarProps = {
  avatarId: ProfileAvatarId;
  className?: string;
};

export function ProfileAvatar({ avatarId, className = "" }: ProfileAvatarProps) {
  const avatar = PROFILE_AVATARS.find((item) => item.id === avatarId);

  if (!avatar) return null;

  return (
    <img
      src={avatar.src}
      alt=""
      className={`aspect-square rounded-[20px] object-cover ${className}`}
    />
  );
}
