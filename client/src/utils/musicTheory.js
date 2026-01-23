export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const getNoteIndex = (noteName) => NOTES.indexOf(noteName);

export const identifyRaga = (playedNotes, ragaDatabase) => {
  if (playedNotes.length < 3 || !ragaDatabase) return null;

  const uniqueIndices = [...new Set(playedNotes.map(n => getNoteIndex(n)))].sort((a, b) => a - b);
  
  const matches = ragaDatabase.filter(raga => {
    return uniqueIndices.every(noteIdx => raga.notes.includes(noteIdx));
  });

  if (matches.length === 0) return "Unknown / Mixed";

  const exactMatch = matches.find(m => m.notes.length === uniqueIndices.length);
  
  if (exactMatch) {
    return { name: exactMatch.name, chords: exactMatch.suggestedChords };
  }

  return { name: matches[0].name, chords: matches[0].suggestedChords };
};

export const identifyChord = (playedNotes) => {
  if (playedNotes.length < 3) return null;
  const unique = [...new Set(playedNotes)].slice(-3);
  if (unique.length < 3) return null;
  
  const root = unique[0];
  const rootIdx = getNoteIndex(root);
  const intervals = unique.map(n => {
    let idx = getNoteIndex(n);
    if (idx < rootIdx) idx += 12; 
    return idx - rootIdx;
  }).sort((a, b) => a - b);

  if (JSON.stringify(intervals) === JSON.stringify([0, 4, 7])) return `${root} Major`;
  if (JSON.stringify(intervals) === JSON.stringify([0, 3, 7])) return `${root} Minor`;
  if (JSON.stringify(intervals) === JSON.stringify([0, 3, 6])) return `${root} Dim`;

  return null;
};