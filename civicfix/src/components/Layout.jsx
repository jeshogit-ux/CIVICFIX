import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Home, AlertTriangle, ShieldAlert, BarChart3, Info, Hexagon, Trophy } from 'lucide-react';
import Chatbot from './Chatbot';
import CustomCursor from './CustomCursor';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/report', icon: <AlertTriangle size={20} />, label: 'Report Issue' },
    { path: '/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { path: '/security', icon: <ShieldAlert size={20} />, label: 'Security Hub' },
    { path: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
    { path: '/about', icon: <Info size={20} />, label: 'About' },
  ];

  return (
    <div className="layout">
      <nav className="glass-panel main-nav">
        <div className="container nav-content">
          <Link to="/" className="brand" style={{ gap: '10px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hexagon size={28} color="var(--accent-cyan)" strokeWidth={1.5} />
              <div style={{ position: 'absolute', width: '8px', height: '8px', backgroundColor: 'var(--accent-purple)', borderRadius: '50%' }}></div>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>
              Civic<span style={{ color: 'var(--accent-cyan)', fontWeight: 300 }}>Fix</span>
            </h2>
          </Link>
          <div className="nav-links">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <Chatbot />
      <CustomCursor />
    </div>
  );
};

export default Layout;
