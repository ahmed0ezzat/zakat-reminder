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
  manualGoldPrice: string;
  setManualGoldPrice: (v: string) => void;
  manualFitrValue: string;
  setManualFitrValue: (v: string) => void;
}

const today = new Date().toISOString().slice(0, 10);

const ZakatInputForm: React.FC<Props> = ({
  lang, zakatTypes, goldPrice, loadingGold, fetchGoldPrice, fitrValue, loadingFitr, fetchFitrValue, onAdd, errors, setErrors, manualGoldPrice, setManualGoldPrice, manualFitrValue, setManualFitrValue
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputName, setInputName] = useState('');
  const [dueDate, setDueDate] = useState(today);

  const getZakatTypeLabel = (t: ZakatType, lang: string) => lang === 'ar' ? t.ar : t.en;

  // Use manual value if provided, else fetched value
//   const effectiveGoldPrice = manualGoldPrice ? Number(manualGoldPrice) : goldPrice;
//   const effectiveFitrValue = manualFitrValue ? Number(manualFitrValue) : fitrValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    if (!selectedType) return setErrors(lang === 'ar' ? 'اختر نوع الزكاة' : 'Select zakat type');
    if (selectedType === 'stocks' && !inputName.trim()) return setErrors(lang === 'ar' ? 'أدخل اسم السهم' : 'Enter stock name');
    const value = Number(inputValue);
    if (!inputValue || value <= 0) return setErrors(lang === 'ar' ? 'أدخل قيمة صحيحة' : 'Enter a valid value');
    if (!dueDate) return setErrors(lang === 'ar' ? 'حدد تاريخ استحقاق الزكاة' : 'Select Zakat Due Date');
    const newRow: ZakatRow = {
      id: Date.now().toString(),
      type: selectedType,
      value,
      name: selectedType === 'stocks' ? inputName.trim() : undefined,
      dueDate,
    };
    onAdd(newRow);
    setInputValue('');
    setInputName('');
    setSelectedType('');
    setDueDate(today);
  };

  return (
    <form
      className="mb-8 max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-blue-100"
      onSubmit={handleSubmit}
    >
      {/* Gold and fitr price display - move to a more prominent, card-like section above the form fields */}
      <div className="w-full mb-6">
        <div className="flex flex-col md:flex-row gap-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm items-center justify-center">
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="font-semibold text-blue-700 text-lg">{lang === 'ar' ? 'سعر جرام الذهب' : 'Gold Price (per gram)'}</span>
            <div className="flex items-center gap-2 mt-1">
              {loadingGold ? (
                <span className="text-gray-500">{lang === 'ar' ? '...جاري التحميل' : 'Loading...'}</span>
              ) : goldPrice ? (
                <span className="font-mono text-blue-700 text-lg">{goldPrice} EGP</span>
              ) : (
                <span className="text-red-500">{lang === 'ar' ? 'غير متوفر' : 'Unavailable'}</span>
              )}
              <button
                className="ml-2 text-xs bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-200 transition"
                type="button"
                onClick={fetchGoldPrice}
              >
                {lang === 'ar' ? 'تحديث' : 'Refresh'}
              </button>
            </div>
            <input
              className="input w-32 mt-2 bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-200 text-center"
              type="number"
              min="0"
              value={manualGoldPrice}
              onChange={e => setManualGoldPrice(e.target.value)}
              placeholder={lang === 'ar' ? 'أدخل يدوياً' : 'Enter manually'}
            />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="font-semibold text-blue-700 text-lg">{lang === 'ar' ? 'قيمة الفطر للفرد' : 'Fitr per Person'}</span>
            <div className="flex items-center gap-2 mt-1">
              {loadingFitr ? (
                <span className="text-gray-500">{lang === 'ar' ? '...جاري التحميل' : 'Loading...'}</span>
              ) : fitrValue ? (
                <span className="font-mono text-blue-700 text-lg">{fitrValue} EGP</span>
              ) : (
                <span className="text-red-500">{lang === 'ar' ? 'غير متوفر' : 'Unavailable'}</span>
              )}
              <button
                className="ml-2 text-xs bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-200 transition"
                type="button"
                onClick={fetchFitrValue}
              >
                {lang === 'ar' ? 'تحديث' : 'Refresh'}
              </button>
            </div>
            <input
              className="input w-32 mt-2 bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-200 text-center"
              type="number"
              min="0"
              value={manualFitrValue}
              onChange={e => setManualFitrValue(e.target.value)}
              placeholder={lang === 'ar' ? 'أدخل يدوياً' : 'Enter manually'}
            />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">
        {lang === 'ar' ? 'إضافة نوع زكاة جديد' : 'Add New Zakat Entry'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className='md:col-span-2'>
          <label className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'نوع الزكاة' : 'Zakat Type'}</label>
          <select
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
              <option key={t.key} value={t.key}>{getZakatTypeLabel(t, lang)}</option>
            ))}
          </select>
        </div>
        {selectedType === 'stocks' && (
          <div>
            <label className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'اسم السهم' : 'Stock Name'}</label>
            <input
              className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              placeholder={lang === 'ar' ? 'اسم السهم' : 'Stock name'}
            />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'القيمة' : 'Value'}</label>
          <input
            className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
            type={selectedType === 'gold' || selectedType === 'silver' ? 'number' : 'number'}
            min="0"
            step={selectedType === 'gold' || selectedType === 'silver' ? '0.01' : '1'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={(() => {
              if (selectedType === 'gold') return lang === 'ar' ? 'أدخل وزن الذهب بالجرام' : 'Enter gold weight in grams';
              if (selectedType === 'silver') return lang === 'ar' ? 'أدخل وزن الفضة بالجرام' : 'Enter silver weight in grams';
              if (selectedType === 'fitr') return lang === 'ar' ? 'عدد الأفراد' : 'Number of people';
              if (selectedType === 'stocks') return lang === 'ar' ? 'قيمة الأسهم بالجنيه' : 'Stock value in EGP';
              if (selectedType === 'cash') return lang === 'ar' ? 'المبلغ النقدي بالجنيه' : 'Cash amount in EGP';
              if (selectedType === 'business') return lang === 'ar' ? 'قيمة التجارة بالجنيه' : 'Business value in EGP';
              return lang === 'ar' ? 'أدخل القيمة' : 'Enter value';
            })()}
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
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700">{lang === 'ar' ? 'تاريخ استحقاق الزكاة' : 'Zakat Due Date'}</label>
          <input
            className="input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            placeholder={lang === 'ar' ? 'اختر التاريخ' : 'Select date'}
          />
        </div>
      </div>
      {errors && <div className="text-red-500 text-sm mb-2 w-full text-center">{errors}</div>}
      <div className="flex gap-2 justify-end mt-2">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow hover:from-blue-700 hover:to-blue-500 transition-all text-lg"
        >
          {lang === 'ar' ? 'إضافة' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default ZakatInputForm;
