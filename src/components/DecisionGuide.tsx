/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export const DecisionGuide: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-10" />
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <ShieldCheck className="text-emerald-400 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Anna's Decision Guide</h2>
        </div>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Anna, follow these steps exactly to make your own trading decisions. Remember, if you don't see all the steps, **don't take the trade!**
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-sm">
              <TrendingUp size={18} />
              <span>Buying (Bullish) Guide</span>
            </div>
            <ul className="space-y-6">
              <GuideStep number="1" title="Look for the 'Floor'" text="Find a low point where price has bounced before (SSL). This is where retail traders have their 'money' hidden." />
              <GuideStep number="2" title="Wait for the 'Trap'" text="Price must drop below that floor to 'sweep' the liquidity. It looks like it's crashing, but it's a trap!" />
              <GuideStep number="3" title="Confirm the 'Shift'" text="Wait for price to suddenly jump back up and break a recent high (MSS). This shows the big players are buying." />
              <GuideStep number="4" title="Find the 'Gap'" text="Look for a big, fast candle that left a 'hole' (FVG). This is your entry zone." />
              <GuideStep number="5" title="Set your 'Trap'" text="Place your buy order at the top of the gap. Put your stop loss below the recent low." />
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-sm">
              <TrendingDown size={18} />
              <span>Selling (Bearish) Guide</span>
            </div>
            <ul className="space-y-6">
              <GuideStep number="1" title="Look for the 'Ceiling'" text="Find a high point where price has hit before (BSL). This is where retail traders have their 'money' hidden." />
              <GuideStep number="2" title="Wait for the 'Trap'" text="Price must jump above that ceiling to 'sweep' the liquidity. It looks like it's mooning, but it's a trap!" />
              <GuideStep number="3" title="Confirm the 'Shift'" text="Wait for price to suddenly crash back down and break a recent low (MSS). This shows the big players are selling." />
              <GuideStep number="4" title="Find the 'Gap'" text="Look for a big, fast candle that left a 'hole' (FVG). This is your entry zone." />
              <GuideStep number="5" title="Set your 'Trap'" text="Place your sell order at the bottom of the gap. Put your stop loss above the recent high." />
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RuleCard title="Patience" text="The market is a device for transferring money from the impatient to the patient. Wait for your setup!" />
        <RuleCard title="Risk Management" text="Never risk more than 1% of your account on a single trade. Protecting your money is job #1." />
        <RuleCard title="Confidence" text="If you followed your steps, you did your job. Whether the trade wins or loses doesn't matter!" />
      </div>
    </motion.div>
  );
};

const GuideStep = ({ number, title, text }: { number: string, title: string, text: string }) => (
  <li className="flex gap-4 group">
    <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-emerald-400 border border-slate-700 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
      {number}
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
    </div>
  </li>
);

const RuleCard = ({ title, text }: { title: string, text: string }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-2 hover:border-blue-500/50 transition-colors">
    <h4 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h4>
    <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
  </div>
);
