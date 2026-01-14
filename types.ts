
export interface PrayerTime {
  name: string;
  time: string;
  isActive?: boolean;
}

export interface Wisdom {
  quote: string;
  source: string;
  reference: string;
}

export interface Mosque {
  name: string;
  distance: string;
  walkTime: string;
  location: string;
}

export enum DhikrPhase {
  SUBHANALLAH = 'SubhanAllah',
  ALHAMDULILLAH = 'Alhamdulillah',
  ALLAHUAKBAR = 'AllahuAkbar'
}
