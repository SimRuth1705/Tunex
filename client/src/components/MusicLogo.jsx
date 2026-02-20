import React from 'react';

const MusicLogo = () => {
  return (
    <div className="relative flex items-center justify-center w-full max-w-137.5 aspect-square select-none">
      {/* Dynamic Background Aura */}
      <div className="absolute w-[70%] h-[70%] bg-[#FF7F11]/10 blur-[120px] rounded-full animate-pulse"></div>
      
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-auto overflow-visible"
      >
        <defs>
          {/* Multi-layered Glow Filter for "Neon" Depth */}
          <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feGaussianBlur stdDeviation="4" result="outerGlow" />
            <feMerge>
              <feMergeNode in="outerGlow" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animation for the waveform bars */}
          <style>{`
            .wave-line {
              animation: wavePulse 2s ease-in-out infinite;
              transform-origin: center;
            }
            @keyframes wavePulse {
              0%, 100% { transform: scaleY(1); opacity: 0.8; }
              50% { transform: scaleY(1.2); opacity: 1; }
            }
          `}</style>
        </defs>

        <g filter="url(#ultraGlow)" stroke="#FF7F11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          
          {/* Central Stylized "S" / Veena Neck */}
          <path 
            d="M115 45 C 130 45, 135 65, 115 100 C 95 135, 90 155, 110 155 C 130 155, 135 135, 125 125" 
            className="drop-shadow-[0_0_8px_rgba(255,127,17,0.8)]"
          />
          
          {/* Bottom Swirl Detail */}
          <path d="M110 155 C 80 155, 80 115, 105 120" />

          {/* Left Waveform (Responsive Pulse) */}
          <path d="M30 100 H50" opacity="0.5" />
          <path d="M55 100 L60 85 L65 115 L70 70 L75 130 L80 90 L85 110 L90 100" className="wave-line" style={{animationDelay: '0.2s'}} />
          
          {/* Right Waveform (Responsive Pulse) */}
          <path d="M125 100 L130 75 L135 125 L140 85 L145 115 L150 90 L155 105 L160 100" className="wave-line" style={{animationDelay: '0.5s'}} />
          <path d="M165 100 H185" opacity="0.5" />

          {/* Top Tuning Peg Detail */}
          <g fill="#FF7F11" stroke="none">
            <circle cx="126" cy="62" r="1.8" />
            <circle cx="130" cy="74" r="1.8" />
            <circle cx="128" cy="86" r="1.2" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default MusicLogo;