import React from 'react';

const ResultsDisplay = ({ detectedRaga, suggestedChords }) => {
  return (
    <div className="w-full flex flex-row items-center justify-between text-center divide-x divide-white/5">
      {/* Raga Section - Minimal padding */}
      <div className="flex-1 flex flex-col px-2 min-w-0">
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-1">
          Carnatic Raga
        </span>
        <div className="text-base lg:text-xl font-bold text-[#FF7F11] truncate">
          {detectedRaga || "Listening..."}
        </div>
      </div>

      {/* Chords Section - Minimal padding */}
      <div className="flex-1 flex flex-col px-2 min-w-0">
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold mb-1">
          Suggested Chords
        </span>
        <div className="text-xs lg:text-sm font-medium text-gray-400 flex flex-wrap justify-center gap-2">
          {suggestedChords?.length > 0 ? (
            suggestedChords.map((chord, i) => (
              <span key={i} className="bg-[#FF7F11]/10 px-2 py-0.5 rounded border border-[#FF7F11]/20 text-[#FF7F11] whitespace-nowrap font-mono text-[10px]">
                {chord}
              </span>
            ))
          ) : (
            <span className="text-gray-700 italic">No harmonic matches...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;