import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Tag,
  Loader2,
  RefreshCw,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { api } from '../services/api';

export const AIChatModal = ({ isOpen, onClose, onApplyTriage }) => {
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'assistant'
  
  // Triage state
  const [inputText, setInputText] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageError, setTriageError] = useState('');

  // Conversational Assistant state
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      content:
        'Hello! I am your AI Grievance Assistant powered by Gemini. You can describe your problem in simple, everyday language (e.g., broken road, water leak, garbage, or power fault), and I will help format, classify, and route it to the right department.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [suggestedTriage, setSuggestedTriage] = useState(null);

  if (!isOpen) return null;

  // Preset demo prompts for quick testing
  const samplePrompts = [
    {
      label: '⚡ Live Wire Hazard',
      text: 'Exposed live wire hanging low from a transformer near Sector 7 market. Sparks were seen this morning and children walk past it.',
    },
    {
      label: '💧 Pipe Burst Flooding',
      text: 'Underground drinking water main pipe fractured near the community hall. Clean water is gushing out and flooding the whole street.',
    },
    {
      label: '🗑️ Garbage Dump Near School',
      text: 'Municipal garbage dumpster next to the primary school gate has not been cleared for 4 days. Foul smell and stray dogs everywhere.',
    },
    {
      label: '🕳️ Dangerous Potholes',
      text: 'Multiple deep potholes on the northern flyover descent. Two motorcyclists skidded today during morning rush hour.',
    },
  ];

  // Fast Triage Handler
  const handleRunTriage = async (textToTriage) => {
    const text = textToTriage || inputText;
    if (!text.trim()) {
      setTriageError('Please enter a complaint description.');
      return;
    }

    setTriageError('');
    setIsTriaging(true);
    setTriageResult(null);

    try {
      const data = await api.triageComplaint(text);
      setTriageResult(data);
    } catch (err) {
      console.error(err);
      setTriageError(err.message || 'AI Triage failed. Please try again.');
    } finally {
      setIsTriaging(false);
    }
  };

  // Conversational Chat Handler
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = { sender: 'user', content: chatInput.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setChatInput('');
    setIsChatting(true);

    try {
      const res = await api.chatWithAI(updatedMessages, chatInput);
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', content: res.reply || 'Thank you for providing the details.' },
      ]);
      if (res.suggestedTriage) {
        setSuggestedTriage(res.suggestedTriage);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. You can still use the Quick AI Triage tab to format your complaint!',
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleApply = (result) => {
    onApplyTriage(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                AI Complaint Triage Engine
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                  Gemini API
                </span>
              </h3>
              <p className="text-xs text-sky-100">
                Natural Language Parsing & Automatic Urgency/Department Classification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('triage')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'triage'
                ? 'bg-white text-sky-700 border-sky-600 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Wand2 className="w-4 h-4 text-sky-600" />
            Quick AI Triage & Parsing
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'assistant'
                ? 'bg-white text-indigo-700 border-indigo-600 shadow-xs'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Conversational Complaint Assistant
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'triage' ? (
            /* TAB 1: QUICK TRIAGE */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Describe Your Problem in Natural Language
                </label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Broken road pipe near main junction is leaking huge amounts of water, creating deep mud and blocking two-wheelers..."
                  className="w-full text-sm p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-slate-400"
                />
              </div>

              {/* Sample Prompts */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Or test with sample citizen scenarios:
                </span>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(p.text);
                        handleRunTriage(p.text);
                      }}
                      className="text-xs bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl px-3 py-1.5 font-medium transition-colors text-slate-700"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Triage Action Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleRunTriage()}
                  disabled={isTriaging || !inputText.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isTriaging ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      Auto-Triage Complaint
                    </>
                  )}
                </button>
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText('');
                      setTriageResult(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 p-2"
                  >
                    Clear Text
                  </button>
                )}
              </div>

              {triageError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {triageError}
                </div>
              )}

              {/* Triage Output Card */}
              {triageResult && (
                <div className="mt-5 p-5 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-200/80 shadow-xs space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                    <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      AI Structured Extraction
                    </span>
                    <span className="text-[11px] text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      Confidence: {Math.round((triageResult.confidenceScore || 0.95) * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Assigned Department
                      </span>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Tag className="w-3.5 h-3.5 text-sky-600" />
                        {triageResult.category}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Calculated Urgency
                      </span>
                      <span
                        className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${
                          triageResult.urgency === 'Critical'
                            ? 'text-rose-600'
                            : triageResult.urgency === 'High'
                            ? 'text-amber-600'
                            : 'text-sky-600'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {triageResult.urgency} Urgency
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Generated Complaint Title
                    </span>
                    <h4 className="text-sm font-bold text-slate-800">{triageResult.title}</h4>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Executive Summary
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{triageResult.summary}</p>
                  </div>

                  {triageResult.actionableRecommendations?.length > 0 && (
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        AI Recommended Action Steps for Authorities
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {triageResult.actionableRecommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleApply({
                        ...triageResult,
                        rawDescription: inputText,
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Apply AI Recommendations to Complaint Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: CONVERSATIONAL ASSISTANT */
            <div className="flex flex-col h-[450px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${
                      m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        m.sender === 'user'
                          ? 'bg-sky-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {m.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    AI Assistant is thinking...
                  </div>
                )}
              </div>

              {/* Chat Suggested Triage Card */}
              {suggestedTriage && (
                <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-indigo-900 block">
                      AI Extracted: {suggestedTriage.category} ({suggestedTriage.urgency} Urgency)
                    </span>
                    <span className="text-slate-600 text-[11px] line-clamp-1">
                      {suggestedTriage.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleApply(suggestedTriage)}
                    className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    Apply <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message to the assistant..."
                  className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
