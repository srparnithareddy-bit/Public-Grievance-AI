import React, { useState, useEffect } from 'react';
import {
  Building2,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Edit3,
  Loader2,
  Tag,
  RefreshCw,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GrievanceCard } from '../components/GrievanceCard';

export const AdminDashboard = ({
  onNavigate,
  onViewGrievance,
  onOpenUpdateModal,
  showNotification,
}) => {
  const { user, isAdmin, login } = useAuth();

  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    departmentCounts: {},
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [grievanceList, statsData] = await Promise.all([
        api.getGrievances({
          category: departmentFilter,
          urgency: urgencyFilter,
          status: statusFilter,
          search: searchQuery,
        }),
        api.getStats(),
      ]);

      setGrievances(grievanceList);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.warn('Error loading admin queue:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [departmentFilter, urgencyFilter, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Quick Switch to Admin if user is currently citizen or not logged in
  const handleQuickAdminLogin = async () => {
    try {
      await login('admin@gov.in', 'admin123');
      showNotification('Switched to Municipal Administrator session!');
      fetchData();
    } catch (err) {
      showNotification(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-400/30 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Administrative Command Center
            </span>
            <span className="text-xs text-slate-400">• Problem ID: HACK-P438</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Grievance Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review incoming citizen reports, filter by department and urgency, and publish official resolution actions.
          </p>
        </div>

        {/* Admin Session Status / Fast Switch */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl text-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                ADM
              </div>
              <div>
                <div className="font-bold text-slate-200">{user?.name || 'Administrator'}</div>
                <div className="text-[11px] text-indigo-400 font-medium">
                  {user?.role === 'admin' ? 'Super Administrator' : `${user?.department} Officer`}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleQuickAdminLogin}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-xs shadow-md transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              1-Click Admin Mode
            </button>
          )}

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Inflow
          </span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
            {stats.total || 0}
          </span>
          <span className="text-[11px] text-slate-500">All Departments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
            Pending Queue
          </span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
            {stats.pending || 0}
          </span>
          <span className="text-[11px] text-slate-500">Awaiting Assignment</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-extrabold text-sky-600 mt-1 block">
            {stats.inProgress || 0}
          </span>
          <span className="text-[11px] text-slate-500">Field Work Underway</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
            {stats.resolved || 0}
          </span>
          <span className="text-[11px] text-slate-500">Action Completed</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-rose-50/80 p-5 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Critical Hazards
          </span>
          <span className="text-2xl font-extrabold text-rose-700 mt-1 block">
            {stats.critical || 0}
          </span>
          <span className="text-[11px] text-rose-600 font-semibold">Immediate Priority</span>
        </div>
      </div>

      {/* Department Distribution Pills */}
      {stats.departmentCounts && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Department Volume Distribution
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(stats.departmentCounts).map(([dept, count]) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 border ${
                  departmentFilter === dept
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{dept}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    departmentFilter === dept ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
            {departmentFilter !== 'All' && (
              <button
                onClick={() => setDepartmentFilter('All')}
                className="text-xs text-sky-600 hover:underline px-2 py-1 font-semibold"
              >
                Reset Department
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
            >
              <option value="All">All Departments</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Water">Water Supply</option>
              <option value="Roads">Roads & PWD</option>
              <option value="Electricity">Electricity</option>
              <option value="Public Safety">Public Safety</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Urgency Level
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
            >
              <option value="All">All Urgencies</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Keyword Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, landmark, or keyword..."
              className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Grievance Queue Grid */}
      <div>
        {loading ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
            <p className="text-xs">Loading grievance queue...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">Queue is clear!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No grievances match the selected filters. Change filters or clear search to review other tickets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {grievances.map((g) => (
              <GrievanceCard
                key={g._id || g.trackingId}
                grievance={g}
                onViewDetails={onViewGrievance}
                onOpenUpdateModal={onOpenUpdateModal}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
