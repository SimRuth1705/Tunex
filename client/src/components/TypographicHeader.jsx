import React from 'react';
import { motion } from 'framer-motion';

const TypographicHeader = ({ midiConnected, onRequestMIDI }) => {
  return (
    <div className="w-full pt-12 lg:pt-0 lg:scale-95 origin-left flex flex-col justify-center">
      {/* Brand Section */}
      <div className="font-black tracking-tighter leading-none mb-4 lg:mb-6">
        <h1 className="text-5xl md:text-6xl lg:text-8xl text-transparent bg-clip-text bg-linear-to-br from-white to-gray-400">
          Tune<span className="text-5xl md:text-6xl lg:text-8xl text-[#FF7F11] drop-shadow-[0_4px_15px_rgba(255,127,17,0.4)] mt-1 lg:mt-0">
            X
          </span>
        </h1>
      </div>

      {/* Tagline */}
      <h2 className="text-sm md:text-base font-medium text-gray-400 tracking-[0.4em] uppercase mb-10">
        Raga <span className="text-white/20 px-2">•</span> Chord Detection
      </h2>

      {/* Engine Status Line */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px w-12 bg-[#FF7F11]"></div>
        <span className="text-[10px] font-mono text-[#FF7F11] tracking-[0.3em] uppercase">
          Engine v1.0
        </span>
      </div>

      {/* Small Description */}
      <p className="text-gray-400 font-light text-xs md:text-sm max-w-70 leading-relaxed mb-12">
        Explore the soul of melody. Engage the <span className="text-white font-medium border-b border-[#FF7F11]/30">stealth interface</span> and let the harmony reveal itself.
      </p>

      {/* Footer Branding & MIDI Status */}
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-bold text-[#FF7F11]/60 tracking-[0.2em] uppercase whitespace-nowrap">
          Powered by TuneX Engine
        </span>

        {/* MIDI Status Bulb - Now a manual activate button */}
        <motion.button
          whileHover={{ scale: 1.05, borderColor: 'rgba(255,127,17,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRequestMIDI}
          className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 ml-auto lg:ml-0 transition-all group outline-none"
          title="Click to activate MIDI"
        >
          <div className={`h-2 w-2 rounded-full transition-all duration-500 ${midiConnected
            ? 'bg-[#FF7F11] shadow-[0_0_10px_#FF7F11] animate-pulse'
            : 'bg-gray-700 group-hover:bg-gray-500'
            }`}></div>
          <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase transition-colors group-hover:text-gray-300">
            {midiConnected ? 'MIDI Active' : 'Activate MIDI'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default TypographicHeader;