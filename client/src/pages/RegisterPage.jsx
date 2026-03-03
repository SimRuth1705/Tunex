import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function RegisterPage({ setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Entry
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');

  // 🌟 PHASE 1: Send Data to Server & Request OTP
  const handleRegisterInitiate = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://your-backend-name.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); // Move to OTP verification
      } else {
        setErrorMessage(data.message || "Authentication failed.");
      }
    } catch (err) {
      setErrorMessage("System Offline. Ensure backend is running on Port 5005.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 PHASE 2: Verify OTP and Finalize Account
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // ✅ FIXED: Changed endpoint to verify-otp
      const response = await fetch('http://localhost:5005/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Log the user in globally
        localStorage.setItem('tunex_user', JSON.stringify(data.user));
        if (setUser) setUser(data.user);
        
        // 🌟 Optional: Small delay for UX feel
        setTimeout(() => {
          navigate('/'); 
        }, 500);
      } else {
        setErrorMessage(data.message || "Invalid Security Code.");
      }
    } catch (err) {
      setErrorMessage("Verification protocol failed. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={step === 1 ? "Join" : "Verify"} 
      subtitle={step === 1 ? "Start your musical journey" : "Security Protocol Active"}
    >
      <AnimatePresence mode="wait">
        
        {/* Error Notification */}
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-mono"
          >
            <AlertCircle size={14} /> {errorMessage}
          </motion.div>
        )}

        {step === 1 ? (
          /* --- STEP 1: REGISTRATION FORM --- */
          <motion.form 
            key="reg-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4" 
            onSubmit={handleRegisterInitiate}
          >
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all text-white"
                placeholder="Arjun Dev"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Email</label>
              <input 
                required
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all text-white"
                placeholder="arjun@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Password</label>
              <input 
                required
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 focus:ring-1 focus:ring-[#FF7F11]/50 transition-all text-white"
                placeholder="Create password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Generate Access Key"}
            </button>

            <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest pt-4 font-bold">
              Already a member? <Link to="/login" className="text-white hover:text-[#FF7F11] transition-colors">Return to login</Link>
            </p>
          </motion.form>
        ) : (
          /* --- STEP 2: OTP VERIFICATION --- */
          <motion.form 
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6" 
            onSubmit={handleVerifyOTP}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 bg-[#FF7F11]/10 rounded-full flex items-center justify-center mb-4 border border-[#FF7F11]/20">
                <Mail className="text-[#FF7F11]" size={20} />
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-60">
                Enter the 6-digit code sent to <br/>
                <span className="text-white font-mono">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <input 
                required
                autoFocus
                type="text" 
                maxLength="6"
                placeholder="000000"
                className="w-full bg-black border-2 border-white/10 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] text-[#FF7F11] outline-none focus:border-[#FF7F11] transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              
              <div className="flex flex-col items-center gap-3">
                <button 
                  type="button"
                  className="text-[9px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors font-bold"
                  onClick={() => setStep(1)}
                >
                  Change Email Address
                </button>
                <button 
                  type="button"
                  disabled={isLoading}
                  className="text-[9px] uppercase tracking-widest text-[#FF7F11] hover:text-[#ff9e4a] transition-colors font-bold disabled:opacity-50"
                  onClick={handleRegisterInitiate}
                >
                  Resend Security Code
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading || otp.length < 6}
              className="w-full bg-[#FF7F11] text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-[#ff9e4a] transition-all duration-300 shadow-[0_0_20px_rgba(255,127,17,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Finalize Identity <ShieldCheck size={18} /></>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}