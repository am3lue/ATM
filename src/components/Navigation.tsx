/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutGrid, BookOpen, Play, TrendingUp, Menu, X, Bell } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs: { id: TabType, label: string, icon: React.ReactNode }[] = [
    { id: 'cheat', label: 'Cheat Sheet', icon: <LayoutGrid size={16} /> },
    { id: 'guide', label: 'Decision Guide', icon: <BookOpen size={16} /> },
    { id: 'learn', label: 'Learning Mode', icon: <Play size={16} /> },
    { id: 'chart', label: 'Live Chart', icon: <TrendingUp size={16} /> },
    { id: 'alerts', label: 'Market Alerts', icon: <Bell size={16} /> },
  ];

  const handleTabClick = (id: TabType) => {
    onTabChange(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-2xl sticky top-0 w-full z-[100] pt-[8vh] md:pt-[4vh]">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 md:p-3 rounded-xl shadow-lg shadow-emerald-500/20">
            <TrendingUp className="text-slate-950 w-5 h-5 md:w-8 md:h-8" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-3xl font-black tracking-tight text-white leading-none">
              Anna's <span className="text-emerald-400">Master</span>
            </h1>
            <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-black mt-1">Trading Academy</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {tabs.map((tab) => (
            <NavButton 
              key={tab.id}
              active={activeTab === tab.id} 
              onClick={() => handleTabClick(tab.id)} 
              icon={tab.icon} 
              label={tab.label} 
            />
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/98 backdrop-blur-3xl border-b border-slate-800/50 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
          <nav className="flex flex-col p-4 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white font-bold'
                }`}
              >
                {tab.icon}
                <span className="text-base">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
      active 
        ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 scale-105' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 font-bold'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);
