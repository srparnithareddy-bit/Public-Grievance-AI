import React, { useState } from 'react';
import { Shield, LogIn, Lock, Mail, Users, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigate, showNotification }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email.trim(), password);
      showNotification(`Welcome back, ${user.name}!`);
      if (user.role === 'admin' || user.role === 'official') {
        onNavigate('admin');
      } else {
        onNavigate('citizen');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click demo login helper
  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');

    try {
      const user = await login(demoEmail, demoPass);
      showNotification(`Logged in as ${user.name} (${user.role})!`);
      if (user.role === 'admin' || user.role === 'official') {
        onNavigate('admin');
      } else {
        onNavigate('citizen');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Public Grievance AI
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to file grievances, review AI triage, or manage administrative queues.
        </p>
      </div>

      {/* 1-Click Fast Track Card for Hackathon Judges */}
      <div className="p-4 bg-gradient-to-br from-sky-50 to-indigo-50/70 border border-sky-200/80 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
          <Users className="w-4 h-4 text-sky-600" />
          Hackathon Evaluator 1-Click Sign In
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('citizen@demo.com', 'citizen123')}
            className="p-2.5 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-colors text-xs font-semibold text-slate-800 flex flex-col justify-between"
          >
            <span className="text-sky-700 font-bold">👤 Citizen Demo</span>
            <span className="text-[10px] text-slate-400 font-normal">citizen@demo.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin@gov.in', 'admin123')}
            className="p-2.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-colors text-xs font-semibold text-slate-800 flex flex-col justify-between"
          >
            <span className="text-indigo-700 font-bold">🏛️ Admin Demo</span>
            <span className="text-[10px] text-slate-400 font-normal">admin@gov.in</span>
          </button>
        </div>
      </div>

      {/* Standard Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-bold text-sky-600 hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
