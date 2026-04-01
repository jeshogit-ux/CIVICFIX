import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Home, AlertTriangle, ShieldAlert, BarChart3, Info, Hexagon, Trophy, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../App';
import Chatbot from './Chatbot';
import CustomCursor from './CustomCursor';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Dynamic header on scroll down/up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Home' },
    { path: '/report', icon: <AlertTriangle size={22} />, label: 'Report' },
    { path: '/dashboard', icon: <BarChart3 size={22} />, label: 'Dashboard' },
    { path: '/security', icon: <ShieldAlert size={22} />, label: 'Security' },
    { path: '/leaderboard', icon: <Trophy size={22} />, label: 'Ranks' },
    { path: '/about', icon: <Info size={22} />, label: 'About' },
  ];

  // Page Transition Variants
  const pageVariants = {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, filter: 'blur(5px)', transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  return (
    <div className="layout">
      {/* Desktop / Tablet top nav */}
      <nav className={`glass-panel main-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <Link to="/" className="brand" style={{ gap: '10px' }}>
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Hexagon size={32} color="var(--accent-cyan)" strokeWidth={1.5} />
              <div style={{ position: 'absolute', width: '10px', height: '10px', backgroundColor: 'var(--accent-purple)', borderRadius: '50%' }}></div>
            </motion.div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
              Civic<span style={{ color: 'var(--accent-cyan)', fontWeight: 300 }}>Fix</span>
            </h2>
          </Link>
          <div className="nav-links">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="active-pill"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                    />
                  )}
                  <div className="nav-icon">{item.icon}</div>
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
            
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="theme-icon sun" /> : <Moon size={20} className="theme-icon moon" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile-only top app bar for title */}
      <header className="mobile-top-bar">
        <Link to="/" className="mobile-brand">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: 'relative', display: 'flex' }}>
            <Hexagon size={24} color="var(--accent-cyan)" strokeWidth={1.5} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '6px', height: '6px', backgroundColor: 'var(--accent-purple)', borderRadius: '50%' }}></div>
          </motion.div>
          <span className="mobile-brand-text">
            Civic<span style={{ color: 'var(--accent-cyan)', fontWeight: 300 }}>Fix</span>
          </span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mobile-page-indicator text-gradient-cyan"
          >
            {navItems.find(i => i.path === location.pathname)?.label ?? 'Home'}
          </motion.div>
          <button onClick={toggleTheme} className="theme-toggle-btn mobile-theme-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Android Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`mobile-nav-link ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active-blob"
                  className="mobile-active-blob"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <motion.div 
                whileTap={{ scale: 0.8 }}
                className="mobile-icon-wrapper"
              >
                {item.icon}
              </motion.div>
              <span className="mobile-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-transition-container"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Chatbot />
      <CustomCursor />
    </div>
  );
};

export default Layout;
