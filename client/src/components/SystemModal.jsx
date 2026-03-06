import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const SystemModal = ({ isOpen, type = 'info', title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  const icons = {
    danger: <AlertTriangle className="text-red-500" size={32} />,
    warning: <AlertTriangle className="text-[#FF7F11]" size={32} />,
    success: <CheckCircle className="text-green-500" size={32} />,
    info: <Info className="text-blue-500" size={32} />
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className={`absolute -top-24 -left-24 w-48 h-48 blur-[80px] opacity-20 pointer-events-none ${type === 'danger' ? 'bg-red-500' : 'bg-[#FF7F11]'}`} />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              {icons[type]}
            </div>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
              {title}
            </h2>
            
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex gap-3 w-full">
              {onCancel && (
                <button 
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
                >
                  {cancelText}
                </button>
              )}
              <button 
                onClick={onConfirm}
                className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${
                  type === 'danger' ? 'bg-red-500 text-white' : 'bg-[#FF7F11] text-black hover:bg-[#ff9e4a]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SystemModal;