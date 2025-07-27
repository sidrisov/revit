import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import CreateRequest from './pages/CreateRequest';
import BrowseRequests from './pages/BrowseRequests';
import ManageRequests from './pages/ManageRequests';
import RequestDetail from './pages/RequestDetail';
import AppBar from './components/AppBar';
import BottomNav from './components/BottomNav';
import OnboardingModal from './components/OnboardingModal';
import HowItWorksModal from './components/HowItWorksModal';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';
import { mockRequests } from './mockData';

const AppRoutes: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const setRequests = useStore((s) => s.setRequests);
  const location = useLocation();

  useEffect(() => {
    setRequests(mockRequests);
    if (!localStorage.getItem('revit_onboarded')) {
      setShowOnboarding(true);
    }
  }, []); // Remove setRequests dependency to prevent infinite loop

  useEffect(() => {
    if (location.pathname === '/help') {
      setShowHowItWorks(true);
    } else {
      setShowHowItWorks(false);
    }
  }, [location.pathname]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('revit_onboarded', '1');
  };

  // Always render AppBar, BottomNav, OnboardingModal, HowItWorksModal
  return (
    <>
      <Toaster position="top-center" richColors />
      <AppBar />
      <div className="pt-16 pb-32 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<CreateRequest />} />
          <Route path="/browse" element={<BrowseRequests />} />
          <Route path="/browse/:id" element={<RequestDetail />} />
          <Route path="/manage" element={<ManageRequests />} />
          <Route path="/help" element={<div />} />
        </Routes>
      </div>
      {/* Ensure BottomNav is always visible and above other content */}
      <div className="z-50">
        <BottomNav />
      </div>
      {/* Onboarding modal (welcome dialog) */}
      <OnboardingModal open={showOnboarding} onClose={handleOnboardingClose} />
      {/* How It Works modal (helper section) */}
      <HowItWorksModal
        open={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
