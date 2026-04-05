/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candle, Annotation } from '../types';
import marketData from './marketData.json';

export const BTC_DATA: Candle[] = marketData.candles as Candle[];

export const BTC_ANNOTATIONS: Annotation[] = marketData.annotations as Annotation[];
