import { Button } from "./components/ui/Button";

function App() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-heading-1 font-bold text-brand">GAMEFLIX</h1>

        <p className="mt-2 font-body text-muted">Your backlog, your rules.</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button variant="primary">Save Game</Button>
          <Button variant="secondary">Edit Game</Button>
          <Button variant="danger">Delete Game</Button>
          <Button disabled>Saving...</Button>
        </div>
      </div>
    </main>
  );
}

export default App;
