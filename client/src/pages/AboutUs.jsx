import React from 'react';
import { motion } from 'framer-motion';

// Animation Constants
const springTransition = { type: "spring", stiffness: 100, damping: 20 };
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: springTransition }
};

const TeamCard = ({ name, role, bio, interests, image }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="relative h-110 w-full lg:w-75 hover:lg:w-145 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group z-10 hover:z-20 transform-gpu"
    >
      <div className="absolute inset-0 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden flex transition-all duration-700 group-hover:border-[#FF7F11]/40 group-hover:shadow-[0_20px_60px_rgba(255,127,17,0.15)]">
        
        {/* Left Side: Image Container */}
        <div className="w-full group-hover:w-[42%] h-full shrink-0 transition-all duration-700 relative overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent group-hover:from-transparent transition-all duration-700" />
        </div>

        {/* Right Side: Bio Data (Revealed on Hover) */}
        <div className="absolute left-[42%] w-[58%] h-full p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 invisible group-hover:visible">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 bg-[#FF7F11] rounded-full shadow-[0_0_10px_#FF7F11]" 
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#FF7F11] font-bold">Protocol Core</span>
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-white mb-1 uppercase italic leading-none">{name}</h3>
            <p className="text-gray-500 font-mono text-[9px] uppercase tracking-widest mb-6 font-bold">{role}</p>
            
            <div className="space-y-6">
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <h4 className="text-[8px] uppercase text-[#FF7F11] font-bold tracking-[0.2em] mb-2 opacity-50">Background</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-medium line-clamp-4">{bio}</p>
              </div>
              <div className="animate-in fade-in slide-in-from-left-6 duration-1000">
                <h4 className="text-[8px] uppercase text-[#FF7F11] font-bold tracking-[0.2em] mb-3 opacity-50">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag, i) => (
                    <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-gray-300 font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#FF7F11] transition-colors shadow-xl"
          >
            Initiate Contact
          </motion.button>
        </div>

        {/* Default State Label (Fades out on hover) */}
        <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black via-black/90 to-transparent group-hover:opacity-0 transition-all duration-500 pointer-events-none">
          <h3 className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic">{name}</h3>
          <p className="text-[#FF7F11] text-[10px] uppercase tracking-[0.3em] font-bold mt-3 drop-shadow-[0_0_10px_rgba(255,127,17,0.5)]">{role}</p>
        </div>
      </div>
    </motion.div>
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF7F11] selection:text-black flex flex-col overflow-x-hidden">

      <motion.main 
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="flex-1 flex flex-col"
      >
        {/* HERO SECTION */}
        <section className="relative py-24 flex flex-col items-center justify-center overflow-hidden shrink-0">
          <motion.h1 
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 0.03 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="text-[18vw] font-black uppercase tracking-tighter absolute pointer-events-none whitespace-nowrap select-none"
          >
            THE COLLECTIVE
          </motion.h1>
          
          <motion.div variants={fadeInUp} className="relative z-10 text-center px-4">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
              ABOUT<span className="text-[#FF7F11] animate-pulse">.</span>US
            </h2>
          </motion.div>
        </section>

        {/* DESCRIPTION */}
        <motion.section 
          variants={fadeInUp}
          className="max-w-3xl mx-auto px-6 mb-20 shrink-0"
        >
          <p className="text-gray-400 text-sm md:text-lg text-center leading-relaxed border-l-2 border-[#FF7F11]/30 pl-8 italic font-light">
            We love creating experiences that enable people to connect, express themselves, and establish meaningful relationships through the universal language of Ragas.
          </p>
        </motion.section>

        {/* TEAM GRID */}
        <section className="max-w-7xl mx-auto px-8 pb-24 w-full">
          <motion.div 
            variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch"
          >
            {team.map((member, index) => (
              <TeamCard key={index} {...member} />
            ))}
          </motion.div>
        </section>
      </motion.main>

      {/* FOOTER */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
        viewport={{ once: true }}
        className="w-full border-t border-white/5 p-12 flex justify-between items-center shrink-0"
      >
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-bold text-[#FF7F11]">TuneX Protocol v1.0</span>
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-bold text-gray-600">EST. 2026 // SYNCED</span>
      </motion.footer>
    </div>
  );
}