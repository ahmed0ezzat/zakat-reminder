import { useEffect, useState } from 'react';
import { useLang } from './lang';
import { formatNumber } from './utils/formatNumber';
import { Link } from 'react-router-dom';
import type { ZakatResult, ZakatRow } from './types';
import { ZAKAT_TYPES } from './types';
import ZakatSummaryTable from './components/tables/ZakatSummaryTable';

export default function Home() {
  const lang = useLang();
  const [rows, setRows] = useState<ZakatRow[]>([]);
  const [result, setResult] = useState<ZakatResult | null>(() => {
    const saved = localStorage.getItem('zakatResult');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const savedRows = localStorage.getItem('zakatRows');
    let rowsArr: ZakatRow[] = [];
    if (savedRows) {
      try {
        const parsed = JSON.parse(savedRows);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rowsArr = parsed;
        }
      } catch {
        console.log('Failed to parse saved zakat rows, falling back to old system');
        // Fallback to old system if parsing fails
      }
    }
    if (rowsArr.length === 0) {
      // fallback to new system if exists
      const savedEntries = localStorage.getItem('zakatEntries');
      if (savedEntries) {
        try {
          const entries = JSON.parse(savedEntries) as Array<{
            id: string;
            type: string;
            name?: string;
            value: number;
            valueDate: string;
            missedPeriods: { due: string; paid: boolean; value: number }[];
            goldPrice?: number;
            fitrValue?: number;
          }>;
          rowsArr = entries.flatMap((entry) =>
            entry.missedPeriods.map((p, i) => ({
              id: entry.id + '-' + i,
              type: entry.type,
              value: p.value,
              name: entry.name,
              dueDate: p.due,
              goldPrice: entry.goldPrice,
              fitrValue: entry.fitrValue,
            }))
          );
        } catch {}
      }
    }
    setRows(rowsArr);
  }, []);

  const handleEdit = (updated: ZakatRow) => {
    const newRows = rows.map(r => (r.id === updated.id ? updated : r));
    setRows(newRows);
    localStorage.setItem('zakatRows', JSON.stringify(newRows));
  };
  const handleDelete = (id: string) => {
    const newRows = rows.filter(r => r.id !== id);
    setRows(newRows);
    localStorage.setItem('zakatRows', JSON.stringify(newRows));
  };
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

  // Keep zakatRows and zakatEntries in sync
  useEffect(() => {
    // When rows change (edit/delete), update zakatEntries as well
    if (rows.length > 0) {
      // Try to group rows by original entry id if possible
      // If id contains '-', treat prefix as entry id
      const grouped: Record<string, ZakatRow[]> = {};
      rows.forEach(r => {
        const baseId = r.id.includes('-') ? r.id.split('-')[0] : r.id;
        if (!grouped[baseId]) grouped[baseId] = [];
        grouped[baseId].push(r);
      });
      const zakatEntries = Object.entries(grouped).map(([id, group]) => ({
        id,
        type: group[0].type,
        name: group[0].name,
        value: group[0].value, // not used in missedPeriods, but kept for compatibility
        valueDate: group[0].dueDate,
        missedPeriods: group.map(r => ({ due: r.dueDate, paid: (typeof r === 'object' && 'paid' in r ? (r as { paid?: boolean }).paid : false) ?? false, value: r.value })),
        goldPrice: group[0].goldPrice,
        fitrValue: group[0].fitrValue,
      }));
      localStorage.setItem('zakatEntries', JSON.stringify(zakatEntries));
    }
  }, [rows]);

  const thisYear = new Date().getFullYear();
  const thisYearRows = rows.filter(r => {
    const date = r.dueDate ? new Date(r.dueDate) : null;
    return date && date.getFullYear() === thisYear;
  });
  const totalThisYear = thisYearRows.reduce((sum, r) => sum + r.value, 0);
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
        {lang === 'ar' ? 'زكاتي' : 'Zakat Summary'}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-6">
        {lang === 'ar'
          ? 'ملخص الزكاة المحفوظة لهذا العام:'
          : 'Your saved zakat summary for this year:'}
      </p>
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-blue-700 text-lg">
            {lang === 'ar' ? 'زكاة هذا العام' : 'This Year Zakat'}
          </span>
          <span className="font-mono text-xl">
            {formatNumber(totalThisYear)} {lang === 'ar' ? 'جنيه' : 'EGP'}
          </span>
        </div>
        <Link
          to="/calculator?showRecord=1"
          className="inline-block mt-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-all text-base"
        >
          {lang === 'ar' ? 'عرض وتعديل سجل الزكاة' : 'View & Edit Full Zakat Record'}
        </Link>
      </div>
      {/* Quick Zakat Record Table */}
      <div className="w-full max-w-2xl mx-auto my-6">
        <h2 className="text-xl font-bold mb-2 text-blue-700 text-center">{lang === 'ar' ? 'سجل الزكوات السريع' : 'Quick Zakat Record'}</h2>
      </div>
      {rows.length === 0 || !result ? (
        <div className="text-gray-500 text-lg">
          {lang === 'ar' ? 'لا توجد بيانات زكاة محفوظة بعد.' : 'No zakat data saved yet.'}
        </div>
      ) : (
        <ZakatSummaryTable lang={lang} rows={rows} result={result} />
      )}
    </div>
  );
}
