import { Link } from "react-router";
import gameflixLogo from "../assets/branding/gameflix-logo.svg";

export function ProfilesPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-page-mobile text-foreground">
      <div className="text-center">
        <img src={gameflixLogo} alt="Gameflix" className="mx-auto h-auto w-51.25 max-w-full" />

        <h1 className="mt-8 font-display text-heading-1 font-bold">Who's playing?</h1>

        <p className="mt-2 font-body text-muted">Choose your player and jump in.</p>

        <Link
          to="/home"
          className="mt-8 inline-flex min-h-12 items-center rounded-md bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Enter preview
        </Link>
      </div>
    </main>
  );
}
