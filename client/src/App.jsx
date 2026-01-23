import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import PianoKey from './components/PianoKey';
import { identifyRaga, identifyChord } from './utils/musicTheory';

export default function App() {
  const [sequence, setSequence] = useState([]);
  const [detectedRaga, setDetectedRaga] = useState(null);
  const [detectedChord, setDetectedChord] = useState(null);
  const [suggestedChords, setSuggestedChords] = useState([]); // New state for backend chords
  const [activeKey, setActiveKey] = useState(null);
  
  // Store the database data here
  const [ragaDatabase, setRagaDatabase] = useState([]);

  // 1. FETCH DATA FROM BACKEND ON LOAD
  useEffect(() => {
    fetch('http://localhost:5000/api/ragas')
      .then(res => res.json())
      .then(data => {
        console.log("Loaded Ragas:", data.length);
        setRagaDatabase(data);
      })
      .catch(err => console.error("Failed to load ragas:", err));
  }, []);

  const handleNotePlay = (note) => {
    setActiveKey(note);
    setTimeout(() => setActiveKey(null), 200);
    const newSequence = [...sequence, note];
    if (newSequence.length > 8) newSequence.shift(); 
    setSequence(newSequence);
  };

  const handleReset = () => {
    setSequence([]);
    setDetectedRaga(null);
    setDetectedChord(null);
    setSuggestedChords([]);
  };

  // 2. DETECT RAGA USING FETCHED DATA
  useEffect(() => {
    if (sequence.length > 0) {
      // Pass the ragaDatabase to the detection function
      const ragaResult = identifyRaga(sequence, ragaDatabase);
      
      if (ragaResult && typeof ragaResult === 'object') {
        setDetectedRaga(ragaResult.name);
        setSuggestedChords(ragaResult.chords || []);
      } else {
        setDetectedRaga(ragaResult);
        setSuggestedChords([]);
      }

      // Keep the simple triad detection as a fallback/instant check
      setDetectedChord(identifyChord(sequence));
    } else {
      setDetectedRaga(null);
      setDetectedChord(null);
      setSuggestedChords([]);
    }
  }, [sequence, ragaDatabase]);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center py-10 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#6b46c1] mb-2">TuneX</h1>
        <p className="text-gray-500">Play notes to discover ragas and chords</p>
      </div>

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-8 md:p-12 flex flex-col items-center">
        
        {/* Note Sequence */}
        <div className="w-full flex flex-col items-center mb-10">
          <span className="text-gray-500 text-sm mb-3">Note Sequence</span>
          <div className="flex gap-2 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-10 h-10 md:w-14 md:h-14 border rounded-lg flex items-center justify-center text-lg font-bold text-gray-700
                  ${sequence[i] ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-transparent'}`}
              >
                {sequence[i] || ''}
              </div>
            ))}
          </div>
        </div>

        {/* Detected Raga */}
        <div className="text-center mb-8 h-16">
          <span className="text-gray-500 text-sm block mb-1">Detected Carnatic Raga</span>
          <h2 className={`text-2xl md:text-3xl font-bold transition-all ${detectedRaga ? 'text-gray-800' : 'text-gray-400'}`}>
            {detectedRaga || "Play notes to detect..."}
          </h2>
        </div>

        {/* Suggested Chords Display */}
        <div className="text-center mb-12 min-h-12">
          <span className="text-gray-500 text-sm block mb-1">Suggested Chords</span>
          
          {/* Priority: Show Database Chords first, then calculated Triads */}
          {suggestedChords.length > 0 ? (
            <div className="flex gap-2 justify-center flex-wrap">
              {suggestedChords.map((chord, idx) => (
                <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {chord}
                </span>
              ))}
            </div>
          ) : (
            <p className={`text-lg transition-all ${detectedChord ? 'text-[#6b46c1] font-semibold' : 'text-gray-400'}`}>
              {detectedChord || "Chords will appear here..."}
            </p>
          )}
        </div>

        <hr className="w-full border-gray-100 mb-10" />

        {/* Virtual Keyboard */}
        <div className="w-full flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-4">Virtual Keyboard</span>
          <div className="relative flex justify-center select-none">
            {/* White Keys */}
            <div className="flex">
               {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'].map((note, i) => (
                 <PianoKey key={i} type="white" note={note} label={note} onClick={handleNotePlay} isActive={activeKey === note} />
               ))}
            </div>
            {/* Black Keys */}
            <div className="absolute top-0 left-0 flex h-0">
               <div className="absolute left-9.5"><PianoKey type="black" note="C#" label="C#" onClick={handleNotePlay} isActive={activeKey === 'C#'}/></div>
               <div className="absolute left-23.5"><PianoKey type="black" note="D#" label="D#" onClick={handleNotePlay} isActive={activeKey === 'D#'}/></div>
               <div className="absolute left-51.5"><PianoKey type="black" note="F#" label="F#" onClick={handleNotePlay} isActive={activeKey === 'F#'}/></div>
               <div className="absolute left-65.5"><PianoKey type="black" note="G#" label="G#" onClick={handleNotePlay} isActive={activeKey === 'G#'}/></div>
               <div className="absolute left-79.5"><PianoKey type="black" note="A#" label="A#" onClick={handleNotePlay} isActive={activeKey === 'A#'}/></div>
            </div>
          </div>
        </div>

        <button onClick={handleReset} className="mt-12 bg-[#5d3fd3] hover:bg-[#4c32b3] text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-purple-200 transition-colors flex items-center gap-2">
          <RefreshCw size={18} /> Reset
        </button>

      </div>
    </div>
  );
}