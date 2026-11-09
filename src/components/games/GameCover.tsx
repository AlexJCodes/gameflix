import { useState } from "react";

type GameCoverProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function GameCover({ src, alt, className = "" }: GameCoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasCover = Boolean(src && src !== failedSrc);

  return (
    <div className={`overflow-hidden bg-surface ${className}`}>
      {hasCover ? (
        <img
          src={src ?? undefined}
          alt={alt}
          onError={() => setFailedSrc(src ?? null)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-surface-elevated p-4 text-center font-body text-body-sm text-muted">
          Cover unavailable
        </div>
      )}
    </div>
  );
}
