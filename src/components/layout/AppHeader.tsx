import { Link, NavLink } from "react-router";
import profilePlaceholder from "../../assets/avatars/profile-placeholder.svg";
import gameflixLogo from "../../assets/branding/gameflix-logo.svg";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex shrink-0 items-center border-b-[3px]",
    "font-body text-body-sm whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-focus",
    "lg:border-b-0",
    isActive
      ? "border-brand font-bold text-foreground"
      : "border-transparent text-muted hover:text-foreground",
  ].join(" ");

export function AppHeader() {
  return (
    <header className="border-b border-divider bg-background lg:border-b-0">
      <div className="mx-auto grid w-full max-w-shell grid-cols-[1fr_auto] items-center px-6 lg:h-22 lg:grid-cols-[1fr_auto_1fr] lg:px-page-desktop">
        {/* Brand */}
        <Link
          to="/home"
          className="col-start-1 row-start-1 flex h-18 w-fit items-center focus-visible:outline-2 focus-visible:outline-focus lg:h-22"
        >
          <img src={gameflixLogo} alt="Gameflix" className="block h-auto w-33" />
        </Link>

        {/* Main navigation */}
        <nav
          aria-label="Main navigation"
          className="col-span-2 row-start-2 flex h-12 items-stretch justify-between gap-4 overflow-x-auto lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:h-full lg:justify-center lg:gap-8"
        >
          <NavLink to="/home" end className={navLinkClasses}>
            Home
          </NavLink>

          <NavLink to="/library" end className={navLinkClasses}>
            My Library
          </NavLink>

          <NavLink to="/games/new" className={navLinkClasses}>
            <span className="lg:hidden">+ </span>
            Add Game
          </NavLink>
        </nav>

        {/* Profile – temporary placeholder */}
        <Link
          to="/profiles"
          aria-label="Choose profile"
          className="col-start-2 row-start-1 flex min-h-12 items-center justify-end gap-2 focus-visible:outline-2 focus-visible:outline-focus lg:col-start-3 lg:justify-self-end"
        >
          <img src={profilePlaceholder} alt="" className="h-9 w-9" />

          <span className="hidden font-body text-body-sm font-semibold text-foreground lg:inline">
            Profiles
          </span>
        </Link>
      </div>
    </header>
  );
}
