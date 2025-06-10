import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile/:id" element={<Profile />} />
        {/* Protected admin route - obfuscated URL */}
        <Route path="/admin-stats-d1g3Yt9" element={<AdminDashboard />} />
        <Route path="/not-found" element={<NotFound />} />
        {/* Catch-all route for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
