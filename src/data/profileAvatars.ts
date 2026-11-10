export const PROFILE_AVATARS = [
  { id: "rune", label: "Rune", src: "/images/avatars/rune.webp" },
  { id: "sprig", label: "Sprig", src: "/images/avatars/sprig.webp" },
  { id: "ember", label: "Ember", src: "/images/avatars/ember.webp" },
  { id: "quest", label: "Quest", src: "/images/avatars/quest.webp" },
  { id: "boo", label: "Boo", src: "/images/avatars/boo.webp" },
  { id: "jelly", label: "Jelly", src: "/images/avatars/jelly.webp" },
  { id: "pip", label: "Pip", src: "/images/avatars/pip.webp" },
  { id: "mochi", label: "Mochi", src: "/images/avatars/mochi.webp" },
  { id: "shade", label: "Shade", src: "/images/avatars/shade.webp" },
  { id: "nova", label: "Nova", src: "/images/avatars/nova.webp" },
  { id: "turbo", label: "Turbo", src: "/images/avatars/turbo.webp" },
  { id: "pixel", label: "Pixel", src: "/images/avatars/pixel.webp" },
] as const;

export type ProfileAvatarId = (typeof PROFILE_AVATARS)[number]["id"];
