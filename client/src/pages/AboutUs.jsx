import React from 'react';

const TeamCard = ({ name, role, bio, interests, image }) => {
  return (
    <div className="relative h-105 w-full lg:w-75 hover:lg:w-145 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group z-10 hover:z-20">
      <div className="absolute inset-0 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden flex transition-all duration-500 group-hover:border-[#FF7F11]/40 group-hover:shadow-[0_20px_60px_rgba(255,127,17,0.15)]">
        
        {/* Left Side: Image Container */}
        <div className="w-full group-hover:w-[42%] h-full shrink-0 transition-all duration-500 relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent group-hover:from-transparent" />
        </div>

        {/* Right Side: Bio Data (Revealed on Hover) */}
        <div className="absolute left-[42%] w-[58%] h-full p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 invisible group-hover:visible">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#FF7F11] rounded-full shadow-[0_0_10px_#FF7F11]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF7F11] font-bold">TuneX Core</span>
            </div>
            <h3 className="text-xl font-black tracking-tighter text-white mb-1 uppercase italic">{name}</h3>
            <p className="text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-4 font-bold">{role}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-[8px] uppercase text-[#FF7F11] font-bold tracking-[0.2em] mb-1">Background</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed font-medium line-clamp-4">{bio}</p>
              </div>
              <div>
                <h4 className="text-[8px] uppercase text-[#FF7F11] font-bold tracking-[0.2em] mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((tag, i) => (
                    <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-400 font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#FF7F11] transition-colors">
            Contact Protocol
          </button>
        </div>

        {/* Default State Label */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black via-black/80 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
          <h3 className="text-xl font-black text-white leading-none tracking-tighter uppercase italic">{name}</h3>
          <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mt-2">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default function AboutUs() {
  const team = [
    { 
      name: "AT THAMIZHINIAN", 
      role: "CEO", 
      bio: "Leading the architectural vision of TuneX, bridging ancient melodic theory with future-state technology.",
      interests: ["Raga AI", "Strategy", "System Architecture"],
      image: "/ceo.jpg" 
    },
    { 
      name: "G MARSHILIN ANTO", 
      role: "Project Manager", 
      bio: "Orchestrating complex development cycles and ensuring precision in every engine update.",
      interests: ["Agile", "Operations", "Product Management"],
      image: "/manager.jpg" 
    },
    { 
      name: "R RAGHUL", 
      role: "Marketing Lead", 
      bio: "Driving the global resonance of the TuneX brand through data-driven storytelling.",
      interests: ["Branding", "Growth", "Content Strategy"],
      image: "/marketing.jpg" 
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF7F11] selection:text-black flex flex-col">

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION - TIGHTER PADDING */}
        <section className="relative py-12 md:py-20 flex flex-col items-center justify-center overflow-hidden shrink-0">
          <h1 className="text-[15vw] font-black uppercase tracking-tighter opacity-[0.03] absolute pointer-events-none whitespace-nowrap">
            THE COLLECTIVE
          </h1>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
              ABOUT<span className="text-[#FF7F11]">.</span>US
            </h2>
          </div>
        </section>

        {/* DESCRIPTION - REDUCED MARGIN */}
        <section className="max-w-3xl mx-auto px-6 mb-12 shrink-0">
          <p className="text-gray-400 text-sm md:text-base text-center leading-relaxed border-l-2 border-[#FF7F11]/30 pl-6 italic font-light">
            We love creating experiences that enable people to connect, express themselves, and establish meaningful relationships through the universal language of Ragas.
          </p>
        </section>

        {/* TEAM GRID - AUTO EXPAND */}
        <section className="max-w-350 mx-auto px-8 pb-12 w-full">
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-start">
            {team.map((member, index) => (
              <TeamCard key={index} {...member} />
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 p-8 flex justify-between items-center opacity-40 shrink-0">
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase font-bold text-[#FF7F11]">TuneX HQ</span>
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase font-bold text-gray-500">© 2026 Core</span>
      </footer>
    </div>
  );
}