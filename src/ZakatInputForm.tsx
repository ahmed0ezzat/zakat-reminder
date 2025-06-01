import React, { useState } from 'react';
import type { ZakatType, ZakatRow } from './types';

interface Props {
  lang: string;
  zakatTypes: ZakatType[];
  goldPrice: number | null;
  loadingGold: boolean;
  fetchGoldPrice: () => void;
  fitrValue: number | null;
  loadingFitr: boolean;
  fetchFitrValue: () => void;
  onAdd: (row: ZakatRow) => void;
  errors: string | null;
  setErrors: (err: string | null) => void;
}

const ZakatInputForm: React.FC<Props> = ({
  lang, zakatTypes, goldPrice, loadingGold, fetchGoldPrice, fitrValue, loadingFitr, fetchFitrValue, onAdd, errors, setErrors
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputName, setInputName] = useState('');

  const handleAdd = () => {
    setErrors(null);
    const value = Number(inputValue);
    if (!selectedType) return setErrors(lang === 'ar' ? 'اختر نوع الزكاة' : 'Select zakat type');
    if (!inputValue || value <= 0) return setErrors(lang === 'ar' ? 'أدخل قيمة صحيحة' : 'Enter a valid value');
    if (selectedType === 'stocks' && !inputName.trim()) return setErrors(lang === 'ar' ? 'أدخل اسم السهم' : 'Enter stock name');
    const newRow: ZakatRow = { id: Date.now().toString(), type: selectedType, value, name: selectedType === 'stocks' ? inputName.trim() : undefined };
    onAdd(newRow);
    setInputValue('');
    setInputName('');
    setSelectedType('');
  };

  const getZakatTypeLabel = (t: ZakatType, lang: string) => lang === 'ar' ? t.ar : t.en;

  return (
    <div className="mb-4 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'نوع الزكاة' : 'Zakat Type'}</label>
        <select className="input w-full" value={selectedType} onChange={e => { setSelectedType(e.target.value); setInputName(''); }}>
          <option value="">{lang === 'ar' ? 'اختر النوع' : 'Select type'}</option>
          {zakatTypes.map(t => (
            <option key={t.key} value={t.key}>{getZakatTypeLabel(t, lang)}</option>
          ))}
        </select>
      </div>
      {selectedType === 'stocks' && (
        <div className="flex-1">
          <label className="block font-semibold mb-1">{lang === 'ar' ? 'اسم السهم' : 'Stock Name'}</label>
          <input className="input w-full" value={inputName} onChange={e => setInputName(e.target.value)} placeholder={lang === 'ar' ? 'اسم السهم' : 'Stock name'} />
        </div>
      )}
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'القيمة' : 'Value'}</label>
        <input className="input w-full" type="number" min="0" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={lang === 'ar' ? 'أدخل القيمة' : 'Enter value'} />
      </div>
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition shadow" onClick={handleAdd}>{lang === 'ar' ? 'إضافة' : 'Add'}</button>
      {/* Gold and fitr price display */}
      <div className="flex-1 flex flex-col gap-2 mt-4 md:mt-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{lang === 'ar' ? 'سعر جرام الذهب:' : 'Gold Price (per gram):'}</span>
          {loadingGold ? <span className="text-gray-500">{lang === 'ar' ? '...جاري التحميل' : 'Loading...'}</span> : goldPrice ? <span className="font-mono text-blue-700">{goldPrice} EGP</span> : <span className="text-red-500">{lang === 'ar' ? 'غير متوفر' : 'Unavailable'}</span>}
          <button className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300" onClick={fetchGoldPrice}>{lang === 'ar' ? 'تحديث' : 'Refresh'}</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{lang === 'ar' ? 'قيمة الفطر للفرد:' : 'Fitr per Person:'}</span>
          {loadingFitr ? <span className="text-gray-500">{lang === 'ar' ? '...جاري التحميل' : 'Loading...'}</span> : fitrValue ? <span className="font-mono text-blue-700">{fitrValue} EGP</span> : <span className="text-red-500">{lang === 'ar' ? 'غير متوفر' : 'Unavailable'}</span>}
          <button className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300" onClick={fetchFitrValue}>{lang === 'ar' ? 'تحديث' : 'Refresh'}</button>
        </div>
      </div>
      {errors && <div className="text-red-500 text-sm mb-2 w-full">{errors}</div>}
    </div>
  );
};

export default ZakatInputForm;
