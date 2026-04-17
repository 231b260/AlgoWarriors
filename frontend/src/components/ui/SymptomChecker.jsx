import React, { useState, useEffect, useMemo } from 'react';
import { analyzeSymptoms } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, Activity, AlertCircle, CheckCircle2, 
  ChevronRight, Info, BrainCircuit, Heart, FlameKindling, 
  Search, ShieldAlert, Zap, Thermometer, Filter,
  Wind, Droplets, Dumbbell, Eye, ZapOff
} from 'lucide-react';

export default function SymptomChecker({ userId, onComplete }) {
  const [library, setLibrary] = useState([]);
  const [selections, setSelections] = useState([]); // Array of { id, severity }
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Load symptom library on mount
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await analyzeSymptoms([]); // Empty call to get library
        setLibrary(response.symptom_library || []);
      } catch (err) {
        console.error("Library load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  // Compute unified list for search and grid
  const allSymptoms = useMemo(() => {
    const list = (library || []).flatMap(d => 
      d.symptoms.map(s => ({ ...s, category: d.name, categoryId: d.id }))
    );
    // Deduplicate if any symptom appears in multiple diseases
    return Array.from(new Map(list.map(s => [s.id, s])).values());
  }, [library]);

  const filteredSymptoms = useMemo(() => {
    return allSymptoms.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === "all" || s.categoryId === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [allSymptoms, searchQuery, activeCategory]);

  // Update results live as symptoms change
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (selections.length === 0) {
        setResults([]);
        return;
      }
      
      setEvaluating(true);
      try {
        const response = await analyzeSymptoms(selections, userId);
        setResults(response.results || []);
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setEvaluating(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [selections, userId]);

  const toggleSymptom = (id) => {
    setSelections(prev => {
      const exists = prev.find(s => s.id === id);
      if (exists) return prev.filter(s => s.id !== id);
      return [...prev, { id, severity: 'mild' }];
    });
  };

  const updateSeverity = (id, severity) => {
    setSelections(prev => prev.map(s => s.id === id ? { ...s, severity } : s));
  };

  const getSymptomIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('breath') || n.includes('cough')) return <Wind className="w-5 h-5 text-sky-400" />;
    if (n.includes('heart') || n.includes('chest')) return <Heart className="w-5 h-5 text-rose-500" />;
    if (n.includes('weight') || n.includes('thirst')) return <Droplets className="w-5 h-5 text-blue-400" />;
    if (n.includes('vision') || n.includes('eye')) return <Eye className="w-5 h-5 text-purple-400" />;
    if (n.includes('fatigue') || n.includes('weak')) return <ZapOff className="w-5 h-5 text-amber-400" />;
    if (n.includes('dizz') || n.includes('faint')) return <Zap className="w-5 h-5 text-yellow-400" />;
    return <Activity className="w-5 h-5 text-slate-400" />;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-blue-500/50" />
        </div>
      </div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Diagnostic Terminal...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Deck */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-blue-500">
             <Stethoscope className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Diagnostic Intake</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Unified Symptom Inventory</h1>
          <p className="text-slate-400 max-w-xl font-medium">Select clinical markers present in your current profile. We use weighted pattern matching to estimate risk pathology.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search indicators..."
                className="bg-slate-900 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Grid Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
             <button 
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-500 border border-white/5 hover:border-white/10'
                }`}
             >
                Global List
             </button>
             {library.map(cat => (
               <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 text-slate-500 border border-white/5 hover:border-white/10'
                }`}
               >
                  {cat.name}
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredSymptoms.map((s) => {
                const isSelected = selections.find(item => item.id === s.id);
                const currentSeverity = isSelected?.severity || 'mild';

                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.01 }}
                    className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/20' 
                        : 'bg-slate-900/40 border-white/5 hover:border-white/10 shadow-sm'
                    }`}
                    onClick={() => toggleSymptom(s.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-2xl transition-all ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                        {getSymptomIcon(s.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-base font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-200 uppercase text-sm font-extrabold'}`}>
                            {s.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 font-bold leading-relaxed opacity-70">
                          {s.desc}
                        </p>
                      </div>
                    </div>

                    {/* Severity Selector (Shown only when selected) */}
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()} // Prevent toggling selection when clicking severity
                      >
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Mark Severity</span>
                        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                           {['mild', 'moderate', 'severe'].map((sev) => (
                             <button
                               key={sev}
                               onClick={() => updateSeverity(s.id, sev)}
                               className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                                 currentSeverity === sev 
                                   ? 'bg-blue-500 text-white shadow-lg' 
                                   : 'text-slate-600 hover:text-slate-400'
                               }`}
                             >
                               {sev[0]}
                             </button>
                           ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Side Statistics */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-10 space-y-6">
             <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />

                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <div>
                         <h3 className="text-xl font-black text-white flex items-center">
                            <BrainCircuit className="w-6 h-6 mr-2 text-purple-400" />
                            Live Profile
                         </h3>
                         <span className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">Algorithmic Match Engine</span>
                      </div>
                      {evaluating && (
                        <div className="flex items-center space-x-2 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                           <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                        </div>
                      )}
                   </div>

                   <div className="space-y-6">
                      {results.length === 0 ? (
                        <div className="py-16 text-center">
                           <ZapOff className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                           <p className="text-slate-600 text-xs font-bold uppercase tracking-widest leading-relaxed">
                              Selection Required to Initiate <br /> 
                              Differential Diagnosis
                           </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                           {results.map((res, i) => (
                             <motion.div 
                               key={res.id} 
                               initial={{ opacity: 0, x: 20 }}
                               animate={{ opacity: 1, x: 0 }}
                               className={`p-5 rounded-2xl border transition-all ${
                                 i === 0 ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/40 border-white/5'
                               }`}
                             >
                               <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs font-black text-white uppercase tracking-tight">{res.name}</span>
                                  <span className="text-2xl font-black text-white">{Math.round(res.probability)}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                  <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: `${res.probability}%` }}
                                     className={`h-full rounded-full ${
                                       res.probability > 50 ? 'bg-rose-500' : res.probability > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                                     }`}
                                  />
                               </div>
                               {res.confidence.is_low && (
                                 <div className="mt-3 flex items-center space-x-2">
                                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                                    <span className="text-[9px] font-bold text-amber-500/80 uppercase">Low Confidence Match</span>
                                 </div>
                               )}
                             </motion.div>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={selections.length === 0}
                onClick={() => onComplete(results, selections)}
                className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center space-x-3 group"
             >
                <span className="uppercase tracking-tighter">Finalize Clinical Report</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
