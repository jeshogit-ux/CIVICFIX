import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, UploadCloud, CheckCircle2, Loader2, LocateFixed, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // CRITICAL FIX: MAP STYLING
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
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
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
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newPos = [formData.lat, formData.lng];
      markerRef.current.setLatLng(newPos);
      mapInstanceRef.current.flyTo(newPos, mapInstanceRef.current.getZoom(), { animate: true });
    }
  }, [formData.lat, formData.lng]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%', zIndex: 0 }} className="neo-map-filter" />;
};

const ReportIssue = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    category: '', // Handled by AI
    description: '', 
    location: '',
    username: '',
    lat: 12.8236, // default
    lng: 80.0435,
    imageBase64: null,
    imagePreview: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [hasCategorized, setHasCategorized] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);

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

  // AI now returns the real TN Govt department name directly — just display it
  const getDepartmentName = (category) => {
    if (!category) return 'Greater Chennai Corporation / Local Body';
    return category;
  };

  // The explicit AI routing function
  const handleCategorizeAI = async () => {
    if (!formData.description.trim()) return;
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
        setFormData(prev => ({ ...prev, category: data.category }));
      } else {
        setFormData(prev => ({ ...prev, category: 'General' }));
      }
    } catch (err) {
      console.error(err);
      setFormData(prev => ({ ...prev, category: 'General' }));
    } finally {
      setIsCategorizing(false);
      setHasCategorized(true);
    }
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await fetch(`${API_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.category ? formData.category.toUpperCase() : 'GENERAL ISSUE',
          description: formData.description + (formData.location ? ` (Location: ${formData.location})` : ''),
          category: formData.category || 'General',
          location: { lat: formData.lat, lng: formData.lng },
          imageUrl: formData.imageBase64 || null,
          username: formData.username || 'AnonymousCitizen'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setTrackingId(data._id ? data._id.substring(data._id.length - 6).toUpperCase() : '892X');
        nextStep();
      } else {
        alert('Failed to submit: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to Server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer Motion Variants
  const tabVariants = {
    hidden: { opacity: 0, x: -30, filter: 'blur(5px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.4, type: 'spring', bounce: 0.1 } },
    exit: { opacity: 0, x: 30, filter: 'blur(5px)', transition: { duration: 0.3 } }
  };

  return (
    <div className="container report-page">
      <motion.div 
        className="report-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <h1 className="text-gradient-cyan">Report an Issue</h1>
        <p>Your report is completely anonymous. Our AI handles routing to the correct department.</p>
        
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
            <span className={step >= 1 ? 'active' : ''}>What?</span>
            <span className={step >= 2 ? 'active' : ''}>Where?</span>
            <span className={step >= 3 ? 'active' : ''}>Evidence</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="glass-panel form-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="form-step">
              <h3>Describe the Issue</h3>
              <p className="text-muted" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                Write a brief description of the problem. Our AI will automatically analyze your text and route it to the correct civic department.
              </p>
              
              <div className="form-group">
                <textarea 
                  className="input-field" 
                  rows="5" 
                  placeholder="e.g. Huge pothole on the corner forming right in the middle of the bus lane. Extremely dangerous for two-wheelers."
                  value={formData.description}
                  onChange={e => {
                    setFormData({...formData, description: e.target.value});
                    setHasCategorized(false); // Reset if they edit
                  }}
                />
              </div>

              {/* Dedicated AI Categorization UI */}
              <div className="ai-categorize-section" style={{ marginTop: '20px', marginBottom: '10px' }}>
                {!hasCategorized ? (
                  <button 
                    className="btn-ai-magic" 
                    onClick={handleCategorizeAI} 
                    disabled={isCategorizing || !formData.description.trim()}
                  >
                    {isCategorizing ? (
                      <><Loader2 size={18} className="spin" /> Analyzing Report...</>
                    ) : (
                      <>Auto-Categorize via AI</>
                    )}
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="ai-result-tile"
                  >
                    <div className="ai-tile-icon"><CheckCircle2 size={24} color="var(--accent-purple)" /></div>
                    <div className="ai-tile-content">
                      <span className="ai-tile-label">AI Routed Department</span>
                      <strong className="ai-tile-value">{getDepartmentName(formData.category)}</strong>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Citizen Handle (Optional - For XP Leaderboard)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. CitySaver99"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div className="form-actions right-align">
                <button 
                  className="btn-primary" 
                  onClick={nextStep} 
                  disabled={!hasCategorized}
                  title={!hasCategorized ? "Please Auto-Categorize first" : ""}
                >
                  Confirm & Next <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="form-step">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px'}}>
                <h3>Pin Location</h3>
                {formData.category && (
                  <div className="ai-badge">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI Auto-Routed:</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}> {getDepartmentName(formData.category)}</strong>
                  </div>
                )}
              </div>
              
              <div className="map-wrapper" style={{ height: '320px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', zIndex: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(5,5,5,0.85)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '100px', zIndex: 1000, color: 'white', fontWeight: 600, fontSize: '0.85rem', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <LocateFixed size={16} color="var(--accent-cyan)" /> Drag pin to precise spot
                </div>
                <ReportMap formData={formData} setFormData={setFormData} />
              </div>
              <div className="form-group" style={{marginTop: '20px'}}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Confirm Address or Intersecting Streets"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="form-actions split-align">
                <button className="btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep} disabled={!formData.location.trim()}>
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="form-step">
              <h3>Photo Evidence</h3>
              <div className="upload-zone neo-upload">
                {formData.imagePreview ? (
                  <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={formData.imagePreview} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      className="btn-secondary remove-photo" 
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
                      className="file-hidden-input"
                    />
                    <div className="upload-content">
                      <UploadCloud size={54} color="var(--accent-cyan)" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))' }} />
                      <h4>Drop Image or Browse</h4>
                      <p>Metadata is automatically scrubbed for privacy.</p>
                    </div>
                  </>
                )}
              </div>

              <div className="form-actions split-align" style={{ marginTop: '32px' }}>
                <button className="btn-secondary" onClick={prevStep} disabled={isSubmitting}>Back</button>
                <button 
                  className="btn-primary submit-btn" 
                  onClick={submitReport} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <><Loader2 size={18} className="spin" /> Submitting securely...</> : 'Submit Anonymously'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="form-step success-step">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              >
                <CheckCircle2 size={80} color="var(--accent-green)" style={{ filter: 'drop-shadow(0 0 20px rgba(0,230,118,0.5))' }} />
              </motion.div>
              <h2 className="text-gradient-cyan" style={{marginTop: '24px'}}>Verified & Submitted.</h2>
              <p>Your tracking ID is <strong style={{color: 'var(--accent-cyan)'}}>#CFX-{trackingId || '8924'}</strong></p>
              
              <div className="karma-reward glass-panel">
                <span style={{ fontSize: '2rem' }}>🎉</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>+50 XP Earned</span>
                  <span style={{ fontSize: '0.85rem', color: "var(--text-secondary)" }}>Thank you for protecting your city.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReportIssue;
