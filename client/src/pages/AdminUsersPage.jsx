import React, { useState, useEffect, useRef } from 'react';
import { Users, ShieldAlert, ShieldCheck, Mail, Calendar, Loader2, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useModal } from '../contexts/ModalContext';
import RoleDropdown from '../components/RoleDropdown';



export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showConfirm } = useModal();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // 🌟 SECURITY CHECK: Verify Admin Status
  const userData = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = userData?.role === 'admin' || userData?.role === 'owner';

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // 👈 Grab the token

        const response = await fetch(`${API_BASE_URL}/api/users`, {
          headers: {
            "Authorization": `Bearer ${token}` // 👈 Send the token
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUsers(data); // Safely set the array
        } else {
          console.error("Unauthorized or Failed to fetch:", data.message);
          setUsers([]); // Prevent the .map crash
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isAdmin]);

  // 🌟 HANDLE ROLE CHANGE (Added Token)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // 👈 Send token
        },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        console.error("Failed to update role. Check admin rights.");
      }
    } catch (err) {
      console.error("Network error updating role", err);
    }
  };

  // 🌟 HANDLE USER DELETION (Added Token)
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = await showConfirm({
      title: 'Delete User',
      message: `WARNING: Are you sure you want to permanently delete ${userName}? This cannot be undone.`,
      type: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}` // 👈 Send token
        }
      });

      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        console.error("Failed to delete user. Check admin rights.");
      }
    } catch (err) {
      console.error("Network error deleting user", err);
    }
  };

  // 🛑 NON-ADMIN FALLBACK SCREEN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <ShieldAlert size={80} className="text-red-500 mb-6" />
        <h1 className="text-4xl font-black uppercase tracking-widest text-red-500 mb-2">Access Denied</h1>
        <p className="text-gray-500 font-mono tracking-widest text-sm uppercase">Level 4 Admin Clearance Required</p>
      </div>
    );
  }

  // ✅ ADMIN DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-black text-white px-8 pb-32 font-sans selection:bg-[#FF7F11] selection:text-black overflow-x-hidden pt-24">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
          <div className="bg-[#FF7F11]/10 p-4 rounded-2xl border border-[#FF7F11]/20">
            <Users size={32} className="text-[#FF7F11]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
              System<span className="text-[#FF7F11]">.</span>Users
            </h1>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-2">
              Identity & Access Management
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Loader2 className="animate-spin text-[#FF7F11]" size={48} />
            <span className="text-[12px] font-mono tracking-[0.5em] text-gray-600 uppercase font-black">Syncing Roster...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {users.map((u, index) => (
                <motion.div
                  key={u._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl hover:border-[#FF7F11]/40 transition-all relative group"
                  style={{ zIndex: openDropdownId === u._id ? 50 : 1 }}
                >
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-all ${u.role === 'admin' || u.role === 'owner' ? 'bg-[#FF7F11]' : 'bg-gray-600'}`}></div>
                  </div>

                  <div className="flex justify-between items-center mb-6 relative z-20">
                    <div className="flex items-center gap-2">
                      {u.role === 'admin' || u.role === 'owner' ? <ShieldCheck size={16} className="text-[#FF7F11]" /> : <Users size={16} className="text-gray-500" />}

                      <RoleDropdown
                        role={u.role}
                        onChange={(newRole) => {
                          handleRoleChange(u._id, newRole);
                          setOpenDropdownId(null);
                        }}
                        disabled={u.email === userData.email}
                        isOpen={openDropdownId === u._id}
                        onToggle={(isOpen) => setOpenDropdownId(isOpen ? u._id : null)}
                      />
                    </div>

                    {u.email !== userData.email && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="text-gray-600 hover:text-red-500 transition-colors focus:outline-none"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-black tracking-tight text-white mb-1 truncate">{u.name}</h3>
                    <div className="space-y-3 mt-6">
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Mail size={16} className="text-gray-600" />
                        <span className="font-mono truncate text-xs">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Calendar size={16} className="text-gray-600" />
                        <span className="font-mono text-xs">
                          Joined: {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}