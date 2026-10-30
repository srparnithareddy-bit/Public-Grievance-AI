import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Droplets,
  Construction,
  Trash2,
  ShieldAlert,
  Building2,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { GrievanceCard } from '../components/GrievanceCard';

export const LandingPage = ({
  onNavigate,
  onOpenAIModal,
  onOpenTrackModal,
  onViewGrievance,
}) => {
  const [stats, setStats] = useState({
    total: 5,
    pending: 2,
    inProgress: 2,
    resolved: 1,
    critical: 2,
  });
  const [recentGrievances, setRecentGrievances] = useState([]);
  const [heroTrackingId, setHeroTrackingId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, grievancesData] = await Promise.all([
          api.getStats(),
          api.getGrievances(),
        ]);
        if (statsData) setStats(statsData);
        if (grievancesData) setRecentGrievances(grievancesData.slice(0, 4));
      } catch (err) {
        console.warn('Could not load landing metrics:', err.message);
      }
    };
    fetchData();
  }, []);

  const handleHeroTrack = (e) => {
    e.preventDefault();
    if (heroTrackingId.trim()) {
      onOpenTrackModal(heroTrackingId.trim());
    } else {
      onOpenTrackModal();
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-800 border border-sky-200 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>College Hackathon 2026 • Problem ID: HACK-P438</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Public Grievance <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Transforming citizen complaints into immediate government action.
              Using <span className="font-semibold text-slate-800">Google Gemini AI</span> to automatically parse natural language, auto-assign departments, detect urgent hazards, and track progress transparently.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('submit')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <span>File a Grievance</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAIModal}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm hover:border-sky-400 transition-all"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Try AI Triage Modal</span>
              </button>
            </div>

            {/* Quick Tracking Search Bar */}
            <div className="pt-6 max-w-lg mx-auto">
              <form onSubmit={handleHeroTrack} className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-lg border border-slate-200">
                <input
                  type="text"
                  value={heroTrackingId}
                  onChange={(e) => setHeroTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. GRV-2026-1001)"
                  className="flex-1 px-4 py-2.5 text-xs font-mono uppercase rounded-xl focus:outline-none placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  Track Live
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="text-center p-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Logged
            </span>
            <span className="text-3xl font-extrabold text-slate-800 mt-1 block">
              {stats.total || 0}
            </span>
            <span className="text-[11px] text-slate-500">Citizen Grievances</span>
          </div>

          <div className="text-center p-3">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
              Pending Action
            </span>
            <span className="text-3xl font-extrabold text-amber-600 mt-1 block">
              {stats.pending || 0}
            </span>
            <span className="text-[11px] text-slate-500">In Active Queue</span>
          </div>

          <div className="text-center p-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              In Progress
            </span>
            <span className="text-3xl font-extrabold text-sky-600 mt-1 block">
              {stats.inProgress || 0}
            </span>
            <span className="text-[11px] text-slate-500">Crew Dispatched</span>
          </div>

          <div className="text-center p-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Resolved
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
              {stats.resolved || 0}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">Verified Fixed</span>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How The AI Grievance Assistant Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Eliminates complex bureaucratic delays through modern AI intelligence and role-based workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">1. Conversational AI Intake</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens don't need to know complex municipal bylaws. Simply describe issues like broken pipes, potholes, or uncollected garbage in plain language.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">2. Automated Triage & Priority</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini extracts key departments (Water, Roads, Electricity, Sanitation), detects life-threatening hazards, and assigns Urgency (Critical to Low).
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">3. Transparent Audit & Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every complaint receives a unique Tracking ID (`GRV-2026-XXXX`). Citizens track real-time departmental remarks as issues are inspected and resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Public Grievance Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Public Grievances</h2>
            <p className="text-xs text-slate-500 mt-1">
              Live municipal feed displaying AI classification and status progress
            </p>
          </div>
          <button
            onClick={() => onNavigate('citizen')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View My Grievances <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentGrievances.map((g) => (
            <GrievanceCard
              key={g._id || g.trackingId}
              grievance={g}
              onViewDetails={onViewGrievance}
              isAdmin={false}
            />
          ))}
        </div>
      </section>

      {/* Quick Demo Credentials Banner for Judges / Evaluators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-semibold">
              <Users className="w-3.5 h-3.5" />
              Hackathon Evaluation Fast-Track
            </div>
            <h3 className="text-xl font-bold">Ready to test Citizen and Admin workflows?</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Use pre-seeded demo accounts with 1-click login to submit grievances as a citizen, or update and resolve complaints as a municipal official!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-xs rounded-xl transition-colors"
            >
              1-Click Demo Login
            </button>
            <button
              onClick={() => onNavigate('submit')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
