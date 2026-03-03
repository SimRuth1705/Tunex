import React, { useState } from 'react';
import FloatingTicket from './FloatingTicket';
import { X, CheckCircle, Loader2, ChevronDown } from 'lucide-react'; // 🌟 Added ChevronDown

const roles = [
  "Music Producer",
  "Classical Musician",
  "Developer / Engineer",
  "Audio Enthusiast"
];

const BetaTicketSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  
  // 🌟 New State for Custom Dropdown
  const [selectedRole, setSelectedRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) return; // Basic validation for custom dropdown

    setFormStatus('loading');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setFormStatus('idle');
      setSelectedRole(''); // Reset dropdown
      setIsDropdownOpen(false);
    }, 300);
  };

  return (
    <div className="w-full relative bg-[#050505] py-32 border-y border-white/5 overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Side: Call to Action Text */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-[#FF7F11] font-mono text-xs w-fit mb-6 bg-black/50">
            <span className="w-2 h-2 bg-[#FF7F11] rounded-full animate-pulse" />
            System Access
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] text-white mb-6">
            Get Your <br/> Access Pass.
          </h2>
          
          <p className="text-gray-400 max-w-md text-sm leading-relaxed font-medium mb-8">
            The TuneX Melakarta engine is currently in closed beta. Claim your decentralized access ticket to unlock full API capabilities, low-latency colocation, and advanced harmonic synthesis.
          </p>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-fit px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-black uppercase tracking-widest transition-colors rounded-lg shadow-xl hover:shadow-[0_0_20px_rgba(255,127,17,0.2)]"
          >
            Request Beta Key
          </button>
        </div>

        {/* Right Side: The 3D Ticket */}
        <div className="flex justify-center items-center pointer-events-auto">
          <FloatingTicket />
        </div>
      </div>

      {/* 🌟 THE GLASSMORPHISM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeModal}
          />
          
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(255,127,17,0.15)] overflow-visible transform transition-all">
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {formStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-[#FF7F11]/10 rounded-full flex items-center justify-center mb-6 text-[#FF7F11]">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                    Access Requested
                  </h3>
                  <p className="text-gray-400 text-sm mb-8">
                    Your request has been logged in the TuneX registry. We will notify you when a beta slot opens.
                  </p>
                  <button 
                    onClick={closeModal}
                    className="w-full py-3 bg-[#FF7F11] text-black font-black uppercase tracking-widest rounded-lg hover:bg-[#ff9e4a] transition-colors"
                  >
                    Close Terminal
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <div className="mb-8">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                      Beta Registry
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Initialize your connection to the Melakarta Engine.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Alias / Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. A.R. Rahman" 
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-700 focus:border-[#FF7F11] focus:ring-1 focus:ring-[#FF7F11] outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Secure Comm (Email)</label>
                      <input 
                        required
                        type="email" 
                        placeholder="you@domain.com" 
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-700 focus:border-[#FF7F11] focus:ring-1 focus:ring-[#FF7F11] outline-none transition-all"
                      />
                    </div>

                    {/* 🌟 CUSTOM DROPDOWN */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold ml-1">Primary Discipline</label>
                      
                      {/* Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full bg-black border rounded-lg px-4 py-3 flex items-center justify-between outline-none transition-all ${isDropdownOpen ? 'border-[#FF7F11] ring-1 ring-[#FF7F11]' : 'border-white/10 hover:border-white/20'}`}
                      >
                        <span className={selectedRole ? "text-white" : "text-gray-700"}>
                          {selectedRole || "Select your role..."}
                        </span>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#FF7F11]' : ''}`} 
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-[#0d0d0d] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          {roles.map((role) => (
                            <div
                              key={role}
                              onClick={() => {
                                setSelectedRole(role);
                                setIsDropdownOpen(false);
                              }}
                              className="px-4 py-3 text-sm text-gray-400 hover:bg-[#FF7F11]/10 hover:text-[#FF7F11] cursor-pointer transition-colors"
                            >
                              {role}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={formStatus === 'loading' || !selectedRole}
                        className="w-full py-4 bg-[#FF7F11] text-black font-black uppercase tracking-widest rounded-lg hover:bg-[#ff9e4a] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formStatus === 'loading' ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          'Initialize Access'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BetaTicketSection;
