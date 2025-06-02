import React from 'react';

interface StockNameInputProps {
  value: string;
  onChange: (v: string) => void;
  lang: string;
}

const StockNameInput: React.FC<StockNameInputProps> = ({ value, onChange, lang }) => (
  <input
    className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={lang === 'ar' ? 'اسم السهم' : 'Stock name'}
  />
);

export default StockNameInput;
