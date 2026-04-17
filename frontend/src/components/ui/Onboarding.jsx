// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { saveOnboarding } from '../../services/api';
// import { Target, Activity, Flame, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

// const QUESTIONS = [
//   {
//     id: 'primary_goal',
//     question: "What is your primary health focus?",
//     icon: Target,
//     options: ["Longevity & Anti-aging", "Weight Management", "Pre-emptive Diagnosis", "Cardiovascular Fitness"]
//   },
//   {
//     id: 'activity_level',
//     question: "How would you describe your baseline physical activity?",
//     icon: Activity,
//     options: ["Sedentary", "Lightly Active (1-2x week)", "Moderately Active (3-4x week)", "Highly Active (5+ week)"]
//   },
//   {
//     id: 'stress_level',
//     question: "How would you rate your typical physiological stress levels?",
//     icon: Flame,
//     options: ["Low (Zen)", "Moderate (Manageable)", "High (Tense)", "Severe (Overwhelming)"]
//   }
// ];

// export default function Onboarding({ userId, onComplete }) {
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSelect = (option) => {
//     setAnswers({ ...answers, [QUESTIONS[step].id]: option });
//   };

//   const handleNext = async () => {
//     if (step < QUESTIONS.length - 1) {
//       setStep(step + 1);
//     } else {
//       setIsSaving(true);
//       try {
//         await saveOnboarding(userId, answers);
//         onComplete();
//       } catch (err) {
//         console.error(err);
//         setIsSaving(false);
//       }
//     }
//   };

//   const currentQ = QUESTIONS[step];
//   const Icon = currentQ.icon;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
//       <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-blue-900/10 to-indigo-900/20 -z-10" />

//       <motion.div 
//         key="onboarding"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="glass-panel w-full max-w-xl p-8 md:p-12 rounded-3xl relative overflow-hidden"
//       >
//         {/* Progress Bar */}
//         <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
//           <motion.div 
//             className="h-full bg-cyan-400 neon-glow-cyan"
//             initial={{ width: 0 }}
//             animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
//             transition={{ duration: 0.5 }}
//           />
//         </div>

//         <div className="text-center mb-8 mt-4">
//           <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
//             <Icon className="w-8 h-8" />
//           </div>
//           <motion.h2 
//             key={step}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
//           >
//             {currentQ.question}
//           </motion.h2>
//         </div>

//         <div className="space-y-4 mb-10">
//           <AnimatePresence mode="popLayout">
//             {currentQ.options.map((opt, idx) => {
//               const isSelected = answers[currentQ.id] === opt;
//               return (
//                 <motion.button
//                   key={`${step}-${idx}`}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.1 } }}
//                   exit={{ opacity: 0, x: 20 }}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => handleSelect(opt)}
//                   className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border flex items-center justify-between
//                     ${isSelected 
//                       ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
//                       : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'}`}
//                 >
//                   <span>{opt}</span>
//                   {isSelected && <CheckCircle className="w-5 h-5 text-cyan-400" />}
//                 </motion.button>
//               );
//             })}
//           </AnimatePresence>
//         </div>

//         <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
//           <button
//             onClick={() => setStep(Math.max(0, step - 1))}
//             disabled={step === 0}
//             className={`flex items-center space-x-2 text-sm font-medium ${step === 0 ? 'opacity-0 cursor-default' : 'text-slate-400 hover:text-slate-200'}`}
//           >
//             <ArrowLeft className="w-4 h-4" /> <span>Back</span>
//           </button>

//           <button
//             onClick={handleNext}
//             disabled={!answers[currentQ.id] || isSaving}
//             className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {isSaving ? (
//               <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
//             ) : (
//               <>
//                 <span>{step === QUESTIONS.length - 1 ? 'Complete Setup' : 'Continue'}</span>
//                 <ArrowRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveOnboarding } from '../../services/api';
import { Target, Activity, Flame, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'primary_goal',
    question: "What is your primary health focus?",
    icon: Target,
    options: ["Longevity & Anti-aging", "Weight Management", "Pre-emptive Diagnosis", "Cardiovascular Fitness"]
  },
  {
    id: 'activity_level',
    question: "How would you describe your baseline physical activity?",
    icon: Activity,
    options: ["Sedentary", "Lightly Active (1-2x week)", "Moderately Active (3-4x week)", "Highly Active (5+ week)"]
  },
  {
    id: 'stress_level',
    question: "How would you rate your typical physiological stress levels?",
    icon: Flame,
    options: ["Low (Zen)", "Moderate (Manageable)", "High (Tense)", "Severe (Overwhelming)"]
  }
];

export default function Onboarding({ userId, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: option });
  };

  const handleNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      try {
        await saveOnboarding(userId, answers);
        onComplete();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const currentQ = QUESTIONS[step];
  const Icon = currentQ.icon;

  return (
    <div className="min-h-screen py-12 px-6 fade-up" style={{ backgroundColor: '#F6F3F1' }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8A8A8A]">
              Sequence {step + 1} / {QUESTIONS.length}
            </span>
            <span className="text-xs font-bold text-[#F47C65]">
              {Math.round(((step + 1) / QUESTIONS.length) * 100)}% Synchronized
            </span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full coral-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="neumorphic-card p-10 md:p-14 bg-white/90 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 coral-gradient opacity-[0.03] rounded-full -mr-32 -mt-32" />

          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-8 w-20 h-20 rounded-3xl coral-gradient flex items-center justify-center shadow-xl shadow-[#F47C65]/20"
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-extrabold text-[#2E2E2E] leading-tight tracking-tight"
            >
              {currentQ.question}
            </motion.h2>
          </div>

          <div className="space-y-4 mb-14">
            <AnimatePresence mode="popLayout">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt;
                return (
                  <motion.button
                    key={`${step}-${idx}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(opt)}
                    className={`w-full p-6 rounded-2xl text-left font-bold transition-all flex items-center justify-between border-2
                      ${isSelected
                        ? 'border-[#F47C65] bg-white text-[#F47C65] shadow-xl shadow-[#F47C65]/10'
                        : 'border-transparent bg-[#F6F3F1]/50 text-[#8A8A8A] hover:bg-white hover:border-[#F47C65]/20 hover:text-[#2E2E2E]'
                      }`}
                  >
                    <span className="text-lg">{opt}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full coral-gradient flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center bg-[#F6F3F1]/30 -mx-6 -mb-6 p-6 md:-mx-14 md:-mb-14 md:p-14 border-t border-[#F6F3F1]">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all
                ${step === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#8A8A8A] hover:text-[#F47C65] hover:bg-white/50'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous Step</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!answers[currentQ.id] || isSaving}
              className="flex items-center gap-4 px-12 py-5 rounded-2xl font-extrabold text-white coral-gradient shadow-[0_10px_30px_rgba(244,124,101,0.3)] disabled:opacity-50 transition-all group"
            >
              {isSaving ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">
                    {step === QUESTIONS.length - 1 ? 'Establish Profile' : 'Proceed Diagnostics'}
                  </span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {QUESTIONS.map((_, idx) => (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                width: idx === step ? 32 : 10,
                backgroundColor: idx === step ? '#F47C65' : (idx < step ? '#FF8A75' : '#D1D1D1')
              }}
              className="h-2.5 rounded-full shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}