import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { GameDetailsPage } from "./pages/GameDetailsPage";
import { LibraryPage } from "./pages/LibraryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ProfilesPage } from "./pages/ProfilesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/profiles" replace />,
  },
  {
    path: "/profiles",
    Component: ProfilesPage,
  },
  {
    Component: AppLayout,
    children: [
      {
        path: "home",
        element: <PlaceholderPage title="Home" description="Your next adventure starts here." />,
      },
      {
        path: "library",
        Component: LibraryPage,
      },
      {
        path: "games/new",
        element: (
          <PlaceholderPage title="Add Game" description="Make room for your next adventure." />
        ),
      },
      {
        path: "games/:id",
        Component: GameDetailsPage,
      },
      {
        path: "games/:id/edit",
        element: (
          <PlaceholderPage title="Edit Game" description="A new chapter for your collection." />
        ),
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
