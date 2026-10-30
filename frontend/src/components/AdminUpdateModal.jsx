import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const AdminUpdateModal = ({ grievance, isOpen, onClose, onUpdated }) => {
  if (!isOpen || !grievance) return null;

  const [status, setStatus] = useState(grievance.status || 'Pending');
  const [departmentAction, setDepartmentAction] = useState(
    grievance.officialResponse?.departmentAction || ''
  );
  const [remarks, setRemarks] = useState(grievance.officialResponse?.remarks || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Please provide official remarks for the resolution record.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.updateGrievanceStatus(grievance._id, {
        status,
        departmentAction: departmentAction.trim() || `Department inspection completed for ${grievance.category}`,
        remarks: remarks.trim(),
      });

      onUpdated(res.grievance);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update grievance status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Official Department Action</h3>
              <p className="text-xs text-slate-400">
                Update status & log resolution remarks for {grievance.trackingId}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block truncate">{grievance.title}</span>
            <span className="text-slate-500 text-[11px]">
              Category: {grievance.category} • Current: {grievance.status}
            </span>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Updated Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="Pending">Pending (Under Initial Review)</option>
              <option value="In Progress">In Progress (Field Work / Crew Dispatched)</option>
              <option value="Resolved">Resolved (Work Completed & Verified)</option>
              <option value="Rejected">Rejected (Out of Municipal Scope / Invalid)</option>
            </select>
          </div>

          {/* Action Taken */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Department Action Title
            </label>
            <input
              type="text"
              value={departmentAction}
              onChange={(e) => setDepartmentAction(e.target.value)}
              placeholder="e.g. Bituminous Road Patching / Line De-energized"
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Official Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Resolution Remarks / Citizen Update Notes *
            </label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Detail the work carried out, inspection findings, contractor details, or resolution ETA..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Post Official Resolution
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
