// A dictionary of common chords for real-time suggestions
const chordDictionary = [
  { name: 'C Major', notes: ['C', 'E', 'G'] },
  { name: 'C Minor', notes: ['C', 'D#', 'G'] },
  { name: 'D Major', notes: ['D', 'F#', 'A'] },
  { name: 'D Minor', notes: ['D', 'F', 'A'] },
  { name: 'E Major', notes: ['E', 'G#', 'B'] },
  { name: 'E Minor', notes: ['E', 'G', 'B'] },
  { name: 'F Major', notes: ['F', 'A', 'C'] },
  { name: 'G Major', notes: ['G', 'B', 'D'] },
  { name: 'A Major', notes: ['A', 'C#', 'E'] },
  { name: 'A Minor', notes: ['A', 'C', 'E'] },
  { name: 'B Dim', notes: ['B', 'D', 'F'] },
];

// A dictionary of common Carnatic ragas
export const ragaDatabase = [
  { name: 'Shankarabharanam', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { name: 'Kalyani', notes: ['F', 'G', 'A', 'B', 'C', 'D', 'E'] },
  { name: 'Harikambhoji', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'A#'] },
  { name: 'Kharaharapriya', notes: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'] },
  { name: 'Natabhairavi', notes: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A'] },
  { name: 'Mayamalavagowla', notes: ['C', 'C#', 'E', 'F', 'G', 'G#', 'B'] },
];

export const getSuggestedChords = (activeNotes) => {
  if (!activeNotes || activeNotes.length === 0) return [];
  const cleanNotes = activeNotes.map(n => n.replace(/[0-9]/g, ''));
  const possibleChords = chordDictionary.filter(chord => {
    return cleanNotes.every(userNote => chord.notes.includes(userNote));
  });
  return possibleChords.map(c => c.name).slice(0, 4);
};

export const identifyRaga = (sequence, database) => {
  // #region agent log
  fetch('http://127.0.0.1:7670/ingest/40934ea7-f54a-48ac-9e19-8914dd227053',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'57a1fb'},body:JSON.stringify({sessionId:'57a1fb',location:'musicTheory.js:32',message:'identifyRaga called',data:{sequenceLength:sequence?.length,databaseType:typeof database,databaseIsUndefined:database === undefined,databaseIsNull:database === null,databaseLength:database?.length},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  if (!sequence || !sequence.length || !database || !database.length) return null;
  const cleanSequence = [...new Set(sequence.map(n => n.replace(/[0-9]/g, '')))];
  const match = database.find(raga => 
    cleanSequence.every(note => raga.notes.includes(note))
  );
  // #region agent log
  fetch('http://127.0.0.1:7670/ingest/40934ea7-f54a-48ac-9e19-8914dd227053',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'57a1fb'},body:JSON.stringify({sessionId:'57a1fb',location:'musicTheory.js:38',message:'identifyRaga returning',data:{matchFound:!!match,matchName:match?.name,returnValue:match ? match.name : "Keep playing..."},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return match ? match.name : "Keep playing...";
};

export const identifyChord = (notes) => {
  if (notes.length < 3) return null;
  const clean = notes.map(n => n.replace(/[0-9]/g, ''));
  const match = chordDictionary.find(c => 
    c.notes.length === clean.length && clean.every(n => c.notes.includes(n))
  );
  return match ? match.name : null;
};