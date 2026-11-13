import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";
import { getActiveProfile } from "../services/activeProfile";

export function useGameMutationView(profileId: string, handle: string, gameId?: string) {
  const { key } = useLocation();
  const view = useRef<object | null>(null);

  useLayoutEffect(() => {
    view.current = { key, profileId, handle, gameId };
    return () => {
      view.current = null;
    };
  }, [key, profileId, handle, gameId]);

  return function captureView() {
    const origin = view.current;

    return () => {
      const activeProfile = getActiveProfile();
      return (
        origin !== null &&
        origin === view.current &&
        activeProfile?.id === profileId &&
        activeProfile.handle === handle
      );
    };
  };
}
