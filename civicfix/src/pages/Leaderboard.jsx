import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './Leaderboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { type: 'spring', damping: 20, stiffness: 100 } 
  }
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
        const res = await fetch(`${API_URL}/api/leaderboard`);
        const data = await res.json();
        if (res.ok) {
          setLeaders(data);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <motion.div 
      className="container leaderboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="leaderboard-header" variants={itemVariants}>
        <div className="header-icon-glow">
          <Trophy size={48} color="var(--accent-cyan)" />
        </div>
        <h1 className="text-gradient-purple">Top Citizens</h1>
        <p style={{color: 'var(--text-secondary)'}}>Recognizing the community's most active contributors in Civic Karma.</p>
      </motion.div>

      <motion.div className="leaderboard-container glass-panel" variants={itemVariants}>
        <div className="leaderboard-list">
          {isLoading && <p style={{ textAlign: 'center', margin: '40px 0', color: 'var(--text-muted)' }}>Loading top citizens...</p>}
          {!isLoading && leaders.length === 0 && <p style={{ textAlign: 'center', margin: '40px 0', color: 'var(--text-muted)' }}>No citizens have earned XP yet. Report an issue to be the first!</p>}
          {!isLoading && leaders.map((leader, index) => (
            <motion.div 
              key={leader.id} 
              variants={itemVariants}
              className={`leaderboard-row ${index < 3 ? 'top-tier' : ''}`}
            >
              <div className="rank-container">
                {index === 0 && <Medal size={28} color="#FFD700" className="rank-icon rank-1" />}
                {index === 1 && <Medal size={28} color="#9CA3AF" className="rank-icon rank-2" />}
                {index === 2 && <Medal size={28} color="#CD7F32" className="rank-icon rank-3" />}
                {index > 2 && <span className="rank-number">{index + 1}</span>}
              </div>
              
              <div className="avatar-circle" style={{
                background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FDB931)' : 
                            index === 1 ? 'linear-gradient(135deg, #E3E4E5, #9CA3AF)' :
                            index === 2 ? 'linear-gradient(135deg, #CD7F32, #A0522D)' : 
                            'var(--bg-primary)'
              }}>
                {leader.avatar}
              </div>

              <div className="citizen-info">
                <h3 className="citizen-name">{leader.name}</h3>
                <span className="citizen-title"><ShieldCheck size={14} /> {leader.rank}</span>
              </div>

              <div className="xp-container">
                <span className="xp-amount">{leader.xp.toLocaleString()}</span>
                <span className="xp-label">XP</span>
                {index < 3 && <Star size={18} color="var(--accent-purple)" className="pulse-star" />}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;
