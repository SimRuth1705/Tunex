import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Zap, Database, Music, Clock } from 'lucide-react';

// 🌟 Parent container handles the stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each card appearing
    }
  }
};

// 🌟 Individual card entrance animation
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 20 } 
  }
};

// 🌟 Updated FeatureCard to be a motion component
const FeatureCard = ({ title, description, icon: Icon, className, children }) => (
  <motion.div 
    variants={itemVariants}
    className={`bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-[#FF7F11]/30 transition-all duration-500 overflow-hidden relative ${className}`}
  >
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl bg-[#FF7F11]/10 flex items-center justify-center mb-6 border border-[#FF7F11]/20 group-hover:bg-[#FF7F11]/20 transition-colors duration-500">
        <Icon className="text-[#FF7F11]" size={20} />
      </div>
      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-70 font-medium">{description}</p>
    </div>
    
    {/* Background Graphic Slot */}
    <div className="mt-8 relative h-32 w-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-700">
      {children}
    </div>
  </motion.div>
);

const Features = () => {
  return (
    <section className="max-w-6xl w-full py-24 mx-auto px-6 lg:px-0">
      
      {/* 🌟 Header Section: Animated Entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <span className="px-4 py-1.5 rounded-full border border-[#FF7F11]/30 text-[#FF7F11] font-mono text-[10px] uppercase tracking-widest font-bold">
          Features
        </span>
        <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white mt-6">
          Where musicality <br />
          <span className="text-[#FF7F11]">meets technology.</span>
        </h2>
      </motion.div>

      {/* 🌟 Bento Grid Layout: Triggers Staggered Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-12 gap-6"
      >
        
        {/* Large Feature: Pitch Analysis */}
        <FeatureCard 
          title="MIDI Integration "
          description="Enables seamless performance capture for modern music producers."
          icon={Mic}
          className="col-span-12 lg:col-span-8 min-h-75"
        >
          {/* Visual: Animated Audio Bars */}
          <div className="flex items-end gap-2 h-24">
            {[40, 70, 45, 90, 65, 80, 50, 100, 75, 60, 85].map((h, i) => (
              <motion.div 
                key={i} 
                className="w-3 bg-[#FF7F11] rounded-full shadow-[0_0_15px_rgba(255,127,17,0.4)]" 
                animate={{ 
                  height: [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] // Bounce between 30% and 100% of their target height
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1 // Creates the "wave" effect
                }}
              />
            ))}
          </div>
        </FeatureCard>

        {/* Small Feature: Raga Database */}
        <FeatureCard 
          title="Matrix DB"
          description="Access over 72 Melakarta ragas and their derived Janya variations."
          icon={Database}
          className="col-span-12 lg:col-span-4 min-h-75"
        >
          {/* Visual: Floating Database Icon */}
          <div className="relative">
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [10, 15, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Database size={80} className="text-[#FF7F11] opacity-20" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-1 bg-[#FF7F11] blur-xl" 
              />
            </div>
          </div>
        </FeatureCard>

        {/* Small Feature: Chord Engine */}
        <FeatureCard 
          title="Chord Suggestions"
          description="Enhances harmony while preserving traditional melodic structure."
          icon={Music}
          className="col-span-12 lg:col-span-4 min-h-75"
        >
          {/* Visual: Shimmering Chords Grid */}
          <div className="grid grid-cols-2 gap-2 w-32">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} className="h-10 bg-white/5 rounded-lg border border-white/10" />
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="h-10 bg-[#FF7F11]/20 rounded-lg border border-[#FF7F11]/40" />
            <motion.div animate={{ scale: [0.95, 1.05, 0.95] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="h-10 bg-[#FF7F11] rounded-lg shadow-[0_0_15px_rgba(255,127,17,0.5)]" />
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} className="h-10 bg-white/5 rounded-lg border border-white/10" />
          </div>
        </FeatureCard>

        {/* Small Feature: Instant Audio */}
        <FeatureCard 
          title="Keys Audio Library"
          description="Search and access raga-based sounds instantly and efficiently."
          icon={Zap}
          className="col-span-12 lg:col-span-4 min-h-75"
        >
          {/* Visual: Pulsing Zap */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap size={60} className="text-[#FF7F11] drop-shadow-[0_0_20px_rgba(255,127,17,0.8)]" />
          </motion.div>
        </FeatureCard>

        {/* Small Feature: History Timeline */}
        <FeatureCard 
          title="Session Logs"
          description="Review your discovery history and favorite the scales that move you."
          icon={Clock}
          className="col-span-12 lg:col-span-4 min-h-75"
        >
          {/* Visual: Data Loading Bars */}
          <div className="w-full flex flex-col gap-3 px-8">
            <motion.div animate={{ width: ["40%", "100%", "40%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="h-2 bg-white/10 rounded-full" />
            <motion.div animate={{ width: ["80%", "30%", "80%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="h-2 bg-[#FF7F11]/40 rounded-full" />
            <motion.div animate={{ width: ["50%", "90%", "50%"] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="h-2 bg-white/10 rounded-full" />
          </div>
        </FeatureCard>

      </motion.div>
    </section>
  );
};

export default Features;