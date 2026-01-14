
import { PrayerTime, Wisdom, Mosque } from './types';

export const PRAYER_TIMES: PrayerTime[] = [
  { name: 'Fajr', time: '04:12 AM' },
  { name: 'Dhuhr', time: '12:45 PM', isActive: true },
  { name: 'Asr', time: '04:15 PM' },
  { name: 'Maghrib', time: '06:40 PM' },
  { name: 'Isha', time: '08:15 PM' },
];

export const INITIAL_WISDOM: Wisdom = {
  quote: "The best among you are those who have the best manners and character.",
  source: "Sahih al-Bukhari",
  reference: "Character & Manners — Vol 8, Hadith 56"
};

export const NEAREST_MOSQUE: Mosque = {
  name: "Central London Mosque",
  distance: "0.8 miles",
  walkTime: "12 mins walk",
  location: "London"
};

export const SURAH_PROGRESS = {
  name: "Surah Ibrahim",
  progress: 65,
  juz: 14
};
