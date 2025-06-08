import React from 'react';
import type { ZakatType } from '../../types';
import { formatNumber } from '../../utils/formatNumber';

interface MissedPeriod {
  due: string;
  paid: boolean;
  value: number;
}

interface ZakatEntry {
  id: string;
  type: string;
  name?: string;
  value: number;
  valueDate: string;
  missedPeriods: MissedPeriod[];
}

interface Props {
  lang: string;
  zakatTypes: ZakatType[];
  zakatEntries: ZakatEntry[];
  goldPrice?: number;
  silverPrice?: number;
  fitrValue?: number;
  getZakatAmount: (val: number, type: string, goldPrice?: number, silverPrice?: number, fitrValue?: number) => number;
  totalZakatAll: number;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  handleTogglePaid: (entryIdx: number, periodDue: string) => void;
}

const ZakatEntriesTable: React.FC<Props> = ({
  lang,
  zakatTypes,
  zakatEntries,
  goldPrice,
  silverPrice,
  fitrValue,
  getZakatAmount,
  totalZakatAll,
  handleEdit,
  handleDelete,
  handleTogglePaid,
}) => {
  const isNisabReached = (value: number, type: string, goldPrice?: number, silverPrice?: number, fitrValue?: number) => {
    if (type === 'gold' && goldPrice) return value * goldPrice >= 85 * goldPrice; // 85g gold
    if (type === 'silver' && silverPrice) return value * silverPrice >= 595 * silverPrice; // 595g silver
    if (type === 'fitr' && fitrValue) return value * fitrValue >= 0; // Fitr has no nisab
    // For cash/stocks, use silver nisab asش
    if (silverPrice) return value >= 595 * silverPrice;
    return true;
  };

  const isHawlPassed = (valueDate: string) => {
    const now = new Date();
    const date = new Date(valueDate);
    // 1 hijri year ≈ 354 days
    return (now.getTime() - date.getTime()) >= 354 * 24 * 60 * 60 * 1000;
  };

  // Helper: group entries by type
  function groupEntriesByType(entries: ZakatEntry[]) {
    const grouped: Record<string, { total: number; earliestDate: string; names: string[]; missedPeriods: MissedPeriod[][] }> = {};
    entries.forEach(entry => {
      if (!grouped[entry.type]) {
        grouped[entry.type] = {
          total: 0,
          earliestDate: entry.valueDate,
          names: [],
          missedPeriods: [],
        };
      }
      grouped[entry.type].total += entry.value;
      if (entry.valueDate < grouped[entry.type].earliestDate) {
        grouped[entry.type].earliestDate = entry.valueDate;
      }
      if (entry.name) grouped[entry.type].names.push(entry.name);
      grouped[entry.type].missedPeriods.push(entry.missedPeriods);
    });
    return grouped;
  }

  return (
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
            {Object.entries(groupEntriesByType(zakatEntries)).map(([type, group]) => {
              const nisab = isNisabReached(group.total, type, goldPrice, silverPrice, fitrValue);
              const hawl = isHawlPassed(group.earliestDate);
              const zakatDue = nisab && hawl;
              // Find all entry indices for this type
              const entryIndices = zakatEntries
                .map((entry, idx) => entry.type === type ? idx : -1)
                .filter(idx => idx !== -1);
              return (
                <tr key={type} className={"border-t " + (!zakatDue ? "bg-red-50" : "") }>
                  <td className="p-2">{zakatTypes.find(t => t.key === type)?.ar ?? type}</td>
                  <td className="p-2">{group.names.length > 0 ? group.names.join(', ') : '-'}</td>
                  <td className="p-2">{
                    formatNumber(
                      entryIndices.reduce((sum, idx) =>
                        sum + zakatEntries[idx].missedPeriods.reduce((s, p) =>
                          s + (!p.paid ? getZakatAmount(p.value, zakatEntries[idx].type, goldPrice, silverPrice, fitrValue) : 0)
                        , 0)
                      , 0)
                    )
                  }</td>
                  <td className="p-2">{group.earliestDate}</td>
                  <td className="p-2">
                    <ul className="space-y-1">
                      {entryIndices.map(idx =>
                        zakatEntries[idx].missedPeriods.map((p) => (
                          <li key={p.due + idx} className="flex items-center gap-2">
                            <span className="font-mono text-xs">{p.due}</span>
                            <span className="font-mono text-xs text-blue-900">
                              {formatNumber(getZakatAmount(p.value, zakatEntries[idx].type, goldPrice, silverPrice, fitrValue))} {lang === 'ar' ? 'جنيه' : 'EGP'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${p.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.paid ? (lang === 'ar' ? 'مدفوعة' : 'Paid') : (lang === 'ar' ? 'غير مدفوعة' : 'Unpaid')}</span>
                            <button
                              className="text-xs underline text-blue-600"
                              onClick={() => handleTogglePaid(idx, p.due)}
                              type="button"
                            >
                              {lang === 'ar' ? (p.paid ? 'اجعلها غير مدفوعة' : 'اجعلها مدفوعة') : (p.paid ? 'Mark Unpaid' : 'Mark Paid')}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </td>
                  <td className="p-2 flex flex-wrap gap-2">
                    {entryIndices.map(idx => (
                      <React.Fragment key={idx}>
                        <button className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700" onClick={() => handleEdit(idx)} type="button">
                          {lang === 'ar' ? `تعديل (${zakatEntries[idx].name || zakatEntries[idx].value})` : `Edit (${zakatEntries[idx].name || zakatEntries[idx].value})`}
                        </button>
                        <button className="text-xs px-2 py-1 rounded bg-red-100 text-red-700" onClick={() => handleDelete(idx)} type="button">
                          {lang === 'ar' ? `حذف (${zakatEntries[idx].name || zakatEntries[idx].value})` : `Delete (${zakatEntries[idx].name || zakatEntries[idx].value})`}
                        </button>
                      </React.Fragment>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-lg font-bold text-blue-900 text-right">
        {lang === 'ar' ? 'إجمالي الزكاة غير المدفوعة:' : 'Total Unpaid Zakat:'} {formatNumber(totalZakatAll)} {lang === 'ar' ? 'جنيه' : 'EGP'}
      </div>
    </div>
  );
};

export default ZakatEntriesTable;
