import React, { useState, useEffect } from 'react';
import { Camera, MapPin, UploadCloud, AlertCircle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import L from 'leaflet';
import './ReportIssue.css';

// Fix leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ReportMap = ({ formData, setFormData }) => {
  const mapContainerRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markerRef = React.useRef(null);

  React.useEffect(() => {
    if (mapInstanceRef.current === null && mapContainerRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([formData.lat, formData.lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add draggable marker
      const marker = L.marker([formData.lat, formData.lng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Ensure marker updates coordinate state on drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updateLocationData(pos.lat, pos.lng);
      });

      // Handle map clicks
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocationData(lat, lng);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateLocationData = (lat, lng) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          setFormData(prev => ({ ...prev, location: data.display_name, lat, lng }));
        }
      })
      .catch(console.error);
  };

  // Sync external changes (like Geolocation load) with map
  React.useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newPos = [formData.lat, formData.lng];
      markerRef.current.setLatLng(newPos);
      mapInstanceRef.current.flyTo(newPos, mapInstanceRef.current.getZoom(), { animate: true });
    }
  }, [formData.lat, formData.lng]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(100%)', zIndex: 0 }} />;
};

const ReportIssue = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    category: '', 
    description: '', 
    location: '',
    username: '',
    lat: 12.8236, // default
    lng: 80.0435
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleAutoCategorize = async () => {
    if (!formData.description) return alert("Please enter a description first.");
    setIsCategorizing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const res = await fetch(`${API_URL}/api/ai/categorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description })
      });
      const data = await res.json();
      if (res.ok && data.category) {
        const validCategories = ["infrastructure", "sanitation", "traffic", "utilities"];
        if (validCategories.includes(data.category)) {
          setFormData(prev => ({ ...prev, category: data.category }));
        } else {
          alert(`AI suggested "${data.category}" which doesn't match standard categories.`);
        }
      } else {
        alert("AI couldn't categorize. " + (data.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to AI service.");
    } finally {
      setIsCategorizing(false);
    }
  };

  useEffect(() => {
    if (step === 2 && !locationLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
        setLocationLoaded(true);
        // Reverse geocode
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name && !formData.location) {
              setFormData(prev => ({ ...prev, location: data.display_name }));
            }
          })
          .catch(console.error);
      }, (err) => {
        console.warn('Geolocation error:', err);
      });
    }
  }, [step, locationLoaded, formData.location]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isNextDisabled = () => {
    if (step === 1) return !formData.category || !formData.description.trim();
    if (step === 2) return !formData.location || !formData.location.trim();
    return false;
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await fetch(`${API_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.category ? formData.category.toUpperCase() : 'General Issue',
          description: formData.description + (formData.location ? ` (Location: ${formData.location})` : ''),
          category: formData.category || 'General',
          location: { lat: formData.lat, lng: formData.lng },
          imageUrl: formData.imageBase64 || null,
          username: formData.username
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setTrackingId(data._id ? data._id.substring(data._id.length - 6).toUpperCase() : '8924');
        nextStep();
      } else {
        alert('Failed to submit: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to Server. Make sure the backend is running on port 5002.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container report-page animate-fade-in">
      <div className="report-header animate-slide-up animate-delay-1">
        <h1 className="text-gradient">Report a Civic Issue</h1>
        <p>Your report is completely anonymous and will be routed to the appropriate city department.</p>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            {/* simple visual steps */}
            <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
          <div className="step-labels">
            <span>Details</span>
            <span>Location</span>
            <span>Evidence</span>
          </div>
        </div>
      </div>

      <div className="glass-panel form-container animate-slide-up animate-delay-2">
        {step === 1 && (
          <div className="form-step">
            <h3>Issue Details</h3>
            <div className="form-group">
              <label>Category</label>
              <select className="input-field select-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="" disabled>Select a category...</option>
                <option value="infrastructure">Infrastructure (Potholes, Sidewalks)</option>
                <option value="sanitation">Sanitation & Garbage</option>
                <option value="traffic">Traffic & Illegal Parking</option>
                <option value="utilities">Utilities (Streetlights, Water)</option>
              </select>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Description</label>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                  onClick={handleAutoCategorize}
                  disabled={isCategorizing || !formData.description}
                >
                  {isCategorizing ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                  Auto-Categorize
                </button>
              </div>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="Briefly describe the issue... then click Auto-Categorize!"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Citizen Handle (Required for Leaderboard XP)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. CitySaver99"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Pin Location</h3>
            <div className="map-wrapper" style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', zIndex: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '20px', zIndex: 1000, color: 'white', fontWeight: 500, backdropFilter: 'blur(5px)', pointerEvents: 'none' }}>
                Click or drag pin to set precise location
              </div>
              <ReportMap formData={formData} setFormData={setFormData} />
            </div>
            <div className="form-group" style={{marginTop: '20px'}}>
              <label>Confirm Address or Intersection</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Corner of 5th and Main St"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3>Photo Evidence</h3>
            <div className="upload-zone" style={{ position: 'relative', overflow: 'hidden' }}>
              {formData.imagePreview ? (
                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={formData.imagePreview} alt="Evidence Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    className="btn-secondary" 
                    style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', border: 'none', color: '#fff' }}
                    onClick={() => setFormData({...formData, imageBase64: null, imagePreview: null})}
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  <UploadCloud size={48} color="var(--accent-cyan)" />
                  <h4>Drag & drop images here</h4>
                  <p>or click to browse from your device</p>
                  <span className="upload-hint">Uploads are scrubbed of personal metadata to ensure anonymity.</span>
                  <button className="btn-secondary" style={{marginTop: '16px', pointerEvents: 'none'}}><Camera size={16} style={{display:'inline', marginRight:'8px'}}/> Take Photo</button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step success-step">
            <CheckCircle2 size={64} color="var(--accent-green)" />
            <h2 className="text-gradient" style={{marginTop: '16px'}}>Report Submitted Successfully</h2>
            <p>Your tracking ID is <strong style={{color: 'var(--accent-cyan)'}}>#CFX-{trackingId || '8924'}</strong></p>
            <p className="karma-reward">You earned +50 Civic Karma points!</p>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && step < 4 && <button className="btn-secondary" onClick={prevStep} disabled={isSubmitting}>Back</button>}
          {step < 3 && <button className="btn-primary" onClick={nextStep} disabled={isSubmitting || isNextDisabled()}>Next Step</button>}
          {step === 3 && (
            <button 
              className="btn-primary" 
              onClick={submitReport} 
              disabled={isSubmitting}
              style={{background: 'linear-gradient(135deg, var(--accent-green), #00b359)', opacity: isSubmitting ? 0.7 : 1}}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
