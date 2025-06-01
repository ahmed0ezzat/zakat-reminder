// Centralized types for zakat app

export interface ZakatType {
  key: string;
  ar: string;
  en: string;
  ask?: boolean;
}

export interface ZakatRow {
  id: string;
  type: string;
  value: number;
  name?: string;
}

export interface ZakatResult {
  total: number;
  breakdown: { label: string; value: number }[];
}

export type CalculatorErrors = {
  input?: string;
  edit?: string;
  hijri?: string;
};

export interface UserProfile {
  name: string;
  email: string;
  country: string;
  city: string;
  currency: string;
  hijriStart: string;
}

export const ZAKAT_TYPES: ZakatType[] = [
  { key: 'cash', ar: 'نقد', en: 'Cash' },
  { key: 'gold', ar: 'ذهب', en: 'Gold' },
  { key: 'silver', ar: 'فضة', en: 'Silver' },
  { key: 'stocks', ar: 'أسهم', en: 'Stocks', ask: true },
  { key: 'business', ar: 'تجارة', en: 'Business' },
  { key: 'fitr', ar: 'فطر', en: 'Fitr' },
];
