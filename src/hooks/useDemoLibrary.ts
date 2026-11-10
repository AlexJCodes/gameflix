import { useRef, useState } from "react";
import { seedDemoLibrary } from "../services/demoLibrary";

export function useDemoLibrary() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const seedPending = useRef(false);

  async function addDemoGames(handle: string) {
    if (seedPending.current) return null;

    seedPending.current = true;
    setIsSeeding(true);
    setSeedError(null);

    try {
      return await seedDemoLibrary(handle);
    } catch (cause) {
      console.error("[Gameflix] Demo seed failed:", cause);

      setSeedError(
        "Couldn't finish adding the demo games. Games already saved are kept. Try again.",
      );

      throw cause;
    } finally {
      seedPending.current = false;
      setIsSeeding(false);
    }
  }

  return {
    addDemoGames,
    isSeeding,
    seedError,
  };
}
