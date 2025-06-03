import { useEffect, useState } from 'react';
import { useLang } from './lang';
import ZakatTable from './ZakatTable';
import type { ZakatRow } from './types';

export default function Home() {
  const lang = useLang();
  const [rows, setRows] = useState<ZakatRow[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zakatRows');
    setRows(saved ? JSON.parse(saved) : []);
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
      {rows.length === 0 ? (
        <div className="text-gray-500 text-lg">
          {lang === 'ar' ? 'لا توجد بيانات زكاة محفوظة بعد.' : 'No zakat data saved yet.'}
        </div>
      ) : (
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 mb-4">
          <ZakatTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} editable />
          <div className="mt-4 text-xl font-bold text-blue-700 flex justify-between">
            <span>{lang === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
            <span>{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
