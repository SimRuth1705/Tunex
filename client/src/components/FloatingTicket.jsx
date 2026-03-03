import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const FloatingTicket = () => {
  // 🌟 Mouse tracking values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth out the movement with a spring physics configuration
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Map mouse position to 3D rotation (-15deg to 15deg)
  const rotateX = useTransform(mouseYSpring, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-15, 15]);

  // Handle mouse movement over the container
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to 0 - 1
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Static array for the barcode to prevent React hydration errors
  const barcodePattern = [3,1,4,2,1,1,3,2,1,4,2,1,1,3,2,4,1,2,1,3,1,1,4,2,1,3,2,1,4,1,2];

  return (
    // Perspective wrapper is required for 3D transforms to work
    <div 
      className="relative w-full h-150 flex items-center justify-center perspective-distant"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-[320px] bg-[#FF7F11] text-black shadow-2xl rounded-sm flex flex-col justify-between overflow-hidden"
      >
        {/* --- TOP SECTION --- */}
        <div className="p-8 pb-10 flex flex-col gap-8">
          {/* Logo / Main Title */}
          <div>
            <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
              Tune<br/>X.
            </h2>
          </div>

          {/* Sub Info */}
          <div className="flex justify-between items-end border-b-2 border-black pb-4">
            <span className="font-mono text-sm font-black tracking-tight">1 ENTRY</span>
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Raga Synthesis</span>
          </div>

          {/* Tech Specs Grid */}
          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <div className="text-[10px] uppercase font-bold text-black/60 mb-1">Engine</div>
              <div className="text-xs font-black">MELAKARTA</div>
              <div className="text-xs font-black">72.0019</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-black/60 mb-1">Latency</div>
              <div className="text-xs font-black">&lt; 10ms</div>
              <div className="text-xs font-black">ON-CHAIN</div>
            </div>
          </div>
        </div>

        {/* --- PERFORATION DIVIDER --- */}
        <div className="relative w-full h-8 flex items-center justify-center">
          {/* Left semi-circle cutout (Inherits the background color of your app, usually black) */}
          <div className="absolute -left-4 w-8 h-8 bg-black rounded-full" />
          
          {/* Dashed line */}
          <div className="w-full mx-6 border-t-[3px] border-dashed border-black/40" />
          
          {/* Right semi-circle cutout */}
          <div className="absolute -right-4 w-8 h-8 bg-black rounded-full" />
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="p-8 pt-6 flex flex-col gap-6 bg-[#FF7F11]">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm font-black uppercase tracking-widest">Try Beta</span>
            <span className="font-black tracking-tighter">&gt;&gt;&gt;</span>
          </div>
          
          {/* Authentic Barcode Generation */}
          <div className="flex items-end h-16 gap-0.5 w-full pt-2">
            {barcodePattern.map((width, i) => (
              <div 
                key={i} 
                className="bg-black" 
                style={{ 
                  width: `${width * 2}px`, 
                  height: i % 5 === 0 ? '100%' : '80%' // Makes some lines taller for realism
                }} 
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingTicket;