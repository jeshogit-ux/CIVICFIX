import React from 'react';
import { Hexagon, Zap, Orbit, Sparkles, Github, Linkedin, Server, Database, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import './About.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 100 } 
  }
};

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Jesho J Upalt",
      role: "Lead Developer & UX Architect",
      bio: "Spearheaded the architectural vision and visual language for CivicFix. With a deep focus on creating frictionless, ultra-premium user experiences, he designed the glassmorphism system from the ground up.",
      skills: ["React 18", "UX Architecture", "System Design"],
      color: "var(--accent-cyan)",
      secondaryColor: "#4f46e5",
      icon: <Hexagon size={64} color="var(--accent-cyan)" strokeWidth={1.5} />,
      github: "https://github.com/jeshogit-ux",
      linkedin: "https://www.linkedin.com/in/jeshoupalt"
    },
    {
      id: 2,
      name: "Karthick M S",
      role: "Core App Developer",
      bio: "Engineered the application logic and data workflows. By focusing on algorithmic efficiency and state management, he ensured that CivicFix can rapidly handle interactive mapping and complex multi-step routing without stuttering.",
      skills: ["Core Logic", "State Management", "Optimization"],
      color: "var(--accent-purple)",
      secondaryColor: "#9333ea",
      icon: <Zap size={64} color="var(--accent-purple)" strokeWidth={1.5} />,
      github: "#",
      linkedin: "https://www.linkedin.com/in/karthick-m-s-a883b7356"
    },
    {
      id: 3,
      name: "PRANAY CHARAN CB",
      role: "Backend & Systems Integration",
      bio: "Bridged the gap between highly-responsive front-end visuals and backend routing implementation. He seamlessly structured the report data workflows. He's passionate about building scalable solutions for complex urban ecosystems.",
      skills: ["Backend Architecture", "Data Flow", "UI Routing"],
      color: "var(--accent-green)",
      secondaryColor: "#10b981",
      icon: <Orbit size={64} color="var(--accent-green)" strokeWidth={1.5} />,
      github: "#",
      linkedin: "https://www.linkedin.com/in/pranay-charan-522698326"
    }
  ];

  return (
    <motion.div 
      className="container about-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="about-header-minimal" variants={itemVariants}>
        <div className="header-icon-glow">
          <Sparkles size={40} color="var(--accent-purple)" className="sparkle-icon" />
        </div>
        <h1 className="text-gradient">The Minds Behind CivicFix</h1>
        <p>A unified Hacktrax initiative to redefine urban governance through transparent, reactive, and gamified web technology.</p>
      </motion.div>

      <motion.div className="bento-grid" variants={containerVariants}>
        {/* The Team Bento Cards */}
        {teamMembers.map((member) => (
          <motion.div 
            key={member.id} 
            variants={itemVariants}
            className="bento-card team-card"
            style={{ '--card-color': member.color, '--card-hex': member.secondaryColor }}
            tabIndex={0}
          >
            {/* Base View (Unhovered) */}
            <div className="bento-base-view">
              <div className="bento-icon-wrapper">
                {member.icon}
              </div>
              <div className="bento-title-plate">
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </div>
            </div>

            {/* Hover Reveal View */}
            <div className="bento-overlay">
              <div className="bento-overlay-content">
                <h3 className="overlay-name" style={{ backgroundImage: `linear-gradient(135deg, ${member.secondaryColor}, var(--text-primary))` }}>
                  {member.name}
                </h3>
                <div className="role-badge" style={{ color: member.secondaryColor, borderColor: `${member.secondaryColor}40`, background: `${member.secondaryColor}10` }}>
                  {member.role}
                </div>
                <p className="detailed-bio">{member.bio}</p>
                
                <div className="skills-row">
                  {member.skills.map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>

                <div className="minimal-social">
                  {member.github !== "#" ? (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-icon"><Github size={24} /></a>
                  ) : (
                    <span className="social-icon disabled-icon"><Github size={24} /></span>
                  )}
                  {member.linkedin !== "#" ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon"><Linkedin size={24} /></a>
                  ) : (
                    <span className="social-icon disabled-icon"><Linkedin size={24} /></span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Manifesto Bento Card (Wide) */}
        <motion.div variants={itemVariants} className="bento-card manifesto-card wide-card">
          <div className="manifesto-content">
            <h3>Our Manifesto</h3>
            <p>
              We believe citizens shouldn't have to navigate bureaucratic labyrinths to report a broken streetlight or an open pothole. 
              CivicFix was built on the philosophy of <strong>Minimalism, Transparency, and Security</strong>. 
              By combining gamification with an ultra-premium visual aesthetic, we are changing how citizens interact with their local authorities.
            </p>
          </div>
        </motion.div>

        {/* Tech Stack Bento Card (Standard) */}
        <motion.div variants={itemVariants} className="bento-card tech-stack-card">
          <h3 className="text-gradient">Powered By</h3>
          <div className="stack-list">
            <div className="stack-item">
              <div className="stack-icon react-icon"><Smartphone size={20} /></div>
              <span>React 18</span>
            </div>
            <div className="stack-item">
              <div className="stack-icon node-icon"><Server size={20} /></div>
              <span>Node.js</span>
            </div>
            <div className="stack-item">
              <div className="stack-icon mongo-icon"><Database size={20} /></div>
              <span>MongoDB</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default About;
