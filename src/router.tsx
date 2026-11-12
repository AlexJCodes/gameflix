import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { AddGamePage } from "./pages/AddGamePage";
import { EditGamePage } from "./pages/EditGamePage";
import { GameDetailsPage } from "./pages/GameDetailsPage";
import { HomePage } from "./pages/HomePage";
import { IntroPage } from "./pages/IntroPage";
import { LibraryPage } from "./pages/LibraryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
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
    path: "/intro",
    Component: IntroPage,
  },
  {
    Component: AppLayout,
    children: [
      {
        path: "home",
        Component: HomePage,
      },
      {
        path: "library",
        Component: LibraryPage,
      },
      {
        path: "games/new",
        Component: AddGamePage,
      },
      {
        path: "games/:id",
        Component: GameDetailsPage,
      },
      {
        path: "games/:id/edit",
        Component: EditGamePage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
