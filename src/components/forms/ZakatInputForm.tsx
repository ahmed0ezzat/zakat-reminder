import React, { useEffect, useState } from 'react';
import type { ZakatType } from '../../types';
import ZakatTypeSelect from './ZakatTypeSelect';
import StockNameInput from './StockNameInput';
import ZakatValueInput from './ZakatValueInput';
import ValueDateInput from './ValueDateInput';
import MissedPeriodsList from './MissedPeriodsList';

// Add type for a full zakat entry (with missed periods)
type ZakatEntry = {
  id: string;
  type: string;
  name?: string;
  value: number;
  valueDate: string;
  missedPeriods: { due: string; paid: boolean; value: number }[];
};

interface Props {
  lang: string;
  zakatTypes: ZakatType[];
  errors: string | null;
  setErrors: (err: string | null) => void;
  goldPrice?: number;
  fitrValue?: number;
  silverPrice?: number;
}

const ZakatInputForm: React.FC<Props> = ({
  lang, zakatTypes, errors, setErrors, goldPrice, fitrValue, silverPrice
}) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputName, setInputName] = useState('');
  const [valueDate, setValueDate] = useState<string>('');

  // Calculate missed zakat periods
  const [missedPeriods, setMissedPeriods] = useState<{ due: string; paid: boolean; value: number }[]>([]);
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

  // Save to localStorage whenever zakatEntries changes
  useEffect(() => {
    localStorage.setItem('zakatEntries', JSON.stringify(zakatEntries));
  }, [zakatEntries]);

  function togglePaid(idx: number) {
    setMissedPeriods(periods => periods.map((p, i) => i === idx ? { ...p, paid: !p.paid } : p));
  }

  // Calculate zakat in EGP for all types
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

  // Calculate total zakat for all unpaid periods (use missedPeriods state, which tracks paid status)
  const totalZakat = React.useMemo(() => {
    return missedPeriods.reduce((sum, p) => sum + (!p.paid ? getZakatAmount(p.value, selectedType, goldPrice, silverPrice, fitrValue) : 0), 0);
  }, [missedPeriods, selectedType, goldPrice, silverPrice, fitrValue]);

  // Calculate total zakat for all unpaid periods (across all entries)
  const totalZakatAll = React.useMemo(() => {
    return zakatEntries.reduce((sum, entry) =>
      sum + entry.missedPeriods.reduce((s, p) => s + (!p.paid ? getZakatAmount(p.value, entry.type, goldPrice, silverPrice, fitrValue) : 0), 0)
    , 0);
  }, [zakatEntries, goldPrice, silverPrice, fitrValue]);

  // Step 1: Select zakat type, value, and value date
  return (
    <form
      className="mb-8 max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-blue-100"
      onSubmit={e => { e.preventDefault(); }}
    >
      {/* Stepper UI */}
      <div className="flex justify-center mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex items-center ${s < 3 ? 'mr-4' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'}`}>{s}</div>
            {s < 3 && <div className="w-8 h-1 bg-blue-200 mx-1 rounded" />}
          </div>
        ))}
      </div>
      {/* Step 1: Input */}
      {step === 1 && (
        <>
          {/* Gold and fitr price display */}
          <div className="w-full mb-6">{/* ...existing gold/fitr price card... */}</div>
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
              <StockNameInput
                lang={lang}
                inputName={inputName}
                setInputName={setInputName}
              />
            )}
            <ZakatValueInput
              lang={lang}
              selectedType={selectedType}
              inputValue={inputValue}
              setInputValue={setInputValue}
              getValuePlaceholder={getValuePlaceholder}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueDateInput
                lang={lang}
                valueDate={valueDate}
                setValueDate={setValueDate}
              />
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
              <MissedPeriodsList lang={lang} missedPeriods={missedPeriods} selectedType={selectedType} goldPrice={goldPrice} silverPrice={silverPrice} fitrValue={fitrValue} togglePaid={togglePaid} getZakatAmount={getZakatAmount} />
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
      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="my-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center font-semibold">
          {lang === 'ar'
            ? 'ستصلك رسالة تذكير عبر البريد الإلكتروني عند اقتراب موعد كل زكاة.'
            : 'You will receive an email reminder for upcoming zakat.'}
          <div className="flex gap-2 justify-center mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition-all text-lg"
              onClick={() => { resetForm(); setStep(1); }}
            >
              {lang === 'ar' ? 'إضافة زكاة جديدة' : 'Add Another Zakat'}
            </button>
          </div>
        </div>
      )}
      {/* Zakat Entries List */}
      {zakatEntries.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-blue-800">{lang === 'ar' ? 'سجل الزكوات' : 'Zakat Records'}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-xl shadow">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-2">{lang === 'ar' ? 'النوع' : 'Type'}</th>
                  <th className="p-2">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th className="p-2">{lang === 'ar' ? 'قيمة الزكاة' : 'Zakat Amount'}</th>
                  <th className="p-2">{lang === 'ar' ? 'تاريخ' : 'Date'}</th>
                  <th className="p-2">{lang === 'ar' ? 'الفترات' : 'Periods'}</th>
                  <th className="p-2">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {zakatEntries.map((entry, i) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-2">{zakatTypes.find(t => t.key === entry.type)?.ar ?? entry.type}</td>
                    <td className="p-2">{entry.name ?? '-'}</td>
                    <td className="p-2">{getZakatAmount(entry.value, entry.type, goldPrice, silverPrice, fitrValue)}</td>
                    <td className="p-2">{entry.valueDate}</td>
                    <td className="p-2">
                      <ul className="space-y-1">
                        {entry.missedPeriods.map((p, j) => (
                          <li key={p.due} className="flex items-center gap-2">
                            <span className="font-mono text-xs">{p.due}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${p.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.paid ? (lang === 'ar' ? 'مدفوعة' : 'Paid') : (lang === 'ar' ? 'غير مدفوعة' : 'Unpaid')}</span>
                            <button className="text-xs underline text-blue-600" onClick={() => handleTogglePaid(i, j)} type="button">{lang === 'ar' ? (p.paid ? 'اجعلها غير مدفوعة' : 'اجعلها مدفوعة') : (p.paid ? 'Mark Unpaid' : 'Mark Paid')}</button>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 flex gap-2">
                      <button className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700" onClick={() => handleEdit(i)} type="button">{lang === 'ar' ? 'تعديل' : 'Edit'}</button>
                      <button className="text-xs px-2 py-1 rounded bg-red-100 text-red-700" onClick={() => handleDelete(i)} type="button">{lang === 'ar' ? 'حذف' : 'Delete'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-lg font-bold text-blue-900 text-right">
            {lang === 'ar' ? 'إجمالي الزكاة غير المدفوعة:' : 'Total Unpaid Zakat:'} {totalZakatAll} {lang === 'ar' ? 'جنيه' : 'EGP'}
          </div>
        </div>
      )}
    </form>
  );

  // Stepper navigation logic
  function handleNext() {
    setErrors(null);
    const trimmedValue = inputValue.trim();
    const value = Number(trimmedValue);
    if (!trimmedValue || isNaN(value) || value <= 0) {
      return setErrors(lang === 'ar' ? 'أدخل قيمة صحيحة' : 'Enter a valid value');
    }
    if (!selectedType) return setErrors(lang === 'ar' ? 'اختر نوع الزكاة' : 'Select zakat type');
    if (selectedType === 'stocks' && !inputName.trim()) return setErrors(lang === 'ar' ? 'أدخل اسم السهم' : 'Enter stock name');
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
  }
  function handleEdit(idx: number) {
    const entry = zakatEntries[idx];
    setSelectedType(entry.type);
    setInputName(entry.name ?? '');
    setInputValue(entry.value.toString());
    setValueDate(entry.valueDate);
    setMissedPeriods(entry.missedPeriods.map(p => ({ ...p })));
    setStep(1);
    setEditIdx(idx);
  }
  function handleDelete(idx: number) {
    setZakatEntries(entries => entries.filter((_, i) => i !== idx));
  }
  function handleTogglePaid(entryIdx: number, periodIdx: number) {
    setZakatEntries(entries => entries.map((e, i) =>
      i === entryIdx ? {
        ...e,
        missedPeriods: e.missedPeriods.map((p, j) =>
          j === periodIdx ? { ...p, paid: !p.paid } : p
        )
      } : e
    ));
  }
  function resetForm() {
    setInputValue('');
    setInputName('');
    setSelectedType('');
    setValueDate('');
    setMissedPeriods([]);
    setErrors(null);
    setStep(1);
  }
};

export default ZakatInputForm;
