import React from 'react';

interface Props {
  lang: string;
  inputName: string;
  setInputName: (v: string) => void;
}

const StockNameInput: React.FC<Props> = ({ lang, inputName, setInputName }) => {
  const inputId = 'stock-name-input';
  return (
    <div>
      <label htmlFor={inputId} className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'اسم السهم' : 'Stock Name'}</label>
      <input
        id={inputId}
        name="stockName"
        className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
        value={inputName}
        onChange={e => setInputName(e.target.value)}
        placeholder={lang === 'ar' ? 'اسم السهم' : 'Stock name'}
      />
    </div>
  );
};

export default StockNameInput;
