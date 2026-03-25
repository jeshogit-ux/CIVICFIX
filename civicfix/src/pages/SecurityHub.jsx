import React from 'react';
import { ShieldAlert, Shield, AlertTriangle } from 'lucide-react';
import './SecurityHub.css';

const SecurityHub = () => {
  return (
    <div className="container security-page">
      <div className="security-header">
        <ShieldAlert size={48} color="var(--accent-purple)" className="pulse-icon" />
        <h2 className="text-gradient">Security & Ethics Hub</h2>
        <p>Stay aware of local threats, phishing scams, and social engineering tactics targeting citizens.</p>
      </div>

      <div className="security-grid">
        <div className="glass-panel alerts-panel">
          <h3>
            <AlertTriangle size={24} style={{display:'inline', marginRight:'12px', verticalAlign:'middle'}} color="var(--accent-warning)" />
            Active Local Alerts
          </h3>
          <div className="alert-list">
            <div className="alert-item critical">
              <span className="alert-label">Urgent</span>
              <h4>Fake Utility Bill SMS Scams</h4>
              <p>Citizens are receiving text messages claiming unpaid power bills with links to fake payment portals. Do not click! Official City channels will never send SMS links for payments.</p>
            </div>
            <div className="alert-item warning">
              <span className="alert-label">Warning</span>
              <h4>City Council Impersonators</h4>
              <p>Phone calls from "City Planning" asking for social security details for a zoning survey are fraudulent. Report these numbers immediately.</p>
            </div>
            <div className="alert-item notice">
              <span className="alert-label">Notice</span>
              <h4>Fake Parking Tickets</h4>
              <p>QR codes placed on windshields for "digital parking fines" redirect to phishing sites. Verify all fines on the official city portal.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel education-panel">
          <h3>
            <Shield size={24} style={{display:'inline', marginRight:'12px', verticalAlign:'middle'}} color="var(--accent-green)" />
            Quick Knowledge Check
          </h3>
          <p style={{marginBottom: '24px', color: 'var(--text-secondary)'}}>Earn Civic Karma by testing your ability to spot social engineering.</p>
          
          <div className="quiz-card">
            <h4>You receive an email from "tax-dept@citygov-refunds.com" claiming you overpaid taxes. What do you do?</h4>
            <div className="quiz-options">
              <button className="quiz-btn">Click the link to claim refund.</button>
              <button className="quiz-btn outline">Verify the domain name. Delete the email.</button>
              <button className="quiz-btn">Reply asking for more details.</button>
            </div>
            <div className="quiz-reveal">
              <p className="success-text">Correct! Official government domains end in .gov, not .com. (+10 Karma)</p>
            </div>
          </div>

          <div className="quiz-card" style={{marginTop: '24px'}}>
            <h4>A worker in uniform asks to enter your house to check the water meter, but lacks an ID badge. What do you do?</h4>
            <div className="quiz-options">
              <button className="quiz-btn outline">Deny entry and call the utility department to verify.</button>
              <button className="quiz-btn">Let them in quickly to avoid a hassle.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityHub;
