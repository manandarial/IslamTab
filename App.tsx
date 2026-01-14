
import React, { useState, useEffect, useCallback } from 'react';
import { PRAYER_TIMES, INITIAL_WISDOM, NEAREST_MOSQUE, SURAH_PROGRESS } from './constants';
import { DhikrPhase, Wisdom } from './types';
import { GoogleGenAI } from '@google/genai';

// --- Components ---

const Header: React.FC = () => (
  <header className="flex flex-col md:flex-row items-center justify-between px-6 lg:px-10 py-4 border-b border-white/5 bg-background-dark/50 sticky top-0 z-50 backdrop-blur-md gap-4">
    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
      <div className="flex items-center gap-3">
        <div className="text-accent">
          <span className="material-symbols-outlined text-3xl">mosque</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Islamic Hub</h1>
      </div>
      <div className="hidden lg:flex items-center bg-surface-dark px-4 py-2 rounded-xl gap-3 border border-white/5">
        <span className="material-symbols-outlined text-accent text-sm">calendar_month</span>
        <span className="text-sm font-medium">14 Ramadan, 1445 AH</span>
      </div>
    </div>
    
    <div className="flex-1 max-w-xl w-full">
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors">search</span>
        <input 
          className="w-full bg-surface-dark border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-accent transition-all placeholder:text-white/30 text-white" 
          placeholder="Search Quran, Hadith, or Duas..." 
          type="text"
        />
      </div>
    </div>

    <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
      <div className="flex items-center gap-2 bg-surface-dark px-3 py-1.5 rounded-lg border border-white/5">
        <span className="material-symbols-outlined text-accent text-sm">cloud</span>
        <span className="text-xs font-medium">London, 12°C</span>
      </div>
      <button className="p-2 rounded-xl bg-surface-dark hover:bg-primary/20 transition-colors">
        <span className="material-symbols-outlined text-white/70">notifications</span>
      </button>
      <div 
        className="size-10 rounded-full border-2 border-primary bg-center bg-cover flex-shrink-0"
        style={{ backgroundImage: `url('https://picsum.photos/seed/user123/100/100')` }}
      />
    </div>
  </header>
);

const PrayerRibbon: React.FC = () => (
  <section className="mb-10">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0.5 bg-white/5 rounded-2xl overflow-hidden p-1">
      {PRAYER_TIMES.map((prayer) => (
        <div 
          key={prayer.name}
          className={`flex flex-col items-center justify-center py-6 bg-surface-dark transition-all hover:bg-surface-dark/80 relative overflow-hidden ${
            prayer.isActive ? 'border-b-2 border-accent group' : ''
          }`}
        >
          {prayer.isActive && (
            <div className="absolute top-0 right-0 p-2 opacity-50">
              <span className="material-symbols-outlined text-accent text-xs">auto_awesome</span>
            </div>
          )}
          <span className={`text-[10px] uppercase tracking-widest mb-1 ${prayer.isActive ? 'text-accent' : 'text-white/40'}`}>
            {prayer.name}
          </span>
          <p className={`text-lg font-bold ${prayer.isActive ? 'text-accent' : ''}`}>
            {prayer.time}
          </p>
          {prayer.isActive && (
            <span className="text-[10px] text-accent/60 mt-1">Current Prayer</span>
          )}
        </div>
      ))}
    </div>
  </section>
);

