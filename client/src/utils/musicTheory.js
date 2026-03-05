// A dictionary of common chords for real-time suggestions 
// (You can eventually move this to MongoDB too!)
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

// Fallback database in case cloud fetch fails
export const ragaDatabase = [
  { name: 'Shankarabharanam', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { name: 'Kalyani', notes: ['F', 'G', 'A', 'B', 'C', 'D', 'E'] },
  { name: 'Harikambhoji', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'A#'] },
  { name: 'Kharaharapriya', notes: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A#'] },
  { name: 'Natabhairavi', notes: ['C', 'C#', 'D#', 'F', 'G', 'G#', 'A'] },
  { name: 'Mayamalavagowla', notes: ['C', 'C#', 'E', 'F', 'G', 'G#', 'B'] },
];

/**
 * Suggests chords that contain the notes currently being played.
 */
export const getSuggestedChords = (activeNotes) => {
  if (!activeNotes || activeNotes.length === 0) return [];
  
  // Remove octave numbers (e.g., 'C2' -> 'C')
  const cleanNotes = activeNotes
    .filter(n => n !== "")
    .map(n => n.replace(/[0-9]/g, ''));
    
  if (cleanNotes.length === 0) return [];

  const possibleChords = chordDictionary.filter(chord => {
    // Check if the user's notes are a subset of the chord's notes
    return cleanNotes.every(userNote => chord.notes.includes(userNote));
  });

  return possibleChords.map(c => c.name).slice(0, 4);
};

/**
 * Identifies a Raga from the sequence by checking against the Cloud Database.
 * Supports both local {notes: []} and MongoDB {"Scale (Notes)": "C, D..."} formats.
 */
export const identifyRaga = (sequence, database) => {
  if (!sequence || !database || database.length === 0) return null;

  // Clean the user input: unique notes only, no octaves
  const cleanSequence = [...new Set(
    sequence
      .filter(n => n !== "")
      .map(n => n.replace(/[0-9]/g, ''))
  )];

  if (cleanSequence.length < 3) return null;

  const match = database.find(raga => {
    // 🌟 SUPPORT CLOUD FORMAT: "C, D, E..." string
    let ragaNotes = [];
    
    if (raga["Scale (Notes)"]) {
      ragaNotes = raga["Scale (Notes)"].split(', ').map(n => n.trim());
    } else if (raga.notes) {
      ragaNotes = raga.notes;
    }

    // Match if every note played by user exists in the Raga scale
    return cleanSequence.every(note => ragaNotes.includes(note));
  });

  // Return the full object if found (so KeyboardPage can use the name and metadata)
  return match || null;
};

/**
 * Identifies a specific chord if exactly 3+ notes match.
 */
export const identifyChord = (notes) => {
  if (!notes || notes.length < 3) return null;
  
  const clean = [...new Set(notes.map(n => n.replace(/[0-9]/g, '')))];
  
  const match = chordDictionary.find(c => 
    c.notes.length === clean.length && 
    clean.every(n => c.notes.includes(n))
  );
  
  return match ? match.name : null;
};