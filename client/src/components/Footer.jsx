import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-white/5 pt-12 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* LEFT: Branding */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-2xl font-black italic tracking-tighter text-white">
            Tune<span className="text-[#FF7F11]">X</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold max-w-xs leading-relaxed">
            Unveiling the mathematical beauty of Indian Classical Ragas through intelligent analysis.
          </p>
        </div>

        {/* CENTER: Navigation Links */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
          {[
            { name: 'Home', path: '/' },
            { name: 'Keyboard', path: '/keyboard' },
            { name: 'Raga Library', path: '/raga' },
            { name: 'About Team', path: '/about' }
          ].map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-[9px] uppercase tracking-widest font-mono text-gray-400 hover:text-[#FF7F11] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT: Operational Status */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F11] animate-pulse"></div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-gray-300">System: Active</span>
          </div>
          <div className="text-[9px] text-gray-700 font-mono tracking-tighter">
            EST. 2026 // 13.0827° N
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em]">
          © 2026 TuneX Melodic Intelligence.
        </span>
        <div className="flex items-center gap-6">
          <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">v1.0.0-Stable</span>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-[8px] font-mono text-[#FF7F11]/50 uppercase tracking-widest">
            Developed by The Collective
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;