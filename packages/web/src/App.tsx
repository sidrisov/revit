import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateRequest from './pages/CreateRequest';
import BrowseRequests from './pages/BrowseRequests';
import ManageRequests from './pages/ManageRequests';
import { useStore } from './store/useStore';
import { mockRequests } from './mockData';

const App: React.FC = () => {
  const setRequests = useStore((s) => s.setRequests);

  useEffect(() => {
    setRequests(mockRequests);
  }, [setRequests]);

  return (
    <Router>
      <nav
        style={{
          display: 'flex',
          gap: 16,
          padding: 16,
          borderBottom: '1px solid #eee',
        }}>
        <Link to="/">Create Request</Link>
        <Link to="/browse">Browse Requests</Link>
        <Link to="/manage">Manage Requests</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CreateRequest />} />
        <Route path="/browse" element={<BrowseRequests />} />
        <Route path="/manage" element={<ManageRequests />} />
      </Routes>
    </Router>
  );
};

export default App;