const DailyWisdom: React.FC<{ wisdom: Wisdom; onRefresh: () => void; loading: boolean }> = ({ wisdom, onRefresh, loading }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
    <div className="relative glass-card rounded-3xl p-6 md:p-10 overflow-hidden min-h-[320px] flex flex-col justify-center">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
        <span className="material-symbols-outlined text-[200px] text-accent">format_quote</span>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-accent">auto_stories</span>
        <h3 className="text-accent text-sm font-bold uppercase tracking-widest">Daily Wisdom</h3>
      </div>
      <blockquote className={`relative z-10 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <p className="text-xl md:text-3xl font-medium leading-relaxed mb-8 text-white/90 italic">
          "{wisdom.quote}"
        </p>
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <cite className="not-italic font-bold text-white block">{wisdom.source}</cite>
            <p className="text-sm text-white/40">{wisdom.reference}</p>
          </div>
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="bg-primary hover:bg-primary/80 disabled:bg-primary/40 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <span>{loading ? 'Refining...' : 'Next Wisdom'}</span>
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </footer>
      </blockquote>
    </div>
  </div>
);

const MosqueFinder: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">Mosque Finder & Qibla</h2>
      <button className="text-accent text-sm font-semibold hover:underline">View All Locations</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-surface-dark rounded-3xl overflow-hidden h-[300px] relative border border-white/5">
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-60" 
          style={{ backgroundImage: `url('https://picsum.photos/seed/london-map/800/400')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <div className="bg-surface-dark/90 backdrop-blur-md p-3 rounded-xl flex-1 border border-white/10">
            <p className="text-xs font-bold text-accent mb-0.5">Nearest Mosque</p>
            <p className="text-sm">{NEAREST_MOSQUE.name}</p>
            <p className="text-[10px] text-white/40">{NEAREST_MOSQUE.distance} • {NEAREST_MOSQUE.walkTime}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-dark rounded-3xl p-6 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Qibla Direction</span>
        <div className="relative size-32 mb-6">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
          <div className="absolute inset-2 border border-white/10 rounded-full border-dashed"></div>
          <div className="absolute inset-0 flex items-center justify-center rotate-[124deg] transition-transform duration-1000">
            <div className="h-16 w-1 bg-accent rounded-full relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(201,178,115,0.6)]"></div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-white/20">N</span>
          </div>
        </div>
        <p className="text-xl font-bold">124° SE</p>
        <p className="text-xs text-white/40">Aligned to Makkah</p>
      </div>
    </div>
  </div>
);

const DhikrMode: React.FC<{ onGlobalIncrement: () => void }> = ({ onGlobalIncrement }) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<DhikrPhase>(DhikrPhase.SUBHANALLAH);
  
  const handleCount = () => {
    const nextCount = count + 1;
    if (nextCount > 33) {
      setCount(1);
      cyclePhase();
    } else {
      setCount(nextCount);
    }
    onGlobalIncrement();
  };

  const cyclePhase = () => {
    if (phase === DhikrPhase.SUBHANALLAH) setPhase(DhikrPhase.ALHAMDULILLAH);
    else if (phase === DhikrPhase.ALHAMDULILLAH) setPhase(DhikrPhase.ALLAHUAKBAR);
    else setPhase(DhikrPhase.SUBHANALLAH);
  };

  const resetCount = () => setCount(0);

  const progress = (count / 33) * 100;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 text-primary/10">
        <span className="material-symbols-outlined text-[120px]">fingerprint</span>
      </div>
      <h3 className="text-primary font-bold text-lg mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined">track_changes</span>
        Dhikr Mode
      </h3>
      <div className="flex flex-col items-center gap-6">
        <div className="size-40 rounded-full border-8 border-primary/10 flex items-center justify-center relative">
          <svg className="absolute inset-0 size-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-primary/10"
            />
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={452.39}
              strokeDashoffset={452.39 * (1 - progress / 100)}
              className="text-primary transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center relative z-10">
            <span className="text-4xl font-black block">{count}</span>
            <span className="text-[10px] uppercase text-white/40 tracking-widest">{phase}</span>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <button 
            onClick={handleCount}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Count
          </button>
          <button 
            onClick={resetCount}
            className="p-3 bg-surface-dark border border-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SunnahHabit: React.FC = () => (
  <div className="bg-surface-dark rounded-3xl p-6 border border-white/5">
    <div className="flex items-center gap-3 mb-4">
      <div className="size-10 bg-accent/10 rounded-xl flex items-center justify-center">
        <span className="material-symbols-outlined text-accent">flare</span>
      </div>
      <div>
        <h4 className="font-bold">Sunnah Habit</h4>
        <p className="text-[10px] text-white/40 uppercase">Actionable Practice</p>
      </div>
    </div>
    <p className="text-sm leading-relaxed text-white/70 mb-4">
      Start every action with 'Bismillah'. It brings Barakah (blessing) into your work and keeps your intentions pure.
    </p>
    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <span className="text-xs font-medium text-accent">742 others today</span>
      <button className="text-xs font-bold text-white/40 hover:text-white">Learn more</button>
    </div>
  </div>
);

