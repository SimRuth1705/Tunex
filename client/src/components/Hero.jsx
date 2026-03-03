import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  // Stagger variants for the left-side text content
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  return (
    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start pt-12 lg:pt-24 flex-1">
      
      {/* LEFT SIDE: Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-8 text-left order-2 lg:order-1 lg:pr-4 z-10"
      >
        <div className="space-y-3">
          <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-4">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
              Tune<span className="text-[#FF7F11] drop-shadow-[0_10px_30px_rgba(255,127,17,0.4)]">X</span>
            </h1>
            <svg 
              viewBox="0 0 50 70" 
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-[#FF7F11] shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="drop-shadow-[0_0_20px_rgba(255,127,17,0.6)]">
                <ellipse cx="25" cy="50" rx="10" ry="7" fill="currentColor" />
                <rect x="22" y="15" width="5" height="35" fill="currentColor" />
                <path d="M 27 15 Q 38 12, 42 22 Q 46 32, 40 38 L 27 35 Z" fill="currentColor" />
              </g>
            </svg>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide italic">
            Discover the Raga Behind Every Note.
          </motion.p>
        </div>

        <motion.p variants={itemVariants} className="text-gray-500 text-lg max-w-xl leading-relaxed border-l-2 border-[#FF7F11]/30 pl-6">
          Upload or record any musical phrase and let <span className="text-white">TuneX</span> reveal its true raga using intelligent pitch analysis. 
        </motion.p>

        <motion.div variants={itemVariants} className="pt-4">
          <Link to="/keyboard">
            <button className="group relative flex items-stretch bg-[#FF7F11] hover:bg-[#ff9e4a] text-black transition-all duration-300 rounded-xl overflow-hidden shadow-2xl active:scale-95">
              <div className="flex items-center pl-8 pr-6 py-4">
                <span className="font-mono text-xl font-black uppercase tracking-widest">Launch App</span>
              </div>
              <div className="relative flex flex-col justify-center items-center w-5 bg-black/10">
                <div className="absolute -top-2 w-4 h-4 bg-black rounded-full"></div>
                <div className="flex flex-col gap-1 z-10">
                  {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 bg-black rounded-full"></div>)}
                </div>
                <div className="absolute -bottom-2 w-4 h-4 bg-black rounded-full"></div>
              </div>
              <div className="flex items-center pl-4 pr-8 py-4 bg-black/5">
                <svg width="24" height="16" viewBox="0 0 16 10" fill="currentColor">
                  <rect x="0" y="0" width="4" height="4" /><rect x="12" y="0" width="4" height="4" />
                  <rect x="6" y="6" width="4" height="4" /><rect x="12" y="6" width="4" height="4" />
                </svg>
              </div>
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE: Animated Graphic */}
      <div className="relative flex justify-center lg:justify-center items-center order-1 lg:order-2 transform lg:-translate-y-12 z-0">
        
        {/* 🌟 Framer Motion Floating Animation */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-15, 10, -15] }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative w-full max-w-70 md:max-w-87.5 lg:max-w-112.5"
        >
          <svg
            viewBox="0 50 200 300"
            className="w-full h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 🌟 Sub-animation: Pulsing Glow on the Note */}
            <motion.g 
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#FF7F11]"
            >
              <ellipse cx="100" cy="280" rx="35" ry="25" fill="currentColor" className="drop-shadow-[0_0_30px_rgba(255,127,17,0.5)]" />
              <rect x="95" y="80" width="10" height="200" fill="currentColor" className="drop-shadow-[0_0_20px_rgba(255,127,17,0.4)]" />
              <path d="M 105 80 Q 140 60, 160 100 Q 180 140, 150 180 L 105 160 Z" fill="currentColor" className="drop-shadow-[0_0_25px_rgba(255,127,17,0.5)]" />
            </motion.g>

            <g className="text-white/10">
              {[120, 160, 200, 240, 280].map((y, i) => (
                <line key={i} x1="40" y1={y} x2="160" y2={y} stroke="currentColor" strokeWidth="2" />
              ))}
            </g>
            
            {/* 🌟 Sub-animation: Blinking Background Nodes */}
            <motion.g 
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
              className="text-[#FF7F11]"
            >
              <circle cx="60" cy="200" r="8" />
              <circle cx="140" cy="240" r="8" />
              <circle cx="70" cy="280" r="8" />
            </motion.g>
          </svg>
        </motion.div>
      </div>
      
    </div>
  );
};

export default Hero;