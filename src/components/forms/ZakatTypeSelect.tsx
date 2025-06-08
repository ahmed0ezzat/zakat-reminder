import React from 'react';
import type { ZakatType } from '../../types';

interface Props {
  lang: string;
  zakatTypes: ZakatType[];
  selectedType: string;
  setSelectedType: (v: string) => void;
  setInputName: (v: string) => void;
  setInputValue: (v: string) => void;
  setErrors: (v: string | null) => void;
}

const ZakatTypeSelect: React.FC<Props> = ({ lang, zakatTypes, selectedType, setSelectedType, setInputName, setInputValue, setErrors }) => {
  const selectId = 'zakat-type-select';
  return (
    <div className='md:col-span-2'>
      <label htmlFor={selectId} className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'نوع الزكاة' : 'Zakat Type'}</label>
      <select
        id={selectId}
        name="zakatType"
        className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
        value={selectedType}
        onChange={e => {
          setSelectedType(e.target.value);
          setInputName('');
          setInputValue('');
          setErrors(null);
        }}
      >
        <option value="">{lang === 'ar' ? 'اختر النوع' : 'Select type'}</option>
        {zakatTypes.map(t => (
          <option key={t.key} value={t.key}>{t.ar}</option>
        ))}
      </select>
    </div>
  );
};

export default ZakatTypeSelect;
