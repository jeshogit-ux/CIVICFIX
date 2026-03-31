import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, ShieldCheck } from 'lucide-react';
import './Leaderboard.css';

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
    <div className="container leaderboard-page animate-fade-in">
      <div className="leaderboard-header animate-slide-up">
        <div className="header-icon-glow">
          <Trophy size={48} color="var(--accent-cyan)" />
        </div>
        <h1 className="text-gradient">Top Citizens</h1>
        <p>Recognizing the community's most active contributors in Civic Karma.</p>
      </div>

      <div className="leaderboard-container animate-slide-up animate-delay-1">
        <div className="leaderboard-list">
          {isLoading && <p style={{ textAlign: 'center', margin: '40px 0', opacity: 0.5 }}>Loading top citizens...</p>}
          {!isLoading && leaders.length === 0 && <p style={{ textAlign: 'center', margin: '40px 0', opacity: 0.5 }}>No citizens have earned XP yet. Report an issue to be the first!</p>}
          {!isLoading && leaders.map((leader, index) => (
            <div key={leader.id} className={`leaderboard-row ${index < 3 ? 'top-tier' : ''}`}>
              <div className="rank-container">
                {index === 0 && <Medal size={28} color="#FFD700" className="rank-icon rank-1" />}
                {index === 1 && <Medal size={28} color="#E3E4E5" className="rank-icon rank-2" />}
                {index === 2 && <Medal size={28} color="#CD7F32" className="rank-icon rank-3" />}
                {index > 2 && <span className="rank-number">{index + 1}</span>}
              </div>
              
              <div className="avatar-circle" style={{
                background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FDB931)' : 
                            index === 1 ? 'linear-gradient(135deg, #E3E4E5, #9CA3AF)' :
                            index === 2 ? 'linear-gradient(135deg, #CD7F32, #A0522D)' : 
                            'var(--glass-border)'
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
                {index < 3 && <Star size={18} color="var(--accent-cyan)" className="pulse-star" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
