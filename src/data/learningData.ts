/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candle, LearningStep } from '../types';

export const BULLISH_CANDLES: Candle[] = [
  { time: 1, open: 120, high: 125, low: 118, close: 122, type: 'bullish' },
  { time: 2, open: 122, high: 128, low: 115, close: 116, type: 'bearish' },
  { time: 3, open: 116, high: 118, low: 115, close: 117, type: 'bullish' }, // SSL at 115
  { time: 4, open: 117, high: 118, low: 105, close: 108, type: 'bearish' }, // Sweep SSL (115 -> 105)
  { time: 5, open: 108, high: 145, low: 107, close: 142, type: 'bullish' }, // MSS (Breaks 128)
  { time: 6, open: 142, high: 155, low: 140, close: 152, type: 'bullish' },
  { time: 7, open: 152, high: 153, low: 130, close: 132, type: 'bearish' }, // Retrace to FVG (Gap 118-130? No, gap is between 4 high and 6 low)
  { time: 8, open: 132, high: 165, low: 131, close: 162, type: 'bullish' }, // Entry & Expansion
  { time: 9, open: 162, high: 175, low: 160, close: 172, type: 'bullish' },
  { time: 10, open: 172, high: 185, low: 170, close: 182, type: 'bullish' },
];

export const BEARISH_CANDLES: Candle[] = [
  { time: 1, open: 80, high: 82, low: 75, close: 78, type: 'bearish' },
  { time: 2, open: 78, high: 85, low: 72, close: 84, type: 'bullish' },
  { time: 3, open: 84, high: 85, low: 82, close: 83, type: 'bearish' }, // BSL at 85
  { time: 4, open: 83, high: 95, low: 82, close: 92, type: 'bullish' }, // Sweep BSL (85 -> 95)
  { time: 5, open: 92, high: 93, low: 55, close: 58, type: 'bearish' }, // MSS (Breaks 72)
  { time: 6, open: 58, high: 60, low: 45, close: 48, type: 'bearish' },
  { time: 7, open: 48, high: 70, low: 47, close: 68, type: 'bullish' }, // Retrace to FVG
  { time: 8, open: 68, high: 69, low: 35, close: 38, type: 'bearish' }, // Entry & Expansion
  { time: 9, open: 38, high: 39, low: 25, close: 28, type: 'bearish' },
  { time: 10, open: 28, high: 29, low: 15, close: 18, type: 'bearish' },
];

export const BULLISH_STEPS: LearningStep[] = [
  { title: "Identify SSL", description: "Look for equal lows or a clear low point where retail traders have placed their stop losses.", psychology: "Retailers see this as 'Support'. Smart money sees this as 'Liquidity' to buy from." },
  { title: "Liquidity Sweep", description: "Price drops below the SSL to trigger those stop losses.", psychology: "Retailers are panicking and selling. Smart money is happily buying their cheap coins." },
  { title: "Market Structure Shift (MSS)", description: "Price quickly jumps back up and breaks the previous high.", psychology: "This confirms that the big players have finished buying and are now pushing price up." },
  { title: "Fair Value Gap (FVG)", description: "A gap is left behind by the fast move. This is where we want to enter.", psychology: "The move was so fast that some orders were left unfilled. Price will return to 'balance' this." },
  { title: "The Entry", description: "Price returns to the FVG. We buy here with a stop loss below the sweep low.", psychology: "We are now riding the wave with the smart money. Target 1:3 risk/reward!" },
];

export const BEARISH_STEPS: LearningStep[] = [
  { title: "Identify BSL", description: "Look for equal highs or a clear high point where retail traders have placed their stop losses.", psychology: "Retailers see this as 'Resistance'. Smart money sees this as 'Liquidity' to sell into." },
  { title: "Liquidity Sweep", description: "Price jumps above the BSL to trigger those stop losses.", psychology: "Retailers are FOMO buying. Smart money is happily selling to them at high prices." },
  { title: "Market Structure Shift (MSS)", description: "Price quickly crashes back down and breaks the previous low.", psychology: "This confirms that the big players have finished selling and are now pushing price down." },
  { title: "Fair Value Gap (FVG)", description: "A gap is left behind by the fast move. This is where we want to enter.", psychology: "The move was so fast that some orders were left unfilled. Price will return to 'balance' this." },
  { title: "The Entry", description: "Price returns to the FVG. We sell here with a stop loss above the sweep high.", psychology: "We are now riding the wave with the smart money. Target 1:3 risk/reward!" },
];
