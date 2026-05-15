import React, { useRef } from 'react';
import { StudentData, LEVEL_LABELS } from '../types';
import { Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FlyerPreviewProps {
  data: StudentData;
  isPaid: boolean;
}

export default function FlyerPreview({ data, isPaid }: FlyerPreviewProps) {
  const flyerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full">
      {/* Flyer Region */}
      <div 
        ref={flyerRef}
        id="flyer-capture"
        className={`flyer-gradient relative w-[500px] h-[650px] overflow-hidden flex flex-col pt-4 px-8 pb-3 text-white shadow-2xl ${!isPaid ? 'grayscale-[0.8] opacity-90' : ''}`}
        style={{ border: '12px solid rgba(255, 255, 255, 0.05)' }}
      >
        {/* Payment Required Watermark */}
        {!isPaid && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none rotate-[-45deg] overflow-hidden">
            <h2 className="text-white/10 text-6xl font-black uppercase tracking-[0.5em] whitespace-nowrap">
              UNPAID PREVIEW • UNPAID PREVIEW • UNPAID PREVIEW
            </h2>
          </div>
        )}
        {/* Watermark Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] pointer-events-none select-none flex items-center justify-center overflow-hidden" style={{ opacity: 0.08 }}>
          <img 
            src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
            alt="" 
            className="w-full h-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Header: Logos and Title */}
        <div className="relative z-10 flex items-center gap-4 mb-1">
          <div className="flex gap-2">
            <img 
              src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" 
              alt="MAPOLY" 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e5135/ffffff?text=MAPOLY';
              }}
            />
            <img 
              src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
              alt="NACOS" 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e5135/ffffff?text=NACOS';
              }}
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-[9px] font-black tracking-[0.05em] uppercase text-white leading-none mb-0.5">
              Moshood Abiola Polytechnic
            </p>
            <p className="text-[7px] font-bold tracking-[0.1em] uppercase mb-0.5" style={{ color: '#4ADE80' }}>
              National Association of Computing Students
            </p>
            <h1 className="font-serif italic text-sm text-white leading-tight" style={{ opacity: 0.9 }}>
              NACOS MAPOLY CHAPTER
            </h1>
          </div>
        </div>

        {/* Big Impact Title */}
        <div className="relative z-20 text-right mb-0 mt-[-4px] pr-6">
          <h2 className="text-[36px] font-black font-serif italic leading-none tracking-tighter uppercase text-white">
            FACE <span style={{ color: '#4ADE80' }}>OF THE</span>
          </h2>
          <h2 className="text-[36px] font-black font-serif italic leading-none tracking-tighter uppercase text-white">
            FINALIST
          </h2>
        </div>

        {/* Main Content: Photo and Info Grid */}
        <div className="relative z-10 flex gap-4 flex-1 items-stretch mt-1">
          {/* Left: Polaroid */}
          <div className="w-[42%] flex flex-col pt-0">
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
                <div className="pt-2 pb-2 text-center overflow-hidden">
                   <p className="font-serif italic text-[#0A1A0F] text-base font-bold truncate leading-snug pb-1">
                     {data.nickname ? `"${data.nickname}"` : ''}
                   </p>
                </div>
              </div>
            </div>
            
            {/* Name Under Photo */}
            <div className="mt-1 text-left">
              <div className="inline-block">
                <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tighter">
                  {data.name || 'Student Name'}
                </h3>
                <div className="h-0.5 w-full bg-[#4ADE80] mt-1"></div>
              </div>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide leading-tight max-w-[180px]" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {LEVEL_LABELS[data.level]}
              </p>
              <div className="mt-3 space-y-3">
                <div className="p-1.5 shadow-inner rounded flex items-center" style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', border: '1px solid rgba(6, 95, 70, 0.2)' }}>
                  <FlyerDetail label="Favorite Word" value={data.favoriteWord ? `"${data.favoriteWord}"` : '---'} italic small />
                </div>
                <div className="min-w-0 px-1">
                  <span className="text-[6px] font-bold uppercase tracking-wider block" style={{ color: '#4ADE80', lineHeight: '1.5' }}>Social Handle</span>
                  <span className="text-[9px] font-mono font-bold text-white truncate block" style={{ lineHeight: '1.6', paddingTop: '2px', paddingBottom: '2px' }}>{data.socialHandle || '---'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="w-[58%] flex flex-col space-y-2 pt-6 overflow-hidden pr-1">
            {/* Details Section */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <FlyerDetail label="State of Origin" value={data.stateOfOrigin} />
                <FlyerDetail label="Birthday" value={data.birthday} />
                <FlyerDetail label="Relationship" value={data.relationshipStatus} />
                <FlyerDetail label="Hobby" value={data.hobby} />
              </div>

              <div className="mt-3 p-1.5 space-y-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px solid #4ADE80' }}>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <FlyerDetail label="Best Level" value={data.bestLevel} small />
                  <FlyerDetail label="Difficult Level" value={data.difficultLevel} small />
                  <FlyerDetail label="Best Course" value={data.bestCourse} small />
                  <FlyerDetail label="Worse Course" value={data.worstCourse} small />
                </div>
                <FlyerDetail label="Favorite Lecturer" value={data.favoriteLecturer} small />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <FlyerDetail label="Post Held" value={data.postHeld} />
                <FlyerDetail label="Business Skill" value={data.businessSkill} />
                <FlyerDetail label="Alternative Career" value={data.careerAlternative} />
                <FlyerDetail label="Class Crush" value={data.classCrush} />
              </div>

              <div className="mt-2 pt-2 space-y-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <FlyerDetail label="What's Next?" value={data.whatNext} />
                <FlyerDetail label="Campus Experience" value={data.bestCampusExperience} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="relative z-10 mt-auto pt-1.5 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="font-sans font-bold text-[7px] uppercase tracking-[0.2em] mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Office of Social Director
          </p>
          <p className="font-sans font-black text-[9px] uppercase tracking-[0.05em]" style={{ color: '#4ADE80' }}>
            Dan Sugar Led Administration 2025/2026
          </p>
        </div>
      </div>
    </div>
  );
}

function FlyerDetail({ label, value, small, italic }: { label: string; value: string; small?: boolean; italic?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`uppercase font-bold tracking-[0.1em] ${small ? 'text-[6px]' : 'text-[7px]'} opacity-70`} style={{ color: '#4ADE80', lineHeight: '1.2' }}>
        {label}
      </span>
      <span className={`text-white block ${small ? 'text-[9px]' : 'text-[10px]'} ${italic ? 'font-serif italic font-medium' : 'font-bold'}`} style={{ lineHeight: '1.4' }}>
        {value || '---'}
      </span>
    </div>
  );
}
