import { useState, useEffect } from 'react';
import { useLang } from './lang';
import i18nEn from './i18n.en.json';
import i18nAr from './i18n.ar.json';

interface ReminderLabels {
  title: string;
  hijri: string;
  notSet: string;
  edit: string;
  save: string;
  nextDue: string;
  days: string;
  due: string;
  paid: string;
}

function getNextHijriYear(date: string) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

function daysBetween(date1: Date, date2: Date) {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Reminder() {
  const lang = useLang();
  const i18n = lang === 'ar' ? (i18nAr as { reminderLabels: ReminderLabels }) : (i18nEn as { reminderLabels: ReminderLabels });
  const t = i18n.reminderLabels;
  const [hijri, setHijri] = useState(() => localStorage.getItem('hijri') || '');
  const [edit, setEdit] = useState(false);
  const [paid, setPaid] = useState(false);
  const [nextDue, setNextDue] = useState<Date | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (hijri) {
      const next = getNextHijriYear(hijri);
      setNextDue(next);
      setDaysLeft(daysBetween(new Date(), next));
      localStorage.setItem('hijri', hijri);
    }
  }, [hijri, paid]);

  const handlePaid = () => {
    setPaid(true);
    setHijri(new Date().toISOString().slice(0, 10));
    setEdit(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-semibold mb-4">{t.title}</h2>
      <div className="mb-4">
        <div className="font-medium">{t.hijri}</div>
        {edit ? (
          <input
            type="date"
            className="input mt-1"
            value={hijri}
            onChange={e => setHijri(e.target.value)}
          />
        ) : (
          <span className="ml-2">{hijri || t.notSet}</span>
        )}
        <button
          className="ml-3 text-blue-600 underline text-sm"
          onClick={() => setEdit(e => !e)}
        >
          {edit ? t.save : t.edit}
        </button>
      </div>
      {nextDue && (
        <div className="mb-4">
          <div className="font-medium">{t.nextDue}</div>
          <span>{nextDue.toISOString().slice(0, 10)}</span>
        </div>
      )}
      {daysLeft !== null && (
        <div className="mb-4 text-lg font-bold text-blue-700">
          {daysLeft > 0
            ? `${daysLeft} ${t.days}`
            : t.due}
        </div>
      )}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
        onClick={handlePaid}
      >
        {t.paid}
      </button>
    </div>
  );
}
