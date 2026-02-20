import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Target, X, Loader2 } from 'lucide-react';

export default function RagaExplorer() {
  const [activeFilters, setActiveFilters] = useState({ jati: '', prahar: '', rasa: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [ragas, setRagas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch from MongoDB (via your API)
  useEffect(() => {
    const fetchRagas = async () => {
      setLoading(true);
      try {
        // Construct query params
        const params = new URLSearchParams({
          ...activeFilters,
          search: searchQuery
        }).toString();
        
        const response = await fetch(`/api/ragas?${params}`);
        const data = await response.json();
        setRagas(data);
      } catch (error) {
        console.error("Database fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchRagas, 300); // Prevent spamming DB
    return () => clearTimeout(debounce);
  }, [activeFilters, searchQuery]);

  const toggleFilter = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      {/* HUGE HEADER (Improved opacity and placement) */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden mb-12">
        <h1 className="text-[12vw] font-black uppercase tracking-tighter opacity-[0.05] absolute">
          {activeFilters.jati || "Archive"}
        </h1>
        <div className="z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black italic">EXPLORE<span className="text-[#FF7F11]">.</span></h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px w-8 bg-[#FF7F11]"></div>
            <span className="text-gray-500 tracking-[0.3em] text-[9px] font-bold uppercase">
              {ragas.length} Ragas Discovered
            </span>
            <div className="h-px w-8 bg-[#FF7F11]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* SEARCH & CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#FF7F11]/40 transition-all"
              placeholder="Search by name, notes, or melakarta..."
            />
          </div>
          {Object.values(activeFilters).some(v => v !== '') && (
            <button 
              onClick={() => setActiveFilters({ jati: '', prahar: '', rasa: '' })}
              className="px-6 py-2 text-xs font-bold text-[#FF7F11] border border-[#FF7F11]/20 rounded-2xl hover:bg-[#FF7F11]/10 transition-all flex items-center gap-2"
            >
              <X size={14}/> Clear Filters
            </button>
          )}
        </div>

        {/* FILTER CATEGORIES (The Layout you liked) */}
        <div className="space-y-4 mb-16">
          <CategoryRow title="Note Count" active={activeFilters.jati}>
            {['Audava', 'Shadava', 'Sampurna'].map(t => (
              <FilterPill 
                key={t} label={t} 
                isActive={activeFilters.jati === t} 
                onClick={() => toggleFilter('jati', t)} 
              />
            ))}
          </CategoryRow>

          <CategoryRow title="Time Period" active={activeFilters.prahar}>
            {['Morning', 'Afternoon', 'Evening', 'Night'].map(t => (
              <FilterPill 
                key={t} label={t} 
                isActive={activeFilters.prahar === t} 
                onClick={() => toggleFilter('prahar', t)} 
              />
            ))}
          </CategoryRow>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <Loader2 className="animate-spin mb-4" size={32} />
            <span className="text-xs uppercase tracking-widest">Querying MongoDB...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ragas.map(raga => <RagaCard key={raga._id} raga={raga} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components for cleaner code
const CategoryRow = ({ title, active, children }) => (
  <div className="flex flex-col lg:flex-row gap-4">
    <div className="lg:w-1/3 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
      <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
      <span className="text-[#FF7F11] font-mono text-[10px]">{active || 'All'}</span>
    </div>
    <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-3">
      {children}
    </div>
  </div>
);

const FilterPill = ({ label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
      isActive ? 'bg-[#FF7F11] border-[#FF7F11] text-black shadow-lg shadow-[#FF7F11]/20' : 'bg-[#050505] border-white/5 text-gray-500 hover:border-white/20'
    }`}
  >
    {label}
  </button>
);

const RagaCard = ({ raga }) => (
  <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-4xl hover:border-[#FF7F11]/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-xl font-bold group-hover:text-[#FF7F11] transition-colors">{raga.name}</h4>
      <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] text-gray-500 uppercase font-bold">{raga.jati}</span>
    </div>
    <div className="flex gap-1 mb-4 h-10 items-end">
       {/* Mock Visual DNA */}
       {[...Array(7)].map((_, i) => <div key={i} className="flex-1 bg-white/5 rounded-t-sm group-hover:bg-[#FF7F11]/20 transition-all" style={{height: `${Math.random() * 100}%`}} />)}
    </div>
    <button className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
      View Scales
    </button>
  </div>
);