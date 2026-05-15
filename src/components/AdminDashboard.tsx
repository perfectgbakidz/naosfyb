import React, { useState, useEffect } from 'react';
import { LogIn, Database, User, ShieldCheck, Download, Trash2, RefreshCw, Edit3, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FlyerPreview from './FlyerPreview';
import { StudentData, Level } from '../types';
import html2canvas from 'html2canvas';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || '';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    
    if (!backendUrl) {
      alert("Missing VITE_BACKEND_URL. Please set it in Settings > Environment Variables.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/admin/dashboard`, {
        headers: { 
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setToken(authHeader);
        setIsLoggedIn(true);
        const data = await response.json();
        setRecords(data.flyers || []);
        setStats(data);
      } else {
        const errorText = await response.text();
        alert(`Access Denied: ${response.status}`);
      }
    } catch (err: any) {
      alert("Login failed: Check your connection and CORS settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecords = async (authToken: string) => {
    setIsLoading(true);
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || '';
    try {
      const response = await fetch(`${backendUrl}/admin/dashboard`, {
        headers: { 'Authorization': authToken }
      });
      const data = await response.json();
      setRecords(data.flyers || []);
      setStats(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A1A0F] border border-[#1E3A28] p-8 rounded-2xl w-full max-w-md shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="text-[#4ADE80]" size={24} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">Admin Access</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Personnel Authorization Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-[#4ADE80] font-bold uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-[#1E3A28] p-3 rounded-lg text-sm focus:outline-none focus:border-[#4ADE80] transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#4ADE80] font-bold uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-[#1E3A28] p-3 rounded-lg text-sm focus:outline-none focus:border-[#4ADE80] transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4ADE80] text-black font-black py-4 uppercase tracking-widest text-[10px] rounded-lg mt-4 disabled:opacity-50"
            >
              Verify Credentials
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-white/40 text-[10px] uppercase font-bold tracking-widest mt-2 hover:text-white transition-colors"
            >
              Exit Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#07130B] flex flex-col">
      <header className="border-b border-[#1E3A28] bg-[#0A1A0F] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Database className="text-[#4ADE80]" size={20} />
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em]">Data Repository</h1>
            <p className="text-[9px] text-[#4ADE80] font-bold uppercase tracking-[0.1em]">Student Submissions & Payments</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchRecords(token)}
            className="p-2 hover:bg-[#1E3A28] rounded-lg transition-colors text-white/60"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={onClose}
            className="bg-[#4ADE80] text-black text-[10px] font-black px-4 py-2 uppercase tracking-widest rounded transition-transform active:scale-95"
          >
            Back to Editor
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-8">
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <StatCard label="Total Records" value={stats.total_records} />
              <StatCard label="Revenue" value={`₦${stats.total_revenue?.toLocaleString()}`} color="text-[#4ADE80]" />
              <StatCard label="Successful" value={stats.successful_payments} color="text-green-500" />
              <StatCard label="Pending" value={stats.pending_payments} color="text-yellow-500" />
              <StatCard label="Failed" value={stats.failed_payments} color="text-red-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="ND2 CS - DD Legends '26" value={stats.nd2_count} />
              <StatCard label="HND2 SWD" value={stats.hnd2_swd_count} />
              <StatCard label="HND2 NCC" value={stats.hnd2_ncc_count} />
              <StatCard label="Single" value={stats.single_count} color="text-pink-400" />
              <StatCard label="Married" value={stats.married_count} color="text-purple-400" />
              <StatCard label="Other Rel." value={stats.other_relationship_count} color="text-white/40" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {records.length === 0 && !isLoading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20 capitalize">
              <Database size={48} className="mb-4" />
              <p className="text-xl font-serif italic text-white/50">No records found in database.</p>
            </div>
          )}
          
          {records.map((record, index) => (
            <FlyerDetailCard 
              key={record.tx_ref || index} 
              record={record} 
              onEdit={() => setEditingRecord(record)}
            />
          ))}
        </div>
      </main>

      <AnimatePresence>
        {editingRecord && (
          <AdminEditor 
            record={editingRecord} 
            onClose={() => setEditingRecord(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminEditor({ record, onClose }: { record: any; onClose: () => void }) {
  const [photo, setPhoto] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Map backend record to StudentData
  const mapLevel = (lvl: string): Level => {
    if (lvl?.includes('SWD')) return 'HND2_SWD';
    if (lvl?.includes('NCC')) return 'HND2_NCC';
    return 'ND2';
  };

  const studentData: StudentData = {
    name: record.full_name || '',
    photo: photo,
    nickname: record.nickname || '',
    stateOfOrigin: record.state_of_origin || '',
    birthday: `${record.birthday_month} ${record.birthday_day}`.trim(),
    relationshipStatus: record.relationship_status || 'Single',
    hobby: record.hobby || '',
    socialHandle: record.social_handle || '',
    favoriteWord: record.favorite_word_quote || '',
    classCrush: record.class_crush || '',
    level: mapLevel(record.current_level),
    bestLevel: record.best_level || '',
    difficultLevel: record.difficult_level || '',
    bestCourse: record.best_course || '',
    worstCourse: record.worst_course || '',
    favoriteLecturer: record.favorite_lecturer || '',
    postHeld: record.post_held || '',
    careerAlternative: record.career_alternative || '',
    businessSkill: record.business_skill || '',
    whatNext: record.whats_next || '',
    bestCampusExperience: record.best_campus_experience || ''
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    const flyerElement = document.getElementById('flyer-capture');
    if (!flyerElement) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(flyerElement, {
        useCORS: true,
        scale: 4,
        backgroundColor: '#0d2e1a',
      });
      const link = document.createElement('a');
      link.download = `ADMIN_REGEN_${studentData.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert("Capture failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase text-[#4ADE80]">Regeneration Studio</h2>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Admin Tool / Manual Override</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#0A1A0F] border border-[#1E3A28] rounded-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60">1. Identity Verification</h3>
            <div className="grid grid-cols-2 gap-4">
              <RecordField label="Full Name" value={record.full_name} />
              <RecordField label="Level" value={record.current_level} />
              <RecordField label="Status" value={record.payment_status} />
              <RecordField label="Ref" value={record.tx_ref?.slice(-8)} />
            </div>
          </div>

          <div className="p-6 bg-[#0A1A0F] border border-[#1E3A28] rounded-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60">2. Asset Injection (Portrait)</h3>
            <div className="flex flex-col items-center">
              <input type="file" id="admin-photo" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              <label 
                htmlFor="admin-photo"
                className="w-full h-48 border-2 border-dashed border-[#1E3A28] hover:border-[#4ADE80] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20"
              >
                {photo ? (
                  <img src={photo} className="w-full h-full object-cover rounded-lg" alt="Regen Preview" />
                ) : (
                  <>
                    <Camera size={32} className="text-[#4ADE80] mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Select Portrait</span>
                  </>
                )}
              </label>
              <p className="text-[8px] text-white/30 mt-3 uppercase font-bold">Recommended: 1:1 Aspect Ratio / High Quality</p>
            </div>
          </div>

          <button 
            onClick={handleDownload}
            disabled={!photo || isGenerating}
            className="w-full bg-[#4ADE80] text-black font-black py-5 uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#22c55e] transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
          >
            {isGenerating ? 'Processing HD Export...' : 'Regenerate & Download'}
            {!isGenerating && <Download size={18} />}
          </button>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-[#0A1A0F] items-center justify-center p-8 border-l border-[#1E3A28] overflow-auto">
        <div className="min-w-fit">
          <FlyerPreview data={studentData} isPaid={true} />
        </div>
      </div>
    </div>
  );
}

interface FlyerDetailCardProps {
  record: any;
  onEdit: () => void;
  key?: React.Key;
}

function FlyerDetailCard({ record, onEdit }: FlyerDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasValidPortrait = record.student_portrait && record.student_portrait !== "skipped" && record.student_portrait.startsWith('data:');

  return (
    <motion.div 
      layout
      className="bg-[#0A1A0F] border border-[#1E3A28] rounded-xl overflow-hidden flex flex-col h-fit"
    >
      <div className="relative aspect-square bg-black">
        {hasValidPortrait ? (
          <img 
            src={record.student_portrait} 
            alt={record.full_name} 
            className="w-full h-full object-cover opacity-60" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
            <User size={48} className="mb-2 opacity-50" />
            <span className="text-[7px] uppercase font-black tracking-widest opacity-30">Portrait Not Uploaded</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
            record.payment_status === 'successful' ? 'bg-[#4ADE80] text-black' : 'bg-red-500/20 text-red-500 border border-red-500/30'
          }`}>
            {record.payment_status}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight truncate">{record.full_name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[9px] text-[#4ADE80] font-bold uppercase">{record.current_level}</p>
            {record.nickname && (
              <span className="text-[8px] text-white/40 uppercase">"{record.nickname}"</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <RecordField label="Hobby" value={record.hobby} />
          <RecordField label="Handle" value={record.social_handle} />
          <RecordField label="Relationship" value={record.relationship_status} />
          <RecordField label="Birthday" value={record.birthday} />
        </div>
        
        <RecordField label="Quote" value={record.favorite_word_quote} />

        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-4 border-t border-[#1E3A28] space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <RecordField label="Origin" value={record.state_of_origin} />
              <RecordField label="Class Crush" value={record.class_crush} />
              <RecordField label="Best Level" value={record.best_level} />
              <RecordField label="Tough Level" value={record.difficult_level} />
              <RecordField label="Best Course" value={record.best_course} />
              <RecordField label="Worst Course" value={record.worst_course} />
              <RecordField label="Fav Lecturer" value={record.favorite_lecturer} />
              <RecordField label="Post Held" value={record.post_held} />
            </div>

            <RecordField label="Career Alt" value={record.career_alternative} />
            <RecordField label="Business Skill" value={record.business_skill} />
            <RecordField label="What's Next" value={record.whats_next} />
            <RecordField label="Campus Exp" value={record.best_campus_experience} />
          </motion.div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] uppercase font-black tracking-widest text-white/50 hover:text-white transition-colors"
          >
            {isExpanded ? 'Hide Dossier' : 'View Full Dossier'}
          </button>
          
          <button 
            onClick={onEdit}
            className="px-4 py-2 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 rounded-lg text-[9px] uppercase font-black tracking-widest text-[#4ADE80] transition-colors flex items-center gap-2"
          >
            <Edit3 size={12} />
            Regen
          </button>
        </div>
        
        <div className="pt-3 border-t border-[#1E3A28] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase font-black">Transaction Ref</span>
            <span className="text-[9px] font-mono text-white/60">{record.tx_ref?.slice(-12)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] text-white/30 uppercase font-black">Date</span>
            <span className="text-[9px] text-white/60">{new Date(record.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecordField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[7px] text-[#4ADE80] uppercase font-black tracking-widest">{label}</span>
      <span className="text-[10px] text-white/80 font-medium truncate">{value || '---'}</span>
    </div>
  );
}

function StatCard({ label, value, color = "text-white" }: { label: string, value: any, color?: string }) {
  return (
    <div className="bg-[#0A1A0F] border border-[#1E3A28] p-4 rounded-xl">
      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </div>
  );
}
