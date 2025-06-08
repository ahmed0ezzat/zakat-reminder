import React from 'react';

interface Props {
  lang: string;
  valueDate: string;
  setValueDate: (v: string) => void;
}

const ValueDateInput: React.FC<Props> = ({ lang, valueDate, setValueDate }) => {
  const inputId = 'value-date-input';
  return (
    <div>
      <label htmlFor={inputId} className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'تاريخ القيمة' : 'Value Date'}</label>
      <input
        id={inputId}
        name="valueDate"
        className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
        type="date"
        value={valueDate}
        onChange={e => setValueDate(e.target.value)}
        placeholder={lang === 'ar' ? 'اختر التاريخ' : 'Select date'}
      />
    </div>
  );
};

export default ValueDateInput;
