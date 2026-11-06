import { StatusBadge } from "./components/games/StatusBadge";
import { Button } from "./components/ui/Button";

const statuses = ["Want to Play", "Playing", "Completed", "Dropped"] as const;

function App() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-heading-1 font-bold text-brand">GAMEFLIX</h1>

        <p className="mt-2 font-body text-muted">Your backlog, your rules.</p>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-heading-3">Buttons</h2>

          <div className="flex flex-wrap gap-4">
            <Button>Save Game</Button>
            <Button variant="secondary">Edit Game</Button>
            <Button variant="danger">Delete Game</Button>
            <Button disabled>Saving...</Button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-heading-3">Game Status</h2>

          <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
