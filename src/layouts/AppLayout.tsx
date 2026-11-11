import { Navigate, Outlet } from "react-router";
import { SuccessToast } from "../components/feedback/SuccessToast";
import { AppHeader } from "../components/layout/AppHeader";
import { getActiveProfile } from "../services/activeProfile";

export function AppLayout() {
  const activeProfile = getActiveProfile();

  if (!activeProfile) {
    return <Navigate to="/profiles" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:p-4 focus:text-foreground"
      >
        Skip to content
      </a>

      <AppHeader profile={activeProfile} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-shell px-page-mobile py-8 lg:px-page-desktop"
      >
        <Outlet context={activeProfile} />
      </main>

      <SuccessToast />
    </div>
  );
}
