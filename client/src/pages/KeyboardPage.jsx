import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion"; // 🌟 Added Framer Motion
import {
  identifyRaga,
  getSuggestedChords,
  ragaDatabase,
} from "../utils/musicTheory";
import TypographicHeader from "../components/TypographicHeader";
import NoteSequenceDisplay from "../components/NoteSequenceDisplay";
import ResultsDisplay from "../components/ResultsDisplay";
import Button from "../components/Button";
import MobileNoteGrid from "../components/MobileNoteGrid";

const PianoKey = ({ note, type, onClick, isActive }) => {
  const displayLabel = note.replace(/[0-9]/g, "");
  const baseStyle =
    "cursor-pointer select-none transition-colors duration-150 flex items-end justify-center pb-4 outline-none w-full";
  const whiteKey = `h-full rounded-b-xl border-x border-b border-white/10 font-extrabold text-sm ${isActive ? "bg-[#111] border-[#FF7F11] text-[#FF7F11] shadow-[inset_0_-8px_20px_rgba(255,127,17,0.3)]" : "bg-black text-white/40 hover:bg-white/[0.08]"}`;
  const blackKey = `h-full rounded-b-lg border border-white/20 border-t-0 text-[10px] font-extrabold ${isActive ? "bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_8px_20px_rgba(255,127,17,0.5)]" : "bg-[#050505] text-white/70 hover:bg-[#111]"}`;

  return (
    <motion.button
      // 🌟 Added physical press animation
      whileTap={{ scale: 0.96, y: 2 }}
      animate={{ 
        scale: isActive ? 0.98 : 1,
        y: isActive ? 2 : 0
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onClick(note);
      }}
      className={`${baseStyle} ${type === "white" ? whiteKey : blackKey}`}
    >
      {displayLabel}
    </motion.button>
  );
};

