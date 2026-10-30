import React, { useState } from 'react';
import { Search, X, Loader2, AlertCircle, ShieldCheck, MapPin, Tag, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { StatusTimeline } from './StatusTimeline';

export const TrackModal = ({ isOpen, onClose, defaultTrackingId = '' }) => {
  const [trackingId, setTrackingId] = useState(defaultTrackingId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const sampleIds = ['GRV-2026-1001', 'GRV-2026-1002', 'GRV-2026-1003', 'GRV-2026-1004'];

  const handleSearch = async (idToSearch) => {
    const id = (idToSearch || trackingId).trim();
    if (!id) {
      setError('Please enter a Tracking ID');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const data = await api.trackGrievance(id);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Grievance not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Track Grievance Real-Time</h3>
              <p className="text-xs text-slate-400">
                Check live municipal action, audit timeline, and department updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Sample Chips */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="Enter Tracking ID (e.g. GRV-2026-1001)"
                className="w-full text-sm font-mono uppercase pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !trackingId.trim()}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </form>

          {/* Quick sample buttons for evaluators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span>Quick test IDs:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setTrackingId(id);
                  handleSearch(id);
                }}
                className="font-mono bg-white hover:bg-sky-50 hover:text-sky-700 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] text-slate-700 font-medium transition-colors"
              >
                {id}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {result ? (
            <div className="space-y-5">
              {/* Grievance Overview Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-sm font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-slate-800">
                    {result.trackingId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {result.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        result.status === 'Resolved'
                          ? 'bg-emerald-500 text-white'
                          : result.status === 'In Progress'
                          ? 'bg-sky-500 text-white'
                          : 'bg-amber-400 text-slate-900'
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-base leading-snug">
                  {result.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {result.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  {result.location?.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {result.location.address}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Submitted: {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <StatusTimeline
                  statusHistory={result.statusHistory || []}
                  currentStatus={result.status}
                  officialResponse={result.officialResponse}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Enter a Tracking ID above to view live progress</p>
              <p className="text-xs text-slate-400">
                You can try sample ID <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">GRV-2026-1001</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
