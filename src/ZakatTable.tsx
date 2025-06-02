import { useState } from 'react';
import { useLang } from './lang';
import type { ZakatRow } from './types';
import { ZAKAT_TYPES } from './types';

interface ZakatTableProps {
  rows: ZakatRow[];
  onEdit?: (row: ZakatRow) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

const getZakatTypeLabel = (t: typeof ZAKAT_TYPES[number], lang: string) => lang === 'ar' ? t.ar : t.en;

export default function ZakatTable({ rows, onEdit, onDelete, editable }: Readonly<ZakatTableProps>) {
  const lang = useLang();
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = (row: ZakatRow) => {
    setEditId(row.id);
    setEditValue(row.value.toString());
    setEditName(row.name ?? '');
    setError(null);
  };

  const handleSave = (row: ZakatRow) => {
    const value = Number(editValue);
    if (!editValue || value <= 0) {
      setError(lang === 'ar' ? 'أدخل قيمة صحيحة' : 'Enter a valid value');
      return;
    }
    if (row.type === 'stocks' && !editName.trim()) {
      setError(lang === 'ar' ? 'أدخل اسم السهم' : 'Enter stock name');
      return;
    }
    if (onEdit) {
      onEdit({ ...row, value, name: row.type === 'stocks' ? editName.trim() : undefined });
    }
    setEditId(null);
    setEditValue('');
    setEditName('');
    setError(null);
  };

  return (
    <table className="w-full text-center">
      <thead>
        <tr>
          <th className="py-2">{lang === 'ar' ? 'النوع' : 'Type'}</th>
          <th className="py-2">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
          <th className="py-2">{lang === 'ar' ? 'القيمة' : 'Value'}</th>
          {editable && <th className="py-2">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
            <td>{(() => {
              const t = ZAKAT_TYPES.find(t => t.key === row.type);
              return t ? getZakatTypeLabel(t, lang) : row.type;
            })()}</td>
            <td>{row.type === 'stocks' ? row.name : '-'}</td>
            <td>
              {editId === row.id ? (
                <input
                  className="input w-24"
                  type="number"
                  min="0"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                />
              ) : (
                row.value
              )}
            </td>
            <td>
              {editId === row.id ? (
                <>
                  {row.type === 'stocks' && (
                    <input
                      className="input w-24 mr-2"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder={lang === 'ar' ? 'اسم السهم' : 'Stock name'}
                    />
                  )}
                  <button className="btn btn-ghost btn-sm bg-gray-50 p-2 rounded-lg text-green-500 hover:bg-blue-100 hover:text-green-600 transition-colors cursor-pointer mr-2" onClick={() => handleSave(row)}>{lang === 'ar' ? 'حفظ' : 'Save'}</button>
                  <button className="btn btn-ghost btn-sm bg-gray-50 p-2 rounded-lg text-gray-500 hover:bg-blue-100 hover:text-gray-600 transition-colors cursor-pointer mr-2" onClick={() => { setEditId(null); setEditValue(''); setEditName(''); setError(null); }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                  {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
                </>
              ) : (
                <>
                  <button
                    className="btn btn-ghost btn-sm bg-gray-50 p-2 rounded-lg text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer mr-2"
                    onClick={() => handleEditClick(row)}
                  >
                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm bg-gray-50 p-2 rounded-lg text-red-500 hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer mr-2"
                    onClick={() => onDelete && onDelete(row.id)}
                  >
                    {lang === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
        {/* Always show add row for edit/delete, even if not editable */}
      </tbody>
    </table>
  );
}