const QuranProgressCard: React.FC = () => (
  <div className="bg-surface-dark rounded-3xl p-6 border border-white/5">
    <h4 className="font-bold mb-6 flex items-center justify-between">
      Quran Progress
      <span className="text-xs font-normal text-white/40">Juz {SURAH_PROGRESS.juz}</span>
    </h4>
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white/60">{SURAH_PROGRESS.name}</span>
          <span className="text-accent">{SURAH_PROGRESS.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${SURAH_PROGRESS.progress}%` }}></div>
        </div>
      </div>
      <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 text-white">
        <span className="material-symbols-outlined text-sm">menu_book</span>
        Continue Reading
      </button>
    </div>
  </div>
);

const Footer: React.FC = () => (
  <footer className="mt-12 border-t border-white/5 py-10 px-6 lg:px-10 bg-surface-dark/30">
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-accent">mosque</span>
          <h2 className="text-lg font-bold">Islamic Hub</h2>
        </div>
        <p className="text-sm text-white/40 leading-relaxed">
          A mindful digital space for the modern Muslim. Elevating spiritual practices through technology.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/20">Resources</h5>
        <ul className="space-y-2 text-sm text-white/60">
          <li><a className="hover:text-accent transition-colors" href="#">Noble Quran</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Hadith Database</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Prayer Times API</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Qibla Direction</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/20">Community</h5>
        <ul className="space-y-2 text-sm text-white/60">
          <li><a className="hover:text-accent transition-colors" href="#">Local Events</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Charity (Sadaqah)</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Volunteer Portal</a></li>
          <li><a className="hover:text-accent transition-colors" href="#">Halal Finder</a></li>
        </ul>
      </div>
      <div className="bg-primary/20 p-6 rounded-2xl border border-primary/30 flex flex-col justify-between">
        <div>
          <h5 className="font-bold text-sm mb-2">Ramadan 1445</h5>
          <p className="text-xs text-white/60 mb-4">Join our global community for daily Iftar reminders and Quran study circles.</p>
        </div>
        <button className="text-xs font-bold text-accent hover:underline self-start">Join Circle</button>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [wisdom, setWisdom] = useState<Wisdom>(INITIAL_WISDOM);
  const [loadingWisdom, setLoadingWisdom] = useState(false);
  const [globalDhikr, setGlobalDhikr] = useState(0);

  const fetchNewWisdom = useCallback(async () => {
    setLoadingWisdom(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Provide a unique, short, and inspiring Islamic wisdom or Hadith. Return it in JSON format with fields: 'quote', 'source', 'reference'. Ensure the reference is concise.",
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const text = response.text;
      if (text) {
        const data = JSON.parse(text.trim());
        setWisdom(data);
      }
    } catch (error) {
      console.error("Error fetching wisdom:", error);
      // Fallback to initial wisdom or a rotation if needed
    } finally {
      setLoadingWisdom(false);
    }
  }, []);

  // UseEffect with empty array to avoid loops, only run once
  useEffect(() => {
    // Optionally fetch on mount
    // fetchNewWisdom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="layout-container flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8">
        <PrayerRibbon />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <DailyWisdom 
              wisdom={wisdom} 
              onRefresh={fetchNewWisdom} 
              loading={loadingWisdom} 
            />
            <MosqueFinder />
          </div>
          
          <aside className="lg:col-span-4 space-y-8">
            <DhikrMode onGlobalIncrement={() => setGlobalDhikr(prev => prev + 1)} />
            <SunnahHabit />
            <QuranProgressCard />
          </aside>
        </div>
      </main>

      <Footer />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => setGlobalDhikr(prev => prev + 1)}
          className="size-14 rounded-full bg-accent text-background-dark shadow-2xl shadow-accent/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
        >
          <span className="material-symbols-outlined font-bold">plus_one</span>
          {globalDhikr > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold size-6 rounded-full flex items-center justify-center border-2 border-background-dark animate-bounce">
              {globalDhikr}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
