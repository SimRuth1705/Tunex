import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-black text-white flex flex-col items-center pt-4 lg:pt-10 px-4 lg:px-8 pb-6 overflow-hidden">
      <div className="max-w-350 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
        
        {/* LEFT SIDE: Hero Content */}
        <div className="flex flex-col space-y-8 -mt-50 text-left order-2 lg:order-1 pt lg:pr-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 md:gap-4">
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
            </div>
            <p className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide italic">
              Discover the Raga Behind Every Note.
            </p>
          </div>

          <p className="text-gray-500 text-lg max-w-xl leading-relaxed border-l-2 border-[#FF7F11]/30 pl-6">
            Upload or record any musical phrase and let <span className="text-white">TuneX</span> reveal its true raga using intelligent pitch analysis. 
          </p>

          <div className="pt-4">
            <Link to="/keyboard">
              <button className="group relative flex items-stretch bg-[#FF7F11] hover:bg-[#ff9e4a] text-black transition-all duration-300 rounded-xl overflow-hidden shadow-2xl">
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
          </div>
        </div>

        {/* RIGHT SIDE: Scaled down and pulled up */}
        <div className="relative flex justify-center lg:justify-end items-center order-1 lg:order-2 pr-20 ">
          <div className="relative w-full max-w-70 md:max-w-[320px] lg:max-w-95 "  >
            <svg
              viewBox="0 50 200 300" /* Cropped top and bottom padding from 0-400 to 50-350 */
              className="w-full h-auto transform -translate-y-4 lg:-translate-y-12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="text-[#FF7F11] opacity-90">
                <ellipse 
                  cx="100" 
                  cy="280" 
                  rx="35" 
                  ry="25" 
                  fill="currentColor"
                  className="drop-shadow-[0_0_30px_rgba(255,127,17,0.5)]"
                />
                <rect 
                  x="95" 
                  y="80" 
                  width="10" 
                  height="200" 
                  fill="currentColor"
                  className="drop-shadow-[0_0_20px_rgba(255,127,17,0.4)]"
                />
                <path 
                  d="M 105 80 Q 140 60, 160 100 Q 180 140, 150 180 L 105 160 Z" 
                  fill="currentColor"
                  className="drop-shadow-[0_0_25px_rgba(255,127,17,0.5)]"
                />
              </g>
              
              <g className="text-white/10">
                {[120, 160, 200, 240, 280].map((y, i) => (
                  <line 
                    key={i}
                    x1="40" 
                    y1={y} 
                    x2="160" 
                    y2={y} 
                    stroke="currentColor" 
                    strokeWidth="2"
                  />
                ))}
              </g>
              
              <g className="text-[#FF7F11]/30">
                <circle cx="60" cy="200" r="8" />
                <circle cx="140" cy="240" r="8" />
                <circle cx="70" cy="280" r="8" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="w-[95%] mx-auto mt-6 lg:mt-8 border-t border-white/10" />
    </div>
  );
}