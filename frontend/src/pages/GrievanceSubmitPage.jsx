import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  MapPin,
  User,
  Mail,
  Phone,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const GrievanceSubmitPage = ({
  initialTriageData,
  onNavigate,
  onOpenAIModal,
  onOpenTrackModal,
  showNotification,
}) => {
  const { user } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [urgency, setUrgency] = useState('Medium');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [wardOrPincode, setWardOrPincode] = useState('');
  const [citizenName, setCitizenName] = useState(user?.name || '');
  const [citizenEmail, setCitizenEmail] = useState(user?.email || '');
  const [citizenPhone, setCitizenPhone] = useState(user?.phone || '');

  // AI Triage meta
  const [aiData, setAiData] = useState(null);

  // Submission Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedGrievance, setSubmittedGrievance] = useState(null);
  const [copied, setCopied] = useState(false);

  // Pre-fill from initialTriageData or user session
  useEffect(() => {
    if (initialTriageData) {
      if (initialTriageData.title) setTitle(initialTriageData.title);
      if (initialTriageData.category) setCategory(initialTriageData.category);
      if (initialTriageData.urgency) setUrgency(initialTriageData.urgency);
      if (initialTriageData.rawDescription) setDescription(initialTriageData.rawDescription);
      setAiData(initialTriageData);
    }
  }, [initialTriageData]);

  useEffect(() => {
    if (user) {
      if (!citizenName) setCitizenName(user.name || '');
      if (!citizenEmail) setCitizenEmail(user.email || '');
      if (!citizenPhone) setCitizenPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide both a title and description of your grievance.');
      return;
    }
    if (!citizenName.trim() || !citizenEmail.trim()) {
      setErrorMessage('Please provide citizen contact name and email.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        urgency,
        location: {
          address: address.trim() || 'Ward jurisdiction',
          landmark: landmark.trim(),
          wardOrPincode: wardOrPincode.trim(),
        },
        citizen: {
          userId: user?.id || null,
          name: citizenName.trim(),
          email: citizenEmail.trim(),
          phone: citizenPhone.trim(),
        },
        aiTriage: aiData || {
          summary: description.slice(0, 150),
          actionableRecommendations: [
            `Dispatch municipal field inspection for ${category} department.`,
          ],
          confidenceScore: 0.9,
          detectedKeywords: [category.toLowerCase()],
        },
      };

      const res = await api.submitGrievance(payload);
      setSubmittedGrievance(res.grievance);
      showNotification('Grievance registered successfully! Save your Tracking ID.');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (submittedGrievance?.trackingId) {
      navigator.clipboard.writeText(submittedGrievance.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            Citizen Grievance Submission
          </span>
          <span className="text-xs text-slate-400">• Problem ID: HACK-P438</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          File a Public Grievance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Report issues regarding roads, sanitation, water, power, or safety to city municipal officials.
        </p>
      </div>

      {/* AI Assistant Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Need help drafting your complaint?</h4>
            <p className="text-xs text-sky-100">
              Gemini AI will automatically suggest the Title, Department, and Urgency level.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAIModal}
          className="shrink-0 px-4 py-2 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Launch AI Triage
        </button>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Complaint Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-600" />
            1. Complaint Overview
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Overflowing Sewage and Waterlogging on 5th Cross Road"
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category / Department *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
              >
                <option value="Sanitation">Sanitation & Solid Waste</option>
                <option value="Water">Water Supply & Drainage</option>
                <option value="Roads">Roads, Bridges & Potholes</option>
                <option value="Electricity">Electricity & Power Grid</option>
                <option value="Public Safety">Public Safety & Lighting</option>
                <option value="General">General Municipal Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Urgency Level *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
              >
                <option value="Low">Low - Cosmetic or Routine</option>
                <option value="Medium">Medium - Regular Attention Required</option>
                <option value="High">High - Significant Disruption / Health Hazard</option>
                <option value="Critical">Critical - Imminent Hazard / Danger</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description of Grievance *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, how long it has persisted, and how it impacts the neighborhood..."
              className="w-full text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400 leading-relaxed"
              required
            />
          </div>
        </div>

        {/* AI Recommendations Box if prefilled */}
        {aiData?.actionableRecommendations?.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Attached Recommendations for Authorities
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {aiData.actionableRecommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold shrink-0">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 2: Location Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-600" />
            2. Location & Ward Details
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Street Address / Area *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 4th Cross Road, Gandhi Nagar"
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nearby Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Shiva Temple / Next to Bank ATM"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ward Number or Pincode
              </label>
              <input
                type="text"
                value={wardOrPincode}
                onChange={(e) => setWardOrPincode(e.target.value)}
                placeholder="e.g. Ward 12 / 560034"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Citizen Contact Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-600" />
            3. Citizen Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Citizen Name"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="text"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('citizen')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering Grievance...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Grievance
              </>
            )}
          </button>
        </div>
      </form>

      {/* Submission Success Dialog */}
      {submittedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 text-center space-y-5 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-slate-900">
                Grievance Submitted!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your complaint has been queued for municipal review and assigned a unique Tracking ID.
              </p>
            </div>

            {/* Tracking ID Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Your Unique Tracking ID
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg font-extrabold text-sky-700">
                  {submittedGrievance.trackingId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Copy Tracking ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const id = submittedGrievance.trackingId;
                  setSubmittedGrievance(null);
                  onOpenTrackModal(id);
                }}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                Track This Grievance Now <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSubmittedGrievance(null);
                  onNavigate('citizen');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Go to Citizen Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
