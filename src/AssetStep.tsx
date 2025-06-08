import React from 'react';
import type { ZakatType, ZakatRow, CalculatorErrors } from './types';
import ZakatTable from './ZakatTable';

interface AssetStepProps {
  lang: string;
  ZAKAT_TYPES: ZakatType[];
  selectedType: string;
  setSelectedType: (v: string) => void;
  inputName: string;
  setInputName: (v: string) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleAdd: () => void;
  goldPricePerGram: number;
  setGoldPricePerGram: (v: number) => void;
  fitrCount: number;
  setFitrCount: (v: number) => void;
  fitrPerPerson: number;
  setFitrPerPerson: (v: number) => void;
  liabilities: number;
  setLiabilities: (v: number) => void;
  nisabStandard: 'gold' | 'silver';
  setNisabStandard: (v: 'gold' | 'silver') => void;
  silverPricePerGram: number;
  setSilverPricePerGram: (v: number) => void;
  errors: CalculatorErrors;
  rows: ZakatRow[];
  handleEdit: (row: ZakatRow) => void;
  handleDelete: (id: string) => void;
  handleNext: () => void;
}

function getZakatTypeLabel(type: ZakatType, lang: string) {
  return lang === 'ar' ? type.ar : type.en;
}

const AssetStep: React.FC<AssetStepProps> = ({
  lang, ZAKAT_TYPES, selectedType, setSelectedType, inputName, setInputName, inputValue, setInputValue, handleAdd, goldPricePerGram, setGoldPricePerGram, fitrCount, setFitrCount, fitrPerPerson, setFitrPerPerson, liabilities, setLiabilities, nisabStandard, setNisabStandard, silverPricePerGram, setSilverPricePerGram, errors, rows, handleEdit, handleDelete, handleNext
}) => (
  <>
    <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-tight drop-shadow">{lang === 'ar' ? 'إضافة أنواع الزكاة' : 'Add Zakat Types'}</h2>
    <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'نوع الزكاة' : 'Zakat Type'}</label>
        <select className="input w-full" value={selectedType} onChange={e => { setSelectedType(e.target.value); setInputName(''); }}>
          <option value="">{lang === 'ar' ? 'اختر النوع' : 'Select type'}</option>
          {ZAKAT_TYPES.map(t => (
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
      {/* <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'القيمة' : 'Value'}</label>
        <input className="input w-full" type="number" min="0" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={lang === 'ar' ? 'أدخل القيمة' : 'Enter value'} />
      </div> */}
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition shadow" onClick={handleAdd}>{lang === 'ar' ? 'إضافة' : 'Add'}</button>
    </div>
    {/* Gold price and Fitr settings */}
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'سعر جرام الذهب (عيار 24)' : 'Gold Price (per gram)'}</label>
        <input
          className="input w-full"
          type="number"
          min="1"
          value={goldPricePerGram}
          onChange={e => setGoldPricePerGram(Number(e.target.value) || 0)}
          placeholder={lang === 'ar' ? 'مثال: 3000' : 'e.g. 3000'}
        />
      </div>
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'عدد الأفراد (زكاة الفطر)' : 'Family Members (Fitr)'}</label>
        <input
          className="input w-full"
          type="number"
          min="1"
          value={fitrCount}
          onChange={e => setFitrCount(Number(e.target.value) || 1)}
          placeholder={lang === 'ar' ? 'عدد الأفراد' : 'Family count'}
        />
      </div>
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'قيمة الفطر للفرد' : 'Fitr per Person'}</label>
        <input
          className="input w-full"
          type="number"
          min="1"
          value={fitrPerPerson}
          onChange={e => setFitrPerPerson(Number(e.target.value) || 0)}
          placeholder={lang === 'ar' ? 'مثال: 60' : 'e.g. 60'}
        />
      </div>
    </div>
    {/* Liabilities Section */}
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">{lang === 'ar' ? 'الخصوم المستحقة (تخصم من الأصول)' : 'Eligible Liabilities (deducted from assets)'}</h3>
      <input
        className="input w-full mb-2"
        type="number"
        min="0"
        value={liabilities}
        onChange={e => setLiabilities(Number(e.target.value) || 0)}
        placeholder={lang === 'ar' ? 'أدخل مجموع الديون/الخصوم' : 'Enter total debts/liabilities'}
      />
    </div>
    {/* Nisab Standard Selector */}
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1">
        <label className="block font-semibold mb-1">{lang === 'ar' ? 'معيار النصاب' : 'Nisab Standard'}</label>
        <select className="input w-full" value={nisabStandard} onChange={e => setNisabStandard(e.target.value as 'gold' | 'silver')}>
          <option value="gold">{lang === 'ar' ? 'ذهب (85 جم)' : 'Gold (85g)'}</option>
          <option value="silver">{lang === 'ar' ? 'فضة (595 جم)' : 'Silver (595g)'}</option>
        </select>
      </div>
      {nisabStandard === 'silver' && (
        <div className="flex-1">
          <label className="block font-semibold mb-1">{lang === 'ar' ? 'سعر جرام الفضة' : 'Silver Price (per gram)'}</label>
          <input
            className="input w-full"
            type="number"
            min="1"
            value={silverPricePerGram}
            onChange={e => setSilverPricePerGram(Number(e.target.value) || 0)}
            placeholder={lang === 'ar' ? 'مثال: 40' : 'e.g. 40'}
          />
        </div>
      )}
    </div>
    {errors.input && <div className="text-red-500 text-sm mb-2">{errors.input}</div>}
    <div className="mb-6 overflow-x-auto">
      {/* TODO: This component is deprecated. Please use ZakatSummaryTable instead for all summary and result displays. */}
      <ZakatTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} editable />
    </div>
    <div className="flex justify-end">
      <button type="button" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition shadow" onClick={handleNext}>{lang === 'ar' ? 'التالي: إعداد التذكير' : 'Next: Setup Reminder'}</button>
    </div>
  </>
);

export default AssetStep;
