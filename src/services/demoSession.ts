import { seedDemoLibrary } from "./demoLibrary";
import { initializeProfileLibrary } from "./initializeProfileLibrary";

const STORAGE_KEY = "gameflix.demoSession.v1";

export const DEMO_PROFILE_ID = "demo";

type DemoStage = "new" | "cleaned" | "ready";

type DemoSession = {
  handle: string;
  stage: DemoStage;
};

function readDemoSession(): DemoSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const session = parsed as Record<string, unknown>;

    if (
      typeof session.handle !== "string" ||
      !/^gf-[a-f0-9]{32}$/.test(session.handle) ||
      !["new", "cleaned", "ready"].includes(String(session.stage))
    ) {
      return null;
    }

    return {
      handle: session.handle,
      stage: session.stage as DemoStage,
    };
  } catch {
    return null;
  }
}

function saveDemoSession(session: DemoSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function getOrCreateDemoSession(): DemoSession {
  const existing = readDemoSession();
  if (existing) return existing;

  const session: DemoSession = {
    handle: `gf-${crypto.randomUUID().replaceAll("-", "")}`,
    stage: "new",
  };

  saveDemoSession(session);
  return session;
}

export function getReadyDemoHandle(): string | null {
  const session = readDemoSession();

  return session?.stage === "ready" ? session.handle : null;
}

export async function prepareDemoLibrary(): Promise<string> {
  let session = getOrCreateDemoSession();

  // Remove the API's automatic starter games.
  if (session.stage === "new") {
    await initializeProfileLibrary(session.handle);

    session = { ...session, stage: "cleaned" };
    saveDemoSession(session);
  }

  // Add our 22 demo games only once.
  if (session.stage === "cleaned") {
    await seedDemoLibrary(session.handle);

    session = { ...session, stage: "ready" };
    saveDemoSession(session);
  }

  return session.handle;
}
