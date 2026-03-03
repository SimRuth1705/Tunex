import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Activity, Database, Music } from 'lucide-react';

const ProfilePage = ({ user }) => {
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
          <div className="w-32 h-32 bg-[#FF7F11]/10 border-2 border-[#FF7F11]/30 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(255,127,17,0.1)]">
            <User size={60} className="text-[#FF7F11]" />
            <div className="absolute -bottom-2 bg-green-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">Verified</div>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-2">{user.name}</h1>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
              <Shield size={12} className="text-[#FF7F11]" /> System Operator // {user.email}
            </p>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Harmonies Logged', value: '128', icon: Music },
            { label: 'System Access', value: 'Level 4', icon: Database },
            { label: 'Uptime', value: '14h 22m', icon: Activity },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-4xl hover:border-[#FF7F11]/20 transition-all group">
              <stat.icon size={24} className="text-[#FF7F11] mb-6 opacity-40 group-hover:opacity-100 transition-all" />
              <h3 className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-3xl font-black italic tracking-tighter uppercase">{stat.value}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-[#FF7F11]/5 border border-[#FF7F11]/10 p-8 rounded-[2.5rem] text-center">
          <p className="font-mono text-[10px] text-[#FF7F11] uppercase tracking-[0.4em] font-bold">
            TuneX Security Protocol Active. All sessions are encrypted via local vault.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;