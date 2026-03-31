import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, List, Clock, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import L from 'leaflet';
import './Dashboard.css';

// Fix leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DashboardMap = ({ userLocation, reports }) => {
  const mapContainerRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (mapInstanceRef.current === null && mapContainerRef.current) {
      // Initialize map once
      const map = L.map(mapContainerRef.current).setView(userLocation, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors' // Removed zoom control config here to keep default UI
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userLocation, 13, { animate: true });
    }
  }, [userLocation]);

  React.useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear old markers securely
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      // Add new markers
      reports.forEach(report => {
        const marker = L.marker([report.lat, report.lng]).addTo(mapInstanceRef.current);
        const popupContent = `
          <div style="color: #000; font-family: var(--font-main)">
            <strong style="font-size: 1.1rem; color: #333">${report.type} Issue</strong>
            <div style="margin-top: 4px; display: flex; align-items: center; gap: 6px">
              <span style="background: ${report.status === 'Resolved' ? '#e0fce5' : '#e0f2fe'}; color: ${report.status === 'Resolved' ? '#00e676' : '#0047ff'}; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600">${report.status}</span>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 0.9rem; color: #555">${report.location}</p>
            <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #888">ID: ${report.id} &bull; ${report.date}</p>
          </div>
        `;
        marker.bindPopup(popupContent);
      });
    }
  }, [reports]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(100%)', zIndex: 0 }} />;
};

const Dashboard = () => {
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([12.8236, 80.0435]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      }, (err) => {
        console.warn('Geolocation blocked or failed in dashboard', err);
      });
    }
  }, []);

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
             
             let locPreview = 'Location securely stored';
             let issueDesc = issue.description || '';
             let locMatch = issueDesc.match(/\(Location: (.*?)\)/);
             if (locMatch) locPreview = locMatch[1];

             const lat = issue.location?.lat || (12.8236 + (Math.random() * 0.02 - 0.01));
             const lng = issue.location?.lng || (80.0435 + (Math.random() * 0.02 - 0.01));

             return {
               _id: issue._id,
               id: 'CFX-' + (issue._id ? issue._id.substring(issue._id.length - 6).toUpperCase() : '0000'),
               type: issue.category ? issue.category.charAt(0).toUpperCase() + issue.category.slice(1) : 'General',
               location: locPreview,
               status: displayStatus,
               date: new Date(issue.createdAt).toLocaleDateString(),
               icon: icon,
               lat,
               lng
             };
          });
          setReports(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch reports', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleResolve = async (report) => {
    if (report.status === 'Resolved') return;
    setResolvingId(report._id);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const res = await fetch(`${API_URL}/api/issues/${report._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });
      if (res.ok) {
        setReports(prev => prev.map(r =>
          r._id === report._id ? { ...r, status: 'Resolved', icon: <CheckCircle size={20} color="var(--accent-green)" /> } : r
        ));
      }
    } catch (err) {
      console.error('Failed to resolve issue', err);
    } finally {
      setResolvingId(null);
    }
  };

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
            <MapIcon size={20} /> Map View
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
                    <span className={`status-badge ${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span>
                  </div>
                  <h3>{report.type} Issue</h3>
                  <p>{report.location} &bull; Reported {report.date}</p>
                </div>
                <div className="report-action">
                  {report.status !== 'Resolved' ? (
                    <button
                      className="resolve-btn"
                      onClick={() => handleResolve(report)}
                      disabled={resolvingId === report._id}
                      title="Mark as Resolved"
                    >
                      {resolvingId === report._id ? '...' : <CheckCircle size={18} />}
                      {resolvingId === report._id ? 'Saving' : 'Resolve'}
                    </button>
                  ) : (
                    <span className="resolved-badge"><CheckCircle size={16} /> Done</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ height: '600px', width: '100%', position: 'relative', overflow: 'hidden', padding: 0 }}>
            <DashboardMap userLocation={userLocation} reports={filteredReports} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.8)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,240,255,0.3)', backdropFilter: 'blur(10px)', color: '#fff', pointerEvents: 'none', zIndex: 1000 }}>
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
