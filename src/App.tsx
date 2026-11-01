import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DiscoverView } from './components/DiscoverView';
import { MatchesView } from './components/MatchesView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PremiumModal } from './components/PremiumModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FC] text-[#1E1B2E]">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'matches' && <MatchesView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <OnboardingModal />
      <PremiumModal />
      <MatchCelebrationModal />
      <ReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
