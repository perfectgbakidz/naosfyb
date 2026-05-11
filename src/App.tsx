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
      <main className="flex-1 overflow-y-auto bg-[#071109] relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4ADE80] rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#065f46] rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 min-h-full flex flex-col items-center justify-center p-12">
          {/* Section Indicator */}
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-[0.4em] block mb-2">Live Rendering Engine</span>
            <h2 className="text-2xl font-serif italic opacity-30">NACOS Editorial System</h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <FlyerPreview data={data} />
          </motion.div>

          <footer className="mt-16 text-center opacity-30 px-12 max-w-lg">
             <p className="text-[8px] font-bold tracking-[0.2em] uppercase leading-relaxed font-sans">
               Optimized for standard A4 aspect ratio exports. All assets generated maintain high fidelity for social media distribution.
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
