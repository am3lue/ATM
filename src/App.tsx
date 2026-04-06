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
import { Alerts } from './components/Alerts';
import { BTC_DATA, BTC_ANNOTATIONS } from './data/btcData';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cheat');

  // Get current price from the last candle
  const currentPrice = BTC_DATA.length > 0 ? BTC_DATA[BTC_DATA.length - 1].close : 0;
  const isBullish = BTC_DATA.length > 1 ? BTC_DATA[BTC_DATA.length - 1].close >= BTC_DATA[BTC_DATA.length - 2].close : true;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-8 md:pb-12">
        {activeTab === 'cheat' && <CheatSheet />}
        {activeTab === 'guide' && <DecisionGuide />}
        {activeTab === 'learn' && <LearningMode />}
        {activeTab === 'alerts' && <Alerts currentPrice={currentPrice} />}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Live Market <span className="text-emerald-400">Analysis</span></h2>
                <p className="text-slate-400 mt-1">Real-time BTC/USDT analysis on the <span className="text-white font-bold">1-Hour (1H)</span> timeframe.</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col items-end px-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Price</span>
                  <span className="text-xl font-mono font-black text-emerald-400">
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="h-10 w-px bg-slate-800" />
                <div className="flex flex-col items-end px-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend</span>
                  <span className={`text-xl font-mono font-black ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isBullish ? 'Bullish' : 'Bearish'}
                  </span>
                </div>
              </div>
            </div>
            
            <TradingChart data={BTC_DATA} annotations={BTC_ANNOTATIONS} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                <h3 className="text-xl font-black text-white mb-6">SMC Identifiers</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
                    <span className="text-sm text-slate-300 font-bold">BOS (Break of Structure)</span>
                    <span className="text-xs text-slate-500 ml-auto font-medium">Trend Continuation</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20" />
                    <span className="text-sm text-slate-300 font-bold">CHoCH (Change of Character)</span>
                    <span className="text-xs text-slate-500 ml-auto font-medium">Trend Reversal</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                    <span className="text-sm text-slate-300 font-bold">Order Block (OB)</span>
                    <span className="text-xs text-slate-500 ml-auto font-medium">Institutional Interest</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                <h3 className="text-xl font-black text-white mb-6">Chart Controls</h3>
                <div className="grid grid-cols-1 gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <kbd className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 font-mono font-bold">Scroll</kbd>
                    <span className="font-medium">to Zoom In/Out</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <kbd className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 font-mono font-bold">Drag</kbd>
                    <span className="font-medium">to Pan the Chart</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                    <kbd className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 font-mono font-bold">Hover</kbd>
                    <span className="font-medium">to see Price Crosshair</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black text-white">Anna's <span className="text-emerald-400">Master</span></h3>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed font-medium">
              A high-end educational trading environment designed exclusively for <span className="text-white">Anna Massawe</span>.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="text-slate-400 text-sm font-bold bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              Built with precision by <span className="text-emerald-400">Blue</span>
            </div>
            <div className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-black">© 2026 Institutional Trading Academy</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
