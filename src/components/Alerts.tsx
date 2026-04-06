/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, BellRing, Settings, ShieldAlert, Zap, TrendingUp, TrendingDown, Trash2, Plus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PriceAlert } from '../types';
import { Preferences } from '@capacitor/preferences';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

const SYMBOLS = ['BTCUSDT', 'BTCUSD', 'GBPJPY', 'XAUUSD'];

interface AlertsProps {
  currentPrice: number;
}

export const Alerts: React.FC<AlertsProps> = ({ currentPrice: initialPrice }) => {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({
    'BTCUSDT': initialPrice,
    'BTCUSD': initialPrice,
    'GBPJPY': 0,
    'XAUUSD': 0
  });
  const [newAlertPrice, setNewAlertPrice] = useState<string>(initialPrice.toString());
  const [newAlertSymbol, setNewAlertSymbol] = useState(SYMBOLS[0]);
  const [newAlertLabel, setNewAlertLabel] = useState('');
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Load from Capacitor Preferences
  useEffect(() => {
    const loadAlerts = async () => {
      const { value } = await Preferences.get({ key: 'priceAlerts' });
      if (value) setPriceAlerts(JSON.parse(value));
    };
    loadAlerts();
    checkPushPermission();
  }, []);

  // Sync with Capacitor Preferences
  useEffect(() => {
    Preferences.set({ key: 'priceAlerts', value: JSON.stringify(priceAlerts) });
  }, [priceAlerts]);

  const checkPushPermission = async () => {
    const perm = await PushNotifications.checkPermissions();
    if (perm.receive === 'granted') setPushEnabled(true);
    
    // Request local notification permission as well
    const localPerm = await LocalNotifications.checkPermissions();
    if (localPerm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
  };

  const requestPermission = async () => {
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive !== 'granted') {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive === 'granted') {
      await PushNotifications.register();
      setPushEnabled(true);
    }
    
    // Also ensure local notifications
    const localPerm = await LocalNotifications.requestPermissions();
    if (localPerm.display === 'granted') {
      console.log("Local notifications granted");
    }
  };

  // Real-time Polling
  const fetchPrices = useCallback(async () => {
    try {
      // Fetch BTC Prices from Binance (No key needed)
      const btcResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","BTCUSDC"]');
      const btcData = await btcResponse.json();
      
      const newPrices: Record<string, number> = { ...prices };
      
      if (Array.isArray(btcData)) {
        const usdt = btcData.find(t => t.symbol === 'BTCUSDT');
        const usdc = btcData.find(t => t.symbol === 'BTCUSDC');
        if (usdt) newPrices['BTCUSDT'] = parseFloat(usdt.price);
        if (usdc) newPrices['BTCUSD'] = parseFloat(usdc.price);
      }

      // Fetch GBPJPY and XAUUSD from a public source (Simulated if unavailable, or using a free API)
      // For demo/prototype, we'll use slightly varied prices or another public API if possible
      // Here we simulate movement for Forex/Gold as reliable no-key APIs are restricted
      newPrices['GBPJPY'] = prices['GBPJPY'] === 0 ? 191.45 : prices['GBPJPY'] + (Math.random() - 0.5) * 0.05;
      newPrices['XAUUSD'] = prices['XAUUSD'] === 0 ? 2330.50 : prices['XAUUSD'] + (Math.random() - 0.5) * 0.2;

      setPrices(newPrices);
      checkAlerts(newPrices);
    } catch (e) {
      console.error("Polling error", e);
    }
  }, [prices]);

  useEffect(() => {
    if (isPolling) {
      pollingRef.current = setInterval(fetchPrices, 5000); // Poll every 5 seconds
    } else if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [isPolling, fetchPrices]);

  const playAlertSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) { console.error("Sound blocked", e); }
  }, []);

  const checkAlerts = (currentPrices: Record<string, number>) => {
    let triggered = false;
    let triggeredAlert: PriceAlert | null = null;

    const updatedAlerts = priceAlerts.map(alert => {
      if (!alert.isActive) return alert;
      const price = currentPrices[alert.symbol];
      if (!price) return alert;

      const isTriggered = (alert.type === 'above' && price >= alert.price) || (alert.type === 'below' && price <= alert.price);
      if (isTriggered) {
        triggered = true;
        triggeredAlert = alert;
        return { ...alert, isActive: false };
      }
      return alert;
    });

    if (triggered && triggeredAlert) {
      playAlertSound();
      setPriceAlerts(updatedAlerts);
      
      // Native Local Notification
      LocalNotifications.schedule({
        notifications: [
          {
            title: "Anna's Market Alert",
            body: `${triggeredAlert.symbol} reached ${triggeredAlert.price}! (${triggeredAlert.label})`,
            id: Math.floor(Math.random() * 1000000),
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'default'
          }
        ]
      });

      // Browser Fallback (if needed or for immediate feedback)
      alert(`Anna's Alert: ${triggeredAlert.symbol} reached ${triggeredAlert.price}!`);
    }
  };

  const addAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newAlertPrice);
    if (isNaN(price)) return;
    const newAlert: PriceAlert = { 
      id: Math.random().toString(36).substr(2, 9), 
      symbol: newAlertSymbol,
      price, 
      label: newAlertLabel || `${newAlertSymbol} at ${price}`, 
      type: newAlertType, 
      isActive: true, 
      createdAt: Date.now() 
    };
    setPriceAlerts(prev => [newAlert, ...prev]);
    setNewAlertLabel('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BellRing className="text-emerald-400" />
            Price <span className="text-emerald-400">Alerts</span>
          </h2>
          <p className="text-slate-400 mt-1">Institutional price levels for Anna.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 ${isPolling ? 'text-emerald-400' : 'text-slate-500'}`}>
            <RefreshCw size={14} className={isPolling ? 'animate-spin' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">{isPolling ? 'Live Polling' : 'Paused'}</span>
          </div>
          {!pushEnabled && (
            <button onClick={requestPermission} className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-emerald-400 transition-colors">
              Enable Phone Alerts
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl h-fit backdrop-blur-sm">
          <form onSubmit={addAlert} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Currency Pair</label>
              <div className="grid grid-cols-2 gap-2">
                {SYMBOLS.map(s => (
                  <button key={s} type="button" onClick={() => { setNewAlertSymbol(s); setNewAlertPrice(prices[s]?.toFixed(s.includes('JPY') ? 3 : 2) || '0'); }} className={`py-2 rounded-xl border border-slate-800 text-[10px] font-black transition-all ${newAlertSymbol === s ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 text-slate-500'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trigger Price ({newAlertSymbol})</label>
              <input type="number" value={newAlertPrice} onChange={(e) => setNewAlertPrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all" step="0.001" />
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Current: {prices[newAlertSymbol]?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Label</label>
              <input type="text" value={newAlertLabel} onChange={(e) => setNewAlertLabel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="e.g. BUY ZONE" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setNewAlertType('above')} className={`py-3 rounded-xl border transition-all text-[10px] font-black uppercase ${newAlertType === 'above' ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-800 text-slate-500'}`}>Above</button>
              <button type="button" onClick={() => setNewAlertType('below')} className={`py-3 rounded-xl border transition-all text-[10px] font-black uppercase ${newAlertType === 'below' ? 'bg-rose-500 border-rose-500 text-slate-950' : 'border-slate-800 text-slate-500'}`}>Below</button>
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Set Alert</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {priceAlerts.length === 0 ? (
              <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active alerts</p>
              </div>
            ) : (
              priceAlerts.map((alert) => (
                <motion.div key={alert.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex items-center justify-between group hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${alert.isActive ? (alert.type === 'above' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400') : 'bg-slate-800 text-slate-600'}`}>
                      {alert.type === 'above' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{alert.symbol}</span>
                        <h4 className={`text-lg font-black ${alert.isActive ? 'text-white' : 'text-slate-500 line-through'}`}>
                          {alert.price.toLocaleString(undefined, { minimumFractionDigits: alert.symbol.includes('JPY') ? 3 : 2 })}
                        </h4>
                      </div>
                      <p className="text-sm font-bold text-slate-400">{alert.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!alert.isActive && <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Triggered</span>}
                    <button onClick={() => setPriceAlerts(prev => prev.filter(a => a.id !== alert.id))} className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
