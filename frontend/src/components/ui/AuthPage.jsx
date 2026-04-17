import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope, Lock, User, Mail, ArrowRight,
    CheckCircle, Activity, Heart, Shield
} from 'lucide-react';
import { loginUser, registerUser } from '../../services/api';

// ── Color tokens ───────────────────────────────────────────────────
const C = {
    bg:        '#EDE9E6',
    text:      '#5C4F4A',
    textMuted: 'rgba(92,79,74,0.55)',
    green:     '#5C766D',
    gold:      '#C9996B',
    white:     '#FFFFFF',
    border:    'rgba(92,79,74,0.12)',
};

// ── Decorative floating blob ────────────────────────────────────────
const Blob = ({ style, delay = 0, size = 160, color }) => (
    <motion.div
        className="absolute rounded-full"
        style={{ width: size, height: size, background: color, filter: 'blur(50px)', opacity: 0.35, ...style }}
        animate={{ scale: [1, 1.15, 1], y: [0, -18, 0] }}
        transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
);

// ── Input field ─────────────────────────────────────────────────────
function Field({ icon: Icon, name, type, placeholder, value, onChange, focused, onFocus, onBlur }) {
    const isFocused = focused === name;
    return (
        <motion.div
            className="relative"
            animate={{ scale: isFocused ? 1.015 : 1 }}
            transition={{ duration: 0.15 }}
        >
            <div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200"
                style={{ color: isFocused ? C.gold : C.textMuted }}
            >
                <Icon className="w-5 h-5" />
            </div>
            <input
                type={type}
                name={name}
                required
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-4 rounded-2xl font-medium outline-none transition-all duration-200"
                style={{
                    backgroundColor: C.bg,
                    color: C.text,
                    border: isFocused ? `2px solid ${C.gold}` : `2px solid ${C.border}`,
                    boxShadow: isFocused ? `0 0 0 4px rgba(201,153,107,0.14)` : 'none',
                }}
            />
        </motion.div>
    );
}

