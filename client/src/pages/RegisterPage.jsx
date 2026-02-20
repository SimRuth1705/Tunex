import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function RegisterPage() {
  return (
    <AuthLayout title="Join" subtitle="Start your musical journey">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Full Name</label>
          <input 
            type="text" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 transition-all"
            placeholder="Arjun Dev"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Email</label>
          <input 
            type="email" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 transition-all"
            placeholder="arjun@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Password</label>
          <input 
            type="password" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF7F11]/50 transition-all"
            placeholder="Create password"
          />
        </div>

        <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 mt-6">
          Create Identity
        </button>

        <p className="text-center text-gray-500 text-xs pt-4">
          Already a member? <Link to="/login" className="text-white hover:text-[#FF7F11] transition-colors">Return to login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}