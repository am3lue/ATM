/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Info, TrendingUp, TrendingDown, Target, Zap, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Candle, SetupType } from '../types';
import { BULLISH_CANDLES, BEARISH_CANDLES, BULLISH_STEPS, BEARISH_STEPS } from '../data/learningData';

export const LearningMode: React.FC = () => {
  const [setupType, setSetupType] = useState<SetupType>('buy');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const candles = useMemo(() => setupType === 'buy' ? BULLISH_CANDLES : BEARISH_CANDLES, [setupType]);
  const steps = useMemo(() => setupType === 'buy' ? BULLISH_STEPS : BEARISH_STEPS, [setupType]);

  const visibleCandles = useMemo(() => {
    const stepToCandleMap = [3, 4, 5, 7, 10];
    return candles.slice(0, stepToCandleMap[currentStep]);
  }, [candles, currentStep]);

  const handleNext = () => currentStep < steps.length - 1 && setCurrentStep(s => s + 1);
  const handlePrev = () => currentStep > 0 && setCurrentStep(s => s - 1);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    } else {
      if (currentStep === steps.length - 1) setCurrentStep(0);
      setIsPlaying(true);
    }
  };

  React.useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, steps.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-xl">
                <Target className="text-emerald-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Interactive Playground</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Market Replay Mode</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button 
                  onClick={() => { setSetupType('buy'); handleReset(); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${setupType === 'buy' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  <TrendingUp size={14} />
                  <span className="text-[10px] uppercase tracking-wider">Bullish</span>
                </button>
                <button 
                  onClick={() => { setSetupType('sell'); handleReset(); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${setupType === 'sell' ? 'bg-rose-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  <TrendingDown size={14} />
                  <span className="text-[10px] uppercase tracking-wider">Bearish</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={togglePlay}
                  className={`p-2 rounded-xl border transition-all ${isPlaying ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'}`}
                  title={isPlaying ? "Pause Replay" : "Start Replay"}
                >
                  {isPlaying ? <Zap size={18} className="animate-pulse" /> : <ChevronRight size={18} />}
                </button>
                <button 
                  onClick={handleReset}
                  className="p-2 bg-slate-800 border border-slate-700 text-white rounded-xl hover:bg-slate-700 transition-all"
                  title="Reset Playground"
                >
                  <ArrowUp size={18} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 h-[300px] sm:h-[400px] relative overflow-hidden flex items-center justify-center group">
            {/* Chart Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </div>

            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" className="relative z-10">
              {/* Grid lines */}
              {[...Array(10)].map((_, i) => (
                <line key={i} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
              ))}
              {[...Array(20)].map((_, i) => (
                <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
              ))}
              
              {/* Dynamic Annotations with better styling */}
              <AnimatePresence>
                {setupType === 'buy' ? (
                  <g>
                    {currentStep >= 0 && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <line x1="50" y1="170" x2="350" y2="170" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 4" />
                        <text x="60" y="160" fill="#f43f5e" fontSize="10" fontWeight="bold" className="uppercase tracking-widest">SSL Liquidity (115.00)</text>
                      </motion.g>
                    )}
                    {currentStep >= 1 && (
                      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <circle cx="260" cy="190" r="20" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
                        <text x="260" y="225" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">SWEEP (105.00)</text>
                      </motion.g>
                    )}
                    {currentStep >= 2 && (
                      <motion.g initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
                        <path d="M 280 180 L 400 110" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" fill="none" />
                        <text x="360" y="100" fill="#10b981" fontSize="10" fontWeight="bold">MSS / CHoCH (145.00)</text>
                      </motion.g>
                    )}
                    {currentStep >= 3 && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <rect x="380" y="120" width="120" height="44" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="440" y="145" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">FVG ENTRY ZONE</text>
                      </motion.g>
                    )}
                  </g>
                ) : (
                  <g>
                    {currentStep >= 0 && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <line x1="50" y1="230" x2="350" y2="230" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
                        <text x="60" y="220" fill="#10b981" fontSize="10" fontWeight="bold" className="uppercase tracking-widest">BSL Liquidity (85.00)</text>
                      </motion.g>
                    )}
                    {currentStep >= 1 && (
                      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <circle cx="260" cy="210" r="20" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                        <text x="260" y="185" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">SWEEP (95.00)</text>
                      </motion.g>
                    )}
                    {currentStep >= 2 && (
                      <motion.g initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
                        <path d="M 280 220 L 400 290" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrow-red)" fill="none" />
                        <text x="360" y="310" fill="#f43f5e" fontSize="10" fontWeight="bold">MSS / CHoCH (55.00)</text>
                      </motion.g>
                    )}
                    {currentStep >= 3 && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <rect x="380" y="236" width="120" height="44" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="440" y="261" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">FVG ENTRY ZONE</text>
                      </motion.g>
                    )}
                  </g>
                )}
              </AnimatePresence>

              {/* Candles with enhanced styling */}
              {visibleCandles.map((c, i) => (
                <CandleStick key={i} candle={c} index={i} />
              ))}

              <defs>
                <linearGradient id="bullishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="bearishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>
            </svg>

            {/* Trade Stats Overlay */}
            {currentStep === 4 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-2xl space-y-3"
              >
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Trade Execution</div>
                <div className="space-y-2">
                  <StatItem label="Entry" value={setupType === 'buy' ? "130.00" : "70.00"} color="text-blue-400" />
                  <StatItem label="Stop Loss" value={setupType === 'buy' ? "105.00" : "95.00"} color="text-rose-400" />
                  <StatItem label="Take Profit" value={setupType === 'buy' ? "185.00" : "15.00"} color="text-emerald-400" />
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center gap-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Risk/Reward</span>
                    <span className="text-xs font-mono text-white bg-slate-800 px-2 py-0.5 rounded">1:2.2</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</div>
            <div className="flex gap-1">
              {[...Array(steps.length)].map((_, i) => (
                <div key={i} className={`h-1 w-4 rounded-full transition-all ${i <= currentStep ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              ))}
            </div>
          </div>

          <div className="flex-grow space-y-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="text-2xl font-bold text-white">{steps[currentStep].title}</h4>
                <p className="text-slate-400 leading-relaxed">{steps[currentStep].description}</p>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                      <Info size={14} />
                      <span>Market Psychology</span>
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{steps[currentStep].psychology}</p>
                  </div>

                  <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <Zap size={14} />
                      <span>Key Takeaway</span>
                    </div>
                    <p className="text-xs text-emerald-500/80 font-medium leading-relaxed">
                      {currentStep === 0 && "Liquidity is the fuel. Without it, there is no big move."}
                      {currentStep === 1 && "The sweep is the trap. Don't be the liquidity, wait for the sweep."}
                      {currentStep === 2 && "The MSS is your confirmation. It shows the tide has turned."}
                      {currentStep === 3 && "The FVG is your entry window. It's the most efficient place to buy/sell."}
                      {currentStep === 4 && "Discipline is key. Stick to the plan and manage your risk."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl transition-all font-bold shadow-lg shadow-emerald-500/20"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandleStick: React.FC<{ candle: Candle, index: number }> = ({ candle, index }) => {
  const x = 50 + index * 70;
  const color = candle.type === 'bullish' ? 'url(#bullishGradient)' : 'url(#bearishGradient)';
  const strokeColor = candle.type === 'bullish' ? '#10b981' : '#f43f5e';
  const bodyTop = Math.min(400 - candle.open * 2, 400 - candle.close * 2);
  const bodyHeight = Math.max(2, Math.abs(candle.open - candle.close) * 2);
  
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Wick */}
      <line 
        x1={x + 15} 
        y1={400 - candle.high * 2} 
        x2={x + 15} 
        y2={400 - candle.low * 2} 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      {/* Body */}
      <rect 
        x={x} 
        y={bodyTop} 
        width="30" 
        height={bodyHeight} 
        fill={color} 
        stroke={strokeColor}
        strokeWidth="0.5"
        rx="2" 
        className="drop-shadow-sm"
      />
    </motion.g>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex justify-between items-center gap-8">
    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
  </div>
);
