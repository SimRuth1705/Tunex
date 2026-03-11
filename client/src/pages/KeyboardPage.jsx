import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
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
import { API_BASE_URL } from "../config";

const PianoKey = ({ note, type, onClick, isActive }) => {
  const displayLabel = note.replace(/[0-9]/g, "");
  const baseStyle =
    "cursor-pointer select-none transition-all duration-150 flex items-end justify-center pb-4 outline-none w-full";
  const whiteKey = `h-full rounded-b-xl border-x border-b border-white/10 font-extrabold text-sm ${isActive ? "bg-[#111] border-[#FF7F11] text-[#FF7F11] shadow-[inset_0_-8px_20px_rgba(255,127,17,0.3)]" : "bg-black text-white/40 hover:bg-white/[0.08]"}`;
  const blackKey = `h-full rounded-b-lg border border-white/20 border-t-0 text-[10px] font-extrabold ${isActive ? "bg-[#FF7F11] border-[#FF7F11] text-black shadow-[0_8px_20px_rgba(255,127,17,0.5)]" : "bg-[#050505] text-white/70 hover:bg-[#111]"}`;

  return (
    <button
      onMouseDown={(e) => {
        e.stopPropagation();
        onClick(note);
      }}
      className={`${baseStyle} ${type === "white" ? whiteKey : blackKey}`}
    >
      {displayLabel}
    </button>
  );
};

const VirtualKeyboard = ({ handleNotePlay, sequence }) => {
  const whiteKeys = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "C2",
    "D2",
    "E2",
    "F2",
    "G2",
    "A2",
    "B2",
    "C3",
  ];
  const step = 100 / 15;
  const blackKeys = [
    { note: "C#", l: 1 },
    { note: "D#", l: 2 },
    { note: "F#", l: 4 },
    { note: "G#", l: 5 },
    { note: "A#", l: 6 },
    { note: "C2#", l: 8 },
    { note: "D2#", l: 9 },
    { note: "F2#", l: 11 },
    { note: "G2#", l: 12 },
    { note: "A2#", l: 13 },
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
  const notes = [
    "C","C#","D","D#","E","F",
    "F#","G","G#","A","A#","B"
  ];

  const octave = Math.floor(midiNumber / 12) - 1;
  const name = notes[midiNumber % 12];

  // Normalize everything into your 3-octave layout
  if (octave <= 4) return name;       // map lower to first octave
  if (octave === 5) return name + "2";
  if (octave >= 6) return name + "3";

  return null;
};

