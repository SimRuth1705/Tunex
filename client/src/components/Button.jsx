import React from 'react';

const Button = ({ name, onClick, icon: Icon }) => (
  <button onClick={onClick} className="shrink-0 mt-6 bg-[#FF7F11] hover:bg-[#ff9e4a] text-black px-6 py-2.5 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(255,127,17,0.4)]">
    {Icon && <Icon size={16} className="text-black" />}
    {name}
  </button>
);

export default Button;