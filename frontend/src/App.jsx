import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { GrievanceSubmitPage } from './pages/GrievanceSubmitPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AIChatModal } from './components/AIChatModal';
import { TrackModal } from './components/TrackModal';
import { GrievanceDetailModal } from './components/GrievanceDetailModal';
import { AdminUpdateModal } from './components/AdminUpdateModal';
import { NotificationToast } from './components/NotificationToast';
import { Shield, Sparkles, Heart } from 'lucide-react';

function AppContent() {
  const { user, isAdmin } = useAuth();

  // Navigation State
  const [activePage, setActivePage] = useState('home');

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackDefaultId, setTrackDefaultId] = useState('');

  // Selected Grievance for Detail view
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  // Grievance to update in Admin modal
  const [grievanceToUpdate, setGrievanceToUpdate] = useState(null);

  // Pre-filled data transferred from AI Triage Modal to Submit Page
  const [triagePrefillData, setTriagePrefillData] = useState(null);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Callback when AI Triage produces structured data
  const handleApplyTriage = (triageData) => {
    setTriagePrefillData(triageData);
    setActivePage('submit');
    showNotification('AI recommendations applied to complaint form!');
  };

  // Open Track Modal with an optional specific ID
  const handleOpenTrackModal = (id = '') => {
    setTrackDefaultId(id);
    setIsTrackModalOpen(true);
  };

  // Handle updated status from AdminUpdateModal
  const handleGrievanceUpdated = (updated) => {
    showNotification(`Status updated to ${updated.status} successfully!`);
    if (selectedGrievance && selectedGrievance._id === updated._id) {
      setSelectedGrievance(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenTrackModal={() => handleOpenTrackModal('')}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <LandingPage
            onNavigate={setActivePage}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            onOpenTrackModal={handleOpenTrackModal}
            onViewGrievance={(g) => setSelectedGrievance(g)}
          />
        )}

        {activePage === 'citizen' && (
          <CitizenDashboard
            onNavigate={setActivePage}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            onOpenTrackModal={handleOpenTrackModal}
            onViewGrievance={(g) => setSelectedGrievance(g)}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            onNavigate={setActivePage}
            onViewGrievance={(g) => setSelectedGrievance(g)}
            onOpenUpdateModal={(g) => setGrievanceToUpdate(g)}
            showNotification={showNotification}
          />
        )}

        {activePage === 'submit' && (
          <GrievanceSubmitPage
            initialTriageData={triagePrefillData}
            onNavigate={setActivePage}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            onOpenTrackModal={handleOpenTrackModal}
            showNotification={showNotification}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onNavigate={setActivePage}
            showNotification={showNotification}
          />
        )}

        {activePage === 'register' && (
          <RegisterPage
            onNavigate={setActivePage}
            showNotification={showNotification}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-700">Public Grievance AI Assistant</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              Problem ID: HACK-P438
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Tech Stack: React • Vite • Node/Express • MongoDB • Google Gemini</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Built for College Hackathon 2026</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AIChatModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyTriage={handleApplyTriage}
      />

      <TrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        defaultTrackingId={trackDefaultId}
      />

      <GrievanceDetailModal
        grievance={selectedGrievance}
        isOpen={Boolean(selectedGrievance)}
        onClose={() => setSelectedGrievance(null)}
        onOpenUpdateModal={(g) => {
          setSelectedGrievance(null);
          setGrievanceToUpdate(g);
        }}
        isAdmin={isAdmin}
      />

      <AdminUpdateModal
        grievance={grievanceToUpdate}
        isOpen={Boolean(grievanceToUpdate)}
        onClose={() => setGrievanceToUpdate(null)}
        onUpdated={handleGrievanceUpdated}
      />

      {/* Global Floating Toast */}
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
