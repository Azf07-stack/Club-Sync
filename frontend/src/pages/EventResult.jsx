import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, Users, Copy, CheckCircle2 } from 'lucide-react';
import PosterCanvas from '../components/PosterCanvas';

export default function EventResult() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    axios.get(`asif/api/events/${id}`).then(res => setData(res.data));
  }, [id]);

  if (!data) return <div className="p-10 font-mono text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Fetching Data...</div>;

  const { originalInput: input, aiPlan: ai } = data;
  const tabs = ['overview', 'schedule', 'logistics', 'poster'];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-black tracking-tight mb-4">{ai.event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 bg-slate-100 p-4 rounded-xl inline-flex w-full md:w-auto">
          <div className="flex items-center gap-2"><Calendar size={16}/> {input.date}</div>
          <div className="flex items-center gap-2"><Clock size={16}/> {input.startTime} - {input.endTime}</div>
          <div className="flex items-center gap-2"><MapPin size={16}/> {input.venue}</div>
          <div className="flex items-center gap-2"><Users size={16}/> {input.participants} pax</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-8 border-b border-slate-200 pb-px">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} 
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-black'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
{activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Organized By</h3>
              <p className="text-black font-bold uppercase tracking-wide mb-8">{input.clubName} <span className="text-slate-400">({input.clubType})</span></p>
              
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Event Purpose</h3>
              <p className="text-slate-800 font-medium leading-relaxed">{ai.event.purpose}</p>
            </div>
            {/* Key Activities remains the same */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Key Activities</h3>
              <ul className="space-y-3">
                {ai.event.activities.map((act, i) => <li key={i} className="flex gap-3 text-slate-800 font-medium"><CheckCircle2 size={20} className="text-black shrink-0"/> {act}</li>)}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ai.schedule.map((item, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-black transition-colors">
                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded mb-3">{item.time} ({item.duration})</span>
                <h4 className="text-lg font-black text-black mb-2">{item.activity}</h4>
                <p className="text-slate-600 text-sm font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        )}

{activeTab === 'logistics' && (
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Budget Overview</h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Total Budget</p>
                  <p className="text-3xl font-black text-black">${input.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Estimated Cost</p>
                  <p className="text-3xl font-black text-black">${ai.budget.reduce((acc, curr) => acc + curr.estimatedCost, 0)}</p>
                </div>
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Cost Breakdown</h3>
              {ai.budget.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm">{item.item}</span>
                  <span className="font-black text-black">${item.estimatedCost}</span>
                </div>
              ))}
            </div>
            {/* Team Roles remains the same */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Team Roles</h3>
              {ai.volunteers.map((vol, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-black">{vol.role}</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{vol.numberOfVolunteers} Required</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'poster' && <PosterCanvas posterData={ai.poster} />}
      </div>
    </div>
  );
}
