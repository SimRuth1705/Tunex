import React from 'react';

const LogoComponent = () => {
  return (
    <div className="relative flex items-center justify-center w-full max-w-125 aspect-square">
      {/* Soft Background Glow */}
      <div className="absolute w-2/3 h-2/3 bg-[#FF7F11]/10 blur-[100px] rounded-full animate-pulse"></div>

      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-auto drop-shadow-[0_0_20px_rgba(255,127,17,0.5)]"
      >
        <defs>
          {/* Neon Filter: Combines internal light and external bleed */}
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="inner-glow" />
            <feGaussianBlur stdDeviation="3.5" result="outer-glow" />
            <feMerge>
              <feMergeNode in="outer-glow" />
              <feMergeNode in="inner-glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animation for the Waveform peaks */}
          <style>{`
            .wave {
              animation: flux 2.5s ease-in-out infinite;
              transform-origin: center;
            }
            @keyframes flux {
              0%, 100% { transform: scaleY(1); opacity: 0.7; }
              50% { transform: scaleY(1.3); opacity: 1; }
            }
          `}</style>
        </defs>

        <g filter="url(#neon)" stroke="#FF7F11" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          
          {/* SEPARATE COMPONENT 1: The Waveform (Reacts to music) */}
          <path 
            className="wave"
            d="M30 100 H45 L50 80 L55 120 L60 60 L65 140 L70 90 L75 110 L80 100 
               M120 100 L125 70 L130 130 L135 85 L140 115 L145 90 L150 105 L155 100 H170" 
          />

          {/* SEPARATE COMPONENT 2: The S-Curve (The Veena/Music Symbol) */}
          <path 
            d="M100 40 
               C 125 40, 135 65, 110 100 
               C 85 135, 80 160, 105 160 
               C 135 160, 140 130, 120 120 
               C 100 110, 85 130, 95 145" 
          />

          {/* The Peg Details from your photo */}
          <g fill="#FF7F11" stroke="none">
            <circle cx="120" cy="55" r="2" />
            <circle cx="124" cy="68" r="2" />
          </g>

        </g>
      </svg>
    </div>
  );
};

export default LogoComponent;