export default function AuthPage({ onLoginSuccess }) {
    const [isLogin, setIsLogin]   = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError]       = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [focused, setFocused]   = useState(null);

    const handleChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setSuccessMsg('');
        try {
            if (isLogin) {
                const data = await loginUser(formData.username, formData.password);
                onLoginSuccess(data.user_id, false);
            } else {
                const data = await registerUser(formData.username, formData.password);
                setSuccessMsg('Account created! Setting up your profile…');
                setTimeout(() => onLoginSuccess(data.user_id, true), 1500);
            }
        } catch (err) {
            setError(err?.message || err || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(v => !v);
        setError('');
        setSuccessMsg('');
        setFormData({ username: '', password: '' });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ backgroundColor: C.bg }}
        >
            {/* ── Page-level background blobs ── */}
            <Blob color={C.gold}  style={{ top: 80,  left: 60  }} delay={0} size={260} />
            <Blob color={C.green} style={{ bottom: 60, right: 60 }} delay={2} size={220} />
            <Blob color={C.text}  style={{ top: '40%', left: '38%' }} delay={4} size={150} />

            {/* ── Main card: split layout ── */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden flex shadow-2xl"
                style={{ boxShadow: '0 30px 80px -20px rgba(92,79,74,0.30)' }}
            >

                {/* ════════════════════  LEFT PANEL  ════════════════════ */}
                <div
                    className="hidden md:flex flex-col justify-between relative overflow-hidden w-5/12 p-10"
                    style={{ background: `linear-gradient(145deg, ${C.green} 0%, ${C.text} 100%)` }}
                >
                    {/* Inner blobs */}
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
                         style={{ background: C.gold, filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-15"
                         style={{ background: '#FFFFFF', filter: 'blur(50px)', transform: 'translate(-30%,30%)' }} />

                    {/* Floating icons as decoration */}
                    <div className="absolute top-24 right-8 opacity-15">
                        <Heart className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute top-1/2 -right-4 opacity-10">
                        <Activity className="w-24 h-24 text-white" />
                    </div>
                    <div className="absolute bottom-28 right-12 opacity-15">
                        <Shield className="w-12 h-12 text-white" />
                    </div>

                    {/* Dot grid pattern */}
                    <div className="absolute inset-0 opacity-10"
                         style={{
                             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                             backgroundSize: '24px 24px',
                         }}
                    />

                    {/* Top logo */}
                    <div className="relative z-10">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
                        >
                            <Stethoscope className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-xs font-bold tracking-widest text-white/60 uppercase mb-2">
                            NeuraHealth
                        </p>
                    </div>

                    {/* Centre copy */}
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            {isLogin ? 'Welcome\nback.' : 'Your health\njourney\nstarts here.'}
                        </h1>
                        <p className="text-white/65 text-sm leading-relaxed">
                            {isLogin
                                ? 'Access your AI-powered diagnostic engine and track your health over time.'
                                : 'Create an account to join our community and receive personalised health insights.'}
                        </p>
                    </div>

                    {/* Bottom feature pills */}
                    <div className="relative z-10 flex flex-col gap-3">
                        {[
                            { icon: Activity, label: 'AI Risk Analysis'        },
                            { icon: Heart,    label: 'Multi-disease Detection'  },
                            { icon: Shield,   label: 'Secure & Private'         },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                     style={{ background: 'rgba(255,255,255,0.15)' }}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white/75 text-sm font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════════════════  RIGHT PANEL (form)  ════════════════════ */}
                <div
                    className="flex-1 flex flex-col justify-center p-8 md:p-12 relative"
                    style={{ backgroundColor: C.white }}
                >
                    {/* Subtle corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-5"
                         style={{ backgroundColor: C.gold }} />

                    {/* Logo (mobile only / top of form) */}
                    <div className="flex justify-center mb-6">
                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.text} 100%)`,
                                     boxShadow: `0 12px 30px -10px rgba(92,118,109,0.50)` }}
                        >
                            <Stethoscope className="w-8 h-8 text-white" />
                        </motion.div>
                    </div>

                    {/* Heading — animates on mode switch */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login-title' : 'reg-title'}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-2xl font-bold mb-1" style={{ color: C.text }}>
                                {isLogin ? 'Hello! Welcome back' : 'Create your account'}
                            </h2>
                            <p className="text-sm" style={{ color: C.textMuted }}>
                                {isLogin
                                    ? 'Enter your credentials below to sign in'
                                    : 'Fill in your details to get started'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Alert messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 px-4 py-3 rounded-2xl text-sm text-center border"
                                style={{
                                    backgroundColor: 'rgba(220,38,38,0.08)',
                                    borderColor: 'rgba(220,38,38,0.25)',
                                    color: '#dc2626',
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 px-4 py-3 rounded-2xl text-sm text-center flex items-center justify-center gap-2 border"
                                style={{
                                    backgroundColor: 'rgba(92,118,109,0.10)',
                                    borderColor: 'rgba(92,118,109,0.25)',
                                    color: C.green,
                                }}
                            >
                                <CheckCircle className="w-4 h-4" />
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username / Email label */}
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: C.text }}>
                                {isLogin ? 'Username' : 'Email address'}
                            </label>
                            <Field
                                icon={isLogin ? User : Mail}
                                name="username"
                                type={isLogin ? 'text' : 'email'}
                                placeholder={isLogin ? 'Enter your username' : 'Enter your email address'}
                                value={formData.username}
                                onChange={handleChange}
                                focused={focused}
                                onFocus={() => setFocused('username')}
                                onBlur={() => setFocused(null)}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: C.text }}>
                                Password
                            </label>
                            <Field
                                icon={Lock}
                                name="password"
                                type="password"
                                placeholder="••••••••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                focused={focused}
                                onFocus={() => setFocused('password')}
                                onBlur={() => setFocused(null)}
                            />
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || !!successMsg}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group mt-2"
                            style={{
                                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.text} 100%)`,
                                boxShadow: `0 12px 32px -10px rgba(201,153,107,0.45)`,
                            }}
                        >
                            {/* Shimmer */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }}
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.4 }}
                            />
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Login' : 'Create Account'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
                        <span className="text-xs font-medium" style={{ color: C.textMuted }}>or</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: C.border }} />
                    </div>

                    {/* Social placeholder buttons */}
                    <div className="flex justify-center gap-4">
                        {[
                            {
                                label: 'Google',
                                svg: (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                )
                            },
                            {
                                label: 'Facebook',
                                svg: (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                                    </svg>
                                )
                            },
                            {
                                label: 'Apple',
                                svg: (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path fill="#000" d="M17.05 12.54c-.03-3.2 2.59-4.74 2.71-4.82-1.48-2.17-3.78-2.46-4.6-2.5-1.96-.2-3.83 1.16-4.82 1.16-.99 0-2.52-1.13-4.14-1.1C4 5.32 1.84 6.75.82 8.97c-2.09 3.63-.54 9 1.49 11.95 1 1.44 2.18 3.06 3.74 3 1.51-.07 2.08-.97 3.9-.97 1.83 0 2.34.97 3.94.94 1.62-.03 2.64-1.47 3.62-2.92.73-1.08 1.31-2.2 1.71-3.44-.04-.01-3.13-1.2-3.17-4.99z"/>
                                        <path fill="#000" d="M14.45 3.25c.82-1 1.37-2.4 1.22-3.79-1.18.05-2.6.79-3.44 1.78-.76.88-1.42 2.28-1.24 3.63 1.32.1 2.67-.67 3.46-1.62z"/>
                                    </svg>
                                )
                            },
                        ].map(({ label, svg }) => (
                            <motion.button
                                key={label}
                                type="button"
                                whileHover={{ scale: 1.08, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                                style={{
                                    border: `2px solid ${C.border}`,
                                    backgroundColor: C.white,
                                    boxShadow: '0 2px 8px rgba(92,79,74,0.06)',
                                }}
                                title={`Continue with ${label}`}
                            >
                                {svg}
                            </motion.button>
                        ))}
                    </div>

                    {/* Toggle mode link */}
                    <p className="mt-8 text-center text-sm" style={{ color: C.textMuted }}>
                        {isLogin ? "Don't Have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={switchMode}
                            className="font-semibold hover:underline transition-all"
                            style={{ color: C.gold }}
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
