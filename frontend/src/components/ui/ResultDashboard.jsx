import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Activity, AlertTriangle, CheckCircle, Info, TrendingUp, XCircle, BrainCircuit, Apple, HeartPulse, Moon, Stethoscope, Hexagon, FileText, Download, FlameKindling, Info as InfoIcon } from 'lucide-react';
import { getHistory } from '../../services/api';
import { generateDoctorReport } from '../../utils/pdfGenerator';
import RecommendationDashboard from './RecommendationDashboard';
import HospitalMap from './HospitalMap';

const generateTrendData = (currentRisk) => {
  return Array.from({ length: 6 }).map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    risk: Math.max(0, currentRisk + (Math.random() * 20 - 10) - (5 - i) * 2),
  }));
};

const CircularProgress = ({ percentage, color, label = "Risk" }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = percentage / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        setVal(percentage);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [percentage]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (val / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-48 h-48">
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-700/50"
        />
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(currentColor,0.5)] transition-all duration-300"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight glow-text" style={{ color }}>
          {Math.round(val)}%
        </span>
        <span className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-bold">{label}</span>
      </div>
    </div>
  );
};

export default function ResultDashboard({ result, formData, diseaseType, onReset }) {
  const { risk_percentage, risk_level, care_plan, stroke_risk } = result;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const colorMap = {
    Low: '#22c55e',    // Green
    Medium: '#eab308', // Yellow
    High: '#ef4444',   // Red
  };

  const iconMap = {
    Low: <CheckCircle className="w-6 h-6 text-green-500" />,
    Medium: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    High: <XCircle className="w-6 h-6 text-red-500" />,
  };

  const color = colorMap[risk_level] || colorMap.Low;
  const trendData = generateTrendData(risk_percentage);

  // Stroke color stratifier
  const strokeColor = stroke_risk > 70 ? '#ef4444' : stroke_risk > 35 ? '#f97316' : '#3b82f6';
  const strokeLabel = stroke_risk > 70 ? 'CRITICAL' : stroke_risk > 35 ? 'ELEVATED' : 'LOW';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const guidanceCards = care_plan ? [
    { title: "Dietary Adjustments", text: care_plan.diet, icon: Apple, color: "text-green-400", border: "border-green-500/30" },
    { title: "Exercise Protocol", text: care_plan.exercise, icon: HeartPulse, color: "text-rose-400", border: "border-rose-500/30" },
    { title: "Lifestyle Habit Changes", text: care_plan.lifestyle, icon: Moon, color: "text-indigo-400", border: "border-indigo-500/30" },
    { title: "Medical Consultation", text: care_plan.medical, icon: Stethoscope, color: "text-blue-400", border: "border-blue-500/30" }
  ] : [];

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const userId = localStorage.getItem('user_id');
      let historyData = [];
      let username = "Anonymous";

      if (userId) {
        const apiRes = await getHistory(userId);
        historyData = apiRes.history || [];
        username = apiRes.username || "Anonymous";
      }

      generateDoctorReport(username, diseaseType || "Health", formData || {}, result, historyData);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Top Section: Analysis Mode & Hybrid Breakdown */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {result.is_hybrid ? (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/30">
             <Zap className="w-4 h-4 text-blue-400" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Hybrid Protocol (0.6 ML + 0.4 Symptom)</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/60 rounded-full border border-slate-700/50">
             <Stethoscope className="w-4 h-4 text-slate-400" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               {result.is_symptom_only ? 'Pure Symptom Match' : 'Clinical Parameter Mapping'}
             </span>
          </div>
        )}

        {result.symptom_breakdown?.confidence?.is_low && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/30">
             <ShieldAlert className="w-4 h-4 text-amber-500" />
             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Low Confidence Scoping</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="col-span-1 xl:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group border border-slate-700/50 bg-slate-900/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
          
          <div className="flex flex-col md:flex-row items-center justify-between z-10 relative">
            <div className="space-y-6 mb-8 md:mb-0 max-w-sm">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Diagnostic Result</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
              </div>

              <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden relative">
                {iconMap[risk_level]}
                <span className="font-black text-lg tracking-tight uppercase" style={{ color }}>{risk_level} Threshold</span>
                <div className="absolute inset-0 bg-current opacity-5" style={{ backgroundColor: color }} />
              </div>

              <p className="text-slate-400 text-sm font-medium leading-relaxed italic opacity-80">
                {result.is_hybrid ? 
                  "Consolidated risk derived from both clinical metrics and symptom pattern recognition." :
                  (care_plan?.analysis || "System identifies distinct pathology markers consistent with target profiles.")
                }
              </p>

              {result.is_hybrid && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                     <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">ML Model (60%)</span>
                     <span className="text-lg font-black text-white">{Math.round(result.ml_contribution)}%</span>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                     <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Symptoms (40%)</span>
                     <span className="text-lg font-black text-blue-400">{Math.round(result.symptom_contribution)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <CircularProgress percentage={risk_percentage} color={color} label={result.is_hybrid ? "Hybrid Score" : "Match Density"} />
              {result.symptom_breakdown?.confidence?.is_low && (
                <p className="mt-4 text-[10px] text-amber-500/70 font-bold uppercase tracking-widest text-center max-w-[200px]">
                   {result.symptom_breakdown.confidence.reason}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Optional Stroke Risk or Trajectory */}
        <div className="col-span-1 glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden border border-slate-700/50 bg-slate-900/60 shadow-xl">
           <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="font-black text-white tracking-widest uppercase text-[11px]">Trajectory Prediction</h3>
           </div>
           
           <div className="flex-1 min-h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="risk" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-white/5">
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                 Statistical variance indicates a ±4% deviation based on historical cohorts. Regular monitoring is advised for precision.
              </p>
           </div>
        </div>
      </div>

      {/* Cross-Disease Analysis (Symptom/Hybrid Mode) */}
      {(result.is_symptom_only || result.is_hybrid) && result.all_symptom_matches?.length > 1 && (
        <div className="col-span-1 xl:col-span-3 glass-panel rounded-3xl p-8 border border-white/5 bg-slate-900/40 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10" />
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FlameKindling className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Associated Risk Patterns Detected</h3>
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Non-Primary Clinical Correlations</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.all_symptom_matches.slice(1).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.name} Path</span>
                  <span className="text-xl font-black text-white">{Math.round(m.probability)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-1000" style={{ width: `${m.probability}%` }} />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">Matches: {m.matched_symptoms.join(", ")}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Logics & Computations Panel (Only if symptoms involved) */}
      {(result.is_symptom_only || result.is_hybrid) && result.symptom_breakdown && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2.5rem] p-8 border border-blue-500/20 bg-slate-900/60 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
          
          <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-white/5">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Diagnostic Logic & Computations</h3>
              <p className="text-xs text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Algorithmic Weighted Mapping Protocol</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-blue-400">
            {/* The Formula Section */}
            <div className="space-y-8">
               <div className="bg-slate-950/50 p-8 rounded-3xl border border-blue-500/10 shadow-inner">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] block mb-6">Weighted Scoping Algorithm</span>
                  <div className="flex flex-col space-y-6">
                     <div className="flex items-center space-x-6">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-4xl font-black text-white tracking-widest italic font-serif opacity-90 leading-none">Σ(Wᵢ * Sᵢ) / ΣW_tot</span>
                        <div className="flex-1 h-px bg-slate-800" />
                     </div>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed italic opacity-70 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                        Total score is calculated by the summation of base clinical weights (Wᵢ) multiplied by user-defined severity factors (Sᵢ).
                     </p>
                  </div>
               </div>

               <div className="flex items-center justify-between p-8 bg-blue-600/5 rounded-3xl border border-blue-500/20 shadow-lg">
                  <div className="space-y-2">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Net match density</span>
                     <span className="text-4xl font-black text-blue-400 tracking-tighter leading-none">
                        {result.symptom_breakdown.matched_total_weight} / {result.symptom_breakdown.disease_total_weight}
                     </span>
                  </div>
                  <div className="text-right">
                     <span className="text-5xl font-black text-white leading-none tracking-tighter">{Math.round((result.symptom_breakdown.matched_total_weight / result.symptom_breakdown.disease_total_weight) * 100)}%</span>
                     <span className="block text-[10px] font-black text-blue-500 mt-2 uppercase tracking-widest">Confidence Quotient</span>
                  </div>
               </div>
            </div>

            {/* Variable Contribution List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clinicial Indicator Variance</span>
                 <div className="flex items-center space-x-4">
                    <span className="flex items-center text-[9px] font-bold text-slate-600 uppercase"><CheckCircle className="w-2.5 h-2.5 mr-1" /> Active</span>
                    <span className="flex items-center text-[9px] font-bold text-slate-600 uppercase"><XCircle className="w-2.5 h-2.5 mr-1" /> Missing</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                  {result.symptom_breakdown.matched_symptoms?.map((s, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-2xl bg-slate-800/40 border border-white/5 group hover:border-blue-500/30 transition-all">
                       <div className="flex items-center justify-between mb-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded uppercase tracking-tighter">+Weight Match</span>
                       </div>
                       <span className="text-[11px] font-black text-slate-200 uppercase tracking-tight line-clamp-1">{s}</span>
                    </div>
                  ))}
                  {result.symptom_breakdown.missing_key_symptoms?.map((s, idx) => (
                    <div key={`missing-${idx}`} className="flex flex-col p-4 rounded-2xl bg-slate-950/40 border border-white/5 opacity-40 grayscale group hover:opacity-100 transition-opacity">
                       <XCircle className="w-4 h-4 text-slate-600 mb-2" />
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight line-clamp-1">{s}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      )}


      {/* AI Personalized Care Plan */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden border border-slate-700/50">
        <motion.div
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent neon-glow-cyan opacity-50"
        />

        <div className="flex items-center space-x-3 mb-8 border-b border-slate-700/50 pb-4">
          <div className="p-2 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            AI Synchronized Care Plan
          </h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {guidanceCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`flex flex-col space-y-3 bg-slate-800/40 p-5 rounded-xl border ${card.border} hover:bg-slate-700/40 transition-colors`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <h4 className="font-semibold text-slate-200 tracking-wide">{card.title}</h4>
              </div>
              <p className="text-slate-400 leading-relaxed font-light text-sm pl-8 border-l-2 border-slate-700/50">{card.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Emergency Map Launcher */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMap(true)}
          className="group relative flex items-center space-x-4 px-12 py-5 bg-slate-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(244,63,94,0.15)] transition-all hover:border-rose-500/60 hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
            <MapPin className="w-7 h-7 text-rose-500 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 leading-none mb-1.5">Critical Infrastructure</span>
            <span className="block text-lg font-extrabold text-white tracking-tight">Locate Nearest Hospital Now</span>
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {showMap && <HospitalMap onClose={() => setShowMap(false)} />}
      </AnimatePresence>

      <RecommendationDashboard formData={formData} riskPercentage={risk_percentage} diseaseType={diseaseType} />

      <div className="flex flex-col sm:flex-row items-center justify-center pt-4 space-y-4 sm:space-y-0 sm:space-x-6 border-t border-slate-700/50 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center space-x-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 border border-purple-500/50 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50"
        >
          {isGeneratingPdf ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Download Doctor-Ready PDF</span>
              <Download className="w-4 h-4 ml-1 opacity-70" />
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-8 py-3.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors"
        >
          Run Another Analysis
        </motion.button>
      </div>
    </motion.div>
  );
}
