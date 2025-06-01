import { useState, useEffect } from 'react';

function getNextHijriYear(date: string) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

function daysBetween(date1: Date, date2: Date) {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Reminder() {
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
      <h2 className="text-2xl font-semibold mb-4">Zakat Reminder</h2>
      <div className="mb-4">
        <div className="font-medium">Hijri Start Date:</div>
        {edit ? (
          <input
            type="date"
            className="input mt-1"
            value={hijri}
            onChange={e => setHijri(e.target.value)}
          />
        ) : (
          <span className="ml-2">{hijri || 'Not set'}</span>
        )}
        <button
          className="ml-3 text-blue-600 underline text-sm"
          onClick={() => setEdit(e => !e)}
        >
          {edit ? 'Save' : 'Edit'}
        </button>
      </div>
      {nextDue && (
        <div className="mb-4">
          <div className="font-medium">Next Due Date:</div>
          <span>{nextDue.toISOString().slice(0, 10)}</span>
        </div>
      )}
      {daysLeft !== null && (
        <div className="mb-4 text-lg font-bold text-blue-700">
          {daysLeft > 0
            ? `${daysLeft} days remaining until zakat due`
            : 'Zakat is due!'}
        </div>
      )}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
        onClick={handlePaid}
      >
        Mark as Paid
      </button>
    </div>
  );
}
