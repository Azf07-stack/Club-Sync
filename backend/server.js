const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { generateEventPlan } = require('./services/geminiService');

const app = express(); // <-- This is the line that was missing!
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'events.json');

// Helper to read/write DB
const getEvents = () => {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(DB_FILE));
};
const saveEvents = (events) => fs.writeFileSync(DB_FILE, JSON.stringify(events, null, 2));

// Generate and Save Event
app.post('/api/events/generate', async (req, res) => {
  try {
    const eventDetails = req.body;
    const aiPlan = await generateEventPlan(eventDetails);
    
    const newEvent = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      originalInput: eventDetails,
      aiPlan: aiPlan
    };

    const events = getEvents();
    events.push(newEvent);
    saveEvents(events);

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
app.get('/api/events', (req, res) => {
  const events = getEvents();
  const summary = events.map(e => ({
    id: e.id,
    clubName: e.originalInput.clubName,
    title: e.originalInput.eventTitle,
    date: e.originalInput.date,
    type: e.originalInput.eventType,
    budget: e.originalInput.budget
  })).reverse();
  res.json(summary);
});
// Delete single event
app.delete('/api/events/:id', (req, res) => {
  let events = getEvents();
  const initialLength = events.length;
  events = events.filter(e => e.id !== req.params.id);
  
  if (events.length === initialLength) {
    return res.status(404).json({ error: "Event not found" });
  }
  
  saveEvents(events);
  res.json({ message: "Event deleted successfully" });
});

// Get single event
app.get('/api/events/:id', (req, res) => {
  const events = getEvents();
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
