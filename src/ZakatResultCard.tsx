import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { ZakatResult } from './types';

const COLORS = ['#2563eb', '#f59e42', '#22c55e', '#eab308', '#6366f1'];

interface Props {
  lang: string;
  result: ZakatResult;
}

const ZakatResultCard: React.FC<Props> = ({ lang, result }) => (
  <div className="mt-6 bg-blue-50 p-4 rounded-xl shadow border-t-4 border-blue-400 animate-fade-in">
    <h3 className="text-lg font-bold mb-2 text-blue-700">{lang === 'ar' ? 'نتيجة الزكاة' : 'Zakat Result'}</h3>
    <ul className="space-y-1 text-base">
      {result.breakdown.map((b, i) => (
        <li key={i} className="flex justify-between"><span>{b.label}:</span> <span className="font-mono">{b.value.toFixed(2)} EGP</span></li>
      ))}
      <li className="font-bold flex justify-between border-t pt-2 mt-2 text-blue-700 text-lg"><span>{lang === 'ar' ? 'الإجمالي' : 'Total'}:</span> <span className="font-mono">{result.total.toFixed(2)} EGP</span></li>
    </ul>
    <div className="w-full h-56 mt-4">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={result.breakdown}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#2563eb"
            label
          >
            {result.breakdown.map((item, idx) => (
              <Cell key={item.label} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ZakatResultCard;
