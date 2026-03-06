import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react'; // 🌟 Added Shield icon
import toast from 'react-hot-toast';
import { useModal } from '../contexts/ModalContext';

const Navbar = ({ user, setUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { showConfirm } = useModal();

  // 🌟 SECURITY CHECK: Verify Admin Status for Navbar links
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Terminate Session',
      message: 'Are you sure you want to log out and terminate the current system session?',
      type: 'warning'
    });

    if (confirmed) {
      // 🌟 FIX: Clear 'user' and 'token' so it matches your whole app
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      toast.error("Identity De-authenticated", {
        style: { background: '#000', color: '#FF7F11', border: '1px solid #FF7F11', fontFamily: 'monospace' }
      });
      navigate('/');
    }
  };

  // Base navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Keyboard', path: '/keyboard' },
    { name: 'Raga', path: '/raga' },
    { name: 'History', path: '/history' },
    { name: 'About Us', path: '/about' }
  ];

  // 🌟 Conditionally add the "Users" link if the logged-in user is an admin
  if (isAdmin) {
    navLinks.push({ name: 'Users', path: '/admin/users' });
  }

  return (
    <nav className="w-full h-24 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 cursor-none">

      {/* LEFT: Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-3xl font-black italic tracking-tighter text-white hover:opacity-80 transition-opacity py-2 px-4 -ml-4 cursor-none!">
          Tune<span className="text-[#FF7F11]">X</span>
        </Link>
      </div>

      {/* CENTER: Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map((item, index) => (
          <React.Fragment key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `text-[10px] uppercase tracking-[0.3em] font-mono transition-all py-4 px-3 flex items-center gap-1.5 ${isActive ? 'text-[#FF7F11] font-bold' : 'text-gray-400 hover:text-[#FF7F11]'}`}
            >
              {/* Add a tiny shield icon next to the Users link for a cool admin vibe */}
              {item.name === 'Users' && <ShieldAlert size={12} className="opacity-70" />}
              {item.name}
            </NavLink>
            {index < navLinks.length - 1 && <span className="text-[#FF7F11] text-[10px] opacity-20">»</span>}
          </React.Fragment>
        ))}
      </div>

      {/* RIGHT: Auth Controls */}
      <div className="flex items-center gap-4">
        {!user ? (
          /* LOGIN BUTTON (Shown only if logged out) */
          <NavLink to="/login" className="hidden md:block cursor-none!">
            <button className="bg-[#FF7F11] hover:bg-[#ff9e4a] text-black px-6 py-2.5 rounded-lg font-mono text-xs font-black uppercase tracking-widest transition-all">
              Login
            </button>
          </NavLink>
        ) : (
          /* PROFILE & LOGOUT (Shown only if logged in) */
          <div className="hidden md:flex items-center gap-3">
            <Link to="/profile" className={`flex items-center gap-2 bg-white/5 hover:bg-white/10 border ${isAdmin ? 'border-[#FF7F11]/30' : 'border-white/10'} px-4 py-2 rounded-xl transition-all cursor-none!`}>
              <UserIcon size={14} className="text-[#FF7F11]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white">
                {user.name.split(' ')[0]}
                {isAdmin && <span className="ml-2 text-[#FF7F11] text-[8px]">(ADM)</span>}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 rounded-xl transition-all cursor-none!"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        <button className="md:hidden text-[#FF7F11] p-4 -mr-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-[#0a0a0a] border-b border-white/10 md:hidden flex flex-col items-center py-8">
          {navLinks.map((item) => (
            <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 border-b border-white/5 text-gray-400 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              {item.name === 'Users' && <ShieldAlert size={12} />}
              {item.name}
            </NavLink>
          ))}
          {user ? (
            <button onClick={handleLogout} className="w-[80%] mt-6 bg-red-500 text-black py-4 rounded-lg font-black uppercase text-xs tracking-widest">
              Terminate Session
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-[80%] mt-6 bg-[#FF7F11] text-black py-4 rounded-lg text-center font-black uppercase text-xs tracking-widest">
              Access Vault
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;