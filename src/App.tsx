/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FlyerForm from './components/FlyerForm';
import FlyerPreview from './components/FlyerPreview';
import { StudentData, INITIAL_DATA } from './types';
import { GraduationCap, Info, Menu, X, ShieldAlert } from 'lucide-react';

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function App() {
  const [data, setData] = useState<StudentData>(INITIAL_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Screenshot and Shortcut Protection
  useEffect(() => {
    const handleContext = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // Disable PrtSc, F12, Ctrl+U, Ctrl+P, Ctrl+S
      if (
        e.key === 'PrintScreen' || 
        e.key === 'F12' || 
        (e.ctrlKey && (e.key === 'u' || e.key === 'p' || e.key === 's'))
      ) {
        e.preventDefault();
        alert('Screenshots and shortcuts are disabled for security.');
      }
    };

    document.addEventListener('contextmenu', handleContext);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#07130B] text-white overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Editorial Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[340px] h-full flex flex-col border-r border-[#1E3A28] bg-[#07130B] transition-transform duration-300 ease-in-out anti-screenshot
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4 z-50">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <FlyerForm data={data} onChange={setData} isPaid={isPaid} setIsPaid={setIsPaid} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#071109] relative flex flex-col">
        {/* Top Navigation / Header */}
        <header className="relative z-20 w-full border-b border-[#1E3A28] bg-[#07130B]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#4ADE80] hover:bg-[#4ADE80]/10 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex gap-2">
              <img 
                src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" 
                alt="MAPOLY" 
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
                alt="NACOS" 
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xs lg:text-sm font-black tracking-tight text-white uppercase leading-none">NACOS MAPOLY</h2>
              <p className="text-[9px] lg:text-[10px] font-bold text-[#4ADE80] uppercase tracking-widest mt-1 opacity-70">Finalists Portal</p>
            </div>
          </div>
        </header>

        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4ADE80] rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#065f46] rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 lg:p-12 anti-screenshot">
          <div className="anti-screenshot-overlay" />
          {/* Section Indicator */}
          <div className="mb-8 text-center">
            <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-[0.4em] block mb-2">Editorial System</span>
            <h2 className="text-xl lg:text-2xl font-serif italic opacity-30">Generation Dashboard</h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-[400px] flex justify-center"
          >
            <FlyerPreview data={data} isPaid={isPaid} />
          </motion.div>

          <footer className="mt-16 pb-12 text-center opacity-30 px-12 max-w-2xl border-t border-[#1E3A28]/30 pt-8">
             <div className="flex justify-center gap-6 mb-4">
                <img 
                  src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" 
                  alt="MAPOLY" 
                  className="w-8 h-8 grayscale opacity-50"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
                  alt="NACOS" 
                  className="w-8 h-8 grayscale opacity-50"
                  referrerPolicy="no-referrer"
                />
             </div>
             <p className="text-[10px] font-black tracking-[0.2em] uppercase leading-relaxed font-sans mb-1 text-[#4ADE80]">
               Dan Sugar Led Admin 2025/2026
             </p>
             <p className="text-[8px] font-bold opacity-70 uppercase tracking-[0.3em]">
               President | Social Director | Gen Sec | Software Director
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
