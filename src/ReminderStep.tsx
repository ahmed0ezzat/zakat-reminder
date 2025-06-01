import React from 'react';
import type { CalculatorErrors } from './types';

type ReminderStepProps = {
  hijri: string;
  setHijri: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  errors: CalculatorErrors;
  lang: string;
  onBack: () => void;
};

const ReminderStep: React.FC<ReminderStepProps> = ({ hijri, setHijri, country, setCountry, city, setCity, errors, lang, onBack }) => (
  <>
    <h3 className="text-xl font-bold mb-4 text-blue-700">{lang === 'ar' ? 'إعداد التذكير' : 'Setup Reminder'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label htmlFor="hijri" className="block font-semibold mb-1">{lang === 'ar' ? 'تاريخ بداية الحول الهجري' : 'Hijri Start Date'}</label>
        <input id="hijri" name="hijri" type="date" className="input w-full" value={hijri} onChange={e => setHijri(e.target.value)} />
        {errors.hijri && <div className="text-red-500 text-xs mt-1">{errors.hijri}</div>}
      </div>
      <div>
        <label htmlFor="country" className="block font-semibold mb-1">{lang === 'ar' ? 'الدولة' : 'Country'}</label>
        <input id="country" name="country" className="input w-full" value={country} onChange={e => setCountry(e.target.value)} placeholder={lang === 'ar' ? 'مصر' : 'Egypt'} />
      </div>
      <div>
        <label htmlFor="city" className="block font-semibold mb-1">{lang === 'ar' ? 'المدينة' : 'City'}</label>
        <input id="city" name="city" className="input w-full" value={city} onChange={e => setCity(e.target.value)} placeholder={lang === 'ar' ? 'القاهرة' : 'Cairo'} />
      </div>
    </div>
    <div className="flex justify-between">
      <button type="button" className="bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-400 transition shadow" onClick={onBack}>{lang === 'ar' ? 'رجوع' : 'Back'}</button>
    </div>
  </>
);

export default ReminderStep;
