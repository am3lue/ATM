/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Target, Zap, ArrowUpRight, Layers, Box, Info, ChevronRight, ChevronDown, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheatSheet: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const detailRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToDetail = (id: string) => {
    setSelectedConcept(id);
    detailRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const concepts = [
    {
      id: 'liq',
      icon: <Target className="text-emerald-400" />,
      title: "Liquidity (BSL/SSL)",
      description: "Where 'money' is hidden. Look for equal highs or lows where retail traders put their stop losses.",
      details: "Buy Side Liquidity (BSL) is above highs. Sell Side Liquidity (SSL) is below lows.",
      visual: (
        <svg viewBox="0 0 400 200" className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800">
          {/* Candles */}
          <rect x="50" y="120" width="10" height="40" fill="#ef4444" />
          <line x1="55" y1="110" x2="55" y2="170" stroke="#ef4444" />
          
          <rect x="80" y="80" width="10" height="50" fill="#10b981" />
          <line x1="85" y1="70" x2="85" y2="140" stroke="#10b981" />
          
          <rect x="110" y="100" width="10" height="30" fill="#ef4444" />
          <line x1="115" y1="90" x2="115" y2="140" stroke="#ef4444" />
          
          <rect x="140" y="50" width="10" height="60" fill="#10b981" />
          <line x1="145" y1="40" x2="145" y2="120" stroke="#10b981" />
          
          <rect x="170" y="50" width="10" height="20" fill="#ef4444" />
          <line x1="175" y1="40" x2="175" y2="80" stroke="#ef4444" />
          
          <rect x="200" y="50" width="10" height="30" fill="#10b981" />
          <line x1="205" y1="40" x2="205" y2="90" stroke="#10b981" />

          {/* Liquidity Line */}
          <line x1="140" y1="40" x2="250" y2="40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
          <text x="195" y="30" fill="#3b82f6" fontSize="10" fontWeight="bold">BSL (Equal Highs)</text>
          
          {/* Sweep Move */}
          <path d="M 230 60 L 260 30 L 290 100" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
          <text x="270" y="25" fill="#f43f5e" fontSize="10" fontWeight="bold">Sweep!</text>
          
          <text x="200" y="180" fill="#64748b" fontSize="10" textAnchor="middle">Retail stops are hit here before a reversal.</text>
        </svg>
      ),
      explanation: "Liquidity represents the 'fuel' for market moves. Retail traders often place their stop losses just above previous highs (BSL) or below previous lows (SSL). Smart Money (Institutional traders) needs this liquidity to fill their large orders. They will often push price into these zones to 'sweep' the stops before moving price in the opposite direction.",
      realLife: "On BTC/USDT, you'll often see price range between two levels. Just when it looks like it's breaking out, it wickedly reverses. That 'wick' is the liquidity sweep."
    },
    {
      id: 'choch',
      icon: <Zap className="text-blue-400" />,
      title: "MSS / CHoCH",
      description: "Market Structure Shift or Change of Character. The first sign that the trend is reversing.",
      details: "When price breaks a significant high/low after a liquidity sweep.",
      visual: (
        <svg viewBox="0 0 400 200" className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800">
          {/* Bullish Trend */}
          <polyline points="50,150 100,100 130,120 180,70 210,90" fill="none" stroke="#475569" strokeWidth="2" />
          
          {/* The High */}
          <circle cx="180" cy="70" r="4" fill="#10b981" />
          
          {/* The Break (CHoCH) */}
          <path d="M 210 90 L 250 140" stroke="#3b82f6" strokeWidth="3" />
          <line x1="130" y1="120" x2="280" y2="120" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
          <text x="260" y="115" fill="#3b82f6" fontSize="10" fontWeight="bold">CHoCH</text>
          
          {/* Reversal Confirmation */}
          <polyline points="250,140 280,125 330,170" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="200" y="180" fill="#64748b" fontSize="10" textAnchor="middle">The break of the last 'Higher Low' signals the shift.</text>
        </svg>
      ),
      explanation: "A Change of Character (CHoCH) is the most aggressive sign of a trend reversal. In an uptrend, it occurs when price fails to make a new higher high and instead breaks the previous higher low. This indicates that the 'character' of the market has changed from bullish to bearish (or vice versa).",
      realLife: "If BTC has been climbing for hours and suddenly drops below the last 'dip' level, that's your CHoCH. Stop looking for buys!"
    },
    {
      id: 'bos',
      icon: <ArrowUpRight className="text-purple-400" />,
      title: "BOS",
      description: "Break of Structure. Confirms that the current trend is continuing.",
      details: "When price breaks a high in an uptrend or a low in a downtrend.",
      visual: (
        <svg viewBox="0 0 400 200" className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800">
          <polyline points="50,160 100,110 130,130 180,80 210,100 260,50" fill="none" stroke="#475569" strokeWidth="2" />
          
          {/* BOS 1 */}
          <line x1="100" y1="110" x2="190" y2="110" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
          <text x="140" y="105" fill="#a855f7" fontSize="10" fontWeight="bold">BOS</text>
          
          {/* BOS 2 */}
          <line x1="180" y1="80" x2="270" y2="80" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
          <text x="220" y="75" fill="#a855f7" fontSize="10" fontWeight="bold">BOS</text>
          
          <circle cx="180" cy="80" r="4" fill="#a855f7" />
          <circle cx="260" cy="50" r="4" fill="#a855f7" />
          <text x="200" y="180" fill="#64748b" fontSize="10" textAnchor="middle">Price continues to break previous highs in an uptrend.</text>
        </svg>
      ),
      explanation: "Break of Structure (BOS) is a confirmation of trend continuation. In a bullish trend, every time price breaks above a previous high, it creates a BOS. This tells you that the buyers are still in control and the market is likely to continue its upward trajectory.",
      realLife: "Think of BOS as 'stair-stepping'. As long as the stairs go up and don't break, the trend is your friend."
    },
    {
      id: 'fvg',
      icon: <Layers className="text-orange-400" />,
      title: "FVG",
      description: "Fair Value Gap. A 'hole' in the price action where only one side was active.",
      details: "Price usually returns to fill these gaps before continuing.",
      visual: (
        <svg viewBox="0 0 400 200" className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800">
          {/* Candle 1 */}
          <rect x="80" y="120" width="20" height="40" fill="#10b981" />
          <line x1="90" y1="110" x2="90" y2="170" stroke="#10b981" />
          
          {/* Candle 2 (Large Move) */}
          <rect x="110" y="40" width="20" height="80" fill="#10b981" />
          <line x1="120" y1="30" x2="120" y2="130" stroke="#10b981" />
          
          {/* Candle 3 */}
          <rect x="140" y="10" width="20" height="30" fill="#10b981" />
          <line x1="150" y1="5" x2="150" y2="50" stroke="#10b981" />

          {/* FVG Highlight */}
          <rect x="110" y="50" width="20" height="60" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="1" strokeDasharray="2 2" />
          <text x="180" y="85" fill="#f97316" fontSize="12" fontWeight="bold">FVG Zone</text>
          
          <text x="200" y="180" fill="#64748b" fontSize="10" textAnchor="middle">The gap between Candle 1's high and Candle 3's low.</text>
        </svg>
      ),
      explanation: "Fair Value Gaps (FVG) occur when price moves so quickly that it leaves an imbalance in the market. It is defined as the gap between the high of Candle 1 and the low of Candle 3 in a 3-candle sequence. These gaps act like magnets; price often returns to 'rebalance' this zone before continuing its move.",
      realLife: "When Elon Musk tweets and BTC rockets up $2k in 1 minute, it leaves an FVG. Price will almost always come back to fill that 'empty' space later."
    },
    {
      id: 'ob',
      icon: <Box className="text-rose-400" />,
      title: "Order Block",
      description: "The last candle before a big move. Where smart money placed their big orders.",
      details: "Look for the last down candle before a big up move (Bullish OB).",
      visual: (
        <svg viewBox="0 0 400 200" className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800">
          {/* Last Sell Candle (OB) */}
          <rect x="80" y="100" width="20" height="40" fill="#ef4444" />
          <line x1="90" y1="90" x2="90" y2="150" stroke="#ef4444" />
          <rect x="75" y="95" width="30" height="50" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Huge Buy Move */}
          <rect x="110" y="30" width="20" height="70" fill="#10b981" />
          <rect x="140" y="10" width="20" height="40" fill="#10b981" />
          
          {/* Return to OB */}
          <path d="M 160 30 L 250 120" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="120" r="6" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="260" y="110" fill="#10b981" fontSize="10" fontWeight="bold">Entry Point!</text>
          
          <text x="200" y="180" fill="#64748b" fontSize="10" textAnchor="middle">Institutions buy at the same level they previously sold.</text>
        </svg>
      ),
      explanation: "An Order Block (OB) is a specific candle where institutional traders have placed significant buy or sell orders. A Bullish OB is the last bearish candle before a strong impulsive bullish move. When price eventually returns to this candle, it often finds 'support' as the institutions defend their positions.",
      realLife: "Think of an Order Block as a 'Footprint'. Big banks left their mark there. When price returns, they are likely to buy again to protect their average price."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {concepts.map((concept) => (
          <ConceptCard 
            key={concept.id}
            icon={concept.icon}
            title={concept.title}
            description={concept.description}
            details={concept.details}
            isSelected={selectedConcept === concept.id}
            onClick={() => scrollToDetail(concept.id)}
          />
        ))}
      </motion.div>

      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg shrink-0">
              <Info className="text-emerald-400 w-5 h-5 sm:w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Visual SMC <span className="text-emerald-400">Guide</span></h2>
              <p className="text-slate-400 text-xs sm:text-sm">Deep dive into each concept with visual examples.</p>
            </div>
          </div>
          {selectedConcept && (
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              <ArrowUp size={14} /> Back to Top
            </button>
          )}
        </div>

        <div className="space-y-6 sm:space-y-12">
          {concepts.map((concept, index) => (
            <motion.div 
              key={`detail-${concept.id}`}
              ref={el => detailRefs.current[concept.id] = el}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-900/50 border ${selectedConcept === concept.id ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-slate-800/50'} rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-5 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg shrink-0">{concept.icon}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{concept.title}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {concept.explanation}
                    </p>
                    
                    <div className="bg-slate-950/50 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={12} className="text-amber-400" /> Real Life Example
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic">
                        {concept.realLife}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                    <h4 className="text-[10px] sm:text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-2">Pro Tip for Anna</h4>
                    <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                      "{concept.details}"
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950/30 p-4 sm:p-8 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-800 relative group">
                  <div className="absolute top-4 right-4 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-800">
                    DIAGRAM
                  </div>
                  <div className="w-full max-w-md transform group-hover:scale-105 transition-transform duration-500">
                    {concept.visual}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ConceptCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
  isSelected: boolean;
  onClick: () => void;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ 
  icon, 
  title, 
  description, 
  details, 
  isSelected, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className={`bg-slate-900/50 border ${isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-800'} rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-emerald-500/50 transition-all group cursor-pointer h-full flex flex-col`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`p-1 rounded-full ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
        {isSelected ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2 flex-grow">{description}</p>
    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 mt-auto">
      <p className="text-xs text-slate-500 italic">{details}</p>
    </div>
  </div>
);
