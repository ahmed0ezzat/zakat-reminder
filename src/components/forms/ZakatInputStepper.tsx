import React, { useState, useEffect } from 'react';
import type { ZakatType } from '../../types';
import ZakatTypeSelect from './ZakatTypeSelect';
import StockNameInput from './StockNameInput';
import ZakatValueInput from './ZakatValueInput';
import ValueDateInput from './ValueDateInput';
import MissedPeriodsList from './MissedPeriodsList';
import ZakatRecord from '../tables/ZakatRecord';
import { formatNumber } from '../../utils/formatNumber';
import { useLocation } from 'react-router-dom';

interface Props {
  lang: string;
  zakatTypes: ZakatType[];
  errors: string | null;
  setErrors: (err: string | null) => void;
  goldPrice?: number;
  fitrValue?: number;
  silverPrice?: number;
}

// Add type for a full zakat entry (with missed periods)
type ZakatEntry = {
  id: string;
  type: string;
  name?: string;
  value: number;
  valueDate: string;
  missedPeriods: { due: string; paid: boolean; value: number }[];
};

// The full implementation of the stepper UI, form fields, and table should be pasted here from the previous ZakatInputForm.
// For now, this is a placeholder to enable modularization and compilation.
const ZakatInputStepper: React.FC<Props> = ({
  lang, zakatTypes, errors, setErrors, goldPrice, fitrValue, silverPrice
}) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputName, setInputName] = useState('');
  const [valueDate, setValueDate] = useState<string>('');
  const [missedPeriods, setMissedPeriods] = useState<{ due: string; paid: boolean; value: number }[]>([]);
  const location = useLocation();

  useEffect(() => {
    const value = Number(inputValue);
    if (!valueDate || !value) {
      setMissedPeriods([]);
      return;
    }
    const periods: { due: string; paid: boolean; value: number }[] = [];
    let d = new Date(valueDate);
    const todayDate = new Date();
    let i = 1;
    while (d < todayDate) {
      const due = new Date(d);
      due.setDate(due.getDate() + 354); // 1 hijri year
      if (due > todayDate) break;
      periods.push({ due: due.toISOString().slice(0, 10), paid: false, value });
      d = due;
      i++;
      if (i > 20) { break; }
    }
    setMissedPeriods(periods);
  }, [valueDate, inputValue]);

  const [zakatEntries, setZakatEntries] = useState<ZakatEntry[]>(() => {
    const saved = localStorage.getItem('zakatEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [editIdx, setEditIdx] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('zakatEntries', JSON.stringify(zakatEntries));
  }, [zakatEntries]);

  function togglePaid(idx: number) {
    setMissedPeriods(periods => periods.map((p, i) => i === idx ? { ...p, paid: !p.paid } : p));
  }

  function getZakatAmount(val: number, type: string, goldPrice?: number, silverPrice?: number, fitrValue?: number): number {
    if (type === 'gold' && goldPrice) {
      return Math.round(val * goldPrice * 0.025 * 100) / 100;
    }
    if (type === 'silver' && silverPrice) {
      return Math.round(val * silverPrice * 0.025 * 100) / 100;
    }
    if (type === 'fitr' && fitrValue) {
      return Math.round(val * fitrValue * 100) / 100;
    }
    return Math.round(val * 0.025 * 100) / 100;
  }

  function getValuePlaceholder(selectedType: string, lang: string) {
    if (selectedType === 'gold') return lang === 'ar' ? 'قيمة الذهب' : 'Gold value';
    if (selectedType === 'silver') return lang === 'ar' ? 'قيمة الفضة' : 'Silver value';
    if (selectedType === 'stocks') return lang === 'ar' ? 'قيمة السهم' : 'Stock value';
    if (selectedType === 'fitr') return lang === 'ar' ? 'قيمة الفطرة' : 'Fitr value';
    return lang === 'ar' ? 'القيمة' : 'Value';
  }

  const totalZakat = React.useMemo(() => {
    return missedPeriods.reduce((sum, p) => sum + (!p.paid ? getZakatAmount(p.value, selectedType, goldPrice, silverPrice, fitrValue) : 0), 0);
  }, [missedPeriods, selectedType, goldPrice, silverPrice, fitrValue]);

  const totalZakatAll = React.useMemo(() => {
    return zakatEntries.reduce((sum, entry) =>
      sum + entry.missedPeriods.reduce((s, p) => s + (!p.paid ? getZakatAmount(p.value, entry.type, goldPrice, silverPrice, fitrValue) : 0), 0)
    , 0);
  }, [zakatEntries, goldPrice, silverPrice, fitrValue]);

  function handleNext() {
    setErrors(null);
    if (!selectedType) return setErrors(lang === 'ar' ? 'اختر نوع الزكاة' : 'Select zakat type');
    if (selectedType === 'stocks' && !inputName.trim()) return setErrors(lang === 'ar' ? 'أدخل اسم السهم' : 'Enter stock name');
    const value = Number(inputValue);
    if (!inputValue || value <= 0) return setErrors(lang === 'ar' ? 'أدخل قيمة صحيحة' : 'Enter a valid value');
    if (!valueDate) return setErrors(lang === 'ar' ? 'أدخل تاريخ القيمة' : 'Enter value date');
    setStep(2);
  }
  function handleConfirmReminders() {
    const entry: ZakatEntry = {
      id: editIdx !== null ? zakatEntries[editIdx].id : Date.now().toString(),
      type: selectedType,
      name: inputName,
      value: Number(inputValue),
      valueDate,
      missedPeriods: missedPeriods.map(p => ({ ...p })),
    };
    if (editIdx !== null) {
      setZakatEntries(entries => entries.map((e, i) => i === editIdx ? entry : e));
      setEditIdx(null);
    } else {
      setZakatEntries(entries => [...entries, entry]);
    }
    setStep(3);
  }
  function resetForm() {
    setSelectedType('');
    setInputValue('');
    setInputName('');
    setValueDate('');
    setMissedPeriods([]);
    setErrors(null);
    setEditIdx(null);
  }
  function handleEdit(idx: number) {
    const entry = zakatEntries[idx];
    setSelectedType(entry.type);
    setInputValue(String(entry.value));
    setInputName(entry.name ?? '');
    setValueDate(entry.valueDate);
    setMissedPeriods(entry.missedPeriods.map(p => ({ ...p })));
    setEditIdx(idx);
    setStep(1); // Move user to the form step
  }
  function handleDelete(idx: number) {
    setZakatEntries(entries => entries.filter((_, i) => i !== idx));
    setEditIdx(null);
  }
  function handleTogglePaid(idx: number, periodDue: string) {
    setZakatEntries(entries => entries.map((entry, i) => {
      if (i !== idx) return entry;
      return {
        ...entry,
        missedPeriods: entry.missedPeriods.map(p =>
          p.due === periodDue ? { ...p, paid: !p.paid } : p
        )
      };
    }));
  }

  // Go to step 3 if coming from Home with ?showRecord=1
  useEffect(() => {
    if (location.search.includes('showRecord=1')) {
      setStep(3);
    }
  }, [location.search]);

  return (
    <form
      className="mb-8 max-w-[800px] mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-blue-100"
      onSubmit={e => { e.preventDefault(); }}
    >
      {/* Stepper UI */}
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex items-center ${s < 5 ? 'mr-4' : ''}`}>
            <button
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-150 focus:outline-none ${step === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-100'}`}
              onClick={() => setStep(s)}
              aria-current={step === s ? 'step' : undefined}
            >
              {s}
            </button>
            {s < 4 && <div className="w-8 h-1 bg-blue-200 mx-1 rounded" />}
          </div>
        ))}
      </div>
      {/* Step 1: Input */}
      {step === 1 && (
        <>
          {/* Gold and fitr price display */}
          <div className="w-full mb-6">
            {/* ...existing gold/fitr price card... */}
          </div>
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">
            {lang === 'ar' ? 'إضافة نوع زكاة جديد' : 'Add New Zakat Entry'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ZakatTypeSelect
              lang={lang}
              zakatTypes={zakatTypes}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              setInputName={setInputName}
              setInputValue={setInputValue}
              setErrors={setErrors}
            />
            {selectedType === 'stocks' && (
              <StockNameInput lang={lang} inputName={inputName} setInputName={setInputName} />
            )}
            <ZakatValueInput
              lang={lang}
              selectedType={selectedType}
              inputValue={inputValue}
              setInputValue={setInputValue}
              getValuePlaceholder={getValuePlaceholder}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueDateInput lang={lang} valueDate={valueDate} setValueDate={setValueDate} />
            </div>
          </div>
          {errors && <div className="text-red-500 text-sm mb-2 w-full text-center">{errors}</div>}
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow hover:from-blue-700 hover:to-blue-500 transition-all text-lg"
              onClick={handleNext}
            >
              {lang === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </>
      )}
      {/* Step 2: Review missed periods */}
      {step === 2 && (
        <>
          {missedPeriods.length > 0 ? (
            <div className="my-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow">
              <div className="font-bold text-yellow-700 mb-2">
                {lang === 'ar' ? 'الزكوات المستحقة منذ تاريخ القيمة' : 'Missed Zakat Periods since Value Date'}
              </div>
              <MissedPeriodsList
                lang={lang}
                missedPeriods={missedPeriods}
                selectedType={selectedType}
                goldPrice={goldPrice}
                silverPrice={silverPrice}
                fitrValue={fitrValue}
                togglePaid={togglePaid}
                getZakatAmount={getZakatAmount}
              />
              <div className="text-xs text-yellow-600 mt-2">
                {lang === 'ar'
                  ? 'يرجى دفع الزكاة عن كل سنة فائتة لم يتم سدادها.'
                  : 'Please pay zakat for each missed year that is not marked as paid.'}
              </div>
              <div className="mt-4 text-lg font-bold text-blue-800">
                {lang === 'ar' ? 'إجمالي الزكاة غير المدفوعة:' : 'Total Unpaid Zakat:'} {totalZakat} {lang === 'ar' ? 'جنيه' : 'EGP'}
              </div>
              <div className="flex gap-2 justify-between mt-6">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition-all text-lg"
                  onClick={() => setStep(1)}
                >
                  {lang === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white font-bold shadow hover:from-green-700 hover:to-green-500 transition-all text-lg"
                  onClick={() => { handleConfirmReminders(); setStep(3); }}
                >
                  {lang === 'ar' ? 'تأكيد وإضافة للتذكيرات' : 'Confirm & Add to Reminders'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-yellow-700 font-semibold my-8">
              {lang === 'ar' ? 'لا توجد فترات زكاة فائتة.' : 'No missed zakat periods.'}
            </div>
          )}
        </>
      )}

      {/* Step 3: Zakat Entries List */}
      {step === 3 && zakatEntries.length > 0 && (
        <>
          <ZakatRecord
            lang={lang}
            zakatTypes={zakatTypes}
            entries={zakatEntries}
            goldPrice={goldPrice}
            silverPrice={silverPrice}
            fitrValue={fitrValue}
            onEdit={idx => handleEdit(zakatEntries.findIndex(e => e.id === idx.id))}
            onDelete={idx => handleDelete(zakatEntries.findIndex(e => e.id === idx))}
            onTogglePaid={(entryId, periodDue) => handleTogglePaid(zakatEntries.findIndex(e => e.id === entryId), periodDue)}
            editable
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-green-100 text-green-700 font-bold shadow hover:bg-green-200 transition-all text-lg"
              onClick={() => setStep(4)}
            >
              {lang === 'ar' ? 'ملخص الزكوات' : 'Zakat Summary'}
            </button>
          </div>
        </>
      )}
      {/* Step 4: Zakat Payment Summary + Reminder Message */}
      {step === 4 && (
        <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow text-blue-900 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">{lang === 'ar' ? 'ملخص الزكوات المستحقة' : 'Zakat Payment Summary'}</h2>
          <ul className="mb-4">
            {zakatEntries.length === 0 ? (
              <li className="text-center text-gray-500">{lang === 'ar' ? 'لا توجد زكوات مسجلة.' : 'No zakat entries.'}</li>
            ) : (
              Object.entries(zakatEntries.reduce((acc, entry) => {
                if (!acc[entry.type]) acc[entry.type] = 0;
                acc[entry.type] += entry.missedPeriods.reduce((sum, p) => sum + (!p.paid ? getZakatAmount(p.value, entry.type, goldPrice, silverPrice, fitrValue) : 0), 0);
                return acc;
              }, {} as Record<string, number>)).map(([type, amount]) => (
                <li key={type} className="mb-2 flex justify-between items-center">
                  <span className="font-semibold">{zakatTypes.find(t => t.key === type)?.ar ?? type}</span>
                  <span className="font-mono text-lg">{formatNumber(amount)} {lang === 'ar' ? 'جنيه' : 'EGP'}</span>
                </li>
              ))
            )}
          </ul>
          <div className="text-xl font-bold text-right border-t pt-4 mt-4">
            {lang === 'ar' ? 'إجمالي الزكاة المستحقة:' : 'Total Due Zakat:'} {formatNumber(totalZakatAll)} {lang === 'ar' ? 'جنيه' : 'EGP'}
          </div>
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center font-semibold">
            {lang === 'ar'
              ? 'ستصلك رسالة تذكير عبر البريد الإلكتروني عند اقتراب موعد كل زكاة.'
              : 'You will receive an email reminder for upcoming zakat.'}
          </div>
        </div>
      )}
    </form>
  );
};

export default ZakatInputStepper;
