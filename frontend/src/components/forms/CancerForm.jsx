import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToggleBtn = ({ name, label, formData, setFormData }) => {
  const isYes = formData[name] === '1';

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-medium text-slate-400">{label}</span>
      <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, [name]: '1' })}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${isYes ? 'bg-blue-500 text-white shadow-md neon-glow-blue' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, [name]: '0' })}
          className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${!isYes && formData[name] !== undefined ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          No
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "number", icon: Icon, placeholder, step, formData, onChange }) => (
  <div className="relative group">
    <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-purple-400 transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
      </div>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={onChange}
        step={step}
        className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium glow-input hover:border-slate-600"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function CancerForm({ formData, setFormData }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Age" name="AGE" icon={User} placeholder="e.g. 50" formData={formData} onChange={handleChange} />
        <div className="relative group">
          <label className="block text-sm font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-purple-400 transition-colors">Gender</label>
          <select
            name="GENDER"
            value={formData.GENDER || ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium glow-input hover:border-slate-600 appearance-none"
          >
            <option value="" disabled>Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <ToggleBtn name="SMOKING" label="Smoking" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="YELLOW_FINGERS" label="Yellow Fingers" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="ANXIETY" label="Anxiety" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="PEER_PRESSURE" label="Peer Pressure" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="CHRONIC_DISEASE" label="Chronic Disease" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="FATIGUE" label="Fatigue" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="ALLERGY" label="Allergy" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="WHEEZING" label="Wheezing" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="ALCOHOL_CONSUMING" label="Alcohol Consuming" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="COUGHING" label="Coughing" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="SHORTNESS_OF_BREATH" label="Shortness of Breath" formData={formData} setFormData={setFormData} />
        <ToggleBtn name="SWALLOWING_DIFFICULTY" label="Swallowing Diff." formData={formData} setFormData={setFormData} />
        <ToggleBtn name="CHEST_PAIN" label="Chest Pain" formData={formData} setFormData={setFormData} />
      </div>

      <div className="pt-4 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>Advanced Diagnostic Metrics</span>
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-4 glass-panel rounded-xl border-purple-500/30 neon-glow-purple space-y-4">
                <div className="flex items-start space-x-2 mb-2 text-purple-300 min-w-0">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs break-words">These metrics are optional fine-tunning parameters from cellular imaging data.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Radius" name="radius" icon={Info} placeholder="Mean Radius" step="0.01" formData={formData} onChange={handleChange} />
                  <InputField label="Texture" name="texture" icon={Info} placeholder="Mean Texture" step="0.01" formData={formData} onChange={handleChange} />
                  <InputField label="Area" name="area" icon={Info} placeholder="Mean Area" step="0.1" formData={formData} onChange={handleChange} />
                  <InputField label="Smoothness" name="smoothness" icon={Info} placeholder="Mean Smoothness" step="0.001" formData={formData} onChange={handleChange} />
                  <InputField label="Concavity" name="concavity" icon={Info} placeholder="Mean Concavity" step="0.001" formData={formData} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

