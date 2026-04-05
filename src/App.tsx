/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CheatSheet } from './components/CheatSheet';
import { DecisionGuide } from './components/DecisionGuide';
import { LearningMode } from './components/LearningMode';
import { TradingChart } from './components/TradingChart';
import { BTC_DATA, BTC_ANNOTATIONS } from './data/btcData';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cheat');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {activeTab === 'cheat' && <CheatSheet />}
        {activeTab === 'guide' && <DecisionGuide />}
        {activeTab === 'learn' && <LearningMode />}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Live Market <span className="text-emerald-400">Analysis</span></h2>
                <p className="text-slate-400 mt-1">Real-time BTC/USDT analysis on the <span className="text-white font-bold">1-Hour (1H)</span> timeframe.</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Price</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">$130,200.00</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">Bullish</span>
                </div>
              </div>
            </div>
            
            <TradingChart data={BTC_DATA} annotations={BTC_ANNOTATIONS} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">SMC Identifiers</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-300 font-medium">BOS (Break of Structure)</span>
                    <span className="text-xs text-slate-500 ml-auto">Trend Continuation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-300 font-medium">CHoCH (Change of Character)</span>
                    <span className="text-xs text-slate-500 ml-auto">Trend Reversal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500" />
                    <span className="text-sm text-slate-300 font-medium">Order Block (OB)</span>
                    <span className="text-xs text-slate-500 ml-auto">Institutional Interest</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Chart Controls</h3>
                <div className="grid grid-cols-1 gap-3 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300">Scroll</kbd>
                    <span>to Zoom In/Out</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300">Drag</kbd>
                    <span>to Pan the Chart</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300">Hover</kbd>
                    <span>to see Price Crosshair</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Anna's Trading Master</h3>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed">
              A personalized educational tool designed to empower Anna Massawe with the skills of institutional trading.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-slate-400 text-sm font-medium">
              Made with ❤️ by <span className="text-emerald-400 font-bold">Blue</span> for <span className="text-white font-bold">Anna Massawe</span>
            </div>
            <div className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2026 All Rights Reserved</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
