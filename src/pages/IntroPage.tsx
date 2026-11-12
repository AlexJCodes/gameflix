import { useCallback, useState } from "react";
import { Navigate } from "react-router";
import { GameflixIntro } from "../components/intro/GameflixIntro";
import { getActiveProfile } from "../services/activeProfile";

export function IntroPage() {
  const activeProfile = getActiveProfile();
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  if (!activeProfile) {
    return <Navigate to="/profiles" replace />;
  }

  if (isComplete) {
    return <Navigate to="/home" replace />;
  }

  return <GameflixIntro onComplete={handleComplete} />;
}
