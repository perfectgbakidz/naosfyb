import React, { useState, useEffect } from 'react';
import { LogIn, Database, User, ShieldCheck, Download, Trash2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || '';
    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setIsLoggedIn(true);
        fetchRecords(data.token);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecords = async (authToken: string) => {
    setIsLoading(true);
    const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || '';
    try {
      const response = await fetch(`${backendUrl}/api/admin/records`, {
        headers: { 'Authorization': authToken }
      });
      const data = await response.json();
      setRecords(data);
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

      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {records.length === 0 && !isLoading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20 capitalize">
              <Database size={48} className="mb-4" />
              <p className="text-xl font-serif italic text-white/50">No records found in database.</p>
            </div>
          )}
          
          {records.map((record) => (
            <motion.div 
              layout
              key={record.id}
              className="bg-[#0A1A0F] border border-[#1E3A28] rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square bg-black">
                {record.photo_url ? (
                  <img src={record.photo_url} alt={record.name} className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={40} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                    record.status === 'paid' ? 'bg-[#4ADE80] text-black' : 'bg-red-500/20 text-red-500 border border-red-500/30'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex-1 space-y-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight truncate">{record.name}</h3>
                  <p className="text-[9px] text-[#4ADE80] font-bold uppercase">{record.level}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <RecordField label="Hobby" value={record.hobby} />
                  <RecordField label="Handle" value={record.social_handle} />
                </div>
                
                <RecordField label="Quote" value={record.favorite_word} />
                
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
          ))}
        </div>
      </main>
    </div>
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
