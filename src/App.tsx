import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ProfileDebug from "./pages/ProfileDebug";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile/:id" element={<Profile />} />
        {/* Protected admin route - obfuscated URL */}
        <Route path="/admin-stats-d1g3Yt9" element={<AdminDashboard />} />
        <Route path="/debug-profiles" element={<ProfileDebug />} />
        <Route path="/not-found" element={<NotFound />} />
        {/* Catch-all route for 404s - includes root "/" */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
