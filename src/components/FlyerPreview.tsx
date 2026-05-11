import React, { useRef } from 'react';
import { StudentData, LEVEL_LABELS } from '../types';
import { Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FlyerPreviewProps {
  data: StudentData;
}

export default function FlyerPreview({ data }: FlyerPreviewProps) {
  const flyerRef = useRef<HTMLDivElement>(null);

  const downloadFlyer = async () => {
    if (!flyerRef.current) return;
    
    try {
      const canvas = await html2canvas(flyerRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0A1A0F',
      });
      
      const link = document.createElement('a');
      link.download = `nacos_flyer_${data.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating flyer:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Flyer Region */}
      <div 
        ref={flyerRef}
        id="flyer-capture"
        className="flyer-gradient relative w-[500px] aspect-[5/6.5] overflow-hidden flex flex-col p-8 text-white shadow-2xl"
        style={{ border: '12px solid rgba(255, 255, 255, 0.05)', backgroundColor: '#0a1a0f' }}
      >
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-8 pointer-events-none select-none" style={{ opacity: 0.1 }}>
          <span className="text-[180px] font-serif font-black italic leading-none text-white overflow-hidden">CS</span>
        </div>

        {/* Watermark Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] pointer-events-none select-none flex items-center justify-center overflow-hidden" style={{ opacity: 0.03 }}>
          <img 
            src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
            alt="" 
            className="w-full h-auto object-contain grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Header: Logos and Title */}
        <div className="relative z-10 flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center p-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <img 
              src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" 
              alt="MAPOLY" 
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e5135/ffffff?text=MAPOLY';
              }}
            />
          </div>
          
          <div className="text-center px-4 pt-2">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5" style={{ color: '#4ADE80' }}>
              National Association of Computer Science Students
            </p>
            <h1 className="font-serif italic text-lg text-white leading-none" style={{ opacity: 0.9 }}>
              NACOS MAPOLY CHAPTER
            </h1>
          </div>

          <div className="w-14 h-14 rounded-full flex items-center justify-center p-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <img 
              src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
              alt="NACOS" 
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e5135/ffffff?text=NACOS';
              }}
            />
          </div>
        </div>

        {/* Big Impact Title */}
        <div className="relative z-10 text-center mb-8 mt-2">
          <h2 className="text-[52px] font-black leading-[0.8] tracking-tighter uppercase text-white">
            FACE <span style={{ color: '#4ADE80' }}>OF THE</span>
          </h2>
          <h2 className="text-[52px] font-black leading-[0.8] tracking-tighter uppercase text-white">
            FINALIST
          </h2>
        </div>

        {/* Main Content: Photo and Info Grid */}
        <div className="relative z-10 flex gap-6 flex-1 items-stretch">
          {/* Left: Polaroid */}
          <div className="w-[42%] flex flex-col pt-4">
            <div className="relative">
              <div className="tape-effect"></div>
              <div className="polaroid-frame w-full aspect-[4/5]" style={{ backgroundColor: '#ffffff' }}>
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#1A3A28' }}>
                  {data.photo ? (
                    <img 
                      src={data.photo} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center" style={{ opacity: 0.3 }}>
                      <Download size={32} className="mb-2 rotate-180 text-white" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">Portrait</span>
                    </div>
                  )}
                </div>
                <div className="pt-3 pb-1 text-center">
                   <p className="font-serif italic text-[#0A1A0F] text-sm font-bold truncate">
                     {data.nickname ? `"${data.nickname}"` : ''}
                   </p>
                </div>
              </div>
            </div>
            
            {/* Name Under Photo */}
            <div className="mt-6 text-left">
              <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter pb-1 inline-block" style={{ borderBottom: '2px solid #4ADE80' }}>
                {data.name}
              </h3>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-wide leading-tight max-w-[180px]" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {LEVEL_LABELS[data.level]}
              </p>
              <div className="mt-4 p-2 rounded flex flex-col gap-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span className="text-[7px] font-bold uppercase" style={{ color: '#4ADE80' }}>Handle</span>
                <span className="text-[10px] font-mono font-bold text-white">{data.socialHandle}</span>
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="w-[58%] flex flex-col space-y-4 pt-2 overflow-hidden overflow-y-auto pr-1 scrollbar-hide">
            {/* Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <FlyerDetail label="State of Origin" value={data.stateOfOrigin} />
                <FlyerDetail label="Birthday" value={data.birthday} />
                <FlyerDetail label="Relationship" value={data.relationshipStatus} />
                <FlyerDetail label="Hobby" value={data.hobby} />
              </div>

              <div className="p-3 space-y-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px solid #4ADE80' }}>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <FlyerDetail label="Best Level" value={data.bestLevel} small />
                  <FlyerDetail label="Difficult Level" value={data.difficultLevel} small />
                  <FlyerDetail label="Best Course" value={data.bestCourse} small />
                  <FlyerDetail label="Worse Course" value={data.worstCourse} small />
                </div>
                <FlyerDetail label="Favorite Lecturer" value={data.favoriteLecturer} small />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <FlyerDetail label="Post Held" value={data.postHeld} />
                <FlyerDetail label="Business Skill" value={data.businessSkill} />
                <FlyerDetail label="Alternative Career" value={data.careerAlternative} />
                <FlyerDetail label="Class Crush" value={data.classCrush} />
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', border: '1px solid rgba(6, 95, 70, 0.3)' }}>
                <FlyerDetail label="Favorite Word" value={`"${data.favoriteWord}"`} italic />
              </div>

              <div className="space-y-2">
                <FlyerDetail label="What's Next?" value={data.whatNext} />
                <FlyerDetail label="Campus Experience" value={data.bestCampusExperience} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="relative z-10 mt-auto pt-6 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="font-sans font-bold text-[8px] uppercase tracking-[0.3em] mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Office of Social Director
          </p>
          <p className="font-sans font-black text-[10px] uppercase tracking-[0.1em]" style={{ color: '#4ADE80' }}>
            Dan Sugar Led Administration 2025/2026
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          onClick={downloadFlyer}
          className="flex items-center gap-2 px-8 py-4 hover:bg-white transition-all active:scale-95 shadow-xl shadow-black/20 text-[#0A1A0F] font-bold uppercase tracking-widest text-xs"
          style={{ backgroundColor: '#4ADE80' }}
        >
          <Download size={16} />
          <span>Generate PNG</span>
        </button>
      </div>
    </div>
  );
}

function FlyerDetail({ label, value, small, italic }: { label: string; value: string; small?: boolean; italic?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`uppercase font-bold tracking-[0.15em] ${small ? 'text-[7px]' : 'text-[8px]'} opacity-70`} style={{ color: '#4ADE80' }}>
        {label}
      </span>
      <span className={`text-white leading-tight ${small ? 'text-[10px]' : 'text-[11px]'} ${italic ? 'font-serif italic font-medium' : 'font-bold'}`}>
        {value || '---'}
      </span>
    </div>
  );
}
