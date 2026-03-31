const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allows parsing large Base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ MONGO_URI is not defined in .env file');
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('CivicFix API is running!');
});

// Models
const Issue = require('./models/Issue');
const User = require('./models/User');

// Create a new Issue & Update User XP
app.post('/api/issues', async (req, res) => {
  try {
    const issueData = req.body;
    const { username } = issueData;

    // Save the Issue
    const newIssue = new Issue(issueData);
    const savedIssue = await newIssue.save();

    // Reward XP if a username was provided
    if (username && username.trim() !== '') {
      const handle = username.trim();
      let user = await User.findOne({ username: handle });
      
      if (!user) {
        user = new User({ 
          username: handle, 
          avatar: handle.substring(0, 2).toUpperCase(),
          xp: 0
        });
      }
      
      // Award 50 Civic Karma
      user.xp += 50;

      // Update Rank Title Contextually
      if (user.xp >= 500) user.rank = "Civic Vanguard";
      else if (user.xp >= 300) user.rank = "Community Pillar";
      else if (user.xp >= 150) user.rank = "Master Fixer";
      else if (user.xp >= 100) user.rank = "Active Reporter";
      else user.rank = "Supporter";
      
      await user.save();
    }

    res.status(201).json(savedIssue);
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ error: 'Failed to report issue' });
  }
});

// Get all Issues
app.get('/api/issues', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get Leaderboard (Top 50 Users by XP)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ xp: -1 }).limit(50);
    // Format to match frontend expectations
    const leaderData = users.map(u => ({
      id: u._id,
      name: u.username,
      rank: u.rank,
      xp: u.xp,
      avatar: u.avatar
    }));
    res.status(200).json(leaderData);
  } catch (err) {
    console.error('Leaderboard Error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// AI Routes
const { GoogleGenerativeAI } = require('@google/generative-ai');

app.post('/api/ai/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is missing in backend .env' });

    const { history, message } = req.body;
    let promptText = "System instructions: You are CivicFix Assistant, a helpful AI chatbot for a city governance platform. Help citizens report issues.\n\n";

    let validHistory = history || [];
    if (validHistory.length > 0 && validHistory[0].role === 'ai') { validHistory = validHistory.slice(1); }

    if (validHistory && validHistory.length > 0) {
      promptText += "Past Conversation History:\n";
      validHistory.forEach(msg => {
        const roleName = msg.role === 'ai' ? 'Assistant' : 'User';
        promptText += `${roleName}: ${msg.text || ''}\n`;
      });
      promptText += "\n";
    }

    promptText += "User query: " + message + "\nAssistant:";

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API Error Body:', data);
      return res.status(500).json({ error: `Gemini API Error: ${data.error?.message || response.statusText}` });
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    res.status(200).json({ reply: responseText });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: 'Failed to process AI chat request' });
  }
});

app.post('/api/ai/categorize', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    const { description } = req.body;
    if (!description) { return res.status(400).json({ error: 'Description is required' }); }

    const promptText = `Analyze this civic issue description and categorize it tightly into exactly one of these nine categories: "infrastructure", "sanitation", "traffic", "utilities", "environment", "safety", "animals", "health", or "landscaping". Description: "${description}". Only return the exact category word in lowercase with no punctuation.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('API Error:', data);
        return res.status(500).json({ error: data.error?.message || response.statusText });
    }

    const categoryText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase() || "";
    res.status(200).json({ category: categoryText });
  } catch (err) {
    console.error('AI Categorize Error:', err);
    res.status(500).json({ error: 'Failed to categorize issue' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