export default function KeyboardPage() {
  const [sequence, setSequence] = useState(Array(7).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [detectedRaga, setDetectedRaga] = useState(null);
  const [suggestedChords, setSuggestedChords] = useState([]);
  const [midiConnected, setMidiConnected] = useState(false);
  const [ragaDb, setRagaDb] = useState([]);

  useEffect(() => {
    const fetchRagas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ragas`);
        if (response.ok) {
          const data = await response.json();
          setRagaDb(data);
        }
      } catch (err) {
        console.error("Failed to fetch Ragas from backend:", err);
      }
    };
    fetchRagas();
  }, []);

  // Define keyboard order (left to right)
  const keyboardOrder = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    "C2",
    "C2#",
    "D2",
    "D2#",
    "E2",
    "F2",
    "F2#",
    "G2",
    "G2#",
    "A2",
    "A2#",
    "B2",
    "C3",
  ];

  // Get the keyboard position of a note
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

    if (validNotes.length !== 7) {
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
      const raga = identifyRaga(validNotes, ragaDb.length > 0 ? ragaDb : ragaDatabase);
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
      
      if (raga) {
        const ragaName = raga["Raga Name"] || raga.name;
        setDetectedRaga(ragaName);
        
        // Extract chords if they exist in the backend data
        const chords = [];
        if (raga["Chord 1 (Notes)"]) chords.push(raga["Chord 1 (Notes)"]);
        if (raga["Chord 2 (Notes)"]) chords.push(raga["Chord 2 (Notes)"]);
        if (raga["Chord 3 (Notes)"]) chords.push(raga["Chord 3 (Notes)"]);
        
        if (chords.length > 0) {
          setSuggestedChords(chords);
        }
      } else {
        setDetectedRaga("Keep playing...");
      }
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

  // REWRITE: "activeIndex" should always point to the first empty box,
  // but MUST ALWAYS be the lowest available index (meaning: if there are multiple empty boxes at low indices, do not skip over any)
  const updateActiveIndex = useCallback((newSeq) => {
    // Find the lowest index that is currently empty
    let firstEmpty = -1;
    for (let i = 0; i < newSeq.length; ++i) {
      if (newSeq[i] === "") {
        firstEmpty = i;
        break;
      }
    }
    // If full, keep the index at 7 (last box)
    setActiveIndex(firstEmpty === -1 ? 6 : firstEmpty);
  }, []);


const handleNotePlay = React.useCallback(
  (note, source = "keyboard") => {

const isInsertMode = source === "button";
const isMidi = source === "midi";

    setSequence((prev) => {

  const currentNotes = prev.filter((n) => n !== "");

  // ---------------------------
  // 📱 MOBILE INSERT MODE
  // ---------------------------
  if (isInsertMode) {

    if (currentNotes.length >= 7) return prev;

    const newSeq = [...currentNotes, note];

    while (newSeq.length < 7) {
      newSeq.push("");
    }

    return newSeq;
  }

  // ---------------------------
  // 🎹 MIDI MODE (NO TOGGLE)
  // ---------------------------
  if (isMidi) {

    if (currentNotes.length >= 7) return prev;

    const sortedNotes = [...currentNotes, note].sort(
      (a, b) => getKeyboardPosition(a) - getKeyboardPosition(b)
    );

    const newSeq = [...sortedNotes];

    while (newSeq.length < 7) {
      newSeq.push("");
    }

    return newSeq;
  }

  // ---------------------------
  // 🖱 VIRTUAL KEYBOARD MODE (TOGGLE)
  // ---------------------------

  const existingIndex = prev.findIndex((n) => n === note);

  if (existingIndex !== -1) {
    const newSeq = [...prev];
    newSeq[existingIndex] = "";

    const compacted = newSeq.filter((n) => n !== "");

    while (compacted.length < 7) {
      compacted.push("");
    }

    return compacted;
  }

  if (currentNotes.length >= 7) return prev;

  const sortedNotes = [...currentNotes, note].sort(
    (a, b) => getKeyboardPosition(a) - getKeyboardPosition(b)
  );

  const newSeq = [...sortedNotes];

  while (newSeq.length < 7) {
    newSeq.push("");
  }

  return newSeq;
});
  },
  [getKeyboardPosition]
);

const handleBackspace = useCallback(() => {
    setSequence((prev) => {
      // Remove the note at the last filled index (rightmost non-empty box before first empty, or last index if full)
      let idxToClear = -1;
      // (1) If not full: find the last filled index before the first empty box
      let firstEmpty = prev.findIndex((n) => n === "");
      if (firstEmpty === -1) {
        // All filled, so start from right
        idxToClear = prev.length - 1;
      } else {
        // Go back to last filled index before first empty (if any)
        idxToClear = firstEmpty - 1;
      }
      // Ensure bounds
      if (idxToClear < 0) idxToClear = 0;
      const newSeq = [...prev];
      newSeq[idxToClear] = "";
      updateActiveIndex(newSeq);
      return newSeq;
    });
  }, [updateActiveIndex]);

  // ✅ Keep this (Backspace listener)
useEffect(() => {
  const onKD = (e) => {
    if (e.key === "Backspace") handleBackspace();
  };
  window.addEventListener("keydown", onKD);
  return () => window.removeEventListener("keydown", onKD);
}, [handleBackspace]);


// ✅ 1️⃣ Create ref
const handleNoteRef = React.useRef(handleNotePlay);


// ✅ 2️⃣ Keep ref updated (VERY IMPORTANT)
useEffect(() => {
  handleNoteRef.current = handleNotePlay;
}, [handleNotePlay]);

const activeMidiNotesRef = React.useRef(new Set());


useEffect(() => {
  if (!navigator.requestMIDIAccess) {
    console.log("Web MIDI not supported");
    return;
  }

  navigator.requestMIDIAccess().then((midiAccess) => {

    const connectInputs = () => {
      let hasDevice = false;

      for (let input of midiAccess.inputs.values()) {
        hasDevice = true;

        input.onmidimessage = (message) => {
          const [status, noteNumber, velocity] = message.data;

          const noteName = midiNumberToNote(noteNumber);
          if (!noteName) return;

          // -------------------
          // NOTE ON
          // -------------------
          if (status === 144 && velocity > 0) {

            // Ignore if already pressed
            if (activeMidiNotesRef.current.has(noteName)) return;

            activeMidiNotesRef.current.add(noteName);

            handleNoteRef.current(noteName, "midi");
          }

          // -------------------
          // NOTE OFF
          // -------------------
          if (status === 128 || (status === 144 && velocity === 0)) {
            activeMidiNotesRef.current.delete(noteName);
          }
        };
      }

      setMidiConnected(hasDevice);
    };

    connectInputs();

    midiAccess.onstatechange = () => {
      connectInputs();
    };
  });
}, []);


  return (
    <div className="w-full bg-black flex flex-col lg:h-[calc(100vh-96px)] lg:overflow-hidden text-white font-sans">
      <main className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-325 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 lg:p-10 h-auto lg:h-fit flex flex-col relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[28%_72%] gap-8">
            <div className="flex items-center border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-8">
              <TypographicHeader midiConnected={midiConnected} />
            </div>
            <div className="flex flex-col justify-between py-2 space-y-6">
              <NoteSequenceDisplay
                sequence={sequence}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />

              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col">
                <ResultsDisplay
                  detectedRaga={detectedRaga}
                  suggestedChords={suggestedChords}
                />

                <div className="mt-8 w-full min-h-44 flex items-center">
                  {/* Desktop Keyboard */}
                  <div className="hidden lg:block w-full">
                    <VirtualKeyboard
                      handleNotePlay={handleNotePlay}
                      sequence={sequence}
                    />
                  </div>
                  {/* Mobile Grid */}
                  <MobileNoteGrid handleNotePlay={handleNotePlay} />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  name="Reset"
                  onClick={() => {
                    const resetSeq = Array(7).fill("");
                    setSequence(resetSeq);
                    setActiveIndex(0);
                  }}
                  icon={RefreshCw}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}