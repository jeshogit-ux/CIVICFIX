import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import SecurityHub from './pages/SecurityHub';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="security" element={<SecurityHub />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
