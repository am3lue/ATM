/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  type: 'bullish' | 'bearish';
}

export interface LearningStep {
  title: string;
  description: string;
  psychology: string;
}

export interface Annotation {
  time: number;
  price: number;
  label: string;
  type: 'BOS' | 'CHoCH' | 'OB' | 'FVG' | 'LIQ';
  endTime?: number;
  endPrice?: number;
}

export type TabType = 'cheat' | 'learn' | 'guide' | 'chart';
export type SetupType = 'buy' | 'sell';
