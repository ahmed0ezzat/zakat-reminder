import { useEffect, useState } from 'react';
import { useLang } from './lang';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ZakatTable from './ZakatTable';
import { type ZakatRow, type ZakatResult, ZAKAT_TYPES } from './types';
import useGoldPrice from './hooks/useGoldPrice';
import useFitrValue from './hooks/useFitrValue';
import ZakatInputForm from './ZakatInputForm';
import ZakatResultCard from './ZakatResultCard';

export default function Calculator() {
  const lang = useLang();
  const [rows, setRows] = useState<ZakatRow[]>(() => {
    const saved = localStorage.getItem('zakatRows');
    return saved ? JSON.parse(saved) : [];
  });
  const [result, setResult] = useState<ZakatResult | null>(() => {
    const saved = localStorage.getItem('zakatResult');
    return saved ? JSON.parse(saved) : null;
  });
  const [errors, setErrors] = useState<string | null>(null);

  // Custom hooks for gold/fitr
  const { goldPrice, loadingGold, fetchGoldPrice } = useGoldPrice(lang);
  const { fitrValue, loadingFitr, fetchFitrValue } = useFitrValue(lang);

  // Add row
  const handleAdd = (row: ZakatRow) => {
    // Attach the current gold/fitr price used for this row, but never null (only number or undefined)
    const goldPriceToUse = manualGoldPrice ? Number(manualGoldPrice) : goldPrice ?? undefined;
    const fitrValueToUse = manualFitrValue ? Number(manualFitrValue) : fitrValue ?? undefined;
    setRows(prev => [
      ...prev,
      {
        ...row,
        goldPrice: goldPriceToUse ?? undefined,
        fitrValue: fitrValueToUse ?? undefined,
      },
    ]);
    toast.success(lang === 'ar' ? 'تمت الإضافة' : 'Added');
  };
  // Delete row
  const handleDelete = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
    toast.error(lang === 'ar' ? 'تم الحذف' : 'Deleted');
  };

  // Manual override state for gold/fitr price
  const [manualGoldPrice, setManualGoldPrice] = useState<string>('');
  const [manualFitrValue, setManualFitrValue] = useState<string>('');

  // Pass manual values to ZakatInputForm

  // Calculate zakat result
  useEffect(() => {
    if (rows.length === 0) {
      setResult(null);
      return;
    }
    let total = 0;
    const breakdown: { label: string; value: number }[] = [];
    rows.forEach(row => {
      let zakat = 0;
      // Use the price attached to the row if present, else fallback to latest
      const goldPriceForRow = row.goldPrice ?? goldPrice ?? 0;
      const fitrValueForRow = row.fitrValue ?? fitrValue ?? 0;
      if (row.type === 'gold' && goldPriceForRow) {
        zakat = row.value * goldPriceForRow * 0.025;
        breakdown.push({ label: lang === 'ar' ? 'ذهب' : 'Gold', value: zakat });
      } else if (row.type === 'silver' && goldPriceForRow) {
        zakat = row.value * goldPriceForRow * 0.025;
        breakdown.push({ label: lang === 'ar' ? 'فضة' : 'Silver', value: zakat });
      } else if (row.type === 'fitr' && fitrValueForRow) {
        zakat = row.value * fitrValueForRow;
        breakdown.push({ label: lang === 'ar' ? 'فطر' : 'Fitr', value: zakat });
      } else if (row.type === 'cash' || row.type === 'business' || row.type === 'stocks') {
        zakat = row.value * 0.025;
        breakdown.push({ label: row.type === 'cash' ? (lang === 'ar' ? 'نقد' : 'Cash') : row.type === 'business' ? (lang === 'ar' ? 'تجارة' : 'Business') : (lang === 'ar' ? 'أسهم' : 'Stocks'), value: zakat });
      }
      total += zakat;
    });
    setResult({ total, breakdown });
  }, [rows, goldPrice, fitrValue, lang]);

  // Auto-fetch gold/fitr price on mount
  useEffect(() => {
    if (!goldPrice) fetchGoldPrice();
    if (!fitrValue) fetchFitrValue();
  }, [fetchGoldPrice, fetchFitrValue, goldPrice, fitrValue]);

  // Save rows and result to localStorage on change
  useEffect(() => {
    localStorage.setItem('zakatRows', JSON.stringify(rows));
  }, [rows]);
  useEffect(() => {
    if (result) {
      localStorage.setItem('zakatResult', JSON.stringify(result));
    } else {
      localStorage.removeItem('zakatResult');
    }
  }, [result]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8">
      <ToastContainer position={lang === 'ar' ? 'top-left' : 'top-right'} rtl={lang === 'ar'} />
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">{lang === 'ar' ? 'حاسبة الزكاة الذكية' : 'Smart Zakat Calculator'}</h2>
      <ZakatInputForm
        lang={lang}
        zakatTypes={ZAKAT_TYPES}
        goldPrice={goldPrice}
        loadingGold={loadingGold}
        fetchGoldPrice={fetchGoldPrice}
        fitrValue={fitrValue}
        loadingFitr={loadingFitr}
        fetchFitrValue={fetchFitrValue}
        onAdd={handleAdd}
        errors={errors}
        setErrors={setErrors}
        manualGoldPrice={manualGoldPrice}
        setManualGoldPrice={setManualGoldPrice}
        manualFitrValue={manualFitrValue}
        setManualFitrValue={setManualFitrValue}
      />
      {rows.length > 0 && (
        <div className="mb-6">
          <ZakatTable rows={rows} onEdit={() => {}} onDelete={handleDelete} editable={false} />
        </div>
      )}
      {result && <ZakatResultCard lang={lang} result={result} />}
    </div>
  );
}
