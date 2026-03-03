import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Inner Dot Values (Instant)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer Ring Values (Delayed Spring)
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  
  // Spring physics for the smooth trailing effect
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const ringXSpring = useSpring(ringX, springConfig);
  const ringYSpring = useSpring(ringY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 4); // Center 8px dot
      ringX.set(e.clientX - 16);  // Center 32px ring
      cursorY.set(e.clientY - 4);
      ringY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      // Check if hovering over a clickable element
      const isClickable = e.target.closest('a, button, input, select, textarea, [role="button"]');
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver); 

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, ringX, ringY]);

  return (
    <>
      {/* Outer Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none z-9999 flex items-center justify-center"
        style={{ 
          x: ringXSpring, 
          y: ringYSpring,
          mixBlendMode: 'difference', // 🌟 THE CSS MAGIC
          borderColor: '#FF7F11'
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? '#FF7F11' : 'transparent',
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      
      {/* Inner Solid Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-9999"
        style={{ 
          x: cursorX, 
          y: cursorY,
          mixBlendMode: 'difference', // 🌟 THE CSS MAGIC
          backgroundColor: '#FF7F11'
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;