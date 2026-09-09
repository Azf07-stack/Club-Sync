import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-200/50 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          CLUB SYNC®
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <span className="hover:text-black cursor-pointer transition-colors">Insights</span>
          <span className="hover:text-black cursor-pointer transition-colors">Solutions</span>
          <span className="hover:text-black cursor-pointer transition-colors">Pricing</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-black transition-colors">Login</Link>
          <Link to="/dashboard" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-1 shadow-md hover:shadow-xl hover:-translate-y-0.5">
            Try For Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center z-10 mt-10">
        <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight leading-[1.05] max-w-4xl mx-auto text-black mb-8">
          Bold Ideas That <br /> Start With Vision.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          We help modern clubs craft automated event schedules, budgets, and digital stories that inspire action and drive results.
        </p>
        <Link to="/create" className="group bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl hover:shadow-black/20 hover:-translate-y-1">
          Get In Touch <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </main>

      {/* Bottom Marquee / Trusted By */}
      <div className="mt-auto border-t border-slate-200/80 py-10 bg-white/60 backdrop-blur-md z-10 w-full">
        <p className="text-center text-sm text-slate-500 font-bold tracking-wide uppercase mb-8">Trusted by teams of every scale</p>
        <div className="flex justify-center items-center gap-12 md:gap-24 opacity-70 grayscale flex-wrap px-4">
          <span className="text-2xl font-black tracking-tighter uppercase">AROHA</span>
          <span className="text-2xl font-bold tracking-widest">NEXORA</span>
          <span className="text-2xl font-black font-serif italic tracking-tight">Vercel</span>
          <span className="text-2xl font-bold">MERCURY</span>
          <span className="text-2xl font-extrabold uppercase">Descript</span>
        </div>
      </div>
    </div>
  );
}
