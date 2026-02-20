import React, { useState } from 'react';

const cleanMobileNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C2'];

const MobileNoteGrid = ({ handleNotePlay }) => {
  const [flashingNote, setFlashingNote] = useState(null);

  const handlePress = (note) => {
    setFlashingNote(note);
    handleNotePlay(note, 'button');
    setTimeout(() => setFlashingNote(null), 150);
  };

  return (
    <div className="w-full flex lg:hidden flex-col items-center mt-2 px-6">
      <span className="text-gray-500 text-[10px] mb-4 tracking-widest uppercase font-semibold opacity-60">
        Tap to Add Note
      </span>
      
      {/* Reduced gap and max-width to make buttons smaller */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-70">
        {cleanMobileNotes.map((note) => (
          <button
            key={note}
            onMouseDown={() => handlePress(note)}
            className={`aspect-square rounded-xl font-bold text-base transition-all duration-75 border select-none outline-none flex items-center justify-center
              ${flashingNote === note 
                ? 'bg-[#FF7F11] border-[#FF7F11] text-black scale-90 shadow-[0_0_15px_#FF7F11]' 
                : 'bg-[#0a0a0a] border-gray-800 text-gray-400 active:border-gray-600'
              }`}
          >
            {note.replace(/[0-9]/g, '')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNoteGrid;