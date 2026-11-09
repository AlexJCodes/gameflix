import { useState } from "react";

const DEFAULT_FALLBACK = "/images/games/fallback/missing-cover-art.webp";

type GameCoverProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
};

export function GameCover({
  src,
  alt,
  className = "",
  fallbackSrc = DEFAULT_FALLBACK,
}: GameCoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const hasCover = Boolean(src && src !== failedSrc);
  const imageSrc = hasCover && src ? src : fallbackSrc;

  return (
    <div className={`overflow-hidden bg-surface ${className}`}>
      <img
        src={imageSrc}
        alt={hasCover ? alt : alt ? "Cover artwork unavailable" : ""}
        onError={hasCover ? () => setFailedSrc(src ?? null) : undefined}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