const VirtualKeyboard = ({ handleNotePlay, sequence }) => {
  const whiteKeys = [
    "C", "D", "E", "F", "G", "A", "B",
    "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3",
  ];
  const step = 100 / 15;
  const blackKeys = [
    { note: "C#", l: 1 }, { note: "D#", l: 2 },
    { note: "F#", l: 4 }, { note: "G#", l: 5 }, { note: "A#", l: 6 },
    { note: "C2#", l: 8 }, { note: "D2#", l: 9 },
    { note: "F2#", l: 11 }, { note: "G2#", l: 12 }, { note: "A2#", l: 13 },
  ];

  return (
    <div className="w-full h-44 relative flex select-none">
      <div className="flex w-full h-full">
        {whiteKeys.map((n) => (
          <div key={n} className="flex-1 px-px h-full">
            <PianoKey
              type="white"
              note={n}
              onClick={handleNotePlay}
              isActive={sequence.includes(n)}
            />
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 w-full h-[65%] pointer-events-none">
        {blackKeys.map((k) => (
          <div
            key={k.note}
            className="absolute -translate-x-1/2 w-[4%] h-full pointer-events-auto"
            style={{ left: `${step * k.l}%` }}
          >
            <PianoKey
              type="black"
              note={k.note}
              onClick={handleNotePlay}
              isActive={sequence.includes(k.note)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const midiNumberToNote = (midiNumber) => {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midiNumber / 12) - 1;
  const name = notes[midiNumber % 12];

  if (octave === 4) return name;
  if (octave === 5) return `${name}2`;
  if (octave === 6 && name === "C") return "C3";
  return null;
};

export default function KeyboardPage() {
  const [sequence, setSequence] = useState(Array(8).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [detectedRaga, setDetectedRaga] = useState(null);
  const [suggestedChords, setSuggestedChords] = useState([]);
  const [midiConnected, setMidiConnected] = useState(false);

  const keyboardOrder = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    "C2", "C2#", "D2", "D2#", "E2", "F2", "F2#", "G2", "G2#", "A2", "A2#", "B2", "C3",
  ];

  const getKeyboardPosition = (note) => {
    return keyboardOrder.indexOf(note);
  };

  useEffect(() => {
    const validNotes = sequence.filter((n) => n);
    if (validNotes.length < 2) {
      setSuggestedChords([]);
      return;
    }
    try {
      const chords = getSuggestedChords(validNotes);
      setSuggestedChords(chords);
    } catch (e) {
      console.error(e);
      setSuggestedChords([]);
    }
  }, [sequence]);

  useEffect(() => {
    const validNotes = sequence.filter((n) => n);
    if (validNotes.length !== 8) {
      setDetectedRaga(null);
      return;
    }
    try {
      // #region agent log
      fetch(
        "http://127.0.0.1:7670/ingest/40934ea7-f54a-48ac-9e19-8914dd227053",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "57a1fb",
          },
          body: JSON.stringify({
            sessionId: "57a1fb",
            location: "KeyboardPage.jsx:132",
            message: "Calling identifyRaga",
            data: {
              validNotesLength: validNotes.length,
              validNotes: validNotes,
              databaseProvided: !!ragaDatabase,
              databaseType: typeof ragaDatabase,
            },
            timestamp: Date.now(),
            runId: "post-fix",
            hypothesisId: "A",
          }),
        },
      ).catch(() => {});
      console.log("[DEBUG] Calling identifyRaga with:", {
        validNotes,
        ragaDatabase,
      });
      // #endregion
      const raga = identifyRaga(validNotes, ragaDatabase);
      // #region agent log
      fetch(
        "http://127.0.0.1:7670/ingest/40934ea7-f54a-48ac-9e19-8914dd227053",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "57a1fb",
          },
          body: JSON.stringify({
            sessionId: "57a1fb",
            location: "KeyboardPage.jsx:136",
            message: "identifyRaga result",
            data: {
              raga: raga,
              ragaType: typeof raga,
              isString: typeof raga === "string",
              isNull: raga === null,
            },
            timestamp: Date.now(),
            runId: "post-fix",
            hypothesisId: "A",
          }),
        },
      ).catch(() => {});
      console.log("[DEBUG] identifyRaga returned:", raga);
      // #endregion
      setDetectedRaga(raga || "Keep playing...");
    } catch (e) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7670/ingest/40934ea7-f54a-48ac-9e19-8914dd227053",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "57a1fb",
          },
          body: JSON.stringify({
            sessionId: "57a1fb",
            location: "KeyboardPage.jsx:140",
            message: "identifyRaga error",
            data: { error: e.message, errorStack: e.stack },
            timestamp: Date.now(),
            runId: "post-fix",
            hypothesisId: "A",
          }),
        },
      ).catch(() => {});
      // #endregion
      console.error("[DEBUG] identifyRaga error:", e);
      setDetectedRaga("Keep playing...");
    }
  }, [sequence]);

  const updateActiveIndex = useCallback((newSeq) => {
    let firstEmpty = -1;
    for (let i = 0; i < newSeq.length; ++i) {
      if (newSeq[i] === "") {
        firstEmpty = i;
        break;
      }
    }
    setActiveIndex(firstEmpty === -1 ? 7 : firstEmpty);
  }, []);

  const handleNotePlay = useCallback(
    (note) => {
      const isMobileOrTab = window.innerWidth < 1024;
      setSequence((prev) => {
        if (isMobileOrTab) {
          const newSeq = [...prev];
          newSeq[activeIndex] = note;
          setActiveIndex((prevIdx) => (prevIdx < 7 ? prevIdx + 1 : prevIdx));
          return newSeq;
        } else {
          const existingIndex = prev.findIndex((n) => n === note);
          if (existingIndex !== -1) {
            const currentNotes = prev.filter((n) => n !== "" && n !== note);
            const newSeq = Array(8).fill("");
            currentNotes.forEach((n, idx) => {
              newSeq[idx] = n;
            });
            const firstEmpty = newSeq.findIndex((n) => n === "");
            setActiveIndex(firstEmpty === -1 ? 7 : firstEmpty);
            return newSeq;
          }
          const currentNotes = prev.filter((n) => n !== "");
          if (currentNotes.length >= 8) return prev;
          const sortedNotes = [...currentNotes, note].sort(
            (a, b) => getKeyboardPosition(a) - getKeyboardPosition(b),
          );
          const newSeq = Array(8).fill("");
          sortedNotes.forEach((n, idx) => {
            newSeq[idx] = n;
          });
          const firstEmpty = newSeq.findIndex((n) => n === "");
          setActiveIndex(firstEmpty === -1 ? 7 : firstEmpty);
          return newSeq;
        }
      });
    },
    [activeIndex, getKeyboardPosition],
  );

  const handleBackspace = useCallback(() => {
    setSequence((prev) => {
      let idxToClear = -1;
      let firstEmpty = prev.findIndex((n) => n === "");
      if (firstEmpty === -1) {
        idxToClear = prev.length - 1;
      } else {
        idxToClear = firstEmpty - 1;
      }
      if (idxToClear < 0) idxToClear = 0;
      const newSeq = [...prev];
      newSeq[idxToClear] = "";
      updateActiveIndex(newSeq);
      return newSeq;
    });
  }, [updateActiveIndex]);

  useEffect(() => {
    const onKD = (e) => {
      if (e.key === "Backspace") handleBackspace();
    };
    window.addEventListener("keydown", onKD);
    return () => window.removeEventListener("keydown", onKD);
  }, [handleBackspace]);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) return;
    const onMIDISuccess = (midi) => {
      const checkConnections = () => {
        const inputs = Array.from(midi.inputs.values());
        const hasDevice = inputs.some((input) => input.state === "connected");
        setMidiConnected(hasDevice);
      };
      checkConnections();
      midi.inputs.forEach((input) => {
        input.onmidimessage = (message) => {
          const [status, noteNumber, velocity] = message.data;
          if (status === 144 && velocity > 0) {
            const noteName = midiNumberToNote(noteNumber);
            if (noteName) handleNotePlay(noteName);
          }
        };
      });
      midi.onstatechange = () => checkConnections();
    };
    navigator
      .requestMIDIAccess()
      .then(onMIDISuccess)
      .catch(() => setMidiConnected(false));
  }, [handleNotePlay]);

  // 🌟 Main Layout Animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  return (
    <div className="w-full bg-black flex flex-col lg:h-[calc(100vh-96px)] lg:overflow-hidden text-white font-sans">
      <main className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto lg:overflow-hidden">
        
        {/* 🌟 Animated Main Wrapper */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-325 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 lg:p-10 h-auto lg:h-fit flex flex-col relative overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[28%_72%] gap-8">
            
            {/* 🌟 Animated Sidebar/Header */}
            <motion.div variants={itemVariants} className="flex items-center border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-8">
              <TypographicHeader midiConnected={midiConnected} />
            </motion.div>
            
            <div className="flex flex-col justify-between py-2 space-y-6">
              
              {/* 🌟 Animated Note Sequence */}
              <motion.div variants={itemVariants}>
                <NoteSequenceDisplay
                  sequence={sequence}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </motion.div>

              {/* 🌟 Animated App Dashboard (Results + Keyboard) */}
              <motion.div variants={itemVariants} className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col">
                <ResultsDisplay
                  detectedRaga={detectedRaga}
                  suggestedChords={suggestedChords}
                />

                <div className="mt-8 w-full min-h-44 flex items-center">
                  <div className="hidden lg:block w-full">
                    <VirtualKeyboard
                      handleNotePlay={handleNotePlay}
                      sequence={sequence}
                    />
                  </div>
                  <MobileNoteGrid handleNotePlay={handleNotePlay} />
                </div>
              </motion.div>

              {/* 🌟 Animated Button Array */}
              <motion.div variants={itemVariants} className="flex justify-center">
                <Button
                  name="Reset"
                  onClick={() => {
                    const resetSeq = Array(8).fill("");
                    setSequence(resetSeq);
                    setActiveIndex(0);
                  }}
                  icon={RefreshCw}
                />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}