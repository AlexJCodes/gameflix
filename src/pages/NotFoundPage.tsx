import { Link } from "react-router";
import lostCartridge from "../assets/illustrations/lost-cartridge.svg";

export function NotFoundPage() {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center py-12 text-center">
      <img src={lostCartridge} alt="" className="mb-10 w-50 max-w-full" />

      <h1 className="max-w-xl font-display text-heading-2 font-bold">
        Looks like this quest failed.
      </h1>

      <p className="mt-6 max-w-md font-body text-muted">
        The page you're looking for has vanished into the void.
      </p>

      <Link
        to="/home"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-brand px-5 font-body text-button font-bold text-background hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Back to Gameflix.
      </Link>
    </section>
  );
}
