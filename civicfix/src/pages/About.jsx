import React from 'react';
import { Code, Blocks, Layout, Sparkles, Github, Linkedin, Server, Database, Smartphone } from 'lucide-react';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Jesho J Upalt",
      role: "Lead Developer & UI/UX Designer",
      bio: "Jesho spearheaded the architectural vision and visual language for CivicFix. With a deep focus on creating frictionless, ultra-premium user experiences, he designed the glassmorphism system from the ground up. He believes that civic tech shouldn't look like legacy software—it should feel like the future.",
      skills: ["React 18", "UI/UX Architecture", "System Design"],
      color: "var(--accent-cyan)",
      icon: <Layout size={40} color="var(--accent-cyan)" />,
      github: "https://github.com/jeshogit-ux",
      linkedin: "https://www.linkedin.com/in/jeshoupalt"
    },
    {
      id: 2,
      name: "Karthick M S",
      role: "Developer",
      bio: "Karthick engineered the core application logic and data tracking workflows. By focusing on algorithmic efficiency and state management, he ensured that CivicFix can rapidly handle interactive mapping and complex multi-step routing without stuttering. His focus on robust code dictates the platform's reliability.",
      skills: ["Core Logic", "State Management", "Optimization"],
      color: "var(--accent-purple)",
      icon: <Code size={40} color="var(--accent-purple)" />,
      github: "#",
      linkedin: "https://www.linkedin.com/in/karthick-m-s-a883b7356"
    },
    {
      id: 3,
      name: "PRANAY CHARAN CB",
      role: "UI & Backend integration",
      bio: "PRANAY CHARAN CB bridged the gap between the stunning front-end visuals and robust technical implementation. He worked intricately on UI refinement, component isolation, and ensuring the complex hooks seamlessly manage citizen report data. He's passionate about building scalable solutions for urban ecosystems.",
      skills: ["Backend Architecture", "Data Flow", "UI Refinement"],
      color: "var(--accent-green)",
      icon: <Blocks size={40} color="var(--accent-green)" />,
      github: "#",
      linkedin: "https://www.linkedin.com/in/pranay-charan-522698326"
    }
  ];

  return (
    <div className="container about-page animate-fade-in">
      <div className="about-header-minimal animate-slide-up animate-delay-1">
        <Sparkles size={40} color="var(--accent-purple)" className="sparkle-icon" />
        <h1 className="text-gradient">The Minds Behind CivicFix</h1>
        <p>A unified Hacktrax initiative to redefine urban governance through transparent, reactive, and gamified web technology.</p>
      </div>

      <div className="team-showcase animate-slide-up animate-delay-2">
        {teamMembers.map((member, index) => (
          <div key={member.id} className={`member-row ${index % 2 !== 0 ? 'reversed' : ''}`}>
            <div className="member-visual" style={{ '--member-color': member.color }}>
              <div className="hologram-ring">
                 {member.icon}
              </div>
            </div>
            <div className="member-content">
              <h2 style={{ background: `linear-gradient(135deg, ${member.color}, #ffffff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {member.name}
              </h2>
              <div className="role-badge" style={{ color: member.color, borderColor: `${member.color}40`, background: `${member.color}10` }}>
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
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-icon"><Github size={20} /></a>
                ) : (
                  <span className="social-icon" style={{opacity: 0.3, cursor: 'not-allowed'}}><Github size={20} /></span>
                )}
                {member.linkedin !== "#" ? (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon"><Linkedin size={20} /></a>
                ) : (
                  <span className="social-icon" style={{opacity: 0.3, cursor: 'not-allowed'}}><Linkedin size={20} /></span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="manifesto-section">
        <h3>Our Manifesto</h3>
        <p>
          We believe citizens shouldn't have to navigate bureaucratic labyrinths to report a broken streetlight or an open pothole. 
          CivicFix was built on the philosophy of <strong>Minimalism, Transparency, and Security</strong>. 
          By combining gamification with an ultra-premium visual aesthetic, we are changing how citizens interact with their local authorities.
        </p>
      </div>

      <div className="tech-stack-section glass-panel" style={{ marginTop: '40px', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
        <h3 className="text-gradient" style={{ marginBottom: '20px' }}>Powered By</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div className="tech-badge" style={{ background: 'rgba(97, 218, 251, 0.1)', border: '1px solid rgba(97, 218, 251, 0.3)', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: '#61DAFB' }}>
            <Smartphone size={20} />
            <strong>React 18 + Vite</strong>
            <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Frontend UI</span>
          </div>
          <div className="tech-badge" style={{ background: 'rgba(140, 200, 75, 0.1)', border: '1px solid rgba(140, 200, 75, 0.3)', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: '#8CC84B' }}>
            <Server size={20} />
            <strong>Node.js + Express</strong>
            <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>REST API</span>
          </div>
          <div className="tech-badge" style={{ background: 'rgba(77, 179, 61, 0.1)', border: '1px solid rgba(77, 179, 61, 0.3)', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', color: '#4DB33D' }}>
            <Database size={20} />
            <strong>MongoDB Atlas</strong>
            <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Cloud Database</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
