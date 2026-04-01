import React, { useState } from 'react';
import { ShieldAlert, Shield, AlertTriangle, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SecurityHub.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { type: 'spring', damping: 20, stiffness: 100 } 
  }
};

const SecurityHub = () => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // null, correct, incorrect
  const [selectedIndex, setSelectedIndex] = useState(null);

  const quizData = [
    {
      id: 1,
      scenario: 'You receive an urgent SMS from "City Parking" claiming your car will be towed unless you pay a digital fine immediately via an attached bit.ly link.',
      options: [
        { text: 'Pay immediately to avoid towing.', isCorrect: false },
        { text: 'Ignore it. Cities do not use bit.ly links for urgent fines.', isCorrect: true },
        { text: 'Click the link just to verify the license plate.', isCorrect: false }
      ],
      revealMsg: "Correct! Scammers use URL shorteners like bit.ly to hide malicious phishing sites. Official notices will always direct you to .gov portals. (+10 Civic Karma)"
    },
    {
      id: 2,
      scenario: 'A worker in a yellow vest asks to enter your house to check the water meter, but lacks an ID badge and refuses to state his supervisor\'s name.',
      options: [
        { text: 'Let them in quickly to avoid a hassle.', isCorrect: false },
        { text: 'Ask them to wait outside and call 311 (City Services) to verify their dispatch.', isCorrect: true },
        { text: 'Take their picture and let them in.', isCorrect: false }
      ],
      revealMsg: "Perfect! Never allow unverified workers into your home. Legitimate utility workers are required to carry and present valid photo IDs. (+15 Civic Karma)"
    },
    {
      id: 3,
      scenario: 'You find a USB drive in the city park labeled "2024 Tax Forms".',
      options: [
        { text: 'Plug it into your personal laptop to find the owner.', isCorrect: false },
        { text: 'Take it to the local police lost & found or throw it away.', isCorrect: true },
        { text: 'Plug it into a public library computer.', isCorrect: false }
      ],
      revealMsg: "Spot on! This is a classic 'Baiting' attack. Malicious USBs can instantly install malware the moment they are plugged in. (+20 Civic Karma)"
    }
  ];

  const handleAnswerClick = (index, isCorrect) => {
    if (selectedAnswer !== null) return; // Prevent double clicking
    setSelectedIndex(index);
    setSelectedAnswer(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setSelectedIndex(null);
    if (currentQuizIndex < quizData.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setCurrentQuizIndex('complete');
    }
  };

  return (
    <motion.div 
      className="container security-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="security-header" variants={itemVariants}>
        <div className="header-icon-glow">
          <ShieldAlert size={48} color="var(--accent-purple)" className="pulse-icon" />
        </div>
        <h2 className="text-gradient">Security & Ethics Hub</h2>
        <p>Stay aware of local threats, phishing scams, and social engineering tactics targeting citizens.</p>
      </motion.div>

      <div className="security-grid">
        {/* Swipeable Threat Feed */}
        <motion.div className="glass-panel feed-panel" variants={itemVariants}>
          <div className="panel-header">
            <h3><AlertTriangle size={24} color="var(--accent-warning)" /> Active Local Alerts</h3>
            <span className="swipe-hint">Swipe &rarr;</span>
          </div>
          
          <div className="alert-swipe-container">
            <div className="alert-card critical">
              <span className="alert-badge">Urgent Update</span>
              <h4>Fake Utility Bill SMS Scams</h4>
              <p>Citizens are receiving text messages claiming unpaid power bills with links to fake payment portals. Do not click! Official channels will never send SMS links.</p>
            </div>
            <div className="alert-card warning">
              <span className="alert-badge">Ongoing Threat</span>
              <h4>City Council Impersonators</h4>
              <p>Phone calls from "City Planning" asking for social security details for a zoning survey are rapidly increasing. Hang up immediately.</p>
            </div>
            <div className="alert-card notice">
              <span className="alert-badge">Investigation</span>
              <h4>Fake Parking QR Codes</h4>
              <p>Fraudulent QR codes placed on windshields for "digital parking fines" redirect to phishing sites. Always verify on the official portal.</p>
            </div>
          </div>
        </motion.div>

        {/* Gamified Tactile Quiz */}
        <motion.div className="glass-panel education-panel" variants={itemVariants}>
          <div className="panel-header">
            <h3><Shield size={24} color="var(--accent-green)" /> Threat Simulator</h3>
            <span className="karma-badge">Earn XP</span>
          </div>
          
          <div className="quiz-container">
            {currentQuizIndex === 'complete' ? (
              <motion.div 
                className="quiz-success-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={64} color="var(--accent-green)" />
                <h4>Simulation Complete!</h4>
                <p>You have successfully completed today's threat detection scenarios. Your Civic Karma has been awarded.</p>
                <button className="tactile-btn next-btn" onClick={() => setCurrentQuizIndex(0)}>Restart Training</button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuizIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="quiz-scenario-card"
                >
                  <div className="quiz-progress">Scenario {currentQuizIndex + 1} of {quizData.length}</div>
                  <h4>{quizData[currentQuizIndex].scenario}</h4>
                  
                  <div className="quiz-options-group">
                    {quizData[currentQuizIndex].options.map((option, idx) => {
                      let btnState = "";
                      if (selectedAnswer !== null) {
                        if (idx === selectedIndex) {
                          btnState = selectedAnswer === 'correct' ? 'correct-choice' : 'incorrect-choice';
                        } else if (option.isCorrect) {
                          btnState = 'missed-correct'; // highlight what they should have picked
                        } else {
                          btnState = 'disabled';
                        }
                      }

                      return (
                        <button 
                          key={idx} 
                          className={`tactile-btn quiz-btn ${btnState}`}
                          onClick={() => handleAnswerClick(idx, option.isCorrect)}
                          disabled={selectedAnswer !== null}
                        >
                          <span className="btn-content">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Banner */}
                  <AnimatePresence>
                    {selectedAnswer && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        className={`quiz-feedback-banner ${selectedAnswer}`}
                      >
                        <div className="feedback-content">
                          {selectedAnswer === 'correct' ? 
                            <CheckCircle size={24} className="feedback-icon" /> : 
                            <XCircle size={24} className="feedback-icon" />
                          }
                          <div>
                            <strong>{selectedAnswer === 'correct' ? 'Correct!' : 'Incorrect.'}</strong>
                            <p>{quizData[currentQuizIndex].revealMsg}</p>
                          </div>
                        </div>
                        <button className="tactile-btn next-btn" onClick={handleNextQuestion}>
                          Continue <ArrowRight size={18} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecurityHub;
