import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#FF7F11]/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-[#FF7F11]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#FF7F11]/20">
            <Lock className="text-[#FF7F11]" size={32} />
          </div>

          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
            System <span className="text-[#FF7F11]">Locked</span>
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium italic">
            "Access to the Melakarta Database and Session Logs is restricted to registered system operators only."
          </p>

          <div className="flex flex-col gap-4">
            <Link to="/login">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-[#FF7F11] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#ff9e4a] transition-colors shadow-[0_0_20px_rgba(255,127,17,0.3)]"
              >
                Authenticate Now
              </motion.button>
            </Link>
            
            <Link to="/">
              <button className="w-full py-4 bg-white/5 text-gray-400 font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors">
                Return to Surface
              </button>
            </Link>
          </div>
        </div>

        {/* Technical Footer Decoration */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 opacity-30">
          <ShieldAlert size={12} className="text-gray-500" />
          <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Protocol Error: UNAUTHORIZED_ACCESS_0x44</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;