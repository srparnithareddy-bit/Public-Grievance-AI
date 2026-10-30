import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  MapPin,
  User,
  Mail,
  Phone,
  Sparkles,
  Lightbulb,
  Building,
  Calendar,
  AlertTriangle,
  Edit3,
} from 'lucide-react';
import { StatusTimeline } from './StatusTimeline';

export const GrievanceDetailModal = ({
  grievance,
  isOpen,
  onClose,
  onOpenUpdateModal,
  isAdmin = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !grievance) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(grievance.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold bg-sky-600/30 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-lg flex items-center gap-2">
              {grievance.trackingId}
              <button
                onClick={handleCopyId}
                className="hover:text-white transition-colors p-0.5"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {grievance.category}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                grievance.urgency === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : grievance.urgency === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {grievance.urgency} Urgency
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xl leading-snug">
                {grievance.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Submitted on {new Date(grievance.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                grievance.status === 'Resolved'
                  ? 'bg-emerald-500 text-white'
                  : grievance.status === 'In Progress'
                  ? 'bg-sky-500 text-white'
                  : 'bg-amber-400 text-slate-900'
              }`}
            >
              {grievance.status}
            </span>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Citizen Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {grievance.description}
            </p>
          </div>

          {/* Location & Citizen Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                Location & Landmark
              </h4>
              <p className="text-sm font-semibold text-slate-800">
                {grievance.location?.address || 'Not specified'}
              </p>
              {grievance.location?.landmark && (
                <p className="text-xs text-slate-500">
                  Landmark: {grievance.location.landmark}
                </p>
              )}
              {grievance.location?.wardOrPincode && (
                <p className="text-xs text-slate-500">
                  Ward / Pincode: {grievance.location.wardOrPincode}
                </p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" />
                Citizen Contact
              </h4>
              <p className="text-sm font-semibold text-slate-800">
                {grievance.citizen?.name || 'Anonymous Citizen'}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {grievance.citizen?.email || 'N/A'}
              </p>
              {grievance.citizen?.phone && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {grievance.citizen.phone}
                </p>
              )}
            </div>
          </div>

          {/* AI Triage Analysis Block */}
          {grievance.aiTriage && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-sky-50/60 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  AI Triage Diagnostic
                </span>
                <span className="text-[10px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                  Auto-Analyzed by Gemini
                </span>
              </div>

              {grievance.aiTriage.summary && (
                <p className="text-xs text-slate-700 italic">
                  "{grievance.aiTriage.summary}"
                </p>
              )}

              {grievance.aiTriage.actionableRecommendations?.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Recommended Department Action Steps:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {grievance.aiTriage.actionableRecommendations.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Status Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <StatusTimeline
              statusHistory={grievance.statusHistory || []}
              currentStatus={grievance.status}
              officialResponse={grievance.officialResponse}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenUpdateModal(grievance);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Update Status & Resolution
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
