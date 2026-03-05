import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Activity, Loader2, Search, Play, X, Heart, Database, Aperture } from 'lucide-react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'framer-motion'; 
import { API_BASE_URL } from '../config'; 

// 🌟 ANIMATION VARIANTS
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 } 
  }
};

const filterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 200, damping: 20 } 
  }
};

// 🌟 CARD DISPLAY
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
  const ragaChakra = data['Chakras'] || data.Chakra || data.chakra || ""; 

  const notes = useMemo(() => scaleString ? scaleString.split(', ') : [], [scaleString]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const playScale = async () => {
    if (isPlaying || notes.length === 0 || !synth) return;
    
    if (onPlay) onPlay(data);

    if (Tone.context.state !== 'running') {
      await Tone.start(); 
    }
    
    setIsPlaying(true);
    
    const now = Tone.now() + 0.1; 
    
    notes.forEach((note, index) => {
      synth.triggerAttackRelease(`${note}4`, "8n", now + (index * 0.4));
      
      const timer = setTimeout(() => {
        setPlayingIndex(index);
      }, (index * 400) + 100); 
      
      timersRef.current.push(timer);
    });

    const resetTimer = setTimeout(() => {
      setPlayingIndex(-1);
      setIsPlaying(false);
    }, (notes.length * 400) + 600); 
    
    timersRef.current.push(resetTimer);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl group hover:border-[#FF7F11]/40 transition-all duration-500 relative overflow-hidden flex flex-col h-90 max-w-75 mx-auto w-full transform-gpu"
    >
      
      <div className="absolute -right-2 -top-4 text-[80px] font-black italic text-white/5 group-hover:text-[#FF7F11]/5 transition-all pointer-events-none select-none">
        {ragaNo}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F11] shadow-[0_0_8px_#FF7F11]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Index {ragaNo}</span>
            {/* 🌟 CHAKRA BADGE */}
            {ragaChakra && (
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#FF7F11] font-bold border border-[#FF7F11]/20 px-2 py-0.5 rounded ml-1 bg-[#FF7F11]/5">
                {ragaChakra}
              </span>
            )}
          </div>

          <motion.button 
            whileTap={{ scale: 0.7 }}
            onClick={(e) => {
              e.stopPropagation();
              if(onToggleFavorite) onToggleFavorite(data);
            }}
            className={`transition-all duration-300 hover:scale-110 focus:outline-none ${
              isFavorite ? 'text-[#FF7F11]' : 'text-gray-600 hover:text-[#FF7F11]'
            }`}
          >
            <Heart size={16} className={isFavorite ? "fill-[#FF7F11]" : ""} />
          </motion.button>
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
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-200 ${
                      isActive 
                      ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-y-110 origin-bottom' 
                      : 'bg-white/20 group-hover:bg-[#FF7F11]'
                    }`}
                    style={{ height: `${((i + 1) / (notes.length || 1)) * 100}%` }}
                  />
                  <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-black uppercase transition-all duration-200 ${
                    isActive ? 'text-white scale-125' : 'text-gray-500 group-hover:text-[#FF7F11]'
                  }`}>
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
                <span className="block text-[9px] font-mono text-gray-300 truncate">
                  {chord ? chord.split(' ')[0] : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={playScale}
          disabled={isPlaying || notes.length === 0}
          className={`w-full py-3 border rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
            isPlaying 
            ? 'bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_0_20px_rgba(255,127,17,0.4)]' 
            : 'bg-white/5 border-white/5 hover:bg-[#FF7F11] hover:text-black hover:border-[#FF7F11]'
          }`}
        >
          {isPlaying ? (
            <>
               <Activity size={12} className="animate-pulse" /> Playing Matrix...
            </>
          ) : (
             <>
               <Play size={12} /> Listen to Scale
             </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}); 

// 🌟 MAIN APP COMPONENT
export default function RagaCard() {
  const [dbEntries, setDbEntries] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [activeChakra, setActiveChakra] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [historyItems, setHistoryItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]); 
  
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const globalSynthRef = useRef(null);
  const inputRef = useRef(null);

  const westernNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  useEffect(() => {
    globalSynthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
    }).toDestination();
    
    const savedHistory = JSON.parse(localStorage.getItem('tunex_history')) || [];
    const savedFavs = JSON.parse(localStorage.getItem('tunex_favorites')) || [];
    setHistoryItems(savedHistory);
    setFavoriteItems(savedFavs);
    
    return () => {
      if (globalSynthRef.current) globalSynthRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    const fetchRagas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ragas`);
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        setDbEntries(data);
      } catch (err) {
        console.error("CONNECTION ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRagas();
  }, []);

  const checkIsFavorite = useCallback((raga) => {
    return favoriteItems.some(f => (f.No || f.no) === (raga.No || raga.no));
  }, [favoriteItems]);

  const handleToggleFavorite = useCallback((ragaData) => {
    setFavoriteItems(prev => {
      const ragaId = ragaData.No || ragaData.no;
      const isFav = prev.some(item => (item.No || item.no) === ragaId);
      let newFavs;
      
      if (isFav) {
        newFavs = prev.filter(item => (item.No || item.no) !== ragaId);
      } else {
        newFavs = [{ ...ragaData }, ...prev];
      }
      
      localStorage.setItem('tunex_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  // 🌟 FULLY FIXED: Now successfully pushes data to your MongoDB Cloud
  const handlePlayRaga = useCallback(async (ragaData) => {
    // 1. Instantly update Local Storage (Optimistic Update)
    const historyEntry = { ...ragaData, playedAt: new Date().toISOString() };
    setHistoryItems(prev => {
      const filtered = prev.filter(item => (item.No || item.no) !== (ragaData.No || ragaData.no));
      const newHistory = [historyEntry, ...filtered].slice(0, 50); 
      localStorage.setItem('tunex_history', JSON.stringify(newHistory));
      return newHistory;
    });

    // 2. Fetch logged-in user data
    const userData = JSON.parse(localStorage.getItem('user'));
    const userEmail = userData ? userData.email : 'guest@tunex.com';

    // 3. Push log to Cloud Time Series Collection
    try {
      const response = await fetch(`${API_BASE_URL}/api/history/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail,
          ragaData: ragaData // 🌟 Pushing the complete object so the History Page can render the chords
        })
      });
      console.log(`✅ Logged to Cloud Database! Status: ${response.status}`);
    } catch (err) {
      console.error("❌ Failed to log playback to cloud:", err);
    }
  }, []);

  const uniqueRagaNames = useMemo(() => {
    const allNames = dbEntries.map(r => r['Raga Name'] || r.name).filter(Boolean);
    return Array.from(new Set(allNames));
  }, [dbEntries]);

  const uniqueChakras = useMemo(() => {
    const chakras = dbEntries.map(r => r['Chakras'] || r.Chakra || r.chakra).filter(Boolean);
    return Array.from(new Set(chakras));
  }, [dbEntries]);

  const availableSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    return uniqueRagaNames.filter(item => 
      item.toLowerCase().includes(inputValue.toLowerCase()) && 
      !selectedTags.includes(item)
    ).slice(0, 10);
  }, [inputValue, selectedTags, uniqueRagaNames]);

  const addTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus(); 
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const match = availableSuggestions[0];
      if (match) addTag(match);
      else addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const filteredData = useMemo(() => {
    if (selectedTags.length === 0 && !activeNote && !activeChakra) {
      return []; 
    }

    return dbEntries.filter(raga => {
      const ragaName = raga['Raga Name'] || raga.name || "";
      const ragaNo = raga.No || raga.no || "";
      const scaleString = raga['Scale (Notes)'] || raga.scale || "";
      const ragaChakra = raga['Chakras'] || raga.Chakra || raga.chakra || ""; 

      const matchesSearch = selectedTags.length === 0 ? true : selectedTags.every(tag => 
        ragaName.toLowerCase().includes(tag.toLowerCase()) || ragaNo.toString() === tag
      );
      
      const matchesNote = activeNote ? scaleString.split(', ')[0] === activeNote : true;
      const matchesChakra = activeChakra ? ragaChakra === activeChakra : true;
      
      return matchesSearch && matchesNote && matchesChakra;
    });
  }, [dbEntries, selectedTags, activeNote, activeChakra]);

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-32 font-sans selection:bg-[#FF7F11] selection:text-black overflow-x-hidden pt-6">
      
      <section className="relative h-[40vh] flex flex-col items-center justify-center z-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0"
        >
          <h1 className="text-[18vw] font-black uppercase tracking-tighter opacity-[0.03] select-none whitespace-nowrap">
            {activeChakra ? activeChakra : activeNote ? `KEY OF ${activeNote}` : 'SCALE MATRIX'}
          </h1>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative z-40 text-center flex flex-col items-center w-full"
        >
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">
            SYSTEM<span className="text-[#FF7F11]">.</span>DB
          </h2>
          
          <div className="mt-8 relative w-full max-w-2xl group z-40">
            <div className="flex flex-wrap items-center gap-2 w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 pl-4 pr-4 focus-within:border-[#FF7F11]/50 transition-all min-h-13 cursor-text" onClick={() => inputRef.current?.focus()}>
              <Search className="text-gray-600 group-focus-within:text-[#FF7F11] shrink-0" size={16} />
              
              <AnimatePresence>
                {selectedTags.map((tag, index) => (
                  <motion.span 
                    key={tag}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-1 bg-[#FF7F11]/10 text-[#FF7F11] px-3 py-1 rounded-lg text-xs font-mono font-bold border border-[#FF7F11]/20"
                  >
                    {tag}
                    <button onClick={(e) => { e.stopPropagation(); removeTag(tag); }} className="hover:text-white transition-colors ml-1 focus:outline-none">
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              <input 
                ref={inputRef}
                type="text" 
                placeholder={selectedTags.length === 0 ? "Search Raga Name..." : ""} 
                className="flex-1 bg-transparent text-sm font-mono outline-none min-w-30"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                onBlur={() => setShowSuggestions(false)} 
              />
            </div>

            <AnimatePresence>
              {showSuggestions && inputValue && availableSuggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
                >
                  {availableSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onMouseDown={(e) => { e.preventDefault(); addTag(suggestion); }}
                      className="w-full text-left px-4 py-3 text-sm font-mono text-gray-400 hover:bg-[#FF7F11] hover:text-black transition-colors border-b border-white/5 last:border-0 focus:bg-[#FF7F11] focus:text-black outline-none"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto mb-20 relative z-10 flex flex-col gap-4">
        
        {/* 🌟 NEW: CHAKRA FILTER ROW */}
        {uniqueChakras.length > 0 && (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <Aperture size={16} className="text-[#FF7F11]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Filter by Chakra</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {uniqueChakras.map(chakra => (
                <motion.button
                  key={chakra}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveChakra(activeChakra === chakra ? null : chakra)}
                  className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold transition-all duration-300 ${
                    activeChakra === chakra 
                    ? 'bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_0_20px_rgba(255,127,17,0.4)]' 
                    : 'bg-black border-white/5 text-gray-400 hover:border-[#FF7F11]/40 hover:text-white'
                  }`}
                >
                  {chakra}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 🌟 EXISTING KEYBOARD FILTER */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden">
          <motion.div 
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4"
          >
            {westernNotes.map((note) => (
              <motion.button
                key={note}
                variants={filterVariants}
                whileHover={{ y: -5 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveNote(activeNote === note ? null : note)}
                className={`py-7 rounded-[1.8rem] border font-mono text-sm font-black transition-colors duration-300 cursor-pointer ${
                  activeNote === note 
                  ? 'bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_0_40px_rgba(255,127,17,0.4)]' 
                  : 'bg-black border-white/5 text-gray-600 hover:border-[#FF7F11]/40 hover:text-white'
                }`}
              >
                {note}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <main className="max-w-350 mx-auto relative z-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Loader2 className="animate-spin text-[#FF7F11]" size={48} />
            <span className="text-[12px] font-mono tracking-[0.5em] text-gray-600 uppercase font-black">Syncing Matrix...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 opacity-30"
          >
            <Database size={64} className="mb-6 text-gray-600" />
            <p className="font-mono text-sm tracking-widest uppercase font-black text-center">Awaiting Query...</p>
            <p className="text-xs text-gray-500 mt-2 text-center">Search a raga name, select a key, or pick a Chakra to populate the matrix.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredData.map((entry) => (
              <CardDisplay 
                key={entry._id || entry.No} 
                data={entry} 
                synth={globalSynthRef.current} 
                onPlay={handlePlayRaga}
                isFavorite={checkIsFavorite(entry)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}