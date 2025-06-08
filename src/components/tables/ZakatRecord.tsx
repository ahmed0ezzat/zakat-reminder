import React from 'react';
import { formatNumber } from '../../utils/formatNumber';
import type { ZakatType } from '../../types';

export interface ZakatRecordEntry {
  id: string;
  type: string;
  name?: string;
  value: number;
  valueDate: string;
  missedPeriods: { due: string; paid: boolean; value: number }[];
}

interface ZakatRecordProps {
  lang: string;
  zakatTypes: ZakatType[];
  entries: ZakatRecordEntry[];
  goldPrice?: number;
  silverPrice?: number;
  fitrValue?: number;
  onEdit?: (entry: ZakatRecordEntry) => void;
  onDelete?: (id: string) => void;
  onTogglePaid?: (entryId: string, periodDue: string) => void;
  editable?: boolean;
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

const ZakatRecord: React.FC<ZakatRecordProps> = ({
  lang,
  zakatTypes,
  entries,
  goldPrice,
  silverPrice,
  fitrValue,
  onEdit,
  onDelete,
  onTogglePaid,
  editable = false,
}) => {
  if (!entries.length) {
    return (
      <div className="text-gray-500 text-lg text-center my-4">
        {lang === 'ar' ? 'لا توجد بيانات زكاة محفوظة.' : 'No zakat data saved.'}
      </div>
    );
  }

  // Group by type
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.type]) acc[entry.type] = [];
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<string, ZakatRecordEntry[]>);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {Object.entries(grouped).map(([type, group]) => {
        const typeLabel = zakatTypes.find(t => t.key === type)?.ar ?? type;
        const total = group.reduce(
          (sum, entry) => sum + entry.missedPeriods.reduce((s, p) => s + (!p.paid ? getZakatAmount(p.value, entry.type, goldPrice, silverPrice, fitrValue) : 0), 0),
          0
        );
        return (
          <div key={type} className="mb-6 bg-white rounded-xl shadow p-4 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-blue-700 text-lg">{typeLabel}</span>
              <span className="font-mono text-xl">{formatNumber(total)} {lang === 'ar' ? 'جنيه' : 'EGP'}</span>
            </div>
            <ul className="divide-y divide-gray-100">
              {group.map(entry => (
                <li key={entry.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    {entry.name && <span className="font-semibold mr-2">{entry.name}</span>}
                    <span className="text-gray-600 text-sm">{lang === 'ar' ? 'تاريخ القيمة:' : 'Value Date:'} {entry.valueDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {entry.missedPeriods.map(period => (
                      <span key={period.due} className={`px-2 py-1 rounded text-xs font-mono ${period.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {lang === 'ar' ? 'مستحق' : 'Due'} {period.due}: {formatNumber(getZakatAmount(period.value, entry.type, goldPrice, silverPrice, fitrValue))} {lang === 'ar' ? 'جنيه' : 'EGP'}
                        {editable && onTogglePaid && (
                          <button
                            type="button"
                            className="ml-2 underline text-blue-600 hover:text-blue-800"
                            onClick={() => onTogglePaid(entry.id, period.due)}
                          >
                            {period.paid ? (lang === 'ar' ? 'إلغاء مدفوع' : 'Mark Unpaid') : (lang === 'ar' ? 'تم الدفع' : 'Mark Paid')}
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {editable && (
                    <div className="flex gap-2 mt-2 md:mt-0">
                      {onEdit && <button type="button" className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200" onClick={() => onEdit(entry)}>{lang === 'ar' ? 'تعديل' : 'Edit'}</button>}
                      {onDelete && <button type="button" className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200" onClick={() => onDelete(entry.id)}>{lang === 'ar' ? 'حذف' : 'Delete'}</button>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ZakatRecord;
