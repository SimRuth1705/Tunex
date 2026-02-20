import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[calc(100vh-96px)] bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF7F11]/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter mb-2 italic">
            {title}<span className="text-[#FF7F11]">.</span>
          </h2>
          <p className="text-gray-500 text-sm mb-8 tracking-wide uppercase font-semibold">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;