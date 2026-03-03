import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { API_BASE_URL } from '../config'; // 🌟 Global Config Integration

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 🌟 Using API_BASE_URL from your config.js
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Store identity in vault
        localStorage.setItem('tunex_user', JSON.stringify(data.user));
        if (setUser) setUser(data.user);
        
        // Brief delay for transition feel
        setTimeout(() => navigate('/'), 300);
      } else {
        // Server-side rejection
        setError(data.message || "Access Denied. Check credentials.");
      }
    } catch (err) {
      // Network/CORS failure
      setError("System Offline. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Secure your harmonies">
      <form className="space-y-6" onSubmit={handleLogin}>
        
        {/* Error Alert Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-mono"
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Email Address</label>
          <input 
            required
            type="email" 
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all text-white placeholder:text-gray-700"
            placeholder="composer@tunex.ai"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Password</label>
          <div className="relative">
            <input 
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all text-white placeholder:text-gray-700"
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF7F11] transition-colors"
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-gray-600 hover:text-[#FF7F11] transition-colors text-[10px] font-bold uppercase tracking-tighter mr-1"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="w-full bg-[#FF7F11] hover:bg-[#ff9e4a] text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(255,127,17,0.2)] mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Access Vault"
          )}
        </motion.button>

        <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest pt-4 font-bold">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-[#FF7F11] transition-colors">
            Join the collective
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}