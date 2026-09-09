import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, PlusCircle, History, CalendarRange } from 'lucide-react';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventResult from './pages/EventResult';
import EventHistory from './pages/EventHistory';

// The new Minimalist Sidebar
function SidebarLayout({ children }) {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Event', path: '/create', icon: PlusCircle },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <div className="flex h-screen bg-transparent">
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 px-4 py-6 flex flex-col z-20">
        <div className="flex items-center gap-2 px-2 mb-12 text-black font-black text-2xl tracking-tighter uppercase">
          CLUB SYNC®
        </div>
        <nav className="flex-1 space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link key={link.name} to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  isActive ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 hover:text-black'
                }`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} /> {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto custom-scrollbar p-8 z-10 relative">
        {children}
      </main>
    </div>
  );
}

// The Main Router (This might have been accidentally deleted!)
export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={
          <SidebarLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventResult />} />
              <Route path="/history" element={<EventHistory />} />
            </Routes>
          </SidebarLayout>
        } />
      </Routes>
    </Router>
  );
}
