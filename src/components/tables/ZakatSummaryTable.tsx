import React from 'react';
import { formatNumber } from '../../utils/formatNumber';
import { ZAKAT_TYPES } from '../../types';
import type { ZakatResult, ZakatRow } from '../../types';

interface Props {
  lang: string;
  rows: ZakatRow[];
  result: ZakatResult;
}

// Helper to calculate zakat due for a row using row-attached prices
function getZakatDue(row: ZakatRow): number {
  if (row.type === 'gold' && row.goldPrice) {
    return Math.round(row.value * row.goldPrice * 0.025 * 100) / 100;
  } else if (row.type === 'silver' && row.goldPrice) {
    return Math.round(row.value * row.goldPrice * 0.025 * 100) / 100;
  } else if (row.type === 'fitr' && row.fitrValue) {
    return Math.round(row.value * row.fitrValue * 100) / 100;
  } else {
    return Math.round(row.value * 0.025 * 100) / 100;
  }
}

const ZakatSummaryTable: React.FC<Props> = ({ lang, rows, result }) => {
  // Only sum unpaid rows for total
  const totalZakat = rows.reduce((sum, row) => {
    const isPaid = typeof row === 'object' && 'paid' in row && (row as { paid?: boolean }).paid === true;
    if (!isPaid) {
      sum += getZakatDue(row);
    }
    return sum;
  }, 0);

  // Optionally, show a warning if mismatch
  const showWarning = Math.abs(totalZakat - result.total) > 0.01;

  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 mb-4">
      <table className="w-full text-center mb-6">
        <thead>
          <tr>
            <th className="py-2">{lang === 'ar' ? 'النوع' : 'Type'}</th>
            <th className="py-2">{lang === 'ar' ? 'التاريخ المستحق' : 'Due Date'}</th>
            <th className="py-2">{lang === 'ar' ? 'قسط الزكاة' : 'Zakat Due'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const isPaid = typeof row === 'object' && 'paid' in row && (row as { paid?: boolean }).paid === true;
            const zakatDue = getZakatDue(row);
            return (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 transition-colors ${isPaid ? 'opacity-60 line-through bg-gray-100' : 'bg-green-50 border-l-4 border-green-400'}`}
              >
                <td>{(() => {
                  const t = ZAKAT_TYPES.find((t: { key: string }) => t.key === row.type);
                  return t ? (lang === 'ar' ? t.ar : t.en) : row.type;
                })()}</td>
                <td>{row.dueDate ? row.dueDate : '-'}</td>
                <td>{formatNumber(zakatDue)} {lang === 'ar' ? 'جنيه' : 'EGP'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 text-xl font-bold text-blue-700 flex justify-between border-t pt-4">
        <span>{lang === 'ar' ? 'إجمالي الزكاة المطلوبة:' : 'Total Zakat Required:'}</span>
        <span>{formatNumber(totalZakat)} {lang === 'ar' ? 'جنيه' : 'EGP'}</span>
      </div>
      {showWarning && (
        <div className="mt-2 text-sm text-red-600 font-semibold text-center">
          {lang === 'ar'
            ? 'تحذير: هناك اختلاف بين إجمالي الزكاة المحسوبة والنتيجة المخزنة!'
            : 'Warning: Calculated total does not match stored zakat result!'}
        </div>
      )}
    </div>
  );
};

export default ZakatSummaryTable;
