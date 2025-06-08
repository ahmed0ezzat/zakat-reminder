import React from 'react';

interface MissedPeriod {
  due: string;
  paid: boolean;
  value: number;
}

interface Props {
  lang: string;
  missedPeriods: MissedPeriod[];
  selectedType: string;
  goldPrice?: number;
  silverPrice?: number;
  fitrValue?: number;
  togglePaid: (idx: number) => void;
  getZakatAmount: (val: number, type: string, goldPrice?: number, silverPrice?: number, fitrValue?: number) => number;
}

const MissedPeriodsList: React.FC<Props> = ({ lang, missedPeriods, selectedType, goldPrice, silverPrice, fitrValue, togglePaid, getZakatAmount }) => (
  <ul className="space-y-2">
    {missedPeriods.map((p, i) => {
      const paidLabel = lang === 'ar' ? 'تم السداد' : 'Paid';
      const unpaidLabel = lang === 'ar' ? 'غير مدفوعة' : 'Not Paid';
      return (
        <li key={p.due} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-yellow-100">
          <span className="font-mono text-yellow-800">{p.due}</span>
          <span className="font-mono text-blue-700">{getZakatAmount(p.value, selectedType, goldPrice, silverPrice, fitrValue)} {lang === 'ar' ? 'قيمة الزكاة' : 'Zakat'}</span>
          <button
            type="button"
            className={`ml-4 px-3 py-1 rounded-lg font-semibold text-sm transition-all ${p.paid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'} border hover:bg-green-200 hover:text-green-900`}
            onClick={() => togglePaid(i)}
          >
            {p.paid ? paidLabel : unpaidLabel}
          </button>
        </li>
      );
    })}
  </ul>
);

export default MissedPeriodsList;
