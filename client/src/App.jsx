import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import CustomCursor from './components/CustomCursor';
import AccessDenied from './components/AccessDenied';

// --- PAGES ---
import HomePage from './pages/HomePage'; 
import KeyboardPage from './pages/KeyboardPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword'; // ✅ FIXED: Added this import
import RagaCard from './pages/RagaCard';
import AboutUs from './pages/AboutUs';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [user, setUser] = useState(null);

  // Sync user state with LocalStorage on load
  useEffect(() => {
    const savedUser = localStorage.getItem('tunex_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Session Corrupted", err);
        localStorage.removeItem('tunex_user');
      }
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <Router>
      <div className="bg-black min-h-screen flex flex-col cursor-none">
        {/* Global UI Elements */}
        <CustomCursor />
        <Navbar user={user} />

        <main className="grow flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/keyboard" element={<KeyboardPage />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage setUser={setUser} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* User Specific Route */}
            <Route 
              path="/profile" 
              element={isAuthenticated ? <ProfilePage user={user} setUser={setUser} /> : <AccessDenied />} 
            />

            {/* Protected Core Routes */}
            <Route 
              path="/raga" 
              element={isAuthenticated ? <RagaCard /> : <AccessDenied />} 
            />
            <Route 
              path="/history" 
              element={isAuthenticated ? <HistoryPage /> : <AccessDenied />} 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;