import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi there! I am CivicAssistant built on Google Gemini. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => setIsOpen(!isOpen);

  const formatHistoryForAPI = () => {
    return messages.map(msg => ({ role: msg.role, text: msg.text }));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: formatHistoryForAPI(),
          message: userMessage
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: `Error: ${data.error || 'API Key may be missing.'}` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am currently offline. Please check your backend connection.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <button className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <Sparkles className="chat-sparkle" size={12} color="#00f0ff" />}
      </button>

      {isOpen && (
        <div className="chatbot-window glass-panel">
          <div className="chatbot-header">
            <Sparkles size={20} color="var(--accent-cyan)" />
            <div>
              <h3>Civic Assistant</h3>
              <p>Powered by Gemini AI</p>
            </div>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.role === 'ai' && <div className="avatar"><Sparkles size={14} color="#000" /></div>}
                <div className="message-bubble">
                  {/* Parse basic bolding out of simple gemini text response if it sends **text** */}
                  {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message ai typing">
                <div className="avatar"><Sparkles size={14} color="#000" /></div>
                <div className="message-bubble typing-indicator">
                  <Loader2 size={16} className="spin" color="var(--accent-cyan)" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping || !inputMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
