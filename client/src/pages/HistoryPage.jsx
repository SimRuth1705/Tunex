import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Activity, Play, Heart, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'framer-motion'; // 🌟 Added Framer Motion

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

// 🌟 REUSABLE CARD DISPLAY
const CardDisplay = React.memo(({ data, synth, onPlay, isFavorite, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1); 
  const timersRef = useRef([]);

  const ragaNo = data.No || data.no || "—";
  const ragaName = data['Raga Name'] || data.name || "Unknown";
  const scaleString = data['Scale (Notes)'] || data.scale || "";
  const c1 = data['Chord 1 (Notes)'] || data.chord1 || "";
  const c2 = data['Chord 2 (Notes)'] || data.chord2 || "";
  const c3 = data['Chord 3 (Notes)'] || data.chord3 || "";

  const notes = useMemo(() => scaleString ? scaleString.split(', ') : [], [scaleString]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const playScale = async () => {
    if (isPlaying || notes.length === 0 || !synth) return;
    if (onPlay) onPlay(data);
    if (Tone.context.state !== 'running') await Tone.start(); 
    
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
      layout // 🌟 Smoothly animates position changes in the grid
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
                {new Date(data.playedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            )}
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                if(onToggleFavorite) onToggleFavorite(data);
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
            <span className="flex items-center gap-1.5"><Activity size={10} className="text-[#FF7F11]"/> Note Profile</span>
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

        <div className="space-y-2 mb-6 mt-2">
           <span className="text-[8px] uppercase tracking-[0.3em] text-gray-700 font-bold ml-1">Harmonic Chords</span>
           <div className="grid grid-cols-3 gap-2">
            {[c1, c2, c3].map((chord, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-2 rounded-lg text-center group-hover:border-[#FF7F11]/20 transition-all">
                <span className="block text-[9px] font-mono text-gray-300 truncate">{chord ? chord.split(' ')[0] : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={playScale}
          disabled={isPlaying || notes.length === 0}
          className={`w-full py-3 border rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            isPlaying 
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
  const globalSynthRef = useRef(null);

  useEffect(() => {
    globalSynthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
    }).toDestination();
    
    setHistoryItems(JSON.parse(localStorage.getItem('tunex_history')) || []);
    setFavoriteItems(JSON.parse(localStorage.getItem('tunex_favorites')) || []);
    
    return () => { if (globalSynthRef.current) globalSynthRef.current.dispose(); };
  }, []);

  const checkIsFavorite = useCallback((raga) => {
    return favoriteItems.some(f => (f.No || f.no) === (raga.No || raga.no));
  }, [favoriteItems]);

  const handleToggleFavorite = useCallback((ragaData) => {
    setFavoriteItems(prev => {
      const ragaId = ragaData.No || ragaData.no;
      const isFav = prev.some(item => (item.No || item.no) === ragaId);
      const newFavs = isFav ? prev.filter(item => (item.No || item.no) !== ragaId) : [{ ...ragaData }, ...prev];
      localStorage.setItem('tunex_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  const handlePlayRaga = useCallback((ragaData) => {
    const historyEntry = { ...ragaData, playedAt: new Date().toISOString() };
    setHistoryItems(prev => {
      const filtered = prev.filter(item => (item.No || item.no) !== (ragaData.No || ragaData.no));
      const newHistory = [historyEntry, ...filtered].slice(0, 50); 
      localStorage.setItem('tunex_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = () => {
    if(window.confirm("Are you sure you want to clear your session logs?")) {
      localStorage.removeItem('tunex_history');
      setHistoryItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-32 font-sans selection:bg-[#FF7F11] selection:text-black pt-6">
      
      {/* 🌟 HEADER ANIMATION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-350 mx-auto pt-8 mb-16"
      >
        <motion.a 
          whileHover={{ x: -5 }}
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF7F11] font-mono text-xs font-bold uppercase tracking-widest transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Return to Matrix
        </motion.a>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
          YOUR <span className="text-[#FF7F11]">LIBRARY</span>
        </h1>
      </motion.div>

      <main className="max-w-350 mx-auto relative z-0">
        
        {/* --- FAVORITES SECTION --- */}
        <AnimatePresence>
          {favoriteItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-24"
            >
              <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
                <Heart className="text-[#FF7F11] fill-[#FF7F11]" size={32} />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Saved Favorites</h2>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {favoriteItems.map((entry) => (
                  <CardDisplay 
                    key={`fav-${entry.No || entry._id}`} 
                    data={entry} 
                    synth={globalSynthRef.current} 
                    onPlay={handlePlayRaga}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SESSION LOGS SECTION --- */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-end justify-between border-b border-white/10 pb-4 mb-8">
            <div className="flex items-center gap-4">
              <Clock className="text-gray-600" size={32} />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-300">Session Logs</h2>
            </div>
            
            {historyItems.length > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05, color: '#ef4444' }}
                whileTap={{ scale: 0.95 }}
                onClick={clearHistory}
                className="flex items-center gap-2 text-[10px] font-black uppercase font-mono tracking-[0.2em] text-gray-500 transition-colors border border-gray-800 hover:border-red-500/30 px-4 py-2 rounded-lg"
              >
                <Trash2 size={12} /> Clear Logs
              </motion.button>
            )}
          </div>

          {!historyItems.length && !favoriteItems.length ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 opacity-30"
            >
              <Clock size={64} className="mb-6 text-gray-600" />
              <p className="font-mono text-sm tracking-widest uppercase font-black">Memory Banks Empty</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {historyItems.map((entry) => (
                  <CardDisplay 
                    key={`hist-${entry.No || entry._id}`} 
                    data={entry} 
                    synth={globalSynthRef.current} 
                    onPlay={handlePlayRaga}
                    isFavorite={checkIsFavorite(entry)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}