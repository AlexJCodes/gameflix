import { Outlet } from "react-router";
import { AppHeader } from "../components/layout/AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:p-4 focus:text-foreground"
      >
        Skip to content
      </a>

      <AppHeader />

      <main
        id="main-content"
        className="mx-auto w-full max-w-shell px-page-mobile py-8 lg:px-page-desktop"
      >
        <Outlet />
      </main>
    </div>
  );
}
