/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FlyerForm from './components/FlyerForm';
import FlyerPreview from './components/FlyerPreview';
import { StudentData, INITIAL_DATA } from './types';
import { GraduationCap, Info } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<StudentData>(INITIAL_DATA);

  return (
    <div className="flex h-screen bg-[#07130B] text-white overflow-hidden font-sans">
      {/* Editorial Sidebar */}
      <aside className="w-[340px] h-full flex flex-col border-r border-[#1E3A28]">
        <FlyerForm data={data} onChange={setData} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#071109] relative flex flex-col">
        {/* Top Navigation / Header */}
        <header className="relative z-20 w-full border-b border-[#1E3A28] bg-[#07130B]/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <img 
                src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/download%20(3).png" 
                alt="MAPOLY" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://raw.githubusercontent.com/perfectgbakidz/hostingimage/refs/heads/main/NACOSMM.png" 
                alt="NACOS" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white uppercase leading-none">NACOS MAPOLY</h2>
              <p className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-widest mt-1 opacity-70">Finalists Portal</p>
            </div>
          </div>
        </header>

        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4ADE80] rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#065f46] rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12">
          {/* Section Indicator */}
          <div className="mb-8 text-center">
            <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-[0.4em] block mb-2">Editorial System</span>
            <h2 className="text-2xl font-serif italic opacity-30">Generation Dashboard</h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <FlyerPreview data={data} />
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
