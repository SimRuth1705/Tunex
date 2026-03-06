import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoleDropdown = ({ role, onChange, disabled, isOpen, onToggle }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isOpen) onToggle(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onToggle]);

    const options = ['user', 'admin'];
    if (role === 'owner') options.push('owner');

    const isAdminOrOwner = role === 'admin' || role === 'owner';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !disabled && onToggle(!isOpen)}
                disabled={disabled}
                className={`flex items-center gap-2 border rounded-lg text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest px-3 py-1.5 outline-none transition-all ${isAdminOrOwner ? 'bg-[#FF7F11]/10 border-[#FF7F11]/50 text-[#FF7F11] shadow-[inset_0_0_10px_rgba(255,127,17,0.1)] hover:bg-[#FF7F11]/20' : 'bg-white/5 border-white/10 text-gray-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)] hover:bg-white/10 hover:text-white'
                    } ${disabled ? 'opacity-40 pointer-events-none' : '!cursor-none'}`}
            >
                <span>{role}</span>
                {!disabled && <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF7F11]' : 'text-gray-500'}`} />}
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-32 bg-[#111111]/90 backdrop-blur-xl border border-[#FF7F11]/40 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(255,127,17,0.25)] z-[100] flex flex-col"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    onToggle(false);
                                }}
                                className={`text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all !cursor-none ${role === opt
                                    ? 'bg-[#FF7F11]/20 text-[#FF7F11] border-l-[3px] border-[#FF7F11] shadow-[inset_0_0_10px_rgba(255,127,17,0.1)]'
                                    : 'text-gray-400 hover:bg-[#FF7F11] hover:text-black border-l-[3px] border-transparent'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoleDropdown;
