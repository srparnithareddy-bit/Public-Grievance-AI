import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Search,
  PlusCircle,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Building2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  activePage,
  setActivePage,
  onOpenAIModal,
  onOpenTrackModal,
}) => {
  const { user, logout, isAdmin, isCitizen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Hackathon Badge */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  Public Grievance AI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                  HACK-P438
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                Municipal AI Triage & Resolution Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activePage === 'home'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home Portal
            </button>

            <button
              onClick={onOpenTrackModal}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Track Grievance
            </button>

            {/* Citizen Dashboard Link */}
            <button
              onClick={() => handleNav('citizen')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'citizen'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Citizen Portal
            </button>

            {/* Admin Dashboard Link */}
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'admin'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Official Queue
            </button>

            {/* AI Triage Launch Button */}
            <button
              onClick={onOpenAIModal}
              className="ml-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              AI Assistant
            </button>

            {/* Submit Grievance Action */}
            <button
              onClick={() => handleNav('submit')}
              className={`ml-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                activePage === 'submit'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-600'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              File Complaint
            </button>
          </nav>

          {/* User Account / Login State */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {user.role === 'admin'
                      ? 'Admin'
                      : user.role === 'official'
                      ? `${user.department} Officer`
                      : 'Citizen'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAIModal}
              className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100"
              title="AI Triage"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home Portal
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrackModal();
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Track Grievance
          </button>
          <button
            onClick={() => handleNav('citizen')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Citizen Dashboard
          </button>
          <button
            onClick={() => handleNav('admin')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Official Admin Queue
          </button>
          <button
            onClick={() => handleNav('submit')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold bg-sky-50 text-sky-700"
          >
            + File New Complaint
          </button>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-rose-600 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="py-2 text-center text-xs font-bold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="py-2 text-center text-xs font-bold bg-slate-900 text-white rounded-xl"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
