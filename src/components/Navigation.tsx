/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutGrid, BookOpen, Play, TrendingUp } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <TrendingUp className="text-slate-950 w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Anna's Trading <span className="text-emerald-400">Master</span></h1>
        </div>
        
        <nav className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
          <NavButton 
            active={activeTab === 'cheat'} 
            onClick={() => onTabChange('cheat')} 
            icon={<LayoutGrid size={18} />} 
            label="Cheat Sheet" 
          />
          <NavButton 
            active={activeTab === 'guide'} 
            onClick={() => onTabChange('guide')} 
            icon={<BookOpen size={18} />} 
            label="Decision Guide" 
          />
          <NavButton 
            active={activeTab === 'learn'} 
            onClick={() => onTabChange('learn')} 
            icon={<Play size={18} />} 
            label="Learning Mode" 
          />
          <NavButton 
            active={activeTab === 'chart'} 
            onClick={() => onTabChange('chart')} 
            icon={<TrendingUp size={18} />} 
            label="Live Chart" 
          />
        </nav>
      </div>
    </header>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all whitespace-nowrap ${active ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);
