import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Activity, Database, Music, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

const ProfilePage = ({ user }) => {
  const [historyCount, setHistoryCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(true);

  // 🌟 Determine dynamic role and access level
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin' || userRole === 'owner';
  const accessLevel = isAdmin ? 'Level 4 (Admin)' : 'Level 1 (Standard)';
  const roleDisplay = userRole.toUpperCase();

  // 🌟 Fetch actual logged harmonies from the backend
  useEffect(() => {
    if (!user?.email) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/history/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setHistoryCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch user stats", err);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-black text-white p-6 lg:p-12 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16 pb-12 border-b border-white/5">
          <div className={`w-32 h-32 border-2 rounded-full flex items-center justify-center relative transition-colors ${
            isAdmin 
            ? 'bg-[#FF7F11]/10 border-[#FF7F11]/50 shadow-[0_0_40px_rgba(255,127,17,0.2)]' 
            : 'bg-white/5 border-white/20'
          }`}>
            <User size={60} className={isAdmin ? "text-[#FF7F11]" : "text-gray-400"} />
            
            {/* 🌟 Dynamic Role Badge */}
            <div className={`absolute -bottom-3 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest border ${
              isAdmin ? 'bg-[#FF7F11] border-[#FF7F11]' : 'bg-gray-300 border-gray-300'
            }`}>
              {roleDisplay}
            </div>
          </div>
          
          <div className="text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">{user.name}</h1>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
              {isAdmin ? <ShieldCheck size={14} className="text-[#FF7F11]" /> : <Shield size={14} className="text-gray-500" />} 
              {isAdmin ? 'System Administrator' : 'Standard Operative'} // {user.email}
            </p>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Box 1: Dynamic History Count */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-4xl hover:border-[#FF7F11]/20 transition-all group relative overflow-hidden">
            <Music size={24} className="text-[#FF7F11] mb-6 opacity-40 group-hover:opacity-100 transition-all relative z-10" />
            <h3 className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1 relative z-10">Harmonies Logged</h3>
            <p className="text-3xl font-black italic tracking-tighter uppercase relative z-10">
              {isSyncing ? '...' : historyCount}
            </p>
          </div>

          {/* Box 2: Dynamic Access Level */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-4xl hover:border-[#FF7F11]/20 transition-all group relative overflow-hidden">
            <Database size={24} className="text-[#FF7F11] mb-6 opacity-40 group-hover:opacity-100 transition-all relative z-10" />
            <h3 className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1 relative z-10">System Access</h3>
            <p className="text-xl md:text-2xl font-black italic tracking-tighter uppercase relative z-10 text-[#FF7F11]">
              {accessLevel}
            </p>
          </div>

          {/* Box 3: Account Creation / Status */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-4xl hover:border-[#FF7F11]/20 transition-all group relative overflow-hidden">
            <Activity size={24} className="text-[#FF7F11] mb-6 opacity-40 group-hover:opacity-100 transition-all relative z-10" />
            <h3 className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1 relative z-10">Vault Status</h3>
            <p className="text-3xl font-black italic tracking-tighter uppercase text-green-500 relative z-10">
              SECURE
            </p>
          </div>
        </div>
        
        <div className={`border p-8 rounded-[2.5rem] text-center ${
          isAdmin ? 'bg-[#FF7F11]/5 border-[#FF7F11]/20' : 'bg-white/5 border-white/10'
        }`}>
          <p className={`font-mono text-[10px] uppercase tracking-[0.4em] font-bold ${isAdmin ? 'text-[#FF7F11]' : 'text-gray-400'}`}>
            {isAdmin 
              ? "Elevated Security Protocol Active. Administrative overrides enabled." 
              : "TuneX Security Protocol Active. All sessions are encrypted via local vault."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;