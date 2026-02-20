import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  return (
    <AuthLayout title="Login" subtitle="Secure your harmonies">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Email Address</label>
          <input 
            type="email" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all"
            placeholder="composer@tunex.ai"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Password</label>
          <input 
            type="password" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button className="w-full bg-[#FF7F11] hover:bg-[#ff9e4a] text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(255,127,17,0.2)] mt-4">
          Access Vault
        </button>

        <p className="text-center text-gray-500 text-xs pt-4">
          Don't have an account? <Link to="/register" className="text-white hover:text-[#FF7F11] transition-colors">Join the collective</Link>
        </p>
      </form>
    </AuthLayout>
  );
}