import React, { useState, useEffect } from 'react';
import { Search, Map, List, Clock, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
        const response = await fetch(`${API_URL}/api/issues`);
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(issue => {
             let icon = <AlertTriangle size={20} color="var(--accent-warning)"/>;
             if (issue.status === 'In Progress' || issue.status === 'Assigned') icon = <Clock size={20} color="var(--accent-cyan)"/>;
             if (issue.status === 'Resolved') icon = <CheckCircle size={20} color="var(--accent-green)"/>;

             const displayStatus = issue.status === 'Pending' ? 'Reported' : issue.status;
             
             // Extract location preview if available
             let locPreview = 'Location securely stored';
             let issueDesc = issue.description || '';
             let locMatch = issueDesc.match(/\(Location: (.*?)\)/);
             if (locMatch) locPreview = locMatch[1];

             return {
               id: 'CFX-' + (issue._id ? issue._id.substring(issue._id.length - 6).toUpperCase() : '0000'),
               type: issue.category || 'General',
               location: locPreview,
               status: displayStatus,
               date: new Date(issue.createdAt).toLocaleDateString(),
               icon: icon
             };
          });
          setReports(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
        // Fallback to empty if error is caught
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    if (filter === 'All') return true;
    if (filter === 'In Progress' && report.status === 'Reported') return true;
    return report.status === filter;
  });

  return (
    <div className="container dashboard-page animate-fade-in">
      <div className="dashboard-header animate-slide-up animate-delay-1">
        <div>
          <h2 className="text-gradient">City Progress Dashboard</h2>
          <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>Track the status of civic issues reported in your area.</p>
        </div>
        <div className="view-toggle">
          <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <List size={20} /> List View
          </button>
          <button className={`toggle-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>
            <Map size={20} /> Map View
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="filters glass-panel animate-slide-up animate-delay-2">
          <div className="search-bar">
            <Search size={20} color="var(--text-secondary)" />
            <input type="text" placeholder="Search by Tracking ID or Location..." className="search-input" />
          </div>
          <div className="filter-tags">
            <span className={`filter-tag ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</span>
            <span className={`filter-tag ${filter === 'In Progress' ? 'active' : ''}`} onClick={() => setFilter('In Progress')}>In Progress</span>
            <span className={`filter-tag ${filter === 'Assigned' ? 'active' : ''}`} onClick={() => setFilter('Assigned')}>Assigned</span>
            <span className={`filter-tag ${filter === 'Resolved' ? 'active' : ''}`} onClick={() => setFilter('Resolved')}>Resolved</span>
          </div>
        </div>

        {view === 'list' ? (
          <div className="reports-list">
            {isLoading ? (
              <div className="glass-panel" style={{textAlign: 'center', padding: '40px'}}>
                <Clock size={48} color="var(--accent-cyan)" style={{animation: 'spin 2s linear infinite'}} />
                <h3>Loading live reports...</h3>
                <p>Fetching data from CivicFix Backend.</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="glass-panel" style={{textAlign: 'center', padding: '40px'}}>
                <h3>No reports found</h3>
                <p>There are currently no civic issues reported.</p>
              </div>
            ) : filteredReports.map(report => (
              <div key={report.id} className="glass-panel report-card">
                <div className="report-icon">{report.icon}</div>
                <div className="report-details">
                  <div className="report-header-line">
                    <span className="tracking-id">{report.id}</span>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>{report.status}</span>
                  </div>
                  <h3>{report.type} Issue</h3>
                  <p>{report.location} • Reported {report.date}</p>
                </div>
                <div className="report-action">
                  <ChevronRight size={24} color="var(--text-secondary)" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ height: '600px', width: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}>
            <iframe
              title="City Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src="https://www.openstreetmap.org/export/embed.html?bbox=80.035,12.815,80.050,12.835&layer=mapnik&marker=12.8236,80.0435"
              style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(100%)', border: 'none', display: 'block' }}
            ></iframe>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.8)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.3)', backdropFilter: 'blur(10px)', color: '#fff', pointerEvents: 'none' }}>
              <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-cyan)' }}></div>
                Active Reports Region
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Showing live civic issues in the mapped bounds.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
