import { useRef, useState, useEffect } from 'react';
import { Download, Loader2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function PosterCanvas({ posterData }) {
  const printRef = useRef();
  const [posterImageUrl, setPosterImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // 1. SAFELY handle missing posterData so it never crashes!
  const safeData = posterData || {};
  
  const design = safeData.design || {
    theme: 'dark', primaryColor: '#000000', accentColor: '#333333', headingFont: 'Inter', bodyFont: 'Inter'
  };

  useEffect(() => {
    try {
      // 2. Safely parse fonts
      const hFont = (design.headingFont || 'Inter').split(',')[0].trim().replace(/ /g, '+');
      const bFont = (design.bodyFont || 'Inter').split(',')[0].trim().replace(/ /g, '+');
      
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${hFont}&family=${bFont}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const timer = setTimeout(() => generateImage(), 1500);
      return () => {
        clearTimeout(timer);
        if (document.head.contains(link)) document.head.removeChild(link);
      };
    } catch (e) {
      // Fallback if font parsing fails
      const timer = setTimeout(() => generateImage(), 1500);
      return () => clearTimeout(timer);
    }
  }, [posterData]);

  const generateImage = () => {
    setIsGenerating(true);
    if (!printRef.current) return;
    
    html2canvas(printRef.current, {
      scale: 3, 
      useCORS: true,
      backgroundColor: design.theme === 'dark' ? '#09090b' : '#ffffff'
    }).then(canvas => {
      setPosterImageUrl(canvas.toDataURL('image/png'));
      setIsGenerating(false);
    }).catch(() => setIsGenerating(false));
  };

  const isDark = design.theme === 'dark';

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex gap-4 w-full justify-center">
        <button onClick={generateImage} disabled={isGenerating} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-slate-800 transition font-bold text-sm shadow-md disabled:opacity-50">
          <Sparkles size={18} /> Re-render Graphics
        </button>
        <button 
          onClick={() => {
            const link = document.createElement('a');
            link.download = `club-sync-${(safeData.headline || 'event').replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = posterImageUrl;
            link.click();
          }} 
          disabled={isGenerating || !posterImageUrl} 
          className="flex items-center gap-2 text-white px-6 py-3 rounded-full transition font-bold text-sm shadow-md disabled:opacity-50"
          style={{ backgroundColor: design.primaryColor }}
        >
          <Download size={18} /> Export High-Res PNG
        </button>
      </div>

      <div className="relative group w-full max-w-md mx-auto flex justify-center mb-10">
        {isGenerating ? (
          <div className="w-[400px] h-[560px] bg-slate-100 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-slate-200">
            <Loader2 className="w-10 h-10 animate-spin text-slate-400 mb-4" />
            <p className="text-slate-500 font-medium font-mono text-sm">Rendering minimal assets...</p>
          </div>
        ) : (
          <img src={posterImageUrl} alt="Generated Poster" className="w-[400px] shadow-2xl rounded-xl border border-slate-200/50 hover:scale-[1.02] transition-transform duration-500" />
        )}
      </div>

      {/* Hidden Render Engine */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0">
        <div ref={printRef} className={`relative w-[400px] h-[560px] p-10 flex flex-col justify-between overflow-hidden ${isDark ? 'bg-[#09090b] text-white' : 'bg-white text-slate-900'}`}>
          
          {/* Minimalist Graphic Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border-[20px] opacity-10 mix-blend-difference" style={{ borderColor: design.primaryColor }}></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5" style={{ backgroundColor: design.accentColor }}></div>

          <div className="relative z-10" style={{ fontFamily: design.headingFont || 'sans-serif' }}>
            <div className="inline-block px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase mb-8 border-2 border-current rounded-full" style={{ color: design.accentColor }}>
              {safeData.subheadline || 'CLUB SYNC EVENT'}
            </div>
            
            {/* Giant Minimal Headline */}
            <h1 className="text-[3.5rem] font-black leading-[0.9] tracking-tighter uppercase break-words hyphens-auto">
              {safeData.headline || 'EVENT TITLE'}
            </h1>
          </div>

          {/* Minimalist Footer Grid */}
          <div className="relative z-10 w-full pt-8 border-t-4 border-current mt-auto" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', fontFamily: design.bodyFont || 'sans-serif' }}>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-[9px] uppercase tracking-widest opacity-50 font-bold mb-1">When</p>
                <p className="font-black text-sm uppercase leading-tight">{safeData.date || 'TBA'}</p>
                <p className="font-black text-sm uppercase leading-tight text-slate-400">{safeData.time || 'TBA'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest opacity-50 font-bold mb-1">Where</p>
                <p className="font-black text-sm uppercase leading-tight break-words">{safeData.venue || 'TBA'}</p>
              </div>
            </div>
            
            <div className="w-full text-center py-4 text-xs font-black uppercase tracking-[0.2em]" style={{ backgroundColor: design.primaryColor, color: isDark ? '#fff' : '#000' }}>
              {safeData.callToAction || 'REGISTER NOW'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
