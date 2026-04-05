/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Candle, Annotation } from '../types';

interface TradingChartProps {
  data: Candle[];
  annotations?: Annotation[];
  width?: number;
  height?: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  data, 
  annotations = [],
  width = 800, 
  height = 500 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomState, setZoomState] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [crosshair, setCrosshair] = useState<{ x: number, y: number } | null>(null);

  const margin = { top: 20, right: 70, bottom: 30, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(() => {
    return d3.scaleTime()
      .domain(d3.extent(data, (d: Candle) => new Date(d.time)) as [Date, Date])
      .range([0, innerWidth]);
  }, [data, innerWidth]);

  const yScale = useMemo(() => {
    const min = d3.min(data, (d: Candle) => d.low) ?? 0;
    const max = d3.max(data, (d: Candle) => d.high) ?? 0;
    const padding = (max - min) * 0.1;
    return d3.scaleLinear()
      .domain([min - padding, max + padding])
      .range([innerHeight, 0]);
  }, [data, innerHeight]);

  // Apply zoom to scales
  const transformedXScale = zoomState.rescaleX(xScale);
  const transformedYScale = zoomState.rescaleY(yScale);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 20])
      .on('zoom', (event) => {
        setZoomState(event.transform);
      });

    svg.call(zoom);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setCrosshair({
        x: e.clientX - rect.left - margin.left,
        y: e.clientY - rect.top - margin.top
      });
    }
  };

  const handleMouseLeave = () => {
    setCrosshair(null);
  };

  const candleWidth = useMemo(() => {
    const totalWidth = innerWidth * zoomState.k;
    return Math.max(2, (totalWidth / data.length) * 0.8);
  }, [innerWidth, zoomState.k, data.length]);

  return (
    <div className="relative bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-xs">BTC/USDT</span>
          <span className="text-slate-400 text-[10px]">1D</span>
        </div>
        {crosshair && (
          <div className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300">
            Price: {transformedYScale.invert(crosshair.y).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      <svg 
        ref={svgRef}
        width={width} 
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair touch-none"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid Lines */}
          {transformedYScale.ticks(10).map(tick => (
            <g key={tick}>
              <line 
                x1={0} y1={transformedYScale(tick)} 
                x2={innerWidth} y2={transformedYScale(tick)} 
                stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" 
              />
              <text 
                x={innerWidth + 5} 
                y={transformedYScale(tick)} 
                fill="#475569" 
                fontSize="10" 
                alignmentBaseline="middle"
              >
                {tick.toLocaleString()}
              </text>
            </g>
          ))}

          {/* Time Axis */}
          {transformedXScale.ticks(6).map(tick => (
            <g key={tick.getTime()}>
              <line 
                x1={transformedXScale(tick)} y1={0} 
                x2={transformedXScale(tick)} y2={innerHeight} 
                stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" 
              />
              <text 
                x={transformedXScale(tick)} 
                y={innerHeight + 20} 
                fill="#475569" 
                fontSize="10" 
                textAnchor="middle"
              >
                {d3.timeFormat('%H:%M')(tick)}
              </text>
            </g>
          ))}

          {/* Annotations (BOS, CHoCH, OB) */}
          {annotations.map((ann, i) => {
            const x1 = transformedXScale(new Date(ann.time));
            const y1 = transformedYScale(ann.price);
            
            if (ann.type === 'BOS' || ann.type === 'CHoCH') {
              const x2 = ann.endTime ? transformedXScale(new Date(ann.endTime)) : x1 + 100;
              return (
                <g key={`ann-${i}`}>
                  <line 
                    x1={x1} y1={y1} x2={x2} y2={y1} 
                    stroke={ann.type === 'BOS' ? '#3b82f6' : '#f59e0b'} 
                    strokeWidth="1.5" strokeDasharray="4 2" 
                  />
                  <text 
                    x={x1 + 5} y={y1 - 5} 
                    fill={ann.type === 'BOS' ? '#3b82f6' : '#f59e0b'} 
                    fontSize="10" fontWeight="bold"
                  >
                    {ann.label}
                  </text>
                </g>
              );
            }

            if (ann.type === 'OB') {
              const x2 = ann.endTime ? transformedXScale(new Date(ann.endTime)) : x1 + 150;
              const y2 = ann.endPrice ? transformedYScale(ann.endPrice) : y1 - 20;
              return (
                <g key={`ann-${i}`}>
                  <rect 
                    x={x1} y={Math.min(y1, y2)} 
                    width={Math.max(0, x2 - x1)} height={Math.abs(y1 - y2)} 
                    fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2"
                  />
                  <text 
                    x={x1 + 5} y={Math.min(y1, y2) + 15} 
                    fill="#10b981" fontSize="10" fontWeight="bold"
                  >
                    {ann.label}
                  </text>
                </g>
              );
            }

            if (ann.type === 'LIQ') {
              return (
                <g key={`ann-${i}`}>
                  <circle cx={x1} cy={y1} r="4" fill="#f43f5e" fillOpacity="0.5" />
                  <text x={x1 + 5} y={y1 + 15} fill="#f43f5e" fontSize="10" fontWeight="bold">{ann.label}</text>
                </g>
              );
            }

            return null;
          })}

          {/* Candles */}
          {data.map((d, i) => {
            const x = transformedXScale(new Date(d.time)) - candleWidth / 2;
            if (x < -candleWidth || x > innerWidth + candleWidth) return null;

            const isBullish = d.close >= d.open;
            const color = isBullish ? 'url(#bullishGradientChart)' : 'url(#bearishGradientChart)';
            const strokeColor = isBullish ? '#10b981' : '#f43f5e';
            const yHigh = transformedYScale(d.high);
            const yLow = transformedYScale(d.low);
            const yOpen = transformedYScale(d.open);
            const yClose = transformedYScale(d.close);
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));

            return (
              <g key={i} className="transition-all duration-300">
                {/* Wick */}
                <line 
                  x1={x + candleWidth / 2} y1={yHigh} 
                  x2={x + candleWidth / 2} y2={yLow} 
                  stroke={strokeColor} strokeWidth="1.5" 
                  strokeLinecap="round"
                />
                {/* Body */}
                <rect 
                  x={x} y={bodyTop} 
                  width={candleWidth} height={bodyHeight} 
                  fill={color} 
                  stroke={strokeColor}
                  strokeWidth="0.5"
                  rx={Math.min(2, candleWidth / 4)}
                  className="hover:brightness-125 transition-all cursor-pointer"
                />
                {/* Last Candle Glow */}
                {i === data.length - 1 && (
                  <circle 
                    cx={x + candleWidth / 2} 
                    cy={yClose} 
                    r="4" 
                    fill={strokeColor} 
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Crosshair Labels */}
          {crosshair && (
            <g pointerEvents="none">
              <line x1={0} y1={crosshair.y} x2={innerWidth} y2={crosshair.y} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={crosshair.x} y1={0} x2={crosshair.x} y2={innerHeight} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Price Label on Y-Axis */}
              <rect x={innerWidth} y={crosshair.y - 10} width={margin.right} height={20} fill="#1e293b" />
              <text x={innerWidth + 5} y={crosshair.y} fill="#fff" fontSize="10" alignmentBaseline="middle" fontWeight="bold">
                {transformedYScale.invert(crosshair.y).toFixed(2)}
              </text>

              {/* Time Label on X-Axis */}
              <rect x={crosshair.x - 30} y={innerHeight} width={60} height={20} fill="#1e293b" />
              <text x={crosshair.x} y={innerHeight + 14} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">
                {d3.timeFormat('%H:%M')(transformedXScale.invert(crosshair.x))}
              </text>
            </g>
          )}
        </g>

        <defs>
          <linearGradient id="bullishGradientChart" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="bearishGradientChart" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};
