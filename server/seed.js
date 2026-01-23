require('dotenv').config();
const mongoose = require('mongoose');
const Raga = require('./models/Raga');

// 1. Helper to convert note names to semitone numbers (0-11)
const noteToNum = (note) => {
  const map = { 'C':0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11 };
  return map[note];
};

// 2. YOUR FULL DATASET (72 Melakartas with Chords)
const rawRagaData = [
/* CHAKRA 1 – INDU */
{ name: "Kanakangi", notes: ["C","C#","D","F","G","G#","A"], chords: ["Csus2 (C-D-G)", "Fm/Ab (G#-C-F)", "Ddim (D-F-G#)"] },
{ name: "Ratnangi", notes: ["C","C#","D","F","G","G#","A#"], chords: ["Csus2 (C-D-G)", "Bbm/Db (C#-F-A#)", "G#maj (G#-C)"] },
{ name: "Ganamurti", notes: ["C","C#","D","F","G","G#","B"], chords: ["Csus2 (C-D-G)", "G#aug (G#-C)", "Bdim (B-D-F)"] },
{ name: "Vanaspati", notes: ["C","C#","D","F","G","A","A#"], chords: ["Csus2 (C-D-G)", "Bbmaj (A#-D-F)", "Fmaj (F-A-C)"] },
{ name: "Manavati", notes: ["C","C#","D","F","G","A","B"], chords: ["Csus2 (C-D-G)", "Fmaj (F-A-C)", "Gmaj (G-B-D)"] },
{ name: "Tanarupi", notes: ["C","C#","D","F","G","A#","B"], chords: ["Csus2 (C-D-G)", "Gdim (G-A#)", "Bdim (B-D-F)"] },

/* CHAKRA 2 – NETRA */
{ name: "Senavati", notes: ["C","C#","D#","F","G","G#","A"], chords: ["Cm (C-D#-G)", "Abmaj (G#-C-D#)", "Fm (F-G#-C)"] },
{ name: "Hanumatodi", notes: ["C","C#","D#","F","G","G#","A#"], chords: ["Cm (C-D#-G)", "Abmaj (G#-C-D#)", "Bbm (A#-C#-F)"] },
{ name: "Dhenuka", notes: ["C","C#","D#","F","G","G#","B"], chords: ["Cm (C-D#-G)", "Abmaj (G#-C-D#)", "G#aug (G#-C-E)"] },
{ name: "Natakapriya", notes: ["C","C#","D#","F","G","A","A#"], chords: ["Cm (C-D#-G)", "Bbmaj (A#-D-F)", "Fm (F-G#-C)"] },
{ name: "Kokilapriya", notes: ["C","C#","D#","F","G","A","B"], chords: ["Cm (C-D#-G)", "Bbmaj (A#-D-F)", "Gdim (G-A#)"] },
{ name: "Rupavati", notes: ["C","C#","D#","F","G","A#","B"], chords: ["Cm (C-D#-G)", "Fm (F-G#)", "Bdim (B-D-F)"] },

/* CHAKRA 3 – AGNI */
{ name: "Gayakapriya", notes: ["C","C#","E","F","G","G#","A"], chords: ["Cmaj (C-E-G)", "Fm (F-G#-C)", "Am (A-C-E)"] },
{ name: "Vakulabharanam", notes: ["C","C#","E","F","G","G#","A#"], chords: ["Cmaj (C-E-G)", "Fm (F-G#-C)", "Bbm (A#-C#-F)"] },
{ name: "Mayamalavagowla", notes: ["C","C#","E","F","G","G#","B"], chords: ["Cmaj (C-E-G)", "Fm (F-G#-C)", "Eaug (E-G#)"] },
{ name: "Chakravakam", notes: ["C","C#","E","F","G","A","A#"], chords: ["Cmaj (C-E-G)", "Bbmaj (A#-D-F)", "Fm (F-G#-C)"] },
{ name: "Suryakantam", notes: ["C","C#","E","F","G","A","B"], chords: ["Cmaj (C-E-G)", "Fmaj (F-A-C)", "Gmaj (G-B-D)"] },
{ name: "Hatakambari", notes: ["C","C#","E","F","G","A#","B"], chords: ["Cmaj (C-E-G)", "Fm (F-G#)", "Bbaug (A#-D)"] },

/* CHAKRA 4 – VEDA */
{ name: "Jhankaradhwani", notes: ["C","D","D#","F","G","G#","A"], chords: ["Cm (C-D#-G)", "Abmaj (G#-C-D#)", "Dm (D-F-A)"] },
{ name: "Natabhairavi", notes: ["C","D","D#","F","G","G#","A#"], chords: ["Cm (C-D#-G)", "Abmaj (G#-C-D#)", "Bbmaj (A#-D-F)"] },
{ name: "Keeravani", notes: ["C","D","D#","F","G","G#","B"], chords: ["Cm (C-D#-G)", "Gmaj (G-B-D)", "Abmaj (G#-C-D#)"] },
{ name: "Kharaharapriya", notes: ["C","D","D#","F","G","A","A#"], chords: ["Cm (C-D#-G)", "Bbmaj (A#-D-F)", "Fmaj (F-A-C)"] },
{ name: "Gowrimanohari", notes: ["C","D","D#","F","G","A","B"], chords: ["Cm (C-D#-G)", "Gmaj (G-B-D)", "Fmaj (F-A-C)"] },
{ name: "Varunapriya", notes: ["C","D","D#","F","G","A#","B"], chords: ["Cm (C-D#-G)", "Gdim (G-A#-D)", "Bdim (B-D-F)"] },

/* CHAKRA 5 – BANA */
{ name: "Mararanjani", notes: ["C","D","E","F","G","G#","A"], chords: ["Cmaj (C-E-G)", "Fmaj (F-A-C)", "Dm (D-F-A)"] },
{ name: "Charukesi", notes: ["C","D","E","F","G","G#","A#"], chords: ["Cmaj (C-E-G)", "Fm (F-G#-C)", "Bbmaj (A#-D-F)"] },
{ name: "Sarasangi", notes: ["C","D","E","F","G","G#","B"], chords: ["Cmaj (C-E-G)", "Fm (F-G#-C)", "Eaug (E-G#-C)"] },
{ name: "Harikambhoji", notes: ["C","D","E","F","G","A","A#"], chords: ["Cmaj (C-E-G)", "Bbmaj (A#-D-F)", "Fmaj (F-A-C)"] },
{ name: "Dheerashankarabharanam", notes: ["C","D","E","F","G","A","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "Fmaj (F-A-C)"] },
{ name: "Naganandini", notes: ["C","D","E","F","G","A#","B"], chords: ["Cmaj (C-E-G)", "Fmaj (F-A-C)", "Gdim (G-A#)"] },

/* CHAKRA 6 – RUTU */
{ name: "Yagapriya", notes: ["C","D#","E","F","G","G#","A"], chords: ["Caug (C-E-G#)", "Am (A-C-E)", "Fm/Ab (G#-C-F)"] },
{ name: "Ragavardhani", notes: ["C","D#","E","F","G","G#","A#"], chords: ["Caug (C-E-G#)", "D#maj (D#-G-A#)", "Gm (G-A#-D)"] },
{ name: "Gangeyabhushani", notes: ["C","D#","E","F","G","G#","B"], chords: ["Caug (C-E-G#)", "Emaj (E-G#-B)", "Gmaj (G-B)"] },
{ name: "Vagadheeswari", notes: ["C","D#","E","F","G","A","A#"], chords: ["Cadd9 (C-E-D)", "Fmaj (F-A-C)", "D#maj (D#-G)"] },
{ name: "Soolini", notes: ["C","D#","E","F","G","A","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "Fmaj (F-A-C)"] },
{ name: "Chalanata", notes: ["C","D#","E","F","G","A#","B"], chords: ["Caug (C-E-G#)", "D#maj (D#-G-A#)", "Gdim (G-A#)"] },

/* CHAKRA 7 – RISHI */
{ name: "Salagam", notes: ["C","C#","D","F#","G","G#","A"], chords: ["D#dim (D#-F#)", "Dmaj (D-F#)", "G#maj (G#-C)"] },
{ name: "Jalarnavam", notes: ["C","C#","D","F#","G","G#","A#"], chords: ["C#maj (C#-F)", "A#m (A#-C#)", "G#maj (G#-C)"] },
{ name: "Jhalavarali", notes: ["C","C#","D","F#","G","G#","B"], chords: ["G#aug (G#-C)", "Bdim (B-D)", "C#maj (C#-F)"] },
{ name: "Navaneetam", notes: ["C","C#","D","F#","G","A","A#"], chords: ["Dmaj (D-F#-A)", "Gm (G-A#-D)", "Bbmaj (A#-D)"] },
{ name: "Pavani", notes: ["C","C#","D","F#","G","A","B"], chords: ["Gmaj (G-B-D)", "Dmaj (D-F#-A)", "C#dim (C#-G)"] },
{ name: "Raghupriya", notes: ["C","C#","D","F#","G","A#","B"], chords: ["Gdim (G-A#)", "Bbaug (A#-D)", "C#maj (C#-F)"] },

/* CHAKRA 8 – VASU */
{ name: "Gavambodhi", notes: ["C","C#","D#","F#","G","G#","A"], chords: ["Cm (C-D#-G)", "Abmaj (G#-C-D#)", "F#dim (F#-A-C)"] },
{ name: "Bhavapriya", notes: ["C","C#","D#","F#","G","G#","A#"], chords: ["Cm (C-D#-G)", "Bbm (A#-C#-F)", "Abmaj (G#-C-D#)"] },
{ name: "Subhapantuvarali", notes: ["C","C#","D#","F#","G","G#","B"], chords: ["Cm (C-D#-G)", "Gmaj (G-B-D)", "Abmaj (G#-C-D#)"] },
{ name: "Shadvidhamargini", notes: ["C","C#","D#","F#","G","A","A#"], chords: ["Cm (C-D#-G)", "Dmaj (D-F#-A)", "Gm (G-A#-D)"] },
{ name: "Suvarnangi", notes: ["C","C#","D#","F#","G","A","B"], chords: ["Cm (C-D#-G)", "Gmaj (G-B-D)", "Dmaj (D-F#-A)"] },
{ name: "Divyamani", notes: ["C","C#","D#","F#","G","A#","B"], chords: ["Cm (C-D#-G)", "Gm (G-A#-D)", "Bbaug (A#-D)"] },

/* CHAKRA 9 – BRAHMA */
{ name: "Dhavalambari", notes: ["C","C#","E","F#","G","G#","A"], chords: ["Cmaj (C-E-G)", "F#dim (F#-A-C)", "Abmaj (G#-C)"] },
{ name: "Namanarayani", notes: ["C","C#","E","F#","G","G#","A#"], chords: ["Cmaj (C-E-G)", "Bbm (A#-C#-F)", "C#dim (C#-G)"] },
{ name: "Kamavardhini", notes: ["C","C#","E","F#","G","G#","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "Emaj (E-G#-B)"] },
{ name: "Ramapriya", notes: ["C","C#","E","F#","G","A","A#"], chords: ["Cmaj (C-E-G)", "Dmaj (D-F#-A)", "Gm (G-A#-D)"] },
{ name: "Gamanasrama", notes: ["C","C#","E","F#","G","A","B"], chords: ["Cmaj (C-E-G)", "Dmaj (D-F#-A)", "Gmaj (G-B-D)"] },
{ name: "Viswambari", notes: ["C","C#","E","F#","G","A#","B"], chords: ["Cmaj (C-E-G)", "Emaj (E-G#-B)", "Bbaug (A#-D)"] },

/* CHAKRA 10 – DISHI */
{ name: "Syamalangi", notes: ["C","D","D#","F#","G","G#","A"], chords: ["Cm (C-D#-G)", "F#dim (F#-A-C)", "Dmaj (D-F#-A)"] },
{ name: "Shanmukhapriya", notes: ["C","D","D#","F#","G","G#","A#"], chords: ["Cm (C-D#-G)", "Bbm (A#-C#-F)", "Gm (G-A#-D)"] },
{ name: "Simhendramadhyamam", notes: ["C","D","D#","F#","G","G#","B"], chords: ["Cm (C-D#-G)", "Gmaj (G-B-D)", "Abmaj (G#-C-D#)"] },
{ name: "Hemavati", notes: ["C","D","D#","F#","G","A","A#"], chords: ["Cm (C-D#-G)", "Dmaj (D-F#-A)", "Gm (G-A#-D)"] },
{ name: "Dharmavati", notes: ["C","D","D#","F#","G","A","B"], chords: ["Cm (C-D#-G)", "Gmaj (G-B-D)", "Dmaj (D-F#-A)"] },
{ name: "Neetimati", notes: ["C","D","D#","F#","G","A#","B"], chords: ["Cm (C-D#-G)", "Dmaj (D-F#-A)", "Gdim (G-A#-D)"] },

/* CHAKRA 11 – RUDRA */
{ name: "Kantamani", notes: ["C","D","E","F#","G","G#","A"], chords: ["Cmaj (C-E-G)", "Dmaj (D-F#-A)", "F#dim (F#-A-C)"] },
{ name: "Rishabhapriya", notes: ["C","D","E","F#","G","G#","A#"], chords: ["Cmaj (C-E-G)", "Gm (G-A#-D)", "Dm (D-F)"] },
{ name: "Latangi", notes: ["C","D","E","F#","G","G#","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "Emaj (E-G#-B)"] },
{ name: "Vachaspati", notes: ["C","D","E","F#","G","A","A#"], chords: ["Cmaj (C-E-G)", "Dmaj (D-F#-A)", "Bbmaj (A#-D-F)"] },
{ name: "Mechakalyani", notes: ["C","D","E","F#","G","A","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "Dmaj (D-F#-A)"] },
{ name: "Chitrambari", notes: ["C","D","E","F#","G","A#","B"], chords: ["Cmaj (C-E-G)", "Dmaj (D-F#-A)", "Bbaug (A#-D)"] },

/* CHAKRA 12 – ADITYA */
{ name: "Sucharitra", notes: ["C","D#","E","F#","G","G#","A"], chords: ["Caug (C-E-G#)", "Adim (A-C-D#)", "D#maj (D#-G)"] },
{ name: "Jyotiswaroopini", notes: ["C","D#","E","F#","G","G#","A#"], chords: ["Caug (C-E-G#)", "D#maj (D#-G-A#)", "Gdim (G-A#)"] },
{ name: "Dhatuvardhini", notes: ["C","D#","E","F#","G","G#","B"], chords: ["Caug (C-E-G#)", "Emaj (E-G#-B)", "Gmaj (G-B)"] },
{ name: "Nasikabhooshani", notes: ["C","D#","E","F#","G","A","A#"], chords: ["Caug (C-E-G#)", "D#maj (D#-G-A#)", "F#dim (F#-A-C)"] },
{ name: "Kosalam", notes: ["C","D#","E","F#","G","A","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "D#aug (D#-G-B)"] },
{ name: "Rasikapriya", notes: ["C","D#","E","F#","G","A#","B"], chords: ["Cmaj (C-E-G)", "Gmaj (G-B-D)", "D#maj (D#-G-A#)"] }
];

// 3. Process data to match Schema
const processedData = rawRagaData.map(raga => ({
  name: raga.name,
  notes: raga.notes.map(n => noteToNum(n)),
  suggestedChords: raga.chords // Map your 'chords' array to 'suggestedChords' in schema
}));

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tunex');
    console.log('✅ Connected to MongoDB');

    await Raga.deleteMany({});
    console.log('🧹 Cleared existing Ragas');

    await Raga.insertMany(processedData);
    console.log(`🌱 Successfully added ${processedData.length} Ragas (with Chords!) to DB`);

    mongoose.connection.close();
    console.log('👋 Connection closed');
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

seedDB();