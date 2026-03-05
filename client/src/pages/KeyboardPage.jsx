import React, { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, Heart, Play, Activity, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Tone from 'tone';
import { identifyRaga } from "../utils/musicTheory";
import { API_BASE_URL } from '../config'; 
import TypographicHeader from "../components/TypographicHeader";
import NoteSequenceDisplay from "../components/NoteSequenceDisplay";
import ResultsDisplay from "../components/ResultsDisplay";
import Button from "../components/Button";
import MobileNoteGrid from "../components/MobileNoteGrid";

// --- SUB-COMPONENTS (Defined inside or outside, but with unique names) ---

const PianoKeyComponent = ({ note, type, onClick, isActive }) => {
  const displayLabel = note.replace(/[0-9]/g, "");
  const baseStyle = "cursor-pointer select-none transition-colors duration-150 flex items-end justify-center pb-4 outline-none w-full";
  const whiteKey = `h-full rounded-b-xl border-x border-b border-white/10 font-extrabold text-sm ${isActive ? "bg-[#111] border-[#FF7F11] text-[#FF7F11] shadow-[inset_0_-8px_20px_rgba(255,127,17,0.3)]" : "bg-black text-white/40 hover:bg-white/[0.08]"}`;
  const blackKey = `h-full rounded-b-lg border border-white/20 border-t-0 text-[10px] font-extrabold ${isActive ? "bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_8px_20px_rgba(255,127,17,0.5)]" : "bg-[#050505] text-white/70 hover:bg-[#111]"}`;

  return (
    <motion.button
      whileTap={{ scale: 0.96, y: 2 }}
      animate={{ scale: isActive ? 0.98 : 1, y: isActive ? 2 : 0 }}
      onMouseDown={(e) => { e.stopPropagation(); onClick(note); }}
      className={`${baseStyle} ${type === "white" ? whiteKey : blackKey}`}
    >
      {displayLabel}
    </motion.button>
  );
};

const KeyboardLayout = ({ handleNotePlay, sequence }) => {
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B", "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3"];
  const step = 100 / 15;
  const blackKeys = [
    { note: "C#", l: 1 }, { note: "D#", l: 2 }, { note: "F#", l: 4 }, { note: "G#", l: 5 }, { note: "A#", l: 6 },
    { note: "C2#", l: 8 }, { note: "D2#", l: 9 }, { note: "F2#", l: 11 }, { note: "G2#", l: 12 }, { note: "A2#", l: 13 },
  ];

  return (
    <div className="w-full h-44 relative flex select-none">
      <div className="flex w-full h-full">
        {whiteKeys.map((n) => (
          <div key={n} className="flex-1 px-px h-full">
            <PianoKeyComponent type="white" note={n} onClick={handleNotePlay} isActive={sequence.includes(n)} />
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 w-full h-[65%] pointer-events-none">
        {blackKeys.map((k) => (
          <div key={k.note} className="absolute -translate-x-1/2 w-[4%] h-full pointer-events-auto" style={{ left: `${step * k.l}%` }}>
            <PianoKeyComponent type="black" note={k.note} onClick={handleNotePlay} isActive={sequence.includes(k.note)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function KeyboardPage() {
  const [sequence, setSequence] = useState(Array(7).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [detectedRaga, setDetectedRaga] = useState(null);
  const [fullRagaObject, setFullRagaObject] = useState(null);
  const [suggestedChords, setSuggestedChords] = useState([]);
  const [midiConnected, setMidiConnected] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dbEntries, setDbEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const synthRef = useRef(null);

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ragas`);
        const data = await response.json();
        setDbEntries(data);
      } catch (err) {
        console.error("DB Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDB();

    synthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.1, release: 1 }
    }).toDestination();

    return () => synthRef.current?.dispose();
  }, []);

  useEffect(() => {
    const validNotes = sequence.filter((n) => n);
    if (validNotes.length < 3 || dbEntries.length === 0) {
      setDetectedRaga(null);
      setFullRagaObject(null);
      setSuggestedChords([]);
      return;
    }

    const match = identifyRaga(validNotes, dbEntries);
    
    if (match) {
      setDetectedRaga(match["Raga Name"] || match.name);
      setFullRagaObject(match);
      const chords = [match["Chord 1 (Notes)"], match["Chord 2 (Notes)"], match["Chord 3 (Notes)"]].filter(Boolean);
      setSuggestedChords(chords);
      const favs = JSON.parse(localStorage.getItem('tunex_favorites')) || [];
      setIsFavorite(favs.some(f => (f.No || f.no) === (match.No || match.no)));
    } else {
      setDetectedRaga(validNotes.length >= 5 ? "No Match Found" : "Keep playing...");
      setFullRagaObject(null);
      setSuggestedChords([]);
    }
  }, [sequence, dbEntries]);

  const handlePlayRaga = useCallback(async () => {
    if (!fullRagaObject || isPlayingAudio) return;
    setIsPlayingAudio(true);
    const scaleStr = fullRagaObject["Scale (Notes)"] || fullRagaObject.scale || "";
    const notes = scaleStr.split(', ');
    if (Tone.context.state !== 'running') await Tone.start();
    const now = Tone.now();
    notes.forEach((note, i) => {
      synthRef.current.triggerAttackRelease(`${note}4`, "8n", now + (i * 0.4));
    });

    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('tunex_user'));
    fetch(`${API_BASE_URL}/api/history/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: user?.email || 'guest@tunex.com', ragaData: fullRagaObject })
    }).catch(e => console.error(e));

    setTimeout(() => setIsPlayingAudio(false), notes.length * 400 + 500);
  }, [fullRagaObject, isPlayingAudio]);

  const toggleFavorite = () => {
    if (!fullRagaObject) return;
    let favs = JSON.parse(localStorage.getItem('tunex_favorites')) || [];
    const id = fullRagaObject.No || fullRagaObject.no;
    if (isFavorite) {
      favs = favs.filter(f => (f.No || f.no) !== id);
    } else {
      favs.unshift(fullRagaObject);
    }
    localStorage.setItem('tunex_favorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  const keyboardOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C2", "C2#", "D2", "D2#", "E2", "F2", "F2#", "G2", "G2#", "A2", "A2#", "B2", "C3"];
  const handleNotePlay = useCallback((note) => {
    setSequence((prev) => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        const next = [...prev];
        next[activeIndex] = note;
        setActiveIndex(prevIdx => prevIdx < 6 ? prevIdx + 1 : prevIdx);
        return next;
      }
      if (prev.includes(note)) return prev.map(n => n === note ? "" : n);
      const current = prev.filter(n => n !== "");
      if (current.length >= 7) return prev;
      const sorted = [...current, note].sort((a, b) => keyboardOrder.indexOf(a) - keyboardOrder.indexOf(b));
      const next = Array(7).fill("");
      sorted.forEach((n, i) => next[i] = n);
      return next;
    });
  }, [activeIndex]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-[#FF7F11] font-mono"><Loader2 className="animate-spin mr-2"/> Syncing Cloud...</div>;

  return (
    <div className="w-full bg-black flex flex-col lg:h-[calc(100vh-96px)] lg:overflow-hidden text-white font-sans">
      <main className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto lg:overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-325 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 lg:p-10 relative shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-[28%_72%] gap-8">
            <TypographicHeader midiConnected={midiConnected} />
            
            <div className="flex flex-col space-y-6">
              
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1">
                  <NoteSequenceDisplay sequence={sequence} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                </div>
                
                <AnimatePresence>
                  {fullRagaObject && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={toggleFavorite} 
                        className={`p-3 rounded-2xl border transition-all ${isFavorite ? 'bg-[#FF7F11] border-[#FF7F11] text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-[#FF7F11]'}`}
                      >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={handlePlayRaga} disabled={isPlayingAudio} 
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[#FF7F11] hover:border-[#FF7F11] transition-all"
                      >
                        {isPlayingAudio ? <Activity size={20} className="animate-pulse text-[#FF7F11]" /> : <Play size={20} />}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative">
                <ResultsDisplay detectedRaga={detectedRaga} suggestedChords={suggestedChords} />
                <div className="mt-8 min-h-44 flex items-center">
                  <div className="hidden lg:block w-full">
                    {/* 🌟 Name changed to KeyboardLayout to avoid "Illegal constructor" error */}
                    <KeyboardLayout handleNotePlay={handleNotePlay} sequence={sequence} />
                  </div>
                  <MobileNoteGrid handleNotePlay={handleNotePlay} />
                </div>
              </div>

              <div className="flex justify-center">
                <Button name="Reset Matrix" onClick={() => {setSequence(Array(7).fill("")); setActiveIndex(0);}} icon={RefreshCw} />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}