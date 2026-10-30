import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, User, Building } from 'lucide-react';

export const StatusTimeline = ({ statusHistory = [], currentStatus = 'Pending', officialResponse }) => {
  const steps = [
    { key: 'Pending', label: 'Complaint Registered', desc: 'AI triage completed and queued' },
    { key: 'In Progress', label: 'Under Department Review', desc: 'Assigned to field authorities' },
    { key: 'Resolved', label: 'Action Taken & Resolved', desc: 'Issue inspected & addressed' },
  ];

  // Helper to determine step status
  const getStepState = (stepIndex) => {
    const statusOrder = ['Pending', 'In Progress', 'Resolved'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    if (currentStatus === 'Rejected') {
      return stepIndex === 0 ? 'completed' : 'rejected';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="py-3">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Resolution Progress Tracker
      </h4>

      {/* Visual Step Progress Bar */}
      <div className="relative flex items-center justify-between mb-8 px-2">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className={`h-full transition-all duration-500 ${
              currentStatus === 'Resolved'
                ? 'w-full bg-emerald-500'
                : currentStatus === 'In Progress'
                ? 'w-1/2 bg-sky-500'
                : 'w-0 bg-slate-300'
            }`}
          />
        </div>

        {steps.map((step, idx) => {
          const state = getStepState(idx);
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                  state === 'completed'
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : state === 'active'
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {state === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : state === 'active' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center max-w-[90px] ${
                  state === 'active' ? 'text-sky-700 font-semibold' : state === 'completed' ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed History Log */}
      <div className="space-y-3 mt-6 border-t border-slate-100 pt-4">
        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Official Audit History ({statusHistory.length} updates)
        </h5>

        {statusHistory.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No historical updates logged yet.</p>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {statusHistory.map((item, i) => (
              <div key={i} className="relative text-sm">
                <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-white" />
                <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {item.updatedBy || 'Authority'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    {item.comment}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Status: {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Response Highlight if exists */}
      {officialResponse?.remarks && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official Department Action Taken
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            "{officialResponse.remarks}"
          </p>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-3">
            <span>By: {officialResponse.respondedBy || 'Municipal Official'}</span>
            {officialResponse.respondedAt && (
              <span>• {new Date(officialResponse.respondedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
