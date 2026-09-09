import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Analyzing event requirements...",
  "Structuring budget and timeline...",
  "Crafting engaging activities...",
  "Generating social media copy...",
  "Designing poster content..."
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const [formData, setFormData] = useState({
    clubName: '', clubType: 'Tech', eventTitle: '', eventType: 'Hackathon',
    venue: '', date: '', startTime: '', endTime: '', budget: '',
    participants: '', targetAudience: '', participantLevel: 'Mixed',
    objective: '', resources: '', additionalRequirements: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Loading text animation
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIndex(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingStepIndex(0);

    try {
      const response = await axios.post('asif/api/events/generate', formData);
      toast.success('Event planned successfully!');
      navigate(`/events/${response.data.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate event plan.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Event</h1>
      <p className="text-slate-500 mb-8">Fill in the details below and let AI do the heavy lifting.</p>

      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl border border-slate-200">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <motion.p 
              key={loadingStepIndex}
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="text-lg font-medium text-slate-700">
              {LOADING_STEPS[loadingStepIndex]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Club Name</label>
            <input required type="text" name="clubName" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Club Type</label>
            <select name="clubType" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Tech</option><option>Non-Tech</option>
            </select>
          </div>
          
          {/* Event Info */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title / Theme</label>
            <input required type="text" name="eventTitle" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
            <select name="eventType" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Hackathon</option><option>Workshop</option><option>Seminar</option><option>Competition</option><option>Cultural Event</option>
            </select>
          </div>

          {/* Logistics */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input required type="date" name="date" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
              <input required type="time" name="startTime" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
              <input required type="time" name="endTime" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
            <input required type="text" name="venue" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($)</label>
              <input required type="number" name="budget" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Participants</label>
              <input required type="number" name="participants" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Textareas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Event Objective</label>
          <textarea required name="objective" rows="2" placeholder="What do you want to achieve?" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Available Resources & Equipment</label>
          <textarea required name="resources" rows="2" placeholder="Projectors, speakers, 3D printers, etc." onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
        </div>

        <button disabled={isGenerating} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-indigo-200 disabled:opacity-50">
          <Sparkles size={20} /> Generate Event Plan with AI
        </button>
      </form>
    </div>
  );
}
