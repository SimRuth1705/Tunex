import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setStep(2);
      else setStatus({ type: 'error', msg: data.message });
    } catch {
      setStatus({ type: 'error', msg: "Connection failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: "Vault Updated. Redirecting..." });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await res.json();
        setStatus({ type: 'error', msg: data.message });
      }
    } catch {
      setStatus({ type: 'error', msg: "System failure." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Recovery" subtitle="Restore system access">
      <AnimatePresence mode="wait">
        <Link to="/login" className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-[#FF7F11] font-bold uppercase tracking-widest mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Login
        </Link>

        {status.msg && (
          <div className={`mb-6 p-3 rounded-xl flex items-center gap-3 text-xs font-mono border ${
            status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            <AlertCircle size={14} /> {status.msg}
          </div>
        )}

        {step === 1 && (
          <motion.form key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Identity Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11] text-white" placeholder="composer@tunex.ai" />
            </div>
            <button disabled={isLoading} className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Request Security Code"}
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={() => setStep(3)} className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Mail className="text-[#FF7F11] mb-4" size={32} />
              <p className="text-gray-400 text-[10px] uppercase tracking-widest leading-relaxed">Verification code sent to email.</p>
            </div>
            <input required maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black border-2 border-white/10 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] text-[#FF7F11] outline-none focus:border-[#FF7F11]" placeholder="000000" />
            <button className="w-full bg-[#FF7F11] text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl">Continue Protocol</button>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">New Access Key</label>
              <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11] text-white" placeholder="••••••••" />
            </div>
            <button disabled={isLoading} className="w-full bg-[#FF7F11] text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Reset"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}