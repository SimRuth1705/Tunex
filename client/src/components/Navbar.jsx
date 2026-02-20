import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full h-24 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      
      {/* LEFT: Logo */}
      <div className="flex items-center">
        <Link 
          to="/" 
          className="text-3xl font-black italic tracking-tighter text-white hover:opacity-80 transition-opacity"
        >
          Tune<span className="text-[#FF7F11]">X</span>
        </Link>
      </div>

      {/* CENTER: Updated Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { name: 'Home', path: '/' },
          { name: 'Keyboard', path: '/keyboard' }, // Using your keyboard page as the Raga detector
          { name: 'Raga', path: '/raga' },
          { name: 'History', path: '/history' },
          { name: 'About Us', path: '/about' }
        ].map((item, index, arr) => (
          <React.Fragment key={item.name}>
            <Link 
              to={item.path} 
              className="text-[10px] uppercase tracking-[0.3em] font-mono text-gray-400 hover:text-[#FF7F11] transition-colors"
            >
              {item.name}
            </Link>
            {index < arr.length - 1 && (
              <span className="text-[#FF7F11] text-[10px] opacity-40">»</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* RIGHT: Login Button with your custom style */}
      <div className="flex items-center">
        <Link to="/login">
          <button className="group relative flex items-stretch bg-[#FF7F11] hover:bg-[#ff9e4a] text-black transition-all duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-[#FF7F11]/40 scale-90 lg:scale-100">
            
            {/* Left Side: Label */}
            <div className="flex items-center pl-6 pr-4 py-2.5">
              <span className="font-mono text-xs lg:text-sm font-black uppercase tracking-widest">
                Login
              </span>
            </div>

            {/* Center Divider: Ticket Cutouts & Dots */}
            <div className="relative flex flex-col justify-center items-center w-3 bg-[#FF7F11]">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full"></div>
              <div className="flex flex-col gap-1 z-10 opacity-40">
                <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full"></div>
            </div>

            {/* Right Side: Pixel Icon */}
            <div className="flex items-center pl-2 pr-5 py-2.5 bg-[#FF7F11]">
              <svg width="14" height="10" viewBox="0 0 16 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="4" height="4" />
                <rect x="12" y="0" width="4" height="4" />
                <rect x="6" y="6" width="4" height="4" />
                <rect x="12" y="6" width="4" height="4" />
              </svg>
            </div>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;