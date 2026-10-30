import React, { useState } from 'react';
import {
  Droplets,
  Trash2,
  Construction,
  Zap,
  ShieldAlert,
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export const GrievanceCard = ({ grievance, onViewDetails, onOpenUpdateModal, isAdmin = false }) => {
  const [copied, setCopied] = useState(false);

  // Category Icon & Styling
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'Water':
        return { icon: Droplets, color: 'text-sky-600 bg-sky-50 border-sky-200' };
      case 'Sanitation':
        return { icon: Trash2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'Roads':
        return { icon: Construction, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'Electricity':
        return { icon: Zap, color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'Public Safety':
        return { icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      default:
        return { icon: HelpCircle, color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  // Urgency Styling
  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 ring-1 ring-rose-300';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Status Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500 text-white';
      case 'In Progress':
        return 'bg-sky-500 text-white';
      case 'Rejected':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-amber-400 text-slate-900';
    }
  };

  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(grievance.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const meta = getCategoryMeta(grievance.category);
  const CategoryIcon = meta.icon;

  return (
    <div
      onClick={() => onViewDetails(grievance)}
      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 hover:border-sky-300 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Header: Tracking ID & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5">
              {grievance.trackingId}
              <button
                onClick={handleCopyId}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                title="Copy Tracking ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </span>

            {/* AI Triaged Badge */}
            {grievance.aiTriage?.confidenceScore && (
              <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI Triaged
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(
                grievance.urgency
              )}`}
            >
              {grievance.urgency} Urgency
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(
                grievance.status
              )}`}
            >
              {grievance.status}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors line-clamp-2 mb-2">
          {grievance.title}
        </h3>

        {/* Description Snippet */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
          {grievance.description}
        </p>

        {/* Location & Department Metadata */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md border ${meta.color}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-700">{grievance.category} Department</span>
          </div>

          {grievance.location?.address && (
            <div className="flex items-start gap-1.5 text-slate-600 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span className="truncate">
                {grievance.location.address}
                {grievance.location.landmark ? ` (${grievance.location.landmark})` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {new Date(grievance.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenUpdateModal(grievance);
              }}
              className="text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg transition-colors"
            >
              Update Status
            </button>
          )}

          <span className="text-sky-600 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
