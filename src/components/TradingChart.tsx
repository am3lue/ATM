/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { Candle, Annotation } from '../types';

interface TradingChartProps {
  data: Candle[];
  annotations?: Annotation[];
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  data, 
  annotations = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  
  // Independent scale transforms
  const [xTransform, setXTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [yTransform, setYTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [crosshair, setCrosshair] = useState<{ x: number, y: number } | null>(null);

  // Handle Resize and Maintain Position
  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = Math.max(400, window.innerHeight * 0.6);
        
        setDimensions(prev => {
          if (prev.width > 0 && (newWidth !== prev.width || newHeight !== prev.height)) {
            setXTransform(currentX => {
              const ratio = newWidth / prev.width;
              // Maintain the right-side alignment (newest data)
              const newX = newWidth - (prev.width - currentX.x) * ratio;
              return d3.zoomIdentity.translate(newX, 0).scale(currentX.k);
            });
          }
          return { width: newWidth, height: newHeight };
        });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  const margin = { top: 30, right: 80, bottom: 40, left: 20 };
  const innerWidth = dimensions.width - margin.left - margin.right;
  const innerHeight = dimensions.height - margin.top - margin.bottom;

  // Base Scales
  const xScaleBase = useMemo(() => {
    return d3.scaleTime()
      .domain(d3.extent(data, (d: Candle) => new Date(d.time)) as [Date, Date])
      .range([0, Math.max(0, innerWidth)]);
  }, [data, innerWidth]);

  const yScaleBase = useMemo(() => {
    const visibleData = data.slice(-100);
    const min = d3.min(visibleData, (d: Candle) => d.low) ?? 0;
    const max = d3.max(visibleData, (d: Candle) => d.high) ?? 0;
    const padding = (max - min) * 0.2;
    return d3.scaleLinear()
      .domain([min - padding, max + padding])
      .range([Math.max(0, innerHeight), 0]);
  }, [data, innerHeight]);

  // Transformed Scales
  const xScale = xTransform.rescaleX(xScaleBase);
  const yScale = yTransform.rescaleY(yScaleBase);

  const resetScales = useCallback(() => {
    if (innerWidth <= 0) return;
    const initialScaleX = 5;
    const initialTranslateX = innerWidth - (innerWidth * initialScaleX);
    const targetX = d3.zoomIdentity.translate(initialTranslateX, 0).scale(initialScaleX);
    
    setXTransform(targetX);
    setYTransform(d3.zoomIdentity);
    
    if (svgRef.current) {
      d3.select(svgRef.current).call(d3.zoom<SVGSVGElement, unknown>().transform, targetX);
    }
  }, [innerWidth]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;
    const svg = d3.select(svgRef.current);
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 100])
      .on('zoom', (event) => {
        setXTransform(event.transform);
        if (event.sourceEvent?.type === 'wheel') {
           setYTransform(d3.zoomIdentity.scale(event.transform.k).translate(0, event.transform.y / event.transform.k));
        } else if (event.sourceEvent?.movementY !== undefined) {
           setYTransform(prev => d3.zoomIdentity.translate(0, prev.y + event.sourceEvent.movementY).scale(prev.k));
        }
      });

    svg.call(zoom);

    if (xTransform === d3.zoomIdentity) {
      resetScales();
    }
  }, [dimensions.width, resetScales]);

  // Axis Dragging Logic
  useEffect(() => {
    if (!svgRef.current || innerWidth <= 0) return;
    const svg = d3.select(svgRef.current);

    const dragY = d3.drag<SVGRectElement, unknown>()
      .on('drag', (event) => {
        const factor = Math.exp(-event.dy / 100);
        setYTransform(prev => {
          const newK = Math.max(0.1, Math.min(100, prev.k * factor));
          const centerY = innerHeight / 2;
          const newY = centerY - (centerY - prev.y) * (newK / prev.k);
          return d3.zoomIdentity.translate(0, newY).scale(newK);
        });
      });

    svg.select<SVGRectElement>('.y-axis-area').call(dragY);

    const dragX = d3.drag<SVGRectElement, unknown>()
      .on('drag', (event) => {
        const factor = Math.exp(event.dx / 100);
        setXTransform(prev => {
          const newK = Math.max(0.1, Math.min(100, prev.k * factor));
          const newX = innerWidth - (innerWidth - prev.x) * (newK / prev.k);
          const transform = d3.zoomIdentity.translate(newX, 0).scale(newK);
          d3.select(svgRef.current).call(d3.zoom().transform as any, transform);
          return transform;
        });
      });

    svg.select<SVGRectElement>('.x-axis-area').call(dragX);
  }, [innerWidth, innerHeight]);

  const candleWidth = useMemo(() => {
    const totalWidth = innerWidth * xTransform.k;
    return Math.max(1, (totalWidth / data.length) * 0.7);
  }, [innerWidth, xTransform.k, data.length]);

  return (
    <div ref={containerRef} className="relative bg-slate-950 rounded-[2.5rem] border border-slate-800/50 overflow-hidden shadow-2xl group">
      <div className="absolute top-6 left-6 z-10 flex flex-wrap items-center gap-3 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-700/50 flex items-center gap-3 shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white font-black text-xs tracking-wider">BTCUSDT</span>
          <span className="text-slate-500 text-[10px] font-bold">1H</span>
          <span className="text-emerald-400 font-mono text-xs font-bold">BINANCE</span>
        </div>
      </div>

      <svg 
        ref={svgRef}
        width={dimensions.width} 
        height={dimensions.height}
        onMouseMove={(e) => {
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) setCrosshair({ x: e.clientX - rect.left - margin.left, y: e.clientY - rect.top - margin.top });
        }}
        onMouseLeave={() => setCrosshair(null)}
        className="cursor-crosshair touch-none select-none"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g className="grid-lines">
            {yScale.ticks(10).map((tick, i) => (
              <line key={i} x1={0} y1={yScale(tick)} x2={innerWidth} y2={yScale(tick)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            {xScale.ticks(innerWidth / 100).map((tick, i) => (
              <line key={i} x1={xScale(tick)} y1={0} x2={xScale(tick)} y2={innerHeight} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
          </g>

          {/* Annotations */}
          {annotations.map((ann, i) => {
            const xPos1 = xScale(new Date(ann.time));
            const yPos1 = yScale(ann.price);
            if (xPos1 < -500 || xPos1 > innerWidth + 500) return null;
            if (ann.type === 'BOS' || ann.type === 'CHoCH') {
              const xPos2 = ann.endTime ? xScale(new Date(ann.endTime)) : xPos1 + 150;
              const color = ann.type === 'BOS' ? '#3b82f6' : '#f59e0b';
              return (
                <g key={`ann-${i}`}>
                  <line x1={xPos1} y1={yPos1} x2={xPos2} y2={yPos1} stroke={color} strokeWidth="2" strokeDasharray="6 3" />
                  <rect x={xPos1 + 5} y={yPos1 - 22} width={55} height={18} rx={4} fill={color} />
                  <text x={xPos1 + 10} y={yPos1 - 9} fill="#fff" fontSize="9" fontWeight="900">{ann.label}</text>
                </g>
              );
            }
            if (ann.type === 'OB' || ann.type === 'FVG') {
              const xPos2 = ann.endTime ? xScale(new Date(ann.endTime)) : xPos1 + 250;
              const yPos2 = ann.endPrice ? yScale(ann.endPrice) : yPos1 - 30;
              const color = ann.type === 'OB' ? '#10b981' : '#8b5cf6';
              return (
                <g key={`ann-${i}`}>
                  <rect x={xPos1} y={Math.min(yPos1, yPos2)} width={Math.max(0, xPos2 - xPos1)} height={Math.abs(yPos1 - yPos2)} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
                  <rect x={xPos1} y={Math.min(yPos1, yPos2) - 18} width={70} height={18} rx={4} fill={color} />
                  <text x={xPos1 + 5} y={Math.min(yPos1, yPos2) - 5} fill="#fff" fontSize="9" fontWeight="900">{ann.label}</text>
                </g>
              );
            }
            return null;
          })}

          {/* Candles */}
          {data.map((d, i) => {
            const xPos = xScale(new Date(d.time)) - candleWidth / 2;
            if (xPos < -candleWidth || xPos > innerWidth + candleWidth) return null;
            const isBullish = d.close >= d.open;
            const color = isBullish ? '#10b981' : '#f43f5e';
            return (
              <g key={i}>
                <line x1={xPos + candleWidth / 2} y1={yScale(d.high)} x2={xPos + candleWidth / 2} y2={yScale(d.low)} stroke={color} strokeWidth={Math.max(0.5, candleWidth/8)} />
                <rect x={xPos} y={Math.min(yScale(d.open), yScale(d.close))} width={candleWidth} height={Math.max(1, Math.abs(yScale(d.open) - yScale(d.close)))} fill={color} />
              </g>
            );
          })}

          <rect className="y-axis-area cursor-ns-resize" x={innerWidth} y={0} width={margin.right} height={innerHeight} fill="transparent" onDoubleClick={resetScales} />
          <rect className="x-axis-area cursor-ew-resize" x={0} y={innerHeight} width={innerWidth} height={margin.bottom} fill="transparent" onDoubleClick={resetScales} />
          
          <g className="y-axis">
            {yScale.ticks(10).map((tick, i) => (
              <text key={i} x={innerWidth + 12} y={yScale(tick)} fill="#64748b" fontSize="10" fontWeight="bold" alignmentBaseline="middle" className="font-mono">{tick.toLocaleString()}</text>
            ))}
          </g>
          <g className="x-axis">
            {xScale.ticks(innerWidth / 100).map((tick, i) => (
              <text key={i} x={xScale(tick)} y={innerHeight + 25} fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">{d3.timeFormat('%H:%M')(tick)}</text>
            ))}
          </g>

          {crosshair && crosshair.x >= 0 && crosshair.x <= innerWidth && crosshair.y >= 0 && crosshair.y <= innerHeight && (
            <g pointerEvents="none">
              <line x1={0} y1={crosshair.y} x2={innerWidth} y2={crosshair.y} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={crosshair.x} y1={0} x2={crosshair.x} y2={innerHeight} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <g transform={`translate(${innerWidth + 5}, ${crosshair.y - 10})`}>
                <rect width={70} height={20} rx={4} fill="#10b981" /><text x={35} y={14} fill="#000" fontSize="10" textAnchor="middle" fontWeight="black">{yScale.invert(crosshair.y).toFixed(2)}</text>
              </g>
              <g transform={`translate(${crosshair.x - 40}, ${innerHeight + 5})`}>
                <rect width={80} height={20} rx={4} fill="#334155" /><text x={40} y={14} fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">{d3.timeFormat('%H:%M')(xScale.invert(crosshair.x))}</text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
