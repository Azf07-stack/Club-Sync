import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('https://club-sync-backend.onrender.com/api/events').then(res => setEvents(res.data));
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Prevents clicking the card from navigating
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await axios.delete(`https://club-sync-backend.onrender.com/api/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-black text-black tracking-tight mb-8">Dashboard.</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-black p-8 rounded-2xl text-white shadow-xl flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-2">Total Events</h3>
          <p className="text-5xl font-black">{events.length}</p>
        </div>
        <Link to="/create" className="bg-white border-2 border-slate-200 border-dashed p-8 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-black hover:border-black hover:bg-slate-50 transition-all cursor-pointer group">
          <PlusCircle size={36} className="mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span className="font-bold uppercase tracking-widest text-sm">Create New</span>
        </Link>
      </div>

      <h2 className="text-xl font-black tracking-tight text-black mb-6">Recent History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(e => (
          <Link key={e.id} to={`/events/${e.id}`} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-black transition-colors group block relative">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-black text-xl text-black pr-8">{e.title}</h4>
              <button onClick={(event) => handleDelete(event, e.id)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors p-2 -m-2">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{e.clubName}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">• {e.type}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-500 border-t border-slate-100 pt-4">
              <span className="flex items-center gap-2"><Calendar size={16}/> {e.date}</span>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
        {events.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm border-2 border-dashed border-slate-200 rounded-xl">
            No events found. Start planning!
          </div>
        )}
      </div>
    </div>
  );
}
