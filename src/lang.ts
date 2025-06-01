import { createContext, useContext } from 'react';

export const LangContext = createContext<'ar' | 'en'>('ar');
export const useLang = () => useContext(LangContext);
