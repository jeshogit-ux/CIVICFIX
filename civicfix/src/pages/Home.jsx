import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import './Home.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' },
  visible: {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 12, mass: 1 }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 20 }
  }
};

const Home = () => {
  return (
    <div className="container home-page">
      <motion.header 
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-badge">
          <div className="live-dot" /> Live Civic Tracker
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="hero-title">
          Empowering citizens for a <br />
          <span className="text-gradient">Smarter, Safer City</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="hero-subtitle">
          Securely report civic issues, track government response in real-time, and stay ahead of local scams with our integrated urban tracker.
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-actions">
          <Link to="/report" className="btn-primary">
            Report an Issue <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            View Dashboard
          </Link>
        </motion.div>
      </motion.header>
      
      <section className="features-container">
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Feature 1 */}
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="glass-panel feature-card"
          >
            <div className="icon-blob" style={{ background: 'rgba(0, 240, 255, 0.15)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)' }}>
              <MapPin size={32} color="var(--accent-cyan)" />
            </div>
            <h3>Geo-Tagged Reports</h3>
            <p>Instantly document unpaved roads, illegal parking, or broken lights with precise GPS locators ensuring rapid authority deployment.</p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="glass-panel feature-card feature-card-highlight"
          >
            <div className="icon-blob" style={{ background: 'rgba(157, 78, 221, 0.15)', boxShadow: '0 0 30px rgba(157, 78, 221, 0.3)' }}>
              <Activity size={32} color="var(--accent-purple)" />
            </div>
            <h3>Live Progress</h3>
            <p>Track the lifecycle of your complaint. Receive updates when local agencies transition reports from "Assigned" to "Resolved".</p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="glass-panel feature-card"
          >
            <div className="icon-blob" style={{ background: 'rgba(0, 230, 118, 0.15)', boxShadow: '0 0 30px rgba(0, 230, 118, 0.3)' }}>
              <ShieldCheck size={32} color="var(--accent-green)" />
            </div>
            <h3>Security Hub</h3>
            <p>Educate yourself against social engineering tactics. View proactive local alerts on tax scams and phishy utility bill texts targeting citizens.</p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
