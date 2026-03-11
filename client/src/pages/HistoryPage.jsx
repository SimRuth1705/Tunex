import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Play, Heart, Clock, ArrowLeft, Trash2, Pencil, Save, X, Loader2 } from 'lucide-react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useModal } from '../contexts/ModalContext';

// 🌟 ANIMATION VARIANTS
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

// 🌟 EDIT MODAL COMPONENT
const EditModal = ({ raga, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...raga });
  const [isSaving, setIsSaving] = useState(false);

  // Safely handle inconsistent DB keys
  const nameKey = raga['Raga Name'] !== undefined ? 'Raga Name' : 'name';
  const scaleKey = raga['Scale (Notes)'] !== undefined ? 'Scale (Notes)' : 'scale';
  const chakraKey = raga['Chakras'] !== undefined ? 'Chakras' : (raga.Chakra !== undefined ? 'Chakra' : 'chakra');
  const c1Key = raga['Chord 1 (Notes)'] !== undefined ? 'Chord 1 (Notes)' : 'chord1';
  const c2Key = raga['Chord 2 (Notes)'] !== undefined ? 'Chord 2 (Notes)' : 'chord2';
  const c3Key = raga['Chord 3 (Notes)'] !== undefined ? 'Chord 3 (Notes)' : 'chord3';

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="bg-[#0a0a0a] border border-[#FF7F11]/30 p-6 rounded-3xl w-full max-w-lg shadow-[0_0_40px_rgba(255,127,17,0.15)] relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-[#FF7F11] mb-6 uppercase tracking-tighter italic">Edit Matrix Node</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Raga Name</label>
            <input type="text" value={formData[nameKey] || ''} onChange={e => handleChange(nameKey, e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:border-[#FF7F11] outline-none transition-all mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Chakra</label>
            <input type="text" value={formData[chakraKey] || ''} onChange={e => handleChange(chakraKey, e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:border-[#FF7F11] outline-none transition-all mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Scale (Comma separated)</label>
            <input type="text" value={formData[scaleKey] || ''} onChange={e => handleChange(scaleKey, e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono text-[#FF7F11] focus:border-[#FF7F11] outline-none transition-all mt-1" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Chord 1</label>
              <input type="text" value={formData[c1Key] || ''} onChange={e => handleChange(c1Key, e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:border-[#FF7F11] outline-none transition-all mt-1" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Chord 2</label>
              <input type="text" value={formData[c2Key] || ''} onChange={e => handleChange(c2Key, e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:border-[#FF7F11] outline-none transition-all mt-1" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Chord 3</label>
              <input type="text" value={formData[c3Key] || ''} onChange={e => handleChange(c3Key, e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm font-mono text-white focus:border-[#FF7F11] outline-none transition-all mt-1" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 bg-[#FF7F11] text-black font-black uppercase tracking-widest py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,127,17,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Syncing..." : "Update Database"}
        </button>
      </div>
    </motion.div>
  );
};

// 🌟 REUSABLE CARD DISPLAY (UPDATED WITH ADMIN CONTROLS)
const CardDisplay = React.memo(({ data, getSynth, onPlay, isFavorite, onToggleFavorite, isAdmin, onEdit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const timersRef = useRef([]);

  const ragaNo = data.No || data.ragaNo || data.no || "—";
  const ragaName = data['Raga Name'] || data.ragaName || data.name || "Unknown";
  const scaleString = data['Scale (Notes)'] || data.scale || "";
  const c1 = data['Chord 1 (Notes)'] || data.chord1 || "";
  const c2 = data['Chord 2 (Notes)'] || data.chord2 || "";
  const c3 = data['Chord 3 (Notes)'] || data.chord3 || "";

  const notes = useMemo(() => scaleString ? scaleString.split(', ') : [], [scaleString]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const playScale = async () => {
    if (isPlaying || notes.length === 0) return;
    if (onPlay) onPlay(data);

    // 🌟 USE THE NEW AUDIO PROTOCOL
    const synth = await getSynth();

    setIsPlaying(true);
    const now = Tone.now() + 0.1;

    notes.forEach((note, index) => {
      synth.triggerAttackRelease(`${note}4`, "8n", now + (index * 0.4));
      const timer = setTimeout(() => setPlayingIndex(index), (index * 400) + 100);
      timersRef.current.push(timer);
    });

    const resetTimer = setTimeout(() => {
      setPlayingIndex(-1);
      setIsPlaying(false);
    }, (notes.length * 400) + 500);
    timersRef.current.push(resetTimer);
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ y: -5, borderColor: 'rgba(255,127,17,0.4)' }}
      className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl group transition-colors duration-500 relative overflow-hidden flex flex-col h-85 max-w-75 mx-auto w-full transform-gpu"
    >
      <div className="absolute -right-2 -top-4 text-[80px] font-black italic text-white/5 group-hover:text-[#FF7F11]/5 transition-all pointer-events-none select-none">
        {ragaNo}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F11] shadow-[0_0_8px_#FF7F11]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Index {ragaNo}</span>
          </div>

          <div className="flex items-center gap-3">
            {data.playedAt && (
              <span className="font-mono text-[8px] uppercase tracking-widest text-gray-600">
                {new Date(data.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}

            {/* 🌟 RBAC: SHOW EDIT BUTTON ONLY TO ADMINS */}
            {isAdmin && (
              <motion.button
                whileTap={{ scale: 0.7 }}
                onClick={(e) => { e.stopPropagation(); onEdit(data); }}
                className="text-gray-600 hover:text-[#FF7F11] transition-colors focus:outline-none"
                title="Edit Raga"
              >
                <Pencil size={14} />
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(data);
              }}
              className={`transition-all duration-300 focus:outline-none ${isFavorite ? 'text-[#FF7F11]' : 'text-gray-600 hover:text-[#FF7F11]'}`}
            >
              <Heart size={16} className={isFavorite ? "fill-[#FF7F11]" : ""} />
            </motion.button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white group-hover:text-[#FF7F11] transition-colors leading-none truncate">
            {ragaName}
          </h3>
        </div>

        <div className="flex-1 mb-6">
          <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-gray-600 font-bold mb-3">
            <span className="flex items-center gap-1.5"><Activity size={10} className="text-[#FF7F11]" /> Note Profile</span>
            <span className="font-mono text-gray-800">{notes.length} Notes</span>
          </div>

          <div className="flex gap-1 h-16 items-end px-1">
            {notes.map((note, i) => {
              const isActive = playingIndex === i;
              return (
                <div key={i} className="flex-1 group/note relative">
                  <motion.div
                    animate={{
                      height: isActive ? '110%' : `${((i + 1) / (notes.length || 1)) * 100}%`,
                      backgroundColor: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.2)'
                    }}
                    className={`w-full rounded-t-sm ${isActive ? 'shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'group-hover:bg-[#FF7F11]'}`}
                  />
                  <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-black uppercase transition-all duration-200 ${isActive ? 'text-white scale-125' : 'text-gray-500 group-hover:text-[#FF7F11]'}`}>
                    {note}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={playScale}
          disabled={isPlaying || notes.length === 0}
          className={`w-full py-3 border rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isPlaying
            ? 'bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_0_20px_rgba(255,127,17,0.4)]'
            : 'bg-white/5 border-white/5 hover:bg-[#FF7F11] hover:text-black hover:border-[#FF7F11]'
            }`}
        >
          {isPlaying ? <><Activity size={12} className="animate-pulse" /> Playing Matrix...</> : <><Play size={12} /> Listen to Scale</>}
        </motion.button>
      </div>
    </motion.div>
  );
});

// 🌟 MAIN HISTORY PAGE COMPONENT
export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [editingRaga, setEditingRaga] = useState(null); // 🌟 STATE FOR EDIT MODAL
  const globalSynthRef = useRef(null);
  const { showConfirm } = useModal();

  // 🌟 ROLE CHECK
  const userData = JSON.parse(localStorage.getItem('user') || localStorage.getItem('tunex_user') || 'null');
  const isAdmin = userData?.role === 'admin' || userData?.role === 'owner';

  useEffect(() => {
    // Load local data
    setFavoriteItems(JSON.parse(localStorage.getItem('tunex_favorites')) || []);

    // Cloud Sync logic
    const fetchCloudHistory = async () => {
      const targetEmail = userData?.email || 'guest@tunex.com';
      console.log("📡 Requesting history for:", targetEmail);

      try {
        const response = await fetch(`${API_BASE_URL}/api/history/${targetEmail}`);
        if (response.ok) {
          const cloudHistory = await response.json();
          const flattenedHistory = cloudHistory.map(log => {
            if (log.ragaData) {
              return {
                ...log.ragaData,
                playedAt: log.playedAt?.$date || log.playedAt,
                _id: log._id // Note: this is the history log ID, not the original Raga ID
              };
            }
            return log;
          });
          setHistoryItems(flattenedHistory);
        }
      } catch (err) {
        console.error("❌ Cloud sync failed:", err);
        setHistoryItems(JSON.parse(localStorage.getItem('tunex_history')) || []);
      }
    };

    fetchCloudHistory();
    return () => {
      if (globalSynthRef.current) {
        globalSynthRef.current.dispose();
        globalSynthRef.current = null;
      }
    };
  }, []);

  // 🌟 NEW: AUDIO PROTOCOL
  const getSynth = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
      console.log('✅ AudioContext Resumed');
    }
    if (!globalSynthRef.current) {
      globalSynthRef.current = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
      }).toDestination();
    }
    return globalSynthRef.current;
  };

  // 🌟 HANDLE DATABASE UPDATE FROM HISTORY PAGE
  const handleUpdateRaga = async (updatedData) => {
    try {
      // Find original Raga ID from the favorite items if possible, or fallback to updatedData._id
      const ragaIdToUpdate = updatedData.ragaId || updatedData._id;

      const res = await fetch(`${API_BASE_URL}/api/ragas/${ragaIdToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const newlySavedRaga = await res.json();

        // Update favorites array in UI and Local Storage
        setFavoriteItems(prev => {
          const newFavs = prev.map(r => (r.No === newlySavedRaga.No || r.no === newlySavedRaga.no) ? { ...r, ...newlySavedRaga } : r);
          localStorage.setItem('tunex_favorites', JSON.stringify(newFavs));
          return newFavs;
        });

        // Update history array in UI
        setHistoryItems(prev => prev.map(r => (r.No === newlySavedRaga.No || r.no === newlySavedRaga.no) ? { ...r, ...newlySavedRaga } : r));

        setEditingRaga(null);
      } else {
        console.error("Update failed. Make sure you have admin rights.");
      }
    } catch (err) {
      console.error("Network error updating database", err);
    }
  };

  const checkIsFavorite = useCallback((raga) => {
    const id = raga.No || raga.no || raga.ragaNo;
    return favoriteItems.some(f => (f.No || f.no || f.ragaNo) === id);
  }, [favoriteItems]);

  const handleToggleFavorite = useCallback((ragaData) => {
    setFavoriteItems(prev => {
      const ragaId = ragaData.No || ragaData.no || ragaData.ragaNo;
      const isFav = prev.some(item => (item.No || item.no || item.ragaNo) === ragaId);
      const newFavs = isFav ? prev.filter(item => (item.No || item.no || item.ragaNo) !== ragaId) : [{ ...ragaData }, ...prev];
      localStorage.setItem('tunex_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  const handlePlayRaga = useCallback(async (ragaData) => {
    const historyEntry = { ...ragaData, playedAt: new Date().toISOString() };
    setHistoryItems(prev => {
      const filtered = prev.filter(item => (item.No || item.no || item.ragaNo) !== (ragaData.No || ragaData.no || ragaData.ragaNo));
      return [historyEntry, ...filtered].slice(0, 50);
    });

    const userEmail = userData?.email || 'guest@tunex.com';

    try {
      await fetch(`${API_BASE_URL}/api/history/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, ragaData })
      });
    } catch (err) {
      console.error("Cloud log error:", err);
    }
  }, [userData]);

  const clearHistory = async () => {
    const confirmed = await showConfirm({
      title: 'Clear Local Storage',
      message: 'Are you sure you want to clear your local logs?',
      type: 'warning'
    });

    if (confirmed) {
      localStorage.removeItem('tunex_history');
      setHistoryItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-32 font-sans selection:bg-[#FF7F11] selection:text-black pt-6">

      {/* 🌟 EDIT MODAL */}
      <AnimatePresence>
        {editingRaga && (
          <EditModal
            raga={editingRaga}
            onClose={() => setEditingRaga(null)}
            onSave={handleUpdateRaga}
          />
        )}
      </AnimatePresence>

      <div className="max-w-350 mx-auto pt-8 mb-16">
        <motion.div whileHover={{ x: -5 }} className="inline-block mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF7F11] font-mono text-xs font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft size={16} /> Return to Matrix
          </Link>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
          YOUR <span className="text-[#FF7F11]">LIBRARY</span>
        </h1>
      </div>

      <main className="max-w-350 mx-auto relative">

        {/* --- FAVORITES SECTION --- */}
        {favoriteItems.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
              <Heart className="text-[#FF7F11] fill-[#FF7F11]" size={32} />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Saved Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favoriteItems.map((entry) => (
                <CardDisplay
                  key={`fav-${entry.No || entry._id || entry.ragaNo}`}
                  data={entry}
                  getSynth={getSynth}
                  onPlay={handlePlayRaga}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  isAdmin={isAdmin} // 🌟 PASS ADMIN STATUS
                  onEdit={setEditingRaga} // 🌟 PASS EDIT HANDLER
                />
              ))}
            </div>
          </div>
        )}

        {/* --- SESSION LOGS SECTION --- */}
        <div>
          <div className="flex items-end justify-between border-b border-white/10 pb-4 mb-8">
            <div className="flex items-center gap-4">
              <Clock className="text-gray-600" size={32} />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-300">Session Logs</h2>
              <span className="bg-[#FF7F11]/10 text-[#FF7F11] text-[8px] font-mono uppercase px-2 py-1 rounded ml-2 tracking-widest border border-[#FF7F11]/20">Cloud Synced</span>
            </div>
            {historyItems.length > 0 && (
              <motion.button onClick={clearHistory} className="flex items-center gap-2 text-[10px] font-black uppercase font-mono tracking-[0.2em] text-gray-500 transition-colors border border-gray-800 hover:border-red-500/30 px-4 py-2 rounded-lg">
                <Trash2 size={12} /> Clear Local
              </motion.button>
            )}
          </div>

          {historyItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {historyItems.map((entry, idx) => (
                <CardDisplay
                  key={`hist-${entry._id || idx}`}
                  data={entry}
                  getSynth={getSynth}
                  onPlay={handlePlayRaga}
                  isFavorite={checkIsFavorite(entry)}
                  onToggleFavorite={handleToggleFavorite}
                  isAdmin={isAdmin} // 🌟 PASS ADMIN STATUS
                  onEdit={setEditingRaga} // 🌟 PASS EDIT HANDLER
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <Clock size={64} className="mb-6 text-gray-600" />
              <p className="font-mono text-sm tracking-widest uppercase font-black">Memory Banks Empty</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}