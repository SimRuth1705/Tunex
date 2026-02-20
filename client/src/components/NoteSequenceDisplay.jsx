const NoteSequenceDisplay = ({ sequence, activeIndex, setActiveIndex }) => {
  return (
    <div className="w-full flex flex-col items-center shrink-0">
      <span className="text-gray-500 text-[10px] md:text-xs mb-3 uppercase tracking-widest font-semibold">Note Sequence</span>
      <div className="flex gap-2 justify-center w-full max-w-md">
        {sequence.map((note, i) => (
          <div 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`flex-1 aspect-square max-w-11.25 border rounded-xl flex items-center justify-center text-sm md:text-lg font-bold transition-all duration-300 cursor-pointer
              ${note ? 'border-[#FF7F11] bg-[#FF7F11]/10 text-[#FF7F11]' : 'border-gray-800 bg-gray-900/50 text-transparent'}
              ${activeIndex === i ? 'border-white ring-2 ring-[#FF7F11]/50 bg-white/5' : ''}`} // Added ring for clarity
          >
            {note ? note.replace(/[0-9]/g, '') : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteSequenceDisplay;