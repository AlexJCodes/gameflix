import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ProfilesPage } from "./pages/ProfilesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profiles" replace />} />

      <Route path="/profiles" element={<ProfilesPage />} />

      <Route element={<AppLayout />}>
        <Route
          path="/home"
          element={<PlaceholderPage title="Home" description="Your next adventure starts here." />}
        />

        <Route
          path="/library"
          element={<PlaceholderPage title="My Library" description="Your backlog, your rules." />}
        />

        <Route
          path="/games/new"
          element={
            <PlaceholderPage title="Add Game" description="Make room for your next adventure." />
          }
        />

        <Route
          path="/games/:id"
          element={<PlaceholderPage title="Game Details" description="Every game has a story." />}
        />

        <Route
          path="/games/:id/edit"
          element={
            <PlaceholderPage title="Edit Game" description="A new chapter for your collection." />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
