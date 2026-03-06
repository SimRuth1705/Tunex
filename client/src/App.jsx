import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import AccessDenied from './components/AccessDenied';
import { ModalProvider } from './contexts/ModalContext';

// --- PAGES ---
import HomePage from './pages/HomePage';
import KeyboardPage from './pages/KeyboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import RagaCard from './pages/RagaCard';
import AboutUs from './pages/AboutUs';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  // 🌟 FIX: Synchronous lazy initialization. 
  // This prevents the "flicker" where React thinks you are logged out for a millisecond.
  const [user, setUser] = useState(() => {
    try {
      // Make sure this key matches exactly what your LoginPage saves!
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("Session Corrupted", err);
      localStorage.removeItem('user');
      return null;
    }
  });

  const isAuthenticated = !!user;

  return (
    <ModalProvider>
      <Router>
        <div className="bg-black min-h-screen flex flex-col custom-cursor-active">
          <CustomCursor />
          <Navbar user={user} setUser={setUser} />

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

              {/* Admin Route */}
              <Route
                path="/admin/users"
                element={isAuthenticated ? <AdminUsersPage /> : <AccessDenied />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ModalProvider>
  );
}

export default App;