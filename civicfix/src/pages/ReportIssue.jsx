import React, { useState } from 'react';
import { Camera, MapPin, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import './ReportIssue.css';

const ReportIssue = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ category: '', description: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState('');

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
          location: { lat: 12.8236, lng: 80.0435 },
          imageUrl: formData.imageBase64 || null
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
              <label>Description</label>
              <textarea 
                className="input-field" 
                rows="4" 
                placeholder="Briefly describe the issue..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Pin Location</h3>
            <div className="mock-map-container" style={{ padding: 0, border: 'none', background: 'transparent' }}>
              <iframe
                title="Pin Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src="https://www.openstreetmap.org/export/embed.html?bbox=80.035,12.815,80.050,12.835&layer=mapnik&marker=12.8236,80.0435"
                style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(100%)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'block' }}
              ></iframe>
              <div className="map-overlay" style={{ pointerEvents: 'none', background: 'rgba(0,0,0,0.3)' }}>
                <MapPin size={48} color="var(--accent-warning)" className="pin-animation" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }} />
                <p style={{background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '20px', fontWeight: 500}}>Drag map to pin precise issue location</p>
              </div>
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
          {step < 3 && <button className="btn-primary" onClick={nextStep} disabled={isSubmitting}>Next Step</button>}
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
