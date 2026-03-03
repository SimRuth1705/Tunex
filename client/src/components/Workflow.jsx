import React, { useRef, useState, useEffect } from 'react';
import { Mic, Cpu, Music, Share2 } from 'lucide-react';

const STEPS = [
  { id: 'A', label: 'EQUITIES', title: 'Frequency Extraction', desc: 'Identify fundamental frequencies and overtones from any audio input. Our engine filters background noise to isolate the core melodic structure.', icon: <Mic size={140} strokeWidth={1} /> },
  { id: 'B', label: 'CRYPTO', title: 'Neural Scale Mapping', desc: 'Every note is cross-referenced against the Melakarta matrix. Our neural net calculates the probability of Raga shifts in real-time.', icon: <Cpu size={140} strokeWidth={1} /> },
  { id: 'C', label: 'INDICES', title: 'Harmonic Synthesis', desc: 'Western chords are generated based on traditional raga rules, creating a seamless bridge between Indian classical and modern harmony.', icon: <Music size={140} strokeWidth={1} /> },
  { id: 'D', label: 'COLOCATION', title: 'Global Deployment', desc: 'Process and share musical insights across a decentralized system for low-latency collaboration and real-time syncing.', icon: <Share2 size={140} strokeWidth={1} /> }
];

const Workflow = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRefs = useRef([]);

  // 🌟 THE MIDDLE TRIGGER OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // threshold: 0.5 means this ONLY fires when the invisible block 
          // crosses the exact middle of your monitor.
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { 
        root: null,
        rootMargin: "0px",
        threshold: 0.5 // Requires 50% of the block to be visible (The Middle)
      } 
    );

    triggerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black relative w-full">
      
      {/* 🌟 1. THE STICKY VISUALS */}
      {/* Changed to top-0 to ensure perfect vertical centering without offset */}
      <div className="sticky top-10 h-screen w-full flex items-center justify-center p-6 overflow-hidden z-10 pointer-events-none">
        
        {/* Main Card */}
        <div className="w-full max-w-6xl h-150 bg-[#0d0d0d] border border-white/10 rounded-[3rem] relative shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden pointer-events-auto">
          
          {/* --- TICKET NAVIGATION --- */}
          <div className="absolute top-10 left-10 z-50 flex items-center bg-[#0d0d0d]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-xl">
            {STEPS.map((step, i) => {
              const isActive = activeIndex === i;
              return (
                <div key={step.id} className="flex items-center">
                  
                  {/* The Button */}
                  <div 
                    className={`flex items-center h-10 px-5 rounded-xl font-mono text-[11px] font-black tracking-tighter transition-all duration-500 ease-out
                      ${isActive ? 'bg-[#FF7F11] text-black shadow-[0_0_15px_rgba(255,127,17,0.3)]' : 'bg-white/5 text-gray-600'}
                    `}
                  >
                    <span>{step.id}</span>
                    {/* The Expanding Label */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-out flex items-center 
                        ${isActive ? 'max-w-30 opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}
                      `}
                    >
                      {step.label}
                    </div>
                  </div>

                  {/* Perforated Dots */}
                  {i < STEPS.length - 1 && (
                    <div className="flex flex-col gap-1 px-3 opacity-20">
                      {[1, 2, 3].map(d => <div key={d} className="w-0.5 h-0.5 bg-white rounded-full" />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* --- CONTENT LAYERS --- */}
          <div className="relative w-full h-full">
            {STEPS.map((step, i) => {
              const isActive = activeIndex === i;
              
              // Slide direction logic
              let yTranslateClass = "translate-y-16"; // Upcoming (below)
              if (isActive) yTranslateClass = "translate-y-0"; // Active (center)
              else if (i < activeIndex) yTranslateClass = "-translate-y-16"; // Past (above)

              return (
                <div 
                  key={step.id} 
                  className={`absolute inset-0 grid grid-cols-1 lg:grid-cols-2 transition-all duration-700 ease-in-out
                    ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}
                    ${yTranslateClass}
                  `}
                >
                  {/* Left Side: Explainer Text */}
                  <div className="p-12 lg:pt-36 flex flex-col justify-center border-r border-white/5">
                    <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-6 leading-[0.85]">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-md font-medium border-l-2 border-[#FF7F11]/40 pl-8">
                      {step.desc}
                    </p>
                  </div>

                  {/* Right Side: Visual Artwork */}
                  <div className="bg-[#050505] p-12 flex items-center justify-center relative overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-[0.02]" 
                      style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
                    />
                    <div className={`text-[#FF7F11] drop-shadow-[0_0_60px_rgba(255,127,17,0.3)] transition-all duration-1000 delay-100 ${isActive ? 'scale-100 animate-pulse' : 'scale-50'}`}>
                      {step.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 🌟 2. THE PHYSICAL SCROLL TRIGGERS */}
      <div className="relative z-0 -mt-[50vh] w-full">
        {STEPS.map((_, i) => (
          <div 
            key={i} 
            data-index={i} 
            ref={(el) => (triggerRefs.current[i] = el)} 
            className="h-screen w-full pointer-events-none" 
          />
        ))}
      </div>

    </div>
  );
};

export default Workflow;