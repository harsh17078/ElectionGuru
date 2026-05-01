import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import TimelinePage from "@/pages/TimelinePage";
import GuidePage from "@/pages/GuidePage";
import MythsPage from "@/pages/MythsPage";
import ChatPage from "@/pages/ChatPage";
import BoothPage from "@/pages/BoothPage";
import VerifyPage from "@/pages/VerifyPage";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("election-guru-theme");
    return stored ? stored === "dark" : true; // Default to dark mode
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("election-guru-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/myths" element={<MythsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/booth" element={<BoothPage />} />
            <Route path="/verify" element={<VerifyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
