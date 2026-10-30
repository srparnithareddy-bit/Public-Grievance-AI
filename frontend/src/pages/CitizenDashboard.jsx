import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Sparkles,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GrievanceCard } from '../components/GrievanceCard';

export const CitizenDashboard = ({
  onNavigate,
  onOpenAIModal,
  onViewGrievance,
  onOpenTrackModal,
}) => {
  const { user, isCitizen } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const data = await api.getGrievances({
        status: statusFilter,
        search: searchQuery,
      });
      setGrievances(data);
    } catch (err) {
      console.warn('Failed to load citizen grievances:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGrievances();
  };

  // Metrics
  const total = grievances.length;
  const pending = grievances.filter((g) => g.status === 'Pending').length;
  const inProgress = grievances.filter((g) => g.status === 'In Progress').length;
  const resolved = grievances.filter((g) => g.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Citizen Portal
            </span>
            <span className="text-xs text-slate-400">• My Grievance History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user ? `Hello, ${user.name}` : 'Citizen Grievance Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit new municipal complaints, review AI triage insights, and track resolution audits.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            AI Grievance Assistant
          </button>

          <button
            onClick={() => onNavigate('submit')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            File New Complaint
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            My Total Complaints
          </span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{total}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
            Pending Review
          </span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pending}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-extrabold text-sky-600 mt-1 block">{inProgress}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{resolved}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or keyword..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Grievances Cards List */}
      <div>
        {loading ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
            <p className="text-xs">Loading grievance history...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">No grievances found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {statusFilter !== 'All'
                  ? `No grievances currently matching status "${statusFilter}".`
                  : "You haven't filed any complaints yet. Use the button below to submit your first issue!"}
              </p>
            </div>
            <button
              onClick={() => onNavigate('submit')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              File First Complaint
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {grievances.map((g) => (
              <GrievanceCard
                key={g._id || g.trackingId}
                grievance={g}
                onViewDetails={onViewGrievance}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
