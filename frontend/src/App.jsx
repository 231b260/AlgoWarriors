import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Activity, Heart, ShieldAlert, ChevronRight, UserCircle } from 'lucide-react';
import BackgroundScene from './components/ui/BackgroundScene';
import DiabetesForm from './components/forms/DiabetesForm';
import HeartForm from './components/forms/HeartForm';
import CancerForm from './components/forms/CancerForm';
import ResultDashboard from './components/ui/ResultDashboard';
import Loader from './components/ui/Loader';
import AuthPage from './components/ui/AuthPage';
import Onboarding from './components/ui/Onboarding';
import ProfileHistory from './components/ui/ProfileHistory';
import SymptomChecker from './components/ui/SymptomChecker';
import { predictRisk, analyzeSymptoms } from './services/api';

const DIABETES = 'diabetes';
const HEART = 'heart';
const CANCER = 'cancer';

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

// Extracted Predictor Component
const MainPredictor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(DIABETES);
  const [view, setView] = useState('clinical'); // 'clinical' or 'symptom'
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [clinicalResult, setClinicalResult] = useState(null);
  const [symptomResult, setSymptomResult] = useState(null);
  
  const userId = localStorage.getItem('user_id');

  const tabs = [
    { id: DIABETES, label: 'Diabetes', icon: Activity, color: 'text-blue-400', glowColor: 'neon-glow-blue', badge: 'bg-blue-500' },
    { id: HEART, label: 'Heart Disease', icon: Heart, color: 'text-red-400', glowColor: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]', badge: 'bg-red-500' },
    { id: CANCER, label: 'Cancer Risk', icon: ShieldAlert, color: 'text-purple-400', glowColor: 'neon-glow-purple', badge: 'bg-purple-500' }
  ];
  const handlePredict = async () => {
    setLoading(true);
    try {
      const data = await predictRisk(activeTab, formData, userId);
      setClinicalResult(data);
      
      // Calculate consolidated if symptom data exists for the same disease
      let finalResult = { ...data };
      if (symptomResult && symptomResult.some(res => res.id === activeTab)) {
        const matchingSymptom = symptomResult.find(res => res.id === activeTab);
        const hybridPercentage = (data.risk_percentage * 0.6) + (matchingSymptom.probability * 0.4);
        
        finalResult = {
          ...data,
          risk_percentage: Math.round(hybridPercentage),
          is_hybrid: true,
          ml_contribution: data.risk_percentage,
          symptom_contribution: matchingSymptom.probability,
          symptom_breakdown: matchingSymptom
        };
      }
      setResult(finalResult);
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomComplete = (results, selections) => {
    setSymptomResult(results);
    
    // If we've already done clinical, update to hybrid immediately
    if (clinicalResult && results.some(res => res.id === activeTab)) {
        const matchingSymptom = results.find(res => res.id === activeTab);
        const hybridPercentage = (clinicalResult.risk_percentage * 0.6) + (matchingSymptom.probability * 0.4);
        
        setResult({
          ...clinicalResult,
          risk_percentage: Math.round(hybridPercentage),
          is_hybrid: true,
          ml_contribution: clinicalResult.risk_percentage,
          symptom_contribution: matchingSymptom.probability,
          symptom_breakdown: matchingSymptom
        });
    } else if (results.length > 0) {
        // Fallback to pure symptom mode if no clinical data yet
        const top = results[0];
        setResult({
            risk_percentage: top.probability,
            risk_level: top.risk_level,
            care_plan: {
                analysis: top.summary,
                medical: `Weighted pattern match match for ${top.name}.`,
                diet: "Dietary optimization recommended based on indicator density.",
                exercise: "System recommends balanced cardio/resistance.",
                lifestyle: "Continue regular screening."
            },
            is_symptom_only: true,
            all_symptom_matches: results,
            symptom_breakdown: top
        });
    }
    setView('clinical');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    navigate('/auth');
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setResult(null)}>
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 tracking-tight">
                Neura<span className="text-cyan-400">Health</span>
              </h1>
              <p className="text-[11px] font-medium text-cyan-500 tracking-[0.2em] uppercase">Diagnostic Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors group px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
            >
              <UserCircle className="w-5 h-5 transition-transform" />
              <span className="font-bold text-sm tracking-wide hidden sm:block">My Vault</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-widest border border-red-500/20 hover:border-red-500/50 px-3 py-1.5 rounded-lg bg-red-500/5 transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <Loader key="loader" />
          ) : result ? (
            <ResultDashboard key="result" result={result} formData={formData} diseaseType={activeTab} onReset={() => setResult(null)} />
          ) : (
            <motion.div
              key="forms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-slate-700/50 shadow-lg mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-sm font-medium text-slate-300">System Online • Ready for Diagnostics</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight glow-text leading-tight">
                  {view === 'clinical' ? 'Clinical Analysis Module' : 'Symptom-Based Analysis'}
                </h2>
                <div className="flex justify-center mt-6">
                  <div className="inline-flex p-1 bg-slate-900/80 rounded-2xl border border-slate-700/50">
                    <button 
                      onClick={() => setView('clinical')}
                      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        view === 'clinical' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Clinical Inputs
                    </button>
                    <button 
                      onClick={() => setView('symptom')}
                      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        view === 'symptom' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Symptom Checker
                    </button>
                  </div>
                </div>
              </div>

              {view === 'symptom' ? (
                <SymptomChecker userId={userId} onComplete={handleSymptomComplete} />
              ) : (
                <>
              <div className="glass-panel p-2 rounded-2xl mb-8 flex overflow-x-auto hide-scrollbar space-x-2 border border-slate-700/50 shadow-2xl relative z-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFormData({});
                    }}
                    className={`relative flex-1 min-w-[140px] flex items-center justify-center space-x-3 py-4 px-6 rounded-xl transition-all duration-300 outline-none
                      ${activeTab === tab.id 
                        ? 'bg-slate-800/80 shadow-lg text-white scale-[1.02] transform' 
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      } ${tab.glowColor}`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <tab.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 ' + tab.color : ''}`} />
                    <span className="font-bold tracking-wide text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${tab.badge} animate-pulse`} />
                    )}
                  </button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl -z-10" />
                
                <div className="mb-8 flex items-center justify-between border-b border-slate-700/50 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                      {tabs.find(t => t.id === activeTab)?.label} Risk Inputs
                    </h3>
                    <p className="text-sm text-slate-400">Please provide accurate metrics for optimal mapping alignment.</p>
                  </div>
                  <div className={`p-4 rounded-full bg-slate-800/50 border border-slate-700 ${tabs.find(t => t.id === activeTab)?.color}`}>
                    {React.createElement(tabs.find(t => t.id === activeTab)?.icon, { className: "w-8 h-8" })}
                  </div>
                </div>

                <div className="pb-8">
                  {activeTab === DIABETES && <DiabetesForm formData={formData} setFormData={setFormData} />}
                  {activeTab === HEART && <HeartForm formData={formData} setFormData={setFormData} />}
                  {activeTab === CANCER && <CancerForm formData={formData} setFormData={setFormData} />}
                </div>

                <div className="pt-6 border-t border-slate-700/50 flex justify-end relative z-20">
                  <button
                    onClick={handlePredict}
                    className="group relative flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="text-lg">Initiate AI Analysis</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// Root Router App Component
export default function App() {
  return (
    <div className="relative min-h-screen bg-[#050B14] text-slate-100 font-sans selection:bg-cyan-500/30">
      <BrowserRouter>
        {/* Background is universally shared across the app seamlessly untouched */}
        <BackgroundScene />
        
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={
             <AuthPageWrapper />
          } />

          {/* Onboarding Route */}
          <Route path="/onboarding" element={
             <OnboardingWrapper />
          } />

          {/* History Route */}
          <Route path="/history" element={
             <ProtectedRoute>
                <ProfileHistoryWrapper />
             </ProtectedRoute>
          } />
          
          {/* Main App Dashboard Route */}
          <Route path="/" element={
             <ProtectedRoute>
                <MainPredictor />
             </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Wrappers for navigating logic locally safely
function AuthPageWrapper() {
  const navigate = useNavigate();
  const handleLoginSuccess = (userId, needsOnboarding) => {
    localStorage.setItem('user_id', userId);
    if (needsOnboarding) {
       navigate('/onboarding');
    } else {
       navigate('/');
    }
  };
  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}

function OnboardingWrapper() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  if(!userId) return <Navigate to="/auth" replace />;
  return <Onboarding userId={userId} onComplete={() => navigate('/')} />;
}

function ProfileHistoryWrapper() {
  const userId = localStorage.getItem('user_id');
  if(!userId) return <Navigate to="/auth" replace />;
  return <ProfileHistory userId={userId} />;
}
