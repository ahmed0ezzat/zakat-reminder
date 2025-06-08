import React from 'react';

interface Props {
  lang: string;
  selectedType: string;
  inputValue: string;
  setInputValue: (v: string) => void;
  getValuePlaceholder: (type: string, lang: string) => string;
}

const ZakatValueInput: React.FC<Props> = ({ lang, selectedType, inputValue, setInputValue, getValuePlaceholder }) => {
  const inputId = `zakat-value-input-${selectedType}`;
  return (
    <div className="md:col-span-2">
      <label htmlFor={inputId} className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'القيمة' : 'Value'}</label>
      <input
        id={inputId}
        name="zakatValue"
        className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
        type="number"
        min="0"
        step={selectedType === 'gold' || selectedType === 'silver' ? '0.01' : '1'}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={getValuePlaceholder(selectedType, lang)}
      />
      {selectedType === 'gold' && (
        <div className="text-xs text-blue-500 mt-1">{lang === 'ar' ? 'أدخل وزن الذهب بالجرام (عيار 24)' : 'Enter the weight of gold in grams (24k)'}</div>
      )}
      {selectedType === 'silver' && (
        <div className="text-xs text-blue-500 mt-1">{lang === 'ar' ? 'أدخل وزن الفضة بالجرام' : 'Enter the weight of silver in grams'}</div>
      )}
      {selectedType === 'fitr' && (
        <div className="text-xs text-blue-500 mt-1">{lang === 'ar' ? 'أدخل عدد الأفراد المستحقين للفطر' : 'Enter the number of people for Fitr'}</div>
      )}
    </div>
  );
};

export default ZakatValueInput;
