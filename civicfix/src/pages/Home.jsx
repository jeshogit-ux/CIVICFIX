import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="container home-page">
      <header className="hero">
        <h1 className="hero-title">
          Empowering citizens for a <br />
          <span className="text-gradient">Smarter, Safer City</span>
        </h1>
        <p className="hero-subtitle">
          Securely report civic issues, track government response in real-time, and stay ahead of local scams with our integrated urban tracker.
        </p>
        <div className="hero-actions">
          <Link to="/report" className="btn-primary">Report an Issue</Link>
          <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
        </div>
      </header>
      
      <section className="features-grid">
        <div className="glass-panel feature-card">
          <div className="icon-wrapper" style={{background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)'}}>
            <MapPin size={24} />
          </div>
          <h3>Geo-Tagged Reports</h3>
          <p>Instantly document unpaved roads, illegal parking, or broken lights with precise GPS locators ensuring rapid authority deployment.</p>
        </div>
        <div className="glass-panel feature-card">
          <div className="icon-wrapper" style={{background: 'rgba(138, 43, 226, 0.1)', color: 'var(--accent-purple)'}}>
            <Activity size={24} />
          </div>
          <h3>Live Progress</h3>
          <p>Track the lifecycle of your complaint. Receive updates when local agencies transition reports from "Assigned" to "Resolved".</p>
        </div>
        <div className="glass-panel feature-card">
          <div className="icon-wrapper" style={{background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)'}}>
            <ShieldCheck size={24} />
          </div>
          <h3>Security Awareness Hub</h3>
          <p>Educate yourself against social engineering tactics. View proactive local alerts on tax scams and phishy utility bill texts targeting citizens.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